const repository = 'https://github.com/Ir786106/food-fight-app';
const assetRoot = repository + '/releases/download/';

function trustedAsset(asset, suffix) {
  return typeof asset?.browser_download_url === 'string'
    && asset.browser_download_url.startsWith(assetRoot)
    && asset.name?.toLowerCase().endsWith(suffix)
    && Number.isFinite(asset.size) && asset.size > 0;
}

export function initReleases() {
  const card = document.querySelector('#downloads .download-card');
  const status = card.querySelector('[role=status]');
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    try {
      const response = await fetch('https://api.github.com/repos/Ir786106/food-fight-app/releases/latest', {
        signal: AbortSignal.timeout(6000)
      });
      if (!response.ok) throw Error('Release unavailable');
      const release = await response.json();
      const date = new Date(release.published_at);
      if (release.draft || release.prerelease || typeof release.tag_name !== 'string' || !Number.isFinite(+date) || !Array.isArray(release.assets) || !release.html_url?.startsWith(repository + '/releases/tag/')) throw Error('Incomplete metadata');
      const downloads = [['.apk','Android APK'],['.exe','Windows installer'],['.apk.sha256','SHA-256 checksum']];
      const links = document.createDocumentFragment();
      function add(url, title) {
        const a = document.createElement('a');
        a.className = 'btn';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = title + ' ↗';
        links.append(a);
      }
      add(release.html_url,'Release notes');
      for (const [extension,label] of downloads) {
        const asset = release.assets.find(item => trustedAsset(item,extension));
        if (asset) add(asset.browser_download_url,label + (extension === '.apk.sha256' ? '' : ' · ' + (asset.size/1000000).toFixed(1) + ' MB'));
      }
      card.querySelector('.actions').replaceChildren(links);
      card.querySelector('.release-summary').textContent = 'Stable ' + release.tag_name + ' · Published ' + date.toLocaleDateString('en-GB',{timeZone:'UTC'});
      status.textContent = 'GitHub checked ' + new Date().toLocaleDateString('en-GB') + '.';
    } catch {
      status.textContent = 'Live release check unavailable. Showing the verified release snapshot.';
    }
  },{rootMargin:'160px'});
  observer.observe(card);
}
