// ===== RUVI STUDIO — lógica compartida =====

// --- Idioma (se recuerda entre páginas) ---
function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    const btn = document.getElementById('langBtn');
    if (btn) btn.textContent = lang === 'es' ? 'EN' : 'ES';
}
function toggleLang() {
    const next = document.documentElement.getAttribute('lang') === 'es' ? 'en' : 'es';
    applyLang(next);
    try { localStorage.setItem('ruvi-lang', next); } catch (e) {}
}
(function initLang() {
    let saved = null;
    try { saved = localStorage.getItem('ruvi-lang'); } catch (e) {}
    applyLang(saved === 'en' ? 'en' : 'es');
})();

// --- Sliders de los casos ---
function moveSlide(btn, direction) {
    const slides = btn.parentElement.querySelectorAll('.slide');
    let active = 0;
    slides.forEach((s, i) => { if (s.classList.contains('active')) { active = i; s.classList.remove('active'); } });
    const next = (active + direction + slides.length) % slides.length;
    slides[next].classList.add('active');
}

// --- Videos: se reproducen solo cuando están en pantalla (ahorra datos y batería) ---
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video[data-autoplay]');
    if ('IntersectionObserver' in window) {
        const vo = new IntersectionObserver(entries => {
            entries.forEach(({ target, isIntersecting }) => {
                if (isIntersecting) { target.play().catch(() => {}); }
                else { target.pause(); }
            });
        }, { threshold: 0.25 });
        videos.forEach(v => vo.observe(v));

        // Aparición suave
        const ro = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
        }, { threshold: 0.12 });
        document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    } else {
        videos.forEach(v => v.play().catch(() => {}));
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }
});

// --- Reproductor a pantalla completa (con sonido) ---
function openVideo(src) {
    const modal = document.getElementById('videoModal');
    const v = document.getElementById('modalVideo');
    if (!modal || !v) return;
    document.querySelectorAll('video[data-autoplay]').forEach(x => x.pause());
    const yt = document.getElementById('ytFrame');
    if (src.startsWith('yt:')) {
        // Videos de YouTube: se ven dentro de la página
        v.style.display = 'none';
        yt.style.display = 'block';
        yt.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + src.slice(3) +
            '?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else {
        yt.style.display = 'none';
        v.style.display = '';
        v.src = src;
        v.play().catch(() => {});
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeVideo() {
    const modal = document.getElementById('videoModal');
    const v = document.getElementById('modalVideo');
    if (!modal || !v) return;
    v.pause();
    v.removeAttribute('src');
    v.load();
    const yt = document.getElementById('ytFrame');
    if (yt) yt.innerHTML = '';
    modal.classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });
