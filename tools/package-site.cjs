// Produce both hosting artifacts from the same committed Git tree.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'release');
const site = path.join(output, 'site');
const archive = path.join(output, 'portfolio.zip');
const entryFiles = ['index.html', '404.html', 'style.css', 'premium.css', 'editorial.css', 'case-studies.css', 'case-studies.js', 'theme-init.js', 'script.js', 'robots.txt', 'sitemap.xml'];
const assetFolders = ['Images', 'assets', 'modules', 'vendor', 'projects'];
const sources = [...entryFiles, ...assetFolders];
const options = {cwd: root, maxBuffer: 32 * 1024 * 1024};
function git(...args) { return execFileSync('git', args, options); }

if (git('status', '--porcelain', '--', ...sources).toString().trim()) {
    throw new Error('Commit the public site changes before packaging them.');
}
const files = git('ls-tree', '-rz', 'HEAD', '--', ...sources).toString().split('\0').filter(Boolean);
const paths = files.map(record => {
    const [metadata, name] = record.split('\t');
    if (!/^100(644|755) blob /.test(metadata) || name.split('/').some(part => part.startsWith('.'))) {
        throw new Error('Unexpected public file: ' + name);
    }
    return name;
});
for (const name of entryFiles) {
    if (!paths.includes(name)) throw new Error('Missing site entry: ' + name);
}
if (fs.existsSync(output) && (fs.lstatSync(output).isSymbolicLink() || !fs.statSync(output).isDirectory())) {
    throw new Error('Expected a local release directory.');
}
fs.mkdirSync(output, {recursive:true});
const marker = path.join(output, 'generated-by-package-site');
if ((fs.existsSync(site) || fs.existsSync(archive)) && !fs.existsSync(marker)) {
    throw new Error('Existing release files have no generator marker. Move them before building.');
}
const stage = fs.mkdtempSync(path.join(output, 'build-'));
try {
    const stagedSite = path.join(stage, 'site');
    const stagedZip = path.join(stage, 'portfolio.zip');
    fs.mkdirSync(stagedSite);
    git('-c', 'core.autocrlf=false', 'archive', '--format=zip', '--output=' + stagedZip, 'HEAD', '--', ...sources);
    for (const name of paths) {
        const dest = path.join(stagedSite, name);
        fs.mkdirSync(path.dirname(dest), {recursive:true});
        fs.writeFileSync(dest, git('show', 'HEAD:' + name));
    }
    fs.writeFileSync(marker, 'Generated outputs: site/ and portfolio.zip\n');
    if (fs.existsSync(site)) fs.renameSync(site, path.join(stage, 'previous-site'));
    try {
        fs.renameSync(stagedSite, site);
    } catch (error) {
        if (fs.existsSync(path.join(stage, 'previous-site'))) fs.renameSync(path.join(stage, 'previous-site'), site);
        throw error;
    }
    fs.renameSync(stagedZip, archive);
    console.log(paths.length + ' public files from ' + git('rev-parse', '--short', 'HEAD').toString().trim());
    console.log(site + '\n' + archive);
} finally {
    fs.rmSync(stage, {recursive:true, force:true});
}
