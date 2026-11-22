// Browser-friendly progressive enhancement; visitors can always access static project links.
const showcase = document.getElementById('showcase');
const orbitButton = document.getElementById('enable-orbit');
const orbitStatus = document.getElementById('orbit-status');
const orbitExperience = document.getElementById('orbit-experience');
const motionSupported = () => matchMedia('(min-width:768px) and (prefers-reduced-motion:no-preference)').matches;
let started = false;

function canRenderWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch { return false; }
}
function enableOrbit(){
    if (started) return;
    if (!motionSupported()) {
        orbitStatus.textContent='3D is disabled on smaller screens or when reduced motion is enabled. Use the project links above.';
        return;
    }
    if (!canRenderWebGL()) {
        orbitStatus.textContent='This browser cannot run WebGL. All case studies remain available above.';
        return;
    }
    started=true;
    orbitButton.disabled=true;
    orbitStatus.textContent='Loading the interactive project orbit…';
    const script=document.createElement('script');
    script.src='vendor/three/three.min.js';
    script.onload=async()=>{
        try{
            orbitExperience.hidden=false;
            await new Promise(resolve=>requestAnimationFrame(resolve));
            const module=await import('./three-showcase.js');
            module.init3D();
            showcase.classList.add('orbit-ready');
            orbitStatus.textContent='3D enabled. Standard project links above remain available for keyboard access.';
            orbitButton.textContent='3D orbit enabled';
        }catch(error){
            orbitExperience.hidden=true;
            started=false;
            orbitButton.disabled=false;
            orbitStatus.textContent='Interactive orbit could not start. Please use the case study links above.';
            console.warn('Optional project orbit failed:',error);
        }
    };
    script.onerror=()=>{
        started=false;
        orbitButton.disabled=false;
        orbitExperience.hidden=true;
        orbitStatus.textContent='Interactive orbit is unavailable. The static project links still work.';
    };
    document.head.append(script);
}
orbitButton?.addEventListener('click',enableOrbit);

const progress = document.getElementById('scrollProgress');
const navbar = document.getElementById('navbar');
if (progress && navbar) {
    let scheduled=false;
    window.addEventListener('scroll',()=>{
        if(scheduled)return;
        scheduled=true;
        requestAnimationFrame(()=>{
            const range=document.documentElement.scrollHeight-innerHeight;
            progress.style.transform=`scaleX(${range>0?scrollY/range:0})`;
            navbar.classList.toggle('scrolled',scrollY>40);
            scheduled=false;
        });
    },{passive:true});
}
