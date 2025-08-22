/* ====== Utilidades ====== */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* ====== Navegación activa con IntersectionObserver ====== */
const links = $$('.nav a, nav a');
const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    const i = sections.indexOf(e.target);
    if(e.isIntersecting){
      links.forEach(l=>l.classList.remove('active'));
      links[i]?.classList.add('active');
    }
  })
}, {rootMargin:'-50% 0px -40% 0px', threshold:0});
sections.forEach(s=>obs.observe(s));

/* ====== Año dinámico ====== */
const y = new Date().getFullYear();
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = y;

/* ====== Menú móvil ====== */
function toggleMenu(){ document.getElementById('menu').classList.toggle('open'); }
window.toggleMenu = toggleMenu;

/* ====== Tema (oscuro/claro) ====== */
const btn = document.getElementById('themeToggle');
btn?.addEventListener('click', ()=>{
  const isLight = document.documentElement.dataset.theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'dark' : 'light';
  if(!isLight){
    document.documentElement.style.setProperty('--bg', '#f7fafc');
    document.documentElement.style.setProperty('--panel', '#ffffff');
    document.documentElement.style.setProperty('--text', '#0b1220');
    document.documentElement.style.setProperty('--muted', '#5b6877');
    document.documentElement.style.setProperty('--code', '#0f172a');
  }else{
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--panel');
    document.documentElement.style.removeProperty('--text');
    document.documentElement.style.removeProperty('--muted');
    document.documentElement.style.removeProperty('--code');
  }
});

/* ====== Formulario (demo sin backend) ====== */
async function enviarMensaje(e){
  e.preventDefault();
  const $s = document.getElementById('status');
  $s.textContent = 'Enviando…';
  await new Promise(r=>setTimeout(r, 700));
  e.target.reset();
  $s.textContent = '¡Gracias! Te responderé pronto.';
  setTimeout(()=> $s.textContent = '', 3000);
}
window.enviarMensaje = enviarMensaje;

/* ====== Animación chida: orbes luminosos en canvas ====== */
(() => {
  const canvas = document.getElementById('fx');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, orbs, mouse = {x:0, y:0, active:false};

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width  = Math.floor(window.innerWidth  * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    spawn();
  }

  function spawn(){
    const count = Math.max(8, Math.floor(Math.min(w, h)/160));
    orbs = Array.from({length: count}).map(()=> ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()*2 - 1) * 0.25 * dpr,
      vy: (Math.random()*2 - 1) * 0.25 * dpr,
      r:  Math.random()*80*dpr + 40*dpr,
      hue: 180 + Math.random()*80
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation = 'lighter';
    for(const o of orbs){
      // movimiento
      o.x += o.vx; o.y += o.vy;
      if(o.x < -o.r || o.x > w + o.r) o.vx *= -1;
      if(o.y < -o.r || o.y > h + o.r) o.vy *= -1;

      // atracción ligera al mouse
      if(mouse.active){
        const dx = (mouse.x - o.x), dy = (mouse.y - o.y);
        const dist2 = dx*dx + dy*dy;
        const force = Math.min(2*dpr, 80*dpr / Math.max(60, Math.sqrt(dist2)));
        o.vx += (dx/dist2) * force;
        o.vy += (dy/dist2) * force;
      }

      // dibujo: gradiente radial con brillo
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `hsla(${o.hue}, 90%, 60%, .65)`);
      g.addColorStop(1, `hsla(${o.hue+20}, 90%, 60%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(step);
  }

  resize();
  requestAnimationFrame(step);
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', e => {
    mouse = {x: e.clientX * dpr, y: e.clientY * dpr, active: true};
  });
  window.addEventListener('pointerleave', ()=> mouse.active = false);
})();

/* ====== Reveal anim ====== */
const revObs = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('in'); revObs.unobserve(e.target); }
  });
}, {threshold: 0.15});
$$('.reveal').forEach(el => revObs.observe(el));
