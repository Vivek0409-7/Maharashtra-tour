document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark/Light Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.setAttribute('data-theme', savedTheme);
            themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }

        themeToggleBtn.addEventListener('click', () => {
            let currentTheme = body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }

    // 2. Interactive Route Selector
    const modeButtons = document.querySelectorAll('.mode-btn');
    const modeDesc = document.getElementById('mode-description');

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const desc = button.getAttribute('data-desc');
            if (modeDesc && desc) {
                modeDesc.textContent = desc;
            }
        });
    });

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// 4. Hero Slider Logic
let slideIndex = 0;
const slides = document.querySelectorAll('.hero-slider .slide');
const dots = document.querySelectorAll('.slider-dots .dot');
let autoSlideInterval;

function showSlide(index) {
    if (slides.length === 0) return;
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[slideIndex]) slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

window.currentSlide = function (index) {
    slideIndex = index;
    showSlide(slideIndex);
    startAutoSlide();
};

function startAutoSlide() {
    if (slides.length <= 1) return;
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 4500);
}

if (slides.length > 0) {
    showSlide(slideIndex);
    startAutoSlide();
}
