// Main JavaScript file for Adventist Health India website

// --- REAL API ENDPOINT ---
// YOUR GOOGLE SCRIPT URL IS CORRECTLY PLACED HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwm5HxeLJ-QG-CM8kvzagbZGag1hpQPnPkF7adscxv8AaJReEm8ceQPODUBKR7gkd6W/exec'; 

// Mock API endpoints for Updates & Happenings section
const MOCK_POSTERS_API = '/api/posters';
const MOCK_EVENTS_API = '/api/events';

// Mock data for development (kept as fallback)
const mockPosters = [
    '/images/logo.png',
    '/images/fampic.png',
    '/images/logo.png'
];

const mockEvents = [
    {
        name: 'Health Awareness Camp',
        date: '2023-06-15',
        time: '10:00 AM - 4:00 PM',
        location: 'Aizawl Adventist Hospital'
    },
    {
        name: 'Blood Donation Drive',
        date: '2023-07-02',
        time: '9:00 AM - 2:00 PM',
        location: 'Pune Adventist Hospital'
    },
    {
        name: 'Medical Conference',
        date: '2023-07-18',
        time: '11:00 AM - 5:00 PM',
        location: 'SDA Medical Centre, Bangalore'
    },
    {
        name: 'Community Health Workshop',
        date: '2023-08-05',
        time: '2:00 PM - 6:00 PM',
        location: 'Mattison Memorial Hospital'
    }
];

// Global variables for slideshow
let currentSlideIndex = 0;
let slideshowInterval;

// *** NEW UNIFIED DATA FETCH FUNCTION ***
// This function replaces fetchPosters and fetchEvents
function fetchData() {
    return fetch(GOOGLE_SCRIPT_URL)
        .then(response => {
            if (!response.ok) {
                // If the network response is bad (e.g., 400 or 500 status), throw error
                throw new Error('Network response was not ok. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // The script is designed to return { events: [...], posters: [...] }
            return {
                events: data.events || mockEvents,
                posters: data.posters || mockPosters
            };
        })
        .catch(error => {
            console.error('Error fetching data from Google Script:', error);
            // Fall back to mock data if API fails
            return {
                events: mockEvents,
                posters: mockPosters
            };
        });
}

// Function to initialize the Updates & Happenings section
function initUpdatesAndHappenings() {
    // The init functions will now call the unified fetchData
    initPosterSlideshow();
    initEventsList();
}

// Function to initialize poster slideshow
function initPosterSlideshow() {
    const slideshowContainer = document.querySelector('.poster-slideshow');
    if (!slideshowContainer) return;
    
    // Fetch ALL data and only use the posters array
    fetchData()
        .then(data => {
            const posters = data.posters;
            if (posters && posters.length > 0) {
                setupSlideshow(posters);
            }
        })
        .catch(error => {
            console.error('Error initializing posters:', error);
        });
}

// *** DELETED: function fetchPosters() is REMOVED ***

// Function to set up the slideshow with fetched data (NO CHANGE)
function setupSlideshow(posters) {
    const slidesContainer = document.querySelector('.slides');
    const dotsContainer = document.querySelector('.slide-dots');
    
    if (!slidesContainer || !dotsContainer) return;
    
    // Clear existing slides and dots
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Create slides and dots from poster data
    posters.forEach((poster, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        
        console.log("Attempting to load poster URL:", poster);
        const img = document.createElement('img');
        img.src = poster;
        img.alt = `Event Poster ${index + 1}`;
        
        slide.appendChild(img);
        slidesContainer.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // Set up navigation arrows
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            navigateSlide('prev');
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            navigateSlide('next');
        });
    }
    
    // Start automatic slideshow
    startSlideshow();
}

// Function to navigate to a specific slide (NO CHANGE)
function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length || !dots.length) return;
    
    // Update current index
    currentSlideIndex = index;
    
    // Hide all slides and remove active class from dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show the selected slide and activate the corresponding dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Reset the slideshow timer
    resetSlideshow();
}

// Function to navigate to the previous or next slide (NO CHANGE)
function navigateSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;
    
    let newIndex;
    
    if (direction === 'prev') {
        newIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    } else {
        newIndex = (currentSlideIndex + 1) % slides.length;
    }
    
    goToSlide(newIndex);
}

// Function to start the automatic slideshow (NO CHANGE)
function startSlideshow() {
    // Clear any existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    
    // Set up a new interval
    slideshowInterval = setInterval(() => {
        navigateSlide('next');
    }, 5000); // Change slide every 5 seconds
}

// Function to reset the slideshow timer (NO CHANGE)
function resetSlideshow() {
    // Clear the existing interval and start a new one
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    
    startSlideshow();
}

// Function to initialize events list
function initEventsList() {
    const eventsContainer = document.querySelector('.events-list');
    if (!eventsContainer) return;
    
    // Fetch ALL data and only use the events array
    fetchData()
        .then(data => {
            const events = data.events;
            if (events && events.length > 0) {
                displayEvents(events);
            }
        })
        .catch(error => {
            console.error('Error initializing events:', error);
        });
}

// *** DELETED: function fetchEvents() is REMOVED ***

// Function to display events in the events list
function displayEvents(events) {
    const eventsContainer = document.querySelector('.events-list');
    if (!eventsContainer) return;
    
    // Clear existing events
    eventsContainer.innerHTML = '';
    
    // Limit to 5 events max
    const limitedEvents = events.slice(0, 5);
    
    // Create event items from events data
    limitedEvents.forEach(event => {
        // Create event item
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        
        // Parse the date
        const eventDate = new Date(event.date);
        
        // Check if date is valid before creating date elements
        let eventHTML = '';
        
        if (!isNaN(eventDate) && eventDate.toString() !== 'Invalid Date') {
            // Only create date elements if we have a valid date
            const month = eventDate.toLocaleString('default', { month: 'short' });
            const day = eventDate.getDate();
            
            eventHTML = `
                <div class="event-date">
                    <span class="event-month">${month}</span>
                    <span class="event-day">${day}</span>
                </div>
                <div class="event-details">
                    <h4 class="event-name">${event.name}</h4>
                    <p class="event-time">${event.time}</p>
                    <p class="event-location">${event.location}</p>
                </div>
            `;
        } else {
            // Skip date display if invalid, only show event details
            eventHTML = `
                <div class="event-details" style="width: 100%;">
                    <h4 class="event-name">${event.name}</h4>
                    <p class="event-time">${event.time}</p>
                    <p class="event-location">${event.location}</p>
                </div>
            `;
        }
        
        eventItem.innerHTML = eventHTML;
        eventsContainer.appendChild(eventItem);
    });
}

// ... (Rest of the script functions: initAnimations, initHospitalFiltering, initContactForm, etc. - NO CHANGE)

// Function to initialize animations (OPTIMIZED FOR FASTER LOADING)
function initAnimations() {
    // Add minimal staggered delay to elements (reduced from 0.1s to 0.03s)
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .slide-in-up').forEach((el, index) => {
        // Special handling for critical sections to load faster
        if (el.closest('#hospital-highlights') || el.closest('.values')) {
            // Almost no delay for critical sections
            el.style.transitionDelay = `${index * 0.02}s`;
        } else {
            // Reduced delay for other sections
            el.style.transitionDelay = `${index * 0.03}s`;
        }
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

// Function to initialize hospital filtering (NO CHANGE)
function initHospitalFiltering() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const hospitals = document.querySelectorAll('.hospital-card');
    
    if (!filterButtons.length || !hospitals.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Show/hide hospitals based on filter
            hospitals.forEach(hospital => {
                if (filter === 'all') {
                    hospital.style.display = 'block';
                } else {
                    const region = hospital.dataset.region;
                    hospital.style.display = region === filter ? 'block' : 'none';
                }
            });
        });
    });
}

// Function to initialize contact form (NO CHANGE)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
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

// Function to initialize smooth scrolling (NO CHANGE)
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

// Function to initialize card hover effects (NO CHANGE)
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

// Initialize everything when the DOM is fully loaded (NO CHANGE)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Updates & Happenings section
    initUpdatesAndHappenings();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
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
    
    // Initialize hospital filtering
    initHospitalFiltering();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Add hover effects to cards
    initCardHoverEffects();
});