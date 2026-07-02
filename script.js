// Flag that JS is running - the fade-in styles only apply to body.js,
// so the page stays fully visible when JS is disabled or fails to load
document.body.classList.add('js');

// -- Fade in sections as you scroll --
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// -- Keep the footer year current --
const year = document.getElementById('year');
if (year) {
    year.textContent = new Date().getFullYear();
}
