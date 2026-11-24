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
const props = new THREE.Group();
scene.add(props);
const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const frameGeometry = new THREE.EdgesGeometry(blockGeometry);
const propMaterials = {
  shell: new THREE.MeshStandardMaterial({ color: 0x182638, metalness: .4, roughness: .3 }),
  cyan: new THREE.MeshStandardMaterial({ color: 0x60cbd0, emissive: 0x164447 }),
  amber: new THREE.MeshStandardMaterial({ color: 0xe2a965, emissive: 0x412609 }),
  violet: new THREE.MeshStandardMaterial({ color: 0x9b9ce5, emissive: 0x292a53 }),
};
const wire = new THREE.LineBasicMaterial({ color: 0xa2d5e4 });
const exhibits = {
  'food-fight': new THREE.Group(),
  'ittehad-food-industries': new THREE.Group(),
  teamsync: new THREE.Group(),
};
function block(parent: THREE.Group, position: [number, number, number], size: [number, number, number], kind: keyof typeof propMaterials, outline = false) {
  const mesh = new THREE.Mesh(blockGeometry, propMaterials[kind]);
  mesh.position.set(...position);
  mesh.scale.set(...size);
  if (outline) mesh.add(new THREE.LineSegments(frameGeometry, wire));
  parent.add(mesh);
}

const phone = exhibits['food-fight'];
block(phone, [0, 0, 0], [1.45, 2.55, .2], 'shell', true);
for (let row = 0; row < 3; row++) {
  block(phone, [-.37, .65 - row * .62, .13], [.38, .38, .06], 'amber');
  block(phone, [.25, .65 - row * .62, .13], [.6, .13, .06], 'cyan');
}

const mill = exhibits['ittehad-food-industries'];
block(mill, [0, -.62, 0], [2.65, .12, .55], 'shell');
for (let bay = 0; bay < 4; bay++) {
  const x = (bay - 1.5) * .68;
  const height = [.5, .9, 1.3, .72][bay];
  block(mill, [x, -.56 + height / 2, 0], [.46, height, .65], 'amber', true);
}

const workspace = exhibits.teamsync;
for (let column = 0; column < 3; column++) {
  const x = (column - 1) * .88;
  block(workspace, [x, 0, 0], [.76, 1.65, .12], 'shell', true);
  for (let task = 0; task < 3 - column; task++) {
    block(workspace, [x, .48 - task * .42, .1], [.57, .25, .08], column === 2 ? 'cyan' : 'violet');
  }
}
Object.values(exhibits).forEach(exhibit => { exhibit.visible = false; props.add(exhibit); });

const modes = {
  origin: {spread:.44, stagger:0, twist:.13, tint:0xff6740},
  'food-fight': {spread:.24, stagger:.43, twist:.04, tint:0xff924d},
  'ittehad-food-industries': {spread:.61, stagger:.08, twist:0, tint:0xffcf78},
  teamsync: {spread:.38, stagger:.36, twist:.29, tint:0x839fff},
};
const hero = host.closest('.cinema-hero');
const tint = new THREE.Color();
const plateScale = new THREE.Vector3();
let mode = modes.origin;
function readMode() {
  const value = hero?.querySelector<HTMLInputElement>('input[name="hero-system"]:checked')?.value ?? 'origin';
  mode = modes[value as keyof typeof modes] ?? modes.origin;
  tint.setHex(mode.tint);
  Object.entries(exhibits).forEach(([id, exhibit]) => {
    const selected = id === value;
    if (selected && !exhibit.visible) exhibit.scale.setScalar(.72);
    exhibit.visible = selected;
  });
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
  const exhibitActive = props.children.some(exhibit => exhibit.visible);
  group.scale.lerp(plateScale.setScalar(exhibitActive ? .44 : 1), .08);
  group.position.z += ((exhibitActive ? -1.25 : 0) - group.position.z) * .08;
  for (const exhibit of props.children) {
    if (exhibit.visible) exhibit.scale.lerp(plateScale.setScalar(1), .09);
  }
  props.rotation.x += ((-.08 + y) - props.rotation.x) * .07;
  props.rotation.y += ((.22 + x) - props.rotation.y) * .07;
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
  blockGeometry.dispose();
  frameGeometry.dispose();
  Object.values(propMaterials).forEach(material => material.dispose());
  wire.dispose();
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
