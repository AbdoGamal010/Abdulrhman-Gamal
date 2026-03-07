/* ============================================
   MODERN PORTFOLIO - ENHANCED JAVASCRIPT
   ============================================ */

// ============================================
// CONFIGURATION & UTILITIES
// ============================================

const CONFIG = {
    scrollOffset: 100,
    animationDelay: 100,
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -50px 0px'
};

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Utility function for debouncing
function debounce(func, wait) {
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

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    heroSection: document.querySelector('.hero'),
    contactForm: document.querySelector('.contact-form'),
    projectCards: document.querySelectorAll('.project-card'),
    serviceCards: document.querySelectorAll('.service-card'),
    skillItems: document.querySelectorAll('.skills-list li')
};

// ============================================
// NAVIGATION & MOBILE MENU
// ============================================

class Navigation {
    constructor() {
        this.init();
    }

    init() {
        // Toggle mobile menu
        elements.hamburger?.addEventListener('click', () => this.toggleMenu());

        // Close menu when link is clicked
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Active navigation on scroll
        window.addEventListener('scroll', throttle(() => this.updateActiveLink(), 100));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
    }

    toggleMenu() {
        elements.hamburger.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMenu() {
        elements.hamburger.classList.remove('active');
        elements.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    updateActiveLink() {
        const sections = [
            { id: 'home', selector: '#home' },
            { id: 'about', selector: '#about' },
            { id: 'services', selector: '#services' },
            { id: 'projects', selector: '#projects' },
            { id: 'contact', selector: '#contact' }
        ];

        let current = '';

        sections.forEach(section => {
            const element = document.querySelector(section.selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= CONFIG.scrollOffset && rect.bottom >= CONFIG.scrollOffset) {
                    current = section.id;
                }
            }
        });

        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

class ScrollReveal {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * CONFIG.animationDelay);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements
        this.observeElements();
    }

    observeElements() {
        // Hero elements
        const heroElements = ['.hero-text', '.hero-image'];
        heroElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                this.observer.observe(el);
            });
        });

        // Section elements
        const sectionElements = [
            '.about-text', '.about-image',
            '.service-card',
            '.project-card',
            '.contact-info', '.contact-form'
        ];

        sectionElements.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                this.observer.observe(el);
            });
        });

        // Skills list items
        elements.skillItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            this.observer.observe(item);
        });
    }
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================

class InteractiveElements {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupButtonEffects();
        this.setupProjectHover();
        this.setupServiceHover();
        this.setupFormHandling();
        this.setupParallaxEffect();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupButtonEffects() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => this.createRippleEffect(e, button));
        });
    }

    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            transform: scale(0);
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    setupProjectHover() {
        elements.projectCards.forEach(card => {
            const image = card.querySelector('.project-image img');
            const overlay = card.querySelector('.project-overlay');
            const link = card.querySelector('.project-link');

            card.addEventListener('mouseenter', () => {
                if (image) image.style.transform = 'scale(1.1)';
                if (overlay) overlay.style.opacity = '1';
                if (link) {
                    link.style.transform = 'scale(1)';
                    link.style.transition = 'transform 0.3s ease';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (image) image.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = '0';
                if (link) link.style.transform = 'scale(0)';
            });
        });
    }

    setupServiceHover() {
        elements.serviceCards.forEach(card => {
            const icon = card.querySelector('.service-icon');

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    setupFormHandling() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Real-time validation
        const inputs = elements.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', debounce(() => this.validateField(input), 300));
        });
    }

    handleFormSubmission() {
        const formData = new FormData(elements.contactForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!this.validateForm(data)) return;

        // Show loading state
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            elements.contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    validateForm(data) {
        const required = ['name', 'email', 'subject', 'message'];
        for (const field of required) {
            if (!data[field] || !data[field].trim()) {
                this.showNotification(`Please fill in the ${field} field.`, 'error');
                return false;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        return true;
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value.length > 0;

        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
    }

    setupParallaxEffect() {
        if (!elements.heroSection) return;

        const handleScroll = throttle(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.5;

            // Parallax effect on hero background
            const heroBefore = elements.heroSection.querySelector('::before');
            if (heroBefore) {
                heroBefore.style.transform = `translateY(${rate}px)`;
            }
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 15px 25px;
            border-radius: 12px;
            font-weight: 500;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ${type === 'success'
                ? 'background: linear-gradient(135deg, #10b981, #059669); color: white;'
                : 'background: #ef4444; color: white;'}
        `;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

class Performance {
    constructor() {
        this.init();
    }

    init() {
        // Preload critical resources
        this.preloadCriticalImages();

        // Lazy load non-critical images
        this.setupLazyLoading();

        // Optimize scroll events
        this.optimizeScrollEvents();
    }

    preloadCriticalImages() {
        const criticalImages = [
            '../img/home.png',
            '../img/about.jpg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeScrollEvents() {
        // Use passive listeners for better performance
        window.addEventListener('scroll', () => {}, { passive: true });
    }
}

// ============================================
// INITIALIZATION
// ============================================

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all modules
        new Navigation();
        new ScrollReveal();
        new InteractiveElements();
        new Performance();

        // Page load animations
        this.setupPageLoad();

        // Console branding
        this.consoleBranding();
    }

    setupPageLoad() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');

            // Animate hero elements on load
            const heroText = document.querySelector('.hero-text');
            if (heroText) {
                heroText.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }

    consoleBranding() {
        console.log('%c🚀 Abdelrahman Gamal - Portfolio', 'font-size: 20px; font-weight: bold; color: #6366f1;');
        console.log('%c💼 Data Analyst & Web Developer', 'font-size: 14px; color: #8b5cf6;');
        console.log('%c✨ Built with modern web technologies', 'font-size: 12px; color: #cbd5e1;');
    }
}

// ============================================
// CSS ANIMATIONS (for JavaScript-created elements)
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .notification {
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .invalid {
        border-color: #ef4444 !important;
    }

    .valid {
        border-color: #10b981 !important;
    }

    .menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// ============================================
// START THE APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Graceful degradation for older browsers
if (!window.IntersectionObserver) {
    // Fallback for browsers without IntersectionObserver
    const elements = document.querySelectorAll('[style*="opacity: 0"]');
    elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}
