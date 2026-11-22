import {projects} from './projects.js';

function node(tag, cls, text=''){
  const el=document.createElement(tag);
  if(cls) el.className=cls;
  if(text) el.textContent=text;
  return el;
}
export function initFeatured(){
  const root=document.getElementById('feature-grid');
  if(!root) return;
  const ids=['foodfight','ittehad','teamsync'];
  const list=ids.map(id=>projects.find(p=>p.id===id)).filter(Boolean);
  const fragment=document.createDocumentFragment();
  for(const [index,project] of list.entries()){
    const article=node('article','feature-project');
    const imageLink=node('a','feature-image');
    imageLink.href=`projects/${encodeURIComponent(project.id)}/`;
    imageLink.setAttribute('aria-label',`Explore ${project.title} case study`);
    if(project.images?.[0]){
      const shot=project.images[0];
      const img=node('img');
      img.src=shot.src;img.alt=shot.alt;
      img.width=shot.width;img.height=shot.height;img.loading='lazy';img.decoding='async';
      imageLink.append(img);
    }
    const content=node('div','feature-project-copy');
    const category=node('p','feature-type',`${String(index+1).padStart(2,'0')} / ${project.category.split(' ')[0]} · ${project.status}`);
    const title=node('h3','',project.title);
    const summary=node('p','',project.description);
    const tags=node('div','feature-tags');
    for(const label of project.tags.slice(0,3))tags.append(node('span','',label));
    const action=node('a','feature-link','Read the case study');
    action.href=`projects/${encodeURIComponent(project.id)}/`;
    action.append(node('span','','↗'));
    content.append(category,title,summary,tags,action);
    article.append(imageLink,content);
    fragment.append(article);
  }
  root.replaceChildren(fragment);
}
