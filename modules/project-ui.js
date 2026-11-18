import { projects } from './projects.js';

const grid = document.querySelector('.projects-grid');
const dialog = document.getElementById('project-dialog');
const title = document.getElementById('project-title');
const body = document.getElementById('project-story');
let opener;

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
    if (project.images.length) body.append(screenshotGallery(project));
    const links = element('div', 'project-actions');
    for (const [key, label] of [['repo', 'Source code'], ['demo', 'Live demo'], ['apk', 'Android release'], ['store', 'Play Store']]) {
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
    card.dataset.category = project.category;
    const top = element('div', 'proj-top');
    top.append(element('span', 'proj-date', project.status));
    const details = element('button', 'sm-btn', 'Details');
    details.type = 'button';
    details.setAttribute('aria-label', 'View ' + project.title + ' details');
    details.addEventListener('click', () => openProject(project.id, details));
    top.append(details);
    const tags = element('div', 'proj-tags');
    for (const tag of project.tags) tags.append(element('span', '', tag));
    card.append(top, element('h3', '', project.title), element('p', '', project.description), tags);
    return card;
}

export function initProjects() {
    grid.replaceChildren(...projects.map(projectCard));
    const filterButtons = document.querySelectorAll('.filter-btn');
    for (const button of filterButtons) {
        const filter = button.dataset.filter;
        button.hidden = filter !== 'all' && !projects.some(p => p.category.split(' ').includes(filter));
        button.setAttribute('aria-pressed', String(filter === 'all'));
        button.addEventListener('click', () => {
            for (const other of filterButtons) {
                other.classList.toggle('active', other === button);
                other.setAttribute('aria-pressed', String(other === button));
            }
            for (const card of grid.children) {
                card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
            }
        });
    }
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => opener?.focus());
}
