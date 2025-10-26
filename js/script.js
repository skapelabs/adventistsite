// Main JavaScript file for Adventist Health India website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Initialize animations
    initAnimations();
    
    // Initialize hospital filter if on hospitals page
    const hospitalFilter = document.getElementById('hospitalFilter');
    if (hospitalFilter) {
        initHospitalFilter();
    }
    
    // Initialize contact form if on contact page
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm();
    }
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Add hover effects to cards
    initCardHoverEffects();
});

// Function to initialize animations
function initAnimations() {
    // Add staggered delay to elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .slide-in-up').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Use Intersection Observer to detect when elements are in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .slide-in-up').forEach(element => {
        observer.observe(element);
    });
}

// Function to initialize hospital filter
function initHospitalFilter() {
    const hospitalFilter = document.getElementById('hospitalFilter');
    const hospitalCards = document.querySelectorAll('.hospital-card');
    
    hospitalFilter.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        hospitalCards.forEach(card => {
            const hospitalName = card.querySelector('h3').textContent.toLowerCase();
            const hospitalLocation = card.querySelector('.hospital-location').textContent.toLowerCase();
            
            if (hospitalName.includes(searchTerm) || hospitalLocation.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Function to initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // In a real application, you would send the form data to a server here
        // For this demo, we'll just show a success message
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Function to initialize smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || !targetId) {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Function to initialize card hover effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.hospital-card, .team-card, .values-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}