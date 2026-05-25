// ═══════════════════════════════════════════════
//   HAM2 Game Studio — main.js
// ═══════════════════════════════════════════════

// ── THEME TOGGLE ──
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  document.getElementById('theme-btn').textContent = isDark ? '☀ IŞIK' : '☾ GECE';
}

// ── MOBILE MENU ──
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
}

// ── EMAILJS CONFIG (hardcoded) ──
const EJS_KEY = 'HVIO89-UZ-jJnItd1';
const EJS_SVC = 'service_mkf8u0j';
const EJS_TPL = 'template_asxjftw';
emailjs.init(EJS_KEY);

function showMsg(text, isErr) {
  const el = document.getElementById('form-msg');
  el.textContent = text;
  el.className = 'form-msg' + (isErr ? ' err' : '');
}

// ── SEND EMAIL ──
async function sendEmail() {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const subject = document.getElementById('f-subject').value;
  const msg     = document.getElementById('f-msg').value.trim();
  if (!name || !email || !msg) {
    showMsg('⚠ Lütfen tüm alanları doldurun.', true); return;
  }

  showMsg('Gönderiliyor...', false);
  try {
    await emailjs.send(EJS_SVC, EJS_TPL, {
      from_name:  name,
      from_email: email,
      subject:    subject || 'Genel Soru',
      message:    msg,
      to_name:    'HAM2 Studio'
    });
    showMsg('✓ Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.', false);
    document.getElementById('f-name').value    = '';
    document.getElementById('f-email').value   = '';
    document.getElementById('f-subject').value = '';
    document.getElementById('f-msg').value     = '';
  } catch (e) {
    showMsg('✗ Gönderilemedi...', true);
  }
}

// ── FALLING RETRO PARTICLES ──
const bg   = document.getElementById('canvas-bg');
const bctx = bg.getContext('2d');
let particles = [];
const symbols = ['▲','▼','◆','●','★','✦','⬡','⬟','□','△','◇','❖','⊕','⊗','╋'];
const colors  = ['#ffffff','#4eff91','#6496ff','#ff6464','#ffdd44'];

function initParticles() {
  bg.width  = window.innerWidth;
  bg.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x:        Math.random() * bg.width,
      y:        Math.random() * bg.height,
      vy:       0.3 + Math.random() * 0.8,
      vx:       (Math.random() - 0.5) * 0.3,
      sym:      symbols[Math.floor(Math.random() * symbols.length)],
      size:     10 + Math.random() * 18,
      opacity:  0.08 + Math.random() * 0.18,
      rot:      Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      color:    colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animParticles() {
  bctx.clearRect(0, 0, bg.width, bg.height);
  particles.forEach(p => {
    bctx.save();
    bctx.translate(p.x, p.y);
    bctx.rotate(p.rot);
    bctx.globalAlpha    = p.opacity;
    bctx.fillStyle      = p.color;
    bctx.font           = `${p.size}px monospace`;
    bctx.textAlign      = 'center';
    bctx.textBaseline   = 'middle';
    bctx.fillText(p.sym, 0, 0);
    bctx.restore();

    p.y   += p.vy;
    p.x   += p.vx;
    p.rot += p.rotSpeed;

    if (p.y > bg.height + 30) { p.y = -30; p.x = Math.random() * bg.width; }
    if (p.x < -30)  p.x = bg.width  + 30;
    if (p.x > bg.width  + 30) p.x = -30;
  });
  requestAnimationFrame(animParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animParticles();

// ── PROJECT CARD CANVASES ──
const cardData = [
  { bg:'#0a0010', colors:['#9b59b6','#3498db','#e74c3c'], type:'rpg'    },
  { bg:'#001020', colors:['#00f5ff','#ff00ff','#ffff00'], type:'neon'   },
  { bg:'#000a05', colors:['#2ecc71','#1abc9c','#3498db'], type:'puzzle' },
  { bg:'#100a00', colors:['#f39c12','#e67e22','#ffffff'], type:'casual' },
  { bg:'#050010', colors:['#9b59b6','#3498db','#2ecc71','#e74c3c'], type:'open' }
];

function drawProjectCanvas(id, d) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;

  ctx.fillStyle = d.bg;
  ctx.fillRect(0, 0, w, h);

  if (d.type === 'rpg') {
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(w/2 + Math.cos(i) * 80, h/2 + Math.sin(i) * 40, 3 + i * 2, 0, Math.PI * 2);
      ctx.fillStyle  = d.colors[i % 3];
      ctx.globalAlpha = 0.3 + i * 0.05;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = d.colors[0]; ctx.fillRect(w/2-30, h/2-40, 60, 80);
    ctx.fillStyle = d.colors[1]; ctx.fillRect(w/2-20, h/2-50, 40, 60);

  } else if (d.type === 'neon') {
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle   = d.colors[i % 3];
      ctx.globalAlpha = 0.2 + Math.random() * 0.5;
      ctx.fillRect(Math.random()*w, Math.random()*h, 2, 2);
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.strokeStyle = d.colors[i % 3];
      ctx.lineWidth   = 1;
      ctx.globalAlpha = 0.4;
      ctx.moveTo(i * 60, 0); ctx.lineTo(w - i * 40, h);
      ctx.stroke();
    }

  } else if (d.type === 'puzzle') {
    const size = 30;
    for (let r = 0; r < h/size+1; r++) {
      for (let c2 = 0; c2 < w/size+1; c2++) {
        if ((r + c2) % 3 === 0) {
          ctx.fillStyle   = d.colors[c2 % 3];
          ctx.globalAlpha = 0.15;
          ctx.fillRect(c2*size, r*size, size-1, size-1);
        }
      }
    }
    ctx.globalAlpha = 0.6;
    ctx.fillStyle   = d.colors[0];
    ctx.beginPath(); ctx.arc(w/2, h/2, 50, 0, Math.PI*2); ctx.fill();

  } else if (d.type === 'casual') {
    for (let i = 0; i < 12; i++) {
      const x = 30 + i * 40;
      const y = h - 20 - Math.random() * 100;
      ctx.fillStyle   = d.colors[i % 2];
      ctx.globalAlpha = 0.5 + (i%3) * 0.1;
      ctx.fillRect(x, y, 28, h - y - 10);
    }

  } else { // open world
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = d.colors[i % 4];
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(0, i*25); ctx.lineTo(w, (i+3)*25);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle   = d.colors[i % 4];
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(Math.random()*w, Math.random()*h, 3 + Math.random()*8, 0, Math.PI*2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle   = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, w, 20);
  ctx.fillStyle   = d.colors[0];
  ctx.font        = 'bold 11px monospace';
  ctx.textAlign   = 'center';
  ctx.fillText('HAM2 STUDIO', w/2, 14);
}

['c1','c2','c3','c4','c5'].forEach((id, i) => drawProjectCanvas(id, cardData[i]));

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── INIT ──
// EmailJS hardcoded — no setup needed