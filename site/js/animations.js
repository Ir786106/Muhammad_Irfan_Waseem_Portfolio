export function initMotion() {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const mascot = document.querySelector('.mascot');
  const stage = document.querySelector('.portrait-stage');
  const follower = document.querySelector('#follower');
  let animation;
  mascot.addEventListener('click', () => {
    if (motion.matches) return;
    animation?.cancel();
    animation = mascot.animate([{translate:'0 0'},{translate:'0 -8px'},{translate:'0 0'}],{duration:520});
    mascot.classList.add('wave');
    animation.onfinish = () => mascot.classList.remove('wave');
  });
  let stageVisible = false;
  const syncMascot = () => stage.classList.toggle('outside', !stageVisible || document.hidden);
  new IntersectionObserver(([entry]) => { stageVisible = entry.isIntersecting; syncMascot(); }).observe(stage);
  document.addEventListener('visibilitychange', syncMascot);
  stage.addEventListener('pointerleave', () => { mascot.querySelector('.eyes').style.translate = ''; });
  let frame = 0;
  let point;
  addEventListener('pointermove',event => {
    point = event;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const {clientX:x,clientY:y,target,pointerType} = point;
      const eligible = pointer.matches && !motion.matches && pointerType === 'mouse' && !target.closest('input,textarea,select,dialog');
      follower.hidden = !eligible;
      if (!eligible) return;
      follower.style.transform = 'translate('+x+'px,'+y+'px) translate(-50%,-50%)';
      const preview = Boolean(target.closest('.project-card a'));
      follower.classList.toggle('preview', preview);
      follower.classList.toggle('active', Boolean(target.closest('a,button,.project-art')));
      follower.textContent = preview ? 'View' : '';
      if (stage.contains(target)) {
        const bounds = stage.getBoundingClientRect();
        mascot.querySelector('.eyes').style.translate = ((x-bounds.left)/bounds.width-.5)*9+'px '+((y-bounds.top)/bounds.height-.5)*7+'px';
      }
    });
  },{passive:true});
  for (const media of [motion,pointer]) media.addEventListener('change',()=> { follower.hidden = true; });
  document.addEventListener('pointerleave',()=> { follower.hidden = true; });
  for (const button of document.querySelectorAll('.hero .primary')) {
    button.addEventListener('pointermove',event=>{
      if (!pointer.matches || motion.matches || event.pointerType !== 'mouse') return;
      const box = button.getBoundingClientRect();
      button.style.translate = ((event.clientX-box.left)/box.width-.5)*10+'px 0';
    });
    button.addEventListener('pointerleave',()=>{button.style.translate = '';});
  }
}
