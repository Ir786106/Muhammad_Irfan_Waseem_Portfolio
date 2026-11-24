import { initReleases } from './releases.js';
import { initExtras } from './extras.js';
import { projectFallback } from './data.js';
import { initUI } from './ui.js';

import { initGitHub } from './github.js';

initUI(); initExtras();
initGitHub();
initReleases();
const work = document.querySelector('#work-browser');
const study = document.querySelector('#case-dialog');
const gallery = document.querySelector('#gallery');
const results = document.createElement('div');
results.className = 'project-grid';
const controls = document.createElement('div');
controls.className = 'project-controls';
controls.innerHTML = '<label>Search projects<input type="search" placeholder="Title or technology"></label><label>Category<select><option value="">All projects</option><option value="mobile">Mobile</option><option value="web">Web</option><option value="erp">ERP</option><option value="ai">AI</option></select></label><details class="advanced-filters"><summary>Advanced filters <span class="filter-count"></span></summary><div class="advanced-fields"><label>Collection<select name="collection"><option value="engineering">Engineering</option><option value="featured">Flagship</option><option value="learning">Open source and learning</option><option value="all">All</option></select></label><label>Technology<select name="technology"><option value="">All technologies</option></select></label><label>Status<select name="progress"><option value="">All statuses</option></select></label></div></details><button class="btn" type="button">Clear filters</button><p role="status"></p>';
work.replaceChildren(controls, results);

const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const link = (href, title) => {
  try {
    const url = new URL(href);
    return url.protocol === 'https:' ? '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+escape(url.href)+'">'+escape(title)+' ↗</a>' : '';
  } catch { return ''; }
};
const image = project => /^assets\/img\/[\w.-]+\.webp$/.test(project.image) ? '<img loading="lazy" src="'+escape(project.image)+'" alt="'+escape(project.imageAlt)+'">' : '';
const tags = project => project.tags.map(tag => '<span class="chip">'+escape(tag)+'</span>').join(' ');
let projects = projectFallback;
let opener;
let openedFromPage = false;
function render() {
  const query = controls.querySelector('input').value.trim().toLowerCase();
  const category = controls.querySelector('select').value;
  const {collection,technology,progress} = Object.fromEntries([...controls.querySelectorAll("select[name]")].map(select => [select.name,select.value])); const shown = projects.filter(p => (collection === "all" || (collection === "featured" ? p.featured : p.category.includes("education") === (collection === "learning"))) && (!technology || p.tags.includes(technology)) && (!progress || p.status === progress) && (!category || p.category.split(' ').includes(category)) && [p.title,p.description,...p.tags].join(' ').toLowerCase().includes(query));
  const advancedCount = Number(collection !== 'engineering') + Number(Boolean(technology)) + Number(Boolean(progress));
  controls.querySelector('.filter-count').textContent = advancedCount ? '· '+advancedCount+' active' : '';
  controls.querySelector('[role=status]').textContent = shown.length ? shown.length+' projects' : 'No matching projects';
  results.innerHTML = shown.map(p => '<article class="project-card"><div class="project-art tone-'+escape(p.art)+'">'+(p.id === 'food-fight' ? '<img src="assets/img/food-fight-cover.webp" alt="Official Food Fight project cover" loading="lazy">' : image(p)||'<span aria-hidden="true">⌘</span><strong>'+escape(p.title)+'</strong><small>Project cover</small>')+'</div><div class="project-copy"><p class="micro">'+escape(p.status)+(p.featured?' · Featured':'')+'</p><h3>'+escape(p.title)+'</h3><p>'+escape(p.description)+'</p><p><strong>Contribution</strong> · '+escape(p.role)+'</p><div>'+tags(p)+'</div><a class="btn" href="#work/'+encodeURIComponent(p.id)+'" aria-label="View '+escape(p.title)+' case study">Case study ↗</a></div></article>').join('');
}
function route() {
  const id = location.hash.slice(6);
  const index = projects.findIndex(p => p.id === id);
  if (!location.hash.startsWith('#work/') || index < 0) {
    if (gallery.open) gallery.close();
    if (study.open) {
      study.close();
      opener?.focus({preventScroll:true});
    }
    opener = undefined;
    openedFromPage = false;
    return;
  }
  const p = projects[index], next = projects[(index+1)%projects.length], previous = projects[(index+projects.length-1)%projects.length];
  const fields = [['Overview',p.description],['Problem',p.problem],['My role',p.role],['Outcome',p.result]];
  const links = [['repo','Source repository'],['stable','Stable release'],['apk','Download APK'],['architecture','Architecture diagram']];
  document.querySelector('#case-content').innerHTML = '<p class="micro">'+escape(p.status)+'</p><h2 tabindex="-1" id="case-title">'+escape(p.title)+'</h2>'+fields.map(([title,value])=>'<section><h3>'+title+'</h3><p>'+escape(value)+'</p></section>').join('')+'<h3>Stack</h3>'+tags(p)+'<h3>Features</h3><ul>'+p.features.map(feature=>'<li>'+escape(feature)+'</li>').join('')+'</ul>'+(p.gallery || (p.image ? [p] : [])).map(shot => image(shot) ? '<button type="button" class="screenshot">View screenshot'+image(shot)+'</button>' : '').join('')+'<div class="actions">'+links.map(([key,title])=>link(p.links[key],title)).join('')+'</div><nav class="case-links" aria-label="Other case studies"><a href="#work/'+encodeURIComponent(previous.id)+'">← '+escape(previous.title)+'</a><a href="#work/'+encodeURIComponent(next.id)+'">'+escape(next.title)+' →</a></nav>';
  if (!study.open) study.showModal();
  study.scrollTop = 0;
  document.querySelector('#case-title').focus();
}
function closeStudy() {
  if (openedFromPage) history.back();
  else {
    history.replaceState(history.state, '', '#work');
    route();
    work.scrollIntoView();
  }
}
study.querySelector('.close').onclick = closeStudy;
study.oncancel = event => { event.preventDefault(); closeStudy(); };
gallery.querySelector('.close').onclick = () => gallery.close();
results.addEventListener('click', event => {
  const a = event.target.closest('a[href^="#work/"]');
  if (a && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    opener = a;
    openedFromPage = true;
    history.pushState(history.state, "", a.hash);
    route();
  }
});
study.addEventListener('click', event => {
  const shot = event.target.closest('.screenshot');
  const a = event.target.closest('a[href^="#work/"]');
  if (shot) {
    const img = shot.querySelector('img');
    const target = gallery.querySelector('img');
    target.src = img.src;
    target.alt = img.alt;
    gallery.showModal();
  } else if (a && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    history.replaceState(history.state, '', a.hash);
    route();
  }
});
controls.querySelector('input').addEventListener('input', render);
controls.querySelectorAll('select').forEach(select => select.addEventListener('change', render));
controls.querySelector('button').onclick = () => {
  controls.querySelector('input').value = '';
  controls.querySelectorAll('select').forEach(select => { select.selectedIndex = 0; });
  render();
};
document.querySelectorAll('[data-technology]').forEach(button => {
  button.onclick = () => {
    controls.querySelector('button').click();
    const select = controls.querySelector('[name=technology]');
    select.value = button.dataset.technology;
    select.closest('details').open = true;
    render();
    document.querySelector('#work').scrollIntoView();
    select.focus({preventScroll:true});
  };
});
window.addEventListener('hashchange', route);
function update() {
  for (const [name,values] of [['technology',projects.flatMap(p=>p.tags)],['progress',projects.map(p=>p.status)]]) {
    const select = controls.querySelector('[name='+name+']');
    const selected = select.value;
    while (select.options.length > 1) select.remove(1);
    for (const value of [...new Set(values)].sort()) select.add(new Option(value,value));
    select.value = [...select.options].some(option=>option.value===selected) ? selected : '';
  }
  projects = [...projects].sort((a,b)=>Number(b.featured)-Number(a.featured));
  render();
  route();

}
update();
fetch(new URL('../data/projects.json',import.meta.url)).then(response => {
  if (!response.ok) throw Error('Project data unavailable');
  return response.json();
}).then(items => {
  if (!Array.isArray(items) || !items.length || JSON.stringify(items) === JSON.stringify(projectFallback)) return;
  projects = items;
  update();
}).catch(() => {});
