/* ══════════════════════════════════════════
   JARICODE PORTFOLIO — script.js
   Gothic horror atmosphere inspired by
   Scary Notes & Zombie TO-DO
══════════════════════════════════════════ */

/* ── Custom Cursor ── */
const cur     = document.getElementById('cur');
const curRing = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('on'); curRing.classList.add('on'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('on'); curRing.classList.remove('on'); });
});

(function trackRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';
  requestAnimationFrame(trackRing);
})();

/* ══════════════════════════════════════════
   CANVAS — Particles + Lightning + Blood drops
   Inspired by Scary Notes fog & Zombie Todo blood
══════════════════════════════════════════ */
const canvas = document.getElementById('bg');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ── Fog particles ── */
const particles = [];
function mkParticle() {
  return {
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    Math.random() * 1.8 + .3,
    vx:   (Math.random() - .5) * .16,
    vy:   (Math.random() - .5) * .1,
    a:    Math.random() * .2,
    da:   (Math.random() * .0005) * (Math.random() < .5 ? 1 : -1),
    type: Math.random() < .18 ? 'gold' : Math.random() < .15 ? 'red' : 'fog'
  };
}
for (let i = 0; i < 180; i++) particles.push(mkParticle());

function updateParticles() {
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.a += p.da;
    if (p.a < 0)    p.da =  Math.abs(p.da);
    if (p.a > .25)  p.da = -Math.abs(p.da);
    if (p.x < -5)   p.x = W + 5;
    if (p.x > W+5)  p.x = -5;
    if (p.y < -5)   p.y = H + 5;
    if (p.y > H+5)  p.y = -5;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    if (p.type === 'gold')
      ctx.fillStyle = `rgba(201,168,76,${p.a * .55})`;
    else if (p.type === 'red')
      ctx.fillStyle = `rgba(160,20,20,${p.a * .5})`;
    else
      ctx.fillStyle = `rgba(120,120,200,${p.a})`;
    ctx.fill();
  });
}

/* ── Lightning bolts — golden, like Scary Notes atmosphere ── */
let bolts = [];

function mkBolt() {
  const x1 = Math.random() * W;
  const x2 = x1 + (Math.random() - .5) * 180;
  const y2 = H * (.2 + Math.random() * .55);
  const pts = [{ x: x1, y: 0 }];
  const steps = 8 + Math.floor(Math.random() * 8);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    pts.push({ x: x1 + (x2 - x1) * t + (Math.random() - .5) * 70, y: y2 * t });
  }
  pts.push({ x: x2, y: y2 });
  return { pts, life: 1, decay: .055 + Math.random() * .06 };
}

function scheduleBolt() {
  if (Math.random() < .4) bolts.push(mkBolt());
  setTimeout(scheduleBolt, 2500 + Math.random() * 8000);
}
setTimeout(scheduleBolt, 3500);

function drawBolts() {
  bolts = bolts.filter(b => b.life > 0);
  bolts.forEach(b => {
    b.life -= b.decay;
    const a = b.life;
    ctx.save();
    ctx.strokeStyle = `rgba(201,168,76,${a * .7})`;
    ctx.lineWidth   = .8;
    ctx.shadowColor = `rgba(201,168,76,${a})`;
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    b.pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.restore();
  });
}

/* ── Blood drip particles — from Zombie Todo ── */
let drops = [];

function mkDrop() {
  return {
    x:   Math.random() * W,
    y:   -10,
    vy:  .4 + Math.random() * .8,
    r:   1 + Math.random() * 2,
    a:   .5 + Math.random() * .3,
    len: 8 + Math.random() * 20
  };
}

function scheduleDrops() {
  if (Math.random() < .5) drops.push(mkDrop());
  setTimeout(scheduleDrops, 1500 + Math.random() * 4000);
}
scheduleDrops();

function drawDrops() {
  drops = drops.filter(d => d.y < H + 20);
  drops.forEach(d => {
    d.y += d.vy;
    ctx.save();
    ctx.strokeStyle = `rgba(160,10,10,${d.a})`;
    ctx.lineWidth   = d.r;
    ctx.shadowColor = `rgba(180,0,0,${d.a})`;
    ctx.shadowBlur  = 6;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y - d.len);
    ctx.lineTo(d.x, d.y);
    ctx.stroke();
    ctx.restore();
  });
}

/* ── Shooting stars / Tähdenlento ── */
let stars = [];

function mkStar() {
  const x = Math.random() * W * 0.7;
  const y = Math.random() * H * 0.4;
  const angle = Math.PI / 5 + (Math.random() - 0.5) * 0.3;
  const speed = 6 + Math.random() * 6;
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    len: 80 + Math.random() * 120,
    life: 1,
    decay: 0.022 + Math.random() * 0.018
  };
}

function scheduleStar() {
  stars.push(mkStar());
  setTimeout(scheduleStar, 4000 + Math.random() * 10000);
}
setTimeout(scheduleStar, 2000);

function drawStars() {
  stars = stars.filter(s => s.life > 0);
  stars.forEach(s => {
    s.life -= s.decay;
    s.x += s.vx;
    s.y += s.vy;
    const a = s.life;
    ctx.save();
    const grad = ctx.createLinearGradient(
      s.x - s.vx * 8, s.y - s.vy * 8,
      s.x - Math.cos(Math.atan2(s.vy, s.vx)) * s.len,
      s.y - Math.sin(Math.atan2(s.vy, s.vx)) * s.len
    );
    grad.addColorStop(0, `rgba(245,224,154,${a})`);
    grad.addColorStop(1, `rgba(212,168,67,0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = `rgba(212,168,67,${a * 0.8})`;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - Math.cos(Math.atan2(s.vy, s.vx)) * s.len,
      s.y - Math.sin(Math.atan2(s.vy, s.vx)) * s.len
    );
    ctx.stroke();
    ctx.restore();
  });
}

/* ── Main draw loop ── */
function draw() {
  ctx.clearRect(0, 0, W, H);
  updateParticles();
  drawBolts();
  drawDrops();
  drawStars();
  requestAnimationFrame(draw);
}
draw();

/* ══════════════════════════════════════════
   MOBILE BURGER
══════════════════════════════════════════ */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => burger.parentElement.querySelector('nav').classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => burger.parentElement.querySelector('nav').classList.remove('open'))
);

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ══════════════════════════════════════════
   PROJEKTIT — korttiruudukko + suodatus
   Lisää kuva vaihtamalla img:"" -> img:"img/tiedosto.webp"
══════════════════════════════════════════ */
const PROJECTS = [
  { name:"Watcher AI",        desc:"Tekoälypohjainen chatsovellus.",                                  tech:["React","Node.js","OpenAI"],   tags:["React"], status:"done", url:"https://youtu.be/riLghm5ydWo?si=8CQeuqb8dE7TdjCo", img:"img/watcher-ai.webp" },
  { name:"Reaper's Calendar", desc:"Synkkä kalenterisovellus tehtävien hallintaan.",                  tech:["React","MongoDB Atlas"],      tags:["React"],        status:"done", url:"https://youtu.be/Ov1q_Gs6aqc?si=QZ5SnAn2_2odQ6JD", img:"img/reapers_calendar.webp" },
  { name:"Scary Notes",       desc:"Muistiinpanosovellus web- ja mobiilikäyttöön.",                   tech:["Web","Mobile"],               tags:[],               status:"done", url:"https://www.youtube.com/watch?v=B4FVWTENkv8", img:"img/scarynotes.webp" },
  { name:"Palkkiolaskuri",    desc:"Palkkioiden laskuri oikealle asiakkaalle.",                       tech:["Asiakasprojekti","Ryhmätyö"], tags:[],               status:"done", url:"https://palkkiolaskuri.fi/", img:"" },
  { name:"Zombie TO-DO",      desc:"Tehtävälista zombie-teemalla ja tietokannalla.",                  tech:["PHP","MySQL"],                tags:[],               status:"done", url:"https://youtu.be/7N0jjv_Zsjc?si=vHKVJ7ETIK7EyHBb", img:"img/zombietodo.webp" },
  { name:"AI-sivu",           desc:"Ryhmätyönä toteutettu tekoälyaiheinen sivusto.",                  tech:["Ryhmätyöprojekti"],           tags:[],               status:"done", url:"https://henkilot.github.io/AI/", img:"" },
  { name:"Judovisa",          desc:"Judon termistöä testaava visasovellus.",                          tech:["JavaScript","Node.js"],       tags:["Node"],         status:"wip",  url:"https://www.youtube.com/watch?v=b0A5zm8vlyg", img:"img/judovisa.webp" },
  { name:"Ikimetsä",          desc:"React-pohjainen roolipeli metsämaailmassa.",                      tech:["React","Roolipeli"],          tags:["React"],        status:"wip",  url:"https://drive.google.com/file/d/19yDpMizZySFxg0jdJ-55eZmp4t_74Plb/view", img:"img/ikimetsa.webp" },
  { name:"Kilsamittari",      desc:"Kävelypäiväkirja matkojen seurantaan.",                           tech:["React","MERN"],               tags:["React"],        status:"done",  url:"https://youtu.be/zV87zPPu7hQ?si=fntKzL1zCzyU7Jdz", img:"img/kilsamittari.webp" },
   { name:"VäinöAI",          desc:"Keskusteleva tekoälyhahmo.",                                      tech:["React","Node.js","OpenAI"],  tags:["React"],        status:"done",  url:"https://drive.google.com/file/d/1pM-EYgE6PywhCiSgchpLkktlVvbywpbA/view?usp=sharing", img:"img/vainoai.webp" }
];

const PCARD_GEM = `<svg class="pcard-gem" viewBox="0 0 200 200" fill="none">
  <polygon points="100,8 192,60 192,140 100,192 8,140 8,60"    stroke="currentColor" stroke-width=".6" fill="none"/>
  <polygon points="100,28 172,66 172,134 100,172 28,134 28,66" stroke="currentColor" stroke-width=".4" opacity=".5" fill="none"/>
  <polygon points="100,55 145,80 145,120 100,145 55,120 55,80" stroke="currentColor" stroke-width=".4" opacity=".3" fill="none"/>
  <circle cx="100" cy="100" r="7"   stroke="currentColor" stroke-width=".6" fill="none"/>
  <circle cx="100" cy="100" r="2.5" fill="currentColor" opacity=".5"/>
</svg>`;

(function initProjects() {
  const grid    = document.getElementById('projGrid');
  const filters = document.getElementById('projFilters');
  if (!grid || !filters) return;

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

  function match(p, f) {
    if (f === 'all') return true;
    if (f === 'wip') return p.status === 'wip';
    return p.tags.includes(f);
  }

  function render(f) {
    grid.innerHTML = '';
    PROJECTS.filter(p => match(p, f)).forEach((p, i) => {
      const wip  = p.status === 'wip';
      const card = document.createElement('a');
      card.className = 'pcard';
      card.href = p.url; card.target = '_blank'; card.rel = 'noopener';
      card.style.animationDelay = (i * 0.06) + 's';
      card.innerHTML =
        '<div class="pcard-img">' +
          (p.img ? `<img src="${esc(p.img)}" alt="${esc(p.name)}">` : PCARD_GEM) +
          `<span class="pcard-status ${wip ? 'wip' : 'done'}">${wip ? '◆ Työn alla' : '✓ Valmis'}</span>` +
        '</div>' +
        '<div class="pcard-body">' +
          `<h3 class="pcard-name">${esc(p.name)}</h3>` +
          `<p class="pcard-desc">${esc(p.desc)}</p>` +
          `<div class="pcard-tech">${p.tech.map(t => `<span>${esc(t)}</span>`).join('')}</div>` +
        '</div>';
      grid.appendChild(card);
    });
    // custom cursor -hover uusille korteille
    grid.querySelectorAll('a').forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('on'); curRing.classList.add('on'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('on'); curRing.classList.remove('on'); });
    });
  }

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.fbtn');
    if (!btn) return;
    filters.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.f);
  });

  render('all');
})();

/* ══════════════════════════════════════════
   PARALLAX HERO
══════════════════════════════════════════ */
const heroEl = document.getElementById('top');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  heroEl.style.transform = `translateY(${y * .28}px)`;
  heroEl.style.opacity   = Math.max(0, 1 - y / (window.innerHeight * .88));
});

/* ══════════════════════════════════════════
   LOGO GLITCH on hover — like Zombie Todo flicker
══════════════════════════════════════════ */
const logoA = document.querySelector('.logo a');
const logoOriginal = 'JariCode';
const glitchChars  = '▓▒░█▄▀╬╫╪';
let glitchLoop;

logoA.addEventListener('mouseenter', () => {
  let count = 0;
  glitchLoop = setInterval(() => {
    const glitched = logoOriginal.split('').map(c =>
      Math.random() < .3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c
    ).join('');
    logoA.textContent = glitched;
    if (++count > 7) { clearInterval(glitchLoop); logoA.textContent = logoOriginal; }
  }, 55);
});
logoA.addEventListener('mouseleave', () => {
  clearInterval(glitchLoop);
  logoA.textContent = logoOriginal;
});

// Varmistaa että logo vie yhdellä klikkauksella sivun yläreunaan
logoA.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════════
   VIDEO POPUP LOGIC
══════════════════════════════════════════ */

const openVideo  = document.getElementById('openVideo');
const closeVideo = document.getElementById('closeVideo');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');

openVideo.addEventListener('click', (e) => {
  e.preventDefault();
  videoModal.classList.add('open');
  videoPlayer.currentTime = 0;
});

closeVideo.addEventListener('click', () => {
  videoModal.classList.remove('open');
  videoPlayer.pause();
});

videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) {
    videoModal.classList.remove('open');
    videoPlayer.pause();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    videoModal.classList.remove('open');
    videoPlayer.pause();
  }
});

/* ══════════════════════════════════════════
   FIX CURSOR IN FULLSCREEN VIDEO
══════════════════════════════════════════ */

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    // Fullscreen päällä → näytä normaali hiiri
    document.body.style.cursor = 'auto';
    document.getElementById('cur').style.display = 'none';
    document.getElementById('cur-ring').style.display = 'none';
  } else {
    // Fullscreen pois → takaisin custom cursor
    document.body.style.cursor = 'none';
    document.getElementById('cur').style.display = 'block';
    document.getElementById('cur-ring').style.display = 'block';
  }
});

/* ══════════════════════════════════════════
   CV MODAL
══════════════════════════════════════════ */

const openCV  = document.getElementById('openCV');
const closeCV = document.getElementById('closeCV');
const cvModal = document.getElementById('cvModal');

openCV.addEventListener('click', (e) => {
  e.preventDefault();
  cvModal.classList.add('open');
});

closeCV.addEventListener('click', () => {
  cvModal.classList.remove('open');
});

cvModal.addEventListener('click', (e) => {
  if (e.target === cvModal) {
    cvModal.classList.remove('open');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    cvModal.classList.remove('open');
  }
});

// Näytä normaali hiiri CV-modalin aikana, koska siellä ei tarvitse custom cursorin efektiä
openCV.addEventListener('click', (e) => {
  e.preventDefault();
  cvModal.classList.add('open');
  document.body.style.cursor = "auto";
});

closeCV.addEventListener('click', () => {
  cvModal.classList.remove('open');
  document.body.style.cursor = "none";
});

// Tulostusnappi CV:ssä, joka avaa tulostustilan
const printBtn = document.getElementById('printCV');

printBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const cvContent = document.querySelector('.cv-content').innerHTML;

  const printWindow = window.open('', '', 'width=900,height=700');

  printWindow.document.write(`
    <html>
      <head>
        <title>Jari Karri – CV</title>

        <!-- TÄRKEÄ: korjaa kuvan polut -->
        <base href="${window.location.origin}/">

        <!-- Self-hosted fontit -->
        <link rel="stylesheet" href="${window.location.origin}/fonts.css">

        <style>
          :root {
            --black: #04040a;
            --gold: #d4a843;
            --gold-dim: #7a5e1a;
            --text-body: #e0e0f4;
          }

          body {
            background: var(--black);
            color: var(--text-body);
            font-family: 'EB Garamond', serif;
            padding: 20px;
            line-height: 1.8;
          }

          /* CV header layout */
        .cv-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
          margin-bottom: 15px;
        }

        .cv-photo img {
          width: 80px;
          height: 120px;
          object-fit: cover;
          filter: brightness(.85) contrast(1.1);
          border: 1px solid var(--gold-dim);
          box-shadow:
            0 0 20px rgba(212,168,67,.2),
            inset 0 0 30px rgba(0,0,0,.4);
        }

          h3 {
            font-family: 'Cinzel', serif;
            color: var(--gold);
            font-size: 25px;
            margin-bottom: 10px;
          }

          h4 {
            font-family: 'Cinzel', serif;
            color: var(--gold);
            margin-top: 20px;
            margin-bottom: 10px;
            letter-spacing: .05em;
          }

          .cv-meta {
            color: var(--gold);
            margin-bottom: 20px;
          }

          .cv-section {
            margin-bottom: 20px;
            border-left: 2px solid var(--gold-dim);
            padding-left: 14px;
          }

          ul {
            padding-left: 18px;
          }

        </style>
      </head>
      <body>
        ${cvContent}
      </body>
    </html>
  `);

  printWindow.document.close();

  // 🔥 Odotetaan että kuvat latautuvat ennen printtiä
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };
});