// -- Smooth scroll for nav links --
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --Fade in sections as you scroll --
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// -- Typed greeting in the hero --
const tagline = document.querySelector('#hero p');
const message = "I build things that work - on the factory floor and on the screen.";
tagline.textContent = '';

let i = 0;
function type() {
    if (i < message.length) {
        tagline.textContent += message[i];
        i++;
        setTimeout(type, 35);
    }
}
type();