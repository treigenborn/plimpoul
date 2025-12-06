/**
 * Plimpoul Landing Page - JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollSpy();
    initScrollAnimations();
    initCarousel();
    initCountdown();
    initPreventaForm();
    initContactForm();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const header = document.querySelector('.header');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Scroll Spy - Highlight nav item based on current section
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // If at the very top (hero section), remove all active states
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }
    
    // Run on scroll with debounce for performance
    window.addEventListener('scroll', debounce(updateActiveNav, 10));
    
    // Run once on load
    updateActiveNav();
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
}

/**
 * Carousel functionality for multiple carousels
 */
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const cards = carousel.querySelectorAll('.carousel-card');
        const dots = carousel.querySelectorAll('.carousel-dots .dot');
        
        if (cards.length === 0) return;
        
        let currentIndex = 1; // Start with middle card
        
        function updateCarousel(index) {
            // Update cards
            cards.forEach((card, i) => {
                card.classList.remove('active');
                if (i === index) {
                    card.classList.add('active');
                }
            });
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
            
            currentIndex = index;
        }
        
        // Click on cards to select
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                updateCarousel(index);
            });
        });
        
        // Click on dots to navigate
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateCarousel(index);
            });
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next
                    const newIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
                    updateCarousel(newIndex);
                } else {
                    // Swipe right - previous
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
                    updateCarousel(newIndex);
                }
            }
        }
    });
}

/**
 * Countdown for Preventa section
 */
function initCountdown() {
    const target = new Date();
    target.setDate(target.getDate() + 15); // default: 15 days from now

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minutesEl = document.getElementById('count-minutes');

    if (!daysEl || !hoursEl || !minutesEl) return;

    function updateCountdown() {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 60 * 1000);
}

/**
 * Preventa form helpers (quantity buttons)
 */
function initPreventaForm() {
    const qtyBtns = document.querySelectorAll('.qty-btn');
    const qtyInput = document.querySelector('#cantidad');
    const preventaForm = document.querySelector('.preventa-form');

    if (qtyBtns && qtyInput) {
        qtyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const change = Number(btn.dataset.change || 0);
                const current = Number(qtyInput.value) || 1;
                const next = Math.min(10, Math.max(1, current + change));
                qtyInput.value = next;
            });
        });
    }

    if (preventaForm) {
        preventaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(preventaForm));
            console.log('Preventa form:', data);
            alert('¡Gracias! Te contactaremos con tus entradas.');
            preventaForm.reset();
        });
    }
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message (replace with actual implementation)
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            form.reset();
        });
    }
}

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

