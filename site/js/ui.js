import { initMotion } from './animations.js';

export function initUI() {
  const root = document.documentElement;
  const theme = document.querySelector('#theme');
  try {
    const preference = localStorage.getItem('miw-theme');
    if (['dark','light'].includes(preference)) root.dataset.theme = preference;
  } catch {}
  const media = matchMedia('(prefers-color-scheme: dark)');
  const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : media.matches;
  function syncTheme() {
    theme.setAttribute('aria-label', 'Switch to '+(dark()?'light':'dark')+' theme');
    theme.textContent = dark()?'☀':'◐';
  }
  theme.onclick = () => {
    const change = () => {
      root.dataset.theme = dark()?'light':'dark';
      try { localStorage.setItem('miw-theme',root.dataset.theme); } catch {}
      syncTheme();
    };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(change);
    else change();
  };
  media.addEventListener('change',syncTheme);
  syncTheme();
  const menu = document.querySelector('#menu');
  const hamburger = document.querySelector('#hamb');
  const cv = document.querySelector('#cv-dialog');
  hamburger.onclick = () => {
    menu.showModal();
    hamburger.setAttribute('aria-expanded','true');
  };
  menu.onclose = () => hamburger.setAttribute('aria-expanded','false');
  menu.addEventListener('click',event => {
    if(event.target.closest('a,.close')) menu.close();
  });
  document.querySelector('#cv-preview').onclick = () => {
    if (!cv.querySelector('object')) {
      const object = document.createElement('object');
      object.type = 'application/pdf';
      object.data = cv.querySelector('a').href;
      object.setAttribute('aria-label','Curriculum vitae PDF');
      cv.querySelector('h2').after(object);
    }
    cv.showModal();
  };
  cv.querySelector('.close').onclick = () => cv.close();
  document.querySelector('#year').textContent = new Date().getFullYear();
  const time = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Karachi',hour:'2-digit',minute:'2-digit'});
  const clock = () => document.querySelector('#clock').textContent = time.format(new Date())+' PKT';
  clock();
  setInterval(clock,30000);
  const toast = document.querySelector('#toast');
  let toastTimer;
  document.querySelector('#copy-email').onclick = async () => {
    try {
      await navigator.clipboard.writeText('muhammadirfan.infosec@gmail.com');
      toast.textContent = 'Email address copied.';
    } catch { toast.textContent = 'Select the email address above to copy it.'; }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.textContent = ''; },3500);
  };
  const progress = document.querySelector('#progress');
  addEventListener('scroll',() => {
    progress.style.transform = 'scaleX('+scrollY/Math.max(1,root.scrollHeight-innerHeight)+')';
  },{passive:true});
  const nav = [...document.querySelectorAll('.navlinks a')];
  const observer = new IntersectionObserver(entries => {
    const active = entries.find(entry=>entry.isIntersecting);
    if (!active) return;
    nav.forEach(a => a.hash === '#'+active.target.id ? a.setAttribute('aria-current','location') : a.removeAttribute('aria-current'));
  },{rootMargin:'-15% 0px -55%'});
  for (const a of nav) observer.observe(document.getElementById(a.hash.slice(1)));
  const form = document.querySelector('.contact-form');
  const submit = form.querySelector('button[type=submit]');
  const status = form.querySelector('.status');
  for (const input of form.querySelectorAll('[required]')) {
    input.addEventListener('input',()=>input.setCustomValidity(input.value.trim()?'':'Please complete this field.'));
  }
  form.onsubmit = async event => {
    event.preventDefault();
    if (submit.disabled || form.elements._gotcha.value) return;
    submit.disabled = true;
    submit.classList.add('busy');
    status.textContent = 'Sending…';
    const data = new FormData(form);
    try {
      const response = await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'},signal:AbortSignal.timeout(16000)});
      if (!response.ok) throw Error('Enquiry rejected');
      status.textContent = 'Your enquiry was accepted. Thank you.';
      form.reset();
    } catch {
      status.textContent = 'Your enquiry could not be sent. Try again or ';
      const draft = document.createElement('a');
      draft.href = 'mailto:muhammadirfan.infosec@gmail.com?subject=Portfolio%20enquiry&body='+encodeURIComponent([...data].filter(([key,value])=>key !== '_gotcha' && value).map(([key,value])=>key+': '+value).join('\n'));
      draft.textContent = 'open an email draft';
      status.append(draft,'.');
    } finally {
      submit.disabled = false;
      submit.classList.remove('busy');
    }
  };
  initMotion();
}
