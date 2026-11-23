import * as THREE from 'three';
export function mountScene(host:HTMLElement){
const motion=matchMedia('(prefers-reduced-motion: reduce)');if(motion.matches)return;
const target=host.querySelector<HTMLElement>('.scene');if(!target)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));target.append(renderer.domElement);const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.z=9;
const group = new THREE.Group();
scene.add(group);
const materials = [
  new THREE.MeshStandardMaterial({color:0xb85032,metalness:.62,roughness:.23}),
  new THREE.MeshStandardMaterial({color:0x82514a,metalness:.55,roughness:.33})
];
const shape = new THREE.Shape();
shape.moveTo(-1.45,-1.45);shape.lineTo(1.45,-1.45);shape.lineTo(1.45,1.45);shape.lineTo(-1.45,1.45);shape.closePath();
const opening = new THREE.Path();
opening.moveTo(-.99,-.99);opening.lineTo(-.99,.99);opening.lineTo(.99,.99);opening.lineTo(.99,-.99);opening.closePath();
shape.holes.push(opening);
const geometry = new THREE.ExtrudeGeometry(shape,{depth:.12,bevelThickness:.045,bevelSize:.045,bevelSegments:2,steps:1});
for(let i=0;i<7;i++){
  const plate=new THREE.Mesh(geometry,materials[i%2]);
  plate.rotation.set(Math.PI/2,0,i*.13);
  plate.position.y=(i-3)*.44;
  group.add(plate);
}
scene.add(new THREE.AmbientLight(0xffc1a1,1.7));
const light=new THREE.DirectionalLight(0xffe3c7,5);
light.position.set(3,4,5);scene.add(light);
const fill=new THREE.DirectionalLight(0xff6740,4);
fill.position.set(-4,-2,3);scene.add(fill);
const resize=()=>{renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/Math.max(1,host.clientHeight);camera.updateProjectionMatrix();};
resize();
const observer=new ResizeObserver(resize);
observer.observe(host);
const modes = {
  origin: {spread:.44, stagger:0, twist:.13, tint:0xff6740},
  'food-fight': {spread:.24, stagger:.43, twist:.04, tint:0xff924d},
  'ittehad-food-industries': {spread:.61, stagger:.08, twist:0, tint:0xffcf78},
  teamsync: {spread:.38, stagger:.36, twist:.29, tint:0x839fff},
};
const hero = host.closest('.cinema-hero');
const tint = new THREE.Color();
let mode = modes.origin;
function readMode() {
  const value = hero?.querySelector<HTMLInputElement>('input[name="hero-system"]:checked')?.value ?? 'origin';
  mode = modes[value as keyof typeof modes] ?? modes.origin;
  tint.setHex(mode.tint);
}
readMode();
hero?.addEventListener('change', readMode);

let visible = false;
let frame = 0;
let disposed = false;
let x = 0;
let y = 0;
const fallback = host.querySelector<HTMLElement>('.sculpture-fallback');
function pointer(event: PointerEvent) {
  if (!visible || document.hidden) return;
  x = (event.clientX / innerWidth - .5) * .3;
  y = (event.clientY / innerHeight - .5) * .3;
}
function render(time: number) {
  frame = 0;
  if (disposed || !visible || document.hidden) return;
  group.rotation.x += (.28 + y - group.rotation.x) * .07;
  group.rotation.y += (.52 + x + Math.sin(time * .0005) * .15 - group.rotation.y) * .07;
  group.rotation.z = -.18;
  fill.color.lerp(tint, .06);
  group.children.forEach((plate, index) => {
    const offset = index - 3;
    plate.position.x += (Math.sin(offset * 1.35) * mode.stagger - plate.position.x) * .08;
    plate.position.y += (offset * mode.spread - plate.position.y) * .08;
    plate.rotation.z += (index * mode.twist - plate.rotation.z) * .08;
  });
  renderer.render(scene, camera);
  if (!host.classList.contains('ready')) {
    host.classList.add('ready');
    if (fallback) fallback.style.visibility = 'hidden';
  }
  schedule();
}
function schedule() {
  if (visible && !document.hidden && !disposed) {
    if (!frame) frame = requestAnimationFrame(render);
  } else if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}
const intersection = new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  schedule();
});
intersection.observe(host);
document.addEventListener('visibilitychange', schedule);
addEventListener('pointermove', pointer, { passive: true });

function cleanup() {
  if (disposed) return;
  disposed = true;
  schedule();
  observer.disconnect();
  intersection.disconnect();
  removeEventListener('pagehide', onPageHide);
  removeEventListener('pointermove', pointer);
  document.removeEventListener('visibilitychange', schedule);
  hero?.removeEventListener('change', readMode);
  motion.removeEventListener('change', cleanup);
  renderer.domElement.removeEventListener('webglcontextlost', cleanup);
  geometry.dispose();
  materials.forEach(material => material.dispose());
  renderer.dispose();
  renderer.domElement.remove();
  host.classList.remove('ready');
  if (fallback) fallback.style.visibility = 'visible';
}
function onPageHide(event: PageTransitionEvent) {
  if (!event.persisted) cleanup();
}
addEventListener('pagehide', onPageHide);
motion.addEventListener('change', cleanup);
renderer.domElement.addEventListener('webglcontextlost', cleanup);
}
