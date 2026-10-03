const gallery = document.getElementById('gallery');
const dialog = document.getElementById('lightbox');
let filter = 'all', activeIndex = 0, previousFocus;
const imageMemories = () => memories.filter(m => !m.video && (filter === 'all' || m.category === filter));
function renderGallery() {
  gallery.replaceChildren();
  const list = memories.filter(m => filter === 'all' || m.category === filter);
  list.forEach((m) => {
    const figure = document.createElement('figure');
    figure.className = 'photo';
    if (m.video) {
      const video = document.createElement('video');
      video.controls = true; video.preload = 'none'; video.playsInline = true;
      video.poster = m.thumb; video.src = m.src; video.setAttribute('aria-label', 'فيديو من ذكرياتنا');
      figure.append(video);
    } else {
      const button = document.createElement('button');
      button.type = 'button'; button.setAttribute('aria-label', 'افتح الصورة: ' + m.label);
      const img = document.createElement('img');
      img.src = m.thumb; img.alt = m.label; img.loading = 'lazy'; img.width = m.width; img.height = m.height;
      const expand = document.createElement('span'); expand.className = 'expand'; expand.textContent = '↗'; expand.setAttribute('aria-hidden','true');
      button.append(img, expand);
      button.addEventListener('click', () => { previousFocus = button; activeIndex = imageMemories().indexOf(m); showPhoto(); dialog.showModal(); document.body.style.overflow = 'hidden'; });
      figure.append(button);
    }
    const caption = document.createElement('figcaption');
    const label = document.createElement('span'); label.textContent = m.label;
    const number = document.createElement('span'); number.className = 'photo-number'; number.textContent = String(memories.indexOf(m) + 1).padStart(2, '0');
    caption.append(label, number); figure.append(caption); gallery.append(figure);
  });
  document.getElementById('album-count').textContent = list.length + ' MOMENTS / ONE FRIENDSHIP';
}
function showPhoto() {
  const list = imageMemories(), m = list[activeIndex];
  const img = document.getElementById('lightbox-img'); img.src = m.src; img.alt = m.label;
  document.getElementById('lightbox-caption').textContent = m.label;
  document.getElementById('lightbox-counter').textContent = (activeIndex + 1) + ' / ' + list.length;
}
function movePhoto(step) { const list = imageMemories(); activeIndex = (activeIndex + step + list.length) % list.length; showPhoto(); }
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { const selected = b === button; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); });
  gallery.querySelectorAll('video').forEach(v => v.pause()); renderGallery();
}));
document.getElementById('prev').addEventListener('click', () => movePhoto(-1));
document.getElementById('next').addEventListener('click', () => movePhoto(1));
document.getElementById('lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; previousFocus?.focus({preventScroll:true}); });
dialog.addEventListener('keydown', e => { if(e.key === 'ArrowLeft') { e.preventDefault(); movePhoto(1); } if(e.key === 'ArrowRight') { e.preventDefault(); movePhoto(-1); } });
let celebrating = false;
document.getElementById('celebrate-btn').addEventListener('click', () => {
  document.getElementById('celebrate-message').textContent = 'كل سنة وإنت طيب يا صياد. لأحلام أكبر وصحبة دايمة 💚';
  if (celebrating || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  celebrating = true;
  const colors = ['#c7fa72', '#f4f1e9', '#c994ed', '#eac36e'];
  for(let i = 0; i < 90; i++) {
    const c = document.createElement('span'); c.className = 'confetti';
    Object.assign(c.style, { left: Math.random()*100+'%', width: 5+Math.random()*6+'px', height: 8+Math.random()*10+'px', background:colors[i%colors.length], animationDuration: 2+Math.random()*2+'s', animationDelay:Math.random()*.4+'s' });
    document.body.append(c);
    c.addEventListener('animationend', () => c.remove(), {once:true});
  }
  setTimeout(() => celebrating = false, 4600);
});
renderGallery();
