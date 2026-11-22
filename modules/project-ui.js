import { projects } from './projects.js';

const grid = document.querySelector('.projects-grid');
const dialog = document.getElementById('project-dialog');
const title = document.getElementById('project-title');
const body = document.getElementById('project-story');
let opener;
let activeFilter = 'all';
let activeSearch = '';

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

function screenshotGallery(project) {
    const gallery = element('section', 'project-gallery');
    gallery.setAttribute('aria-label', project.title + ' screenshots');
    const picture = element('img');
    picture.loading = 'lazy';
    const caption = element('p');
    caption.setAttribute('aria-live', 'polite');
    let current = 0;
    function show(index) {
        current = (index + project.images.length) % project.images.length;
        const shot = project.images[current];
        picture.width = shot.width;
        picture.height = shot.height;
        picture.alt = shot.alt;
        picture.src = shot.src;
        caption.textContent = (current + 1) + ' of ' + project.images.length + ' · ' + shot.alt;
    }
    gallery.append(picture, caption);
    if (project.images.length > 1) {
        for (const [label, direction] of [['Previous screenshot', -1], ['Next screenshot', 1]]) {
            const button = element('button', 'sm-btn', label);
            button.type = 'button';
            button.addEventListener('click', () => show(current + direction));
            gallery.append(button);
        }
    }
    show(0);
    return gallery;
}

export function openProject(id, trigger = document.activeElement) {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    opener = trigger;
    title.textContent = project.title;
    body.replaceChildren();
    for (const [label, copy] of [['Problem', project.problem], ['My role', project.role], ['Result', project.result]]) {
        body.append(element('h3', '', label), element('p', '', copy));
    }
    if (project.features?.length) {
        body.append(element('h3', '', 'Implemented features'));
        const featureList = element('ul');
        for (const feature of project.features) featureList.append(element('li', '', feature));
        body.append(featureList);
    }
    if (project.images.length) body.append(screenshotGallery(project));
    const links = element('div', 'project-actions');
    const caseStudy = element('a', 'sm-btn', 'Read full case study');
    caseStudy.href = `projects/${encodeURIComponent(project.id)}/`;
    links.append(caseStudy);
    for (const [key, label] of [
        ['repo', 'View source code'],
        ['demo', 'Live demo'],
        ['apk', 'Download Android APK'],
        ['windows', 'Download Windows installer'],
        ['stable', 'View stable release'],
        ['previewApk', 'Preview APK'],
        ['previewWindows', 'Preview Windows installer'],
        ['preview', 'View preview release'],
        ['checksum', 'View checksum'],
        ['releaseHistory', 'View release history'],
        ['store', 'Play Store'],
        ['architecture', 'Architecture diagram'],
        ['implementation', 'Explore the Dart code']
    ]) {
        if (!project.links[key]) continue;
        const link = element('a', 'sm-btn', label);
        link.href = project.links[key];
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
        links.append(link);
    }
    body.append(links);
    body.scrollTop = 0;
    dialog.showModal();
    dialog.querySelector('[data-close]').focus();
}

function projectCard(project) {
    const card = element('article', 'proj-card glass');
    if (project.featured) card.classList.add('featured-proj');
    card.dataset.category = project.category;
    card.dataset.search = `${project.title} ${project.description} ${project.tags.join(' ')} ${project.status}`.toLowerCase();
    if (project.images.length) {
        const image = element('img', 'proj-cover');
        image.src = project.images[0].src;
        image.alt = project.images[0].alt;
        image.loading = 'lazy';
        image.width = project.images[0].width;
        image.height = project.images[0].height;
        card.append(image);
    }
    const top = element('div', 'proj-top');
    top.append(element('span', 'proj-date', project.status));
    const details = element('button', 'sm-btn', 'Details');
    details.type = 'button';
    details.setAttribute('aria-label', 'View ' + project.title + ' details');
    details.addEventListener('click', () => openProject(project.id, details));
    top.append(details);
    const tags = element('div', 'proj-tags');
    for (const tag of project.tags) tags.append(element('span', '', tag));
    const study = element('a', 'project-study-link', 'Explore case study');
    study.href = `projects/${encodeURIComponent(project.id)}/`;
    study.setAttribute('aria-label', `Explore ${project.title} case study`);
    card.append(top, element('h3', '', project.title), element('p', '', project.description), tags, study);
    return card;
}

function applyProjectFilters() {
    let visible = 0;
    for (const card of grid.children) {
        const matchesFilter = activeFilter === 'all' || card.dataset.category.split(' ').includes(activeFilter);
        const matchesSearch = !activeSearch || card.dataset.search.includes(activeSearch);
        card.hidden = !(matchesFilter && matchesSearch);
        if (!card.hidden) visible++;
    }
    const summary = document.getElementById('project-results');
    const empty = document.getElementById('project-empty');
    if (summary) summary.textContent = `${visible} of ${projects.length} projects shown`;
    if (empty) empty.hidden = visible !== 0;
}

export function initProjects() {
    const orderedProjects = projects.slice().sort((a, b) => Number(b.featured) - Number(a.featured));
    grid.replaceChildren(...orderedProjects.map(projectCard));
    const filterButtons = document.querySelectorAll('.filter-btn');
    for (const button of filterButtons) {
        const filter = button.dataset.filter;
        button.hidden = filter !== 'all' && !projects.some(p => p.category.split(' ').includes(filter));
        button.setAttribute('aria-pressed', String(filter === 'all'));
        button.addEventListener('click', () => {
            activeFilter = filter;
            for (const other of filterButtons) {
                other.classList.toggle('active', other === button);
                other.setAttribute('aria-pressed', String(other === button));
            }
            applyProjectFilters();
        });
    }
    const search = document.getElementById('project-search');
    if (search) {
        search.addEventListener('input', () => {
            activeSearch = search.value.trim().toLowerCase();
            applyProjectFilters();
        });
    }
    applyProjectFilters();
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        if (document.activeElement === document.body && !document.querySelector('dialog[open]')) opener?.focus();
    });
}
