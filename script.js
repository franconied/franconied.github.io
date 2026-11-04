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
