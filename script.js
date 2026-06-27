// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.projects-carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');
    let currentIndex = 0;
    let autoPlay = null;
    let progressAnimation = null;
    let startTime = null;
    let remainingTime = 3000; // Track remaining time
    let isPaused = false;
    
    const SLIDE_DURATION = 10000; // 10  seconds per slide
    
    // Create colorful progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    if (slider) {
        slider.appendChild(progressBar);
    }
    
    // Function to animate progress bar with requestAnimationFrame for smooth animation
    function animateProgressBar(duration, startFrom = 0) {
        if (progressAnimation) {
            cancelAnimationFrame(progressAnimation);
        }
        
        startTime = performance.now();
        const startProgress = (startFrom / duration) * 100;
        progressBar.style.width = startProgress + '%';
        
        function updateProgress(currentTime) {
            const elapsed = currentTime - startTime;
            const totalElapsed = startFrom + elapsed;
            const progress = Math.min((totalElapsed / duration) * 100, 100);
            progressBar.style.width = progress + '%';
            
            if (totalElapsed < duration) {
                progressAnimation = requestAnimationFrame(updateProgress);
            } else {
                progressAnimation = null;
            }
        }
        
        progressAnimation = requestAnimationFrame(updateProgress);
    }
    
    function resetProgressBar() {
        if (progressAnimation) {
            cancelAnimationFrame(progressAnimation);
            progressAnimation = null;
        }
        progressBar.style.width = '0%';
        remainingTime = SLIDE_DURATION;
        isPaused = false;
        if (autoPlay) {
            animateProgressBar(SLIDE_DURATION, 0);
        }
    }
    
    function pauseProgressBar() {
        if (progressAnimation && !isPaused) {
            cancelAnimationFrame(progressAnimation);
            progressAnimation = null;
            
            // Calculate remaining time based on current width
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            remainingTime = SLIDE_DURATION * (1 - currentWidth / 100);
            isPaused = true;
        }
    }
    
    function resumeProgressBar() {
        if (isPaused && autoPlay) {
            const startFrom = SLIDE_DURATION - remainingTime;
            animateProgressBar(SLIDE_DURATION, startFrom);
            isPaused = false;
        }
    }
    
    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
        
        // Reset progress bar
        resetProgressBar();
    }
    
    // Next slide function
    function next() {
        let newIndex = currentIndex + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        showSlide(newIndex);
    }
    
    // Previous slide function
    function prev() {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        }
        showSlide(newIndex);
    }
    
    // Function to restart auto-play
    function restartAutoPlay() {
        if (autoPlay) {
            clearInterval(autoPlay);
        }
        autoPlay = setInterval(next, SLIDE_DURATION);
        remainingTime = SLIDE_DURATION;
        isPaused = false;
        animateProgressBar(SLIDE_DURATION, 0);
    }
    
    // Function to stop auto-play completely
    function stopAutoPlay() {
        if (autoPlay) {
            clearInterval(autoPlay);
            autoPlay = null;
        }
        pauseProgressBar();
    }
    
    // Function to resume auto-play without restarting
    function resumeAutoPlay() {
        if (!autoPlay) {
            autoPlay = setInterval(next, remainingTime);
            resumeProgressBar();
            
            // Adjust next slide timing based on remaining time
            setTimeout(() => {
                if (autoPlay) {
                    clearInterval(autoPlay);
                    autoPlay = setInterval(next, SLIDE_DURATION);
                }
            }, remainingTime);
        }
    }
    
    // Only initialize slider if elements exist
    if (slider && slides.length > 0 && dots.length > 0) {
        // Initialize the slider
        showSlide(currentIndex);
        restartAutoPlay();
        
        // Stop auto-play on hover over the entire carousel area (pause)
        slider.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });
        
        // Resume auto-play when mouse leaves the carousel (continue from where it left off)
        slider.addEventListener('mouseleave', () => {
            resumeAutoPlay();
        });
        
        // Event listeners for arrows
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                next();
                stopAutoPlay();
                restartAutoPlay();
            });
        }
        
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                prev();
                stopAutoPlay();
                restartAutoPlay();
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoPlay();
                restartAutoPlay();
            });
        });
    }
});

function animateWildCounter(element, target) {
    let count = 0;
    const interval = setInterval(() => {
        if (count < target) {
            // Random increment that increases as we get closer to target
            const remaining = target - count;
            let increment;
            
            if (remaining > 20) {
                increment = Math.floor(Math.random() * 8) + 2; // Random between 2-9
            } else if (remaining > 10) {
                increment = Math.floor(Math.random() * 5) + 1; // Random between 1-5
            } else {
                increment = Math.floor(Math.random() * 3) + 1; // Random between 1-3
            }
            
            count = Math.min(count + increment, target);
            element.textContent = count + '+';
        } else {
            clearInterval(interval);
        }
    }, 100); // Update every 100ms
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const target = parseInt(element.getAttribute('data-target'), 10);
            
            if (!element.hasAttribute('data-animated')) {
                element.setAttribute('data-animated', 'true');
                animateWildCounter(element, target);
                observer.unobserve(element);
            }
        }
    });
}, { threshold: 0.4 }); // Trigger when 40% visible

document.querySelectorAll('[class^="stat-number"]').forEach(element => {
    observer.observe(element);
});

// Custom alert function
function showCustomAlert(message, type = 'info') {
    // Get the modal
    const modal = document.getElementById('customAlert');
    const messageElement = document.getElementById('alertMessage');
    
    if (!modal || !messageElement) return;
    
    // Set the message
    messageElement.textContent = message;
    
    // Remove existing type classes
    modal.classList.remove('success', 'error', 'warning', 'info');
    
    // Add the type class
    modal.classList.add(type);
    
    // Change header icon based on type
    const headerIcon = document.querySelector('.alert-header i');
    if (headerIcon) {
        if (type === 'success') {
            headerIcon.className = 'fa-solid fa-circle-check';
        } else if (type === 'error') {
            headerIcon.className = 'fa-solid fa-circle-exclamation';
        } else if (type === 'warning') {
            headerIcon.className = 'fa-solid fa-triangle-exclamation';
        } else {
            headerIcon.className = 'fa-solid fa-bell';
        }
    }
    
    // Change header text based on type
    const headerTitle = document.querySelector('.alert-header h3');
    if (headerTitle) {
        if (type === 'success') {
            headerTitle.textContent = 'Success!';
        } else if (type === 'error') {
            headerTitle.textContent = 'Error!';
        } else if (type === 'warning') {
            headerTitle.textContent = 'Warning!';
        } else {
            headerTitle.textContent = 'Notification';
        }
    }
    
    // Show the modal
    modal.style.display = 'flex';
}

// Close alert function
function closeAlert() {
    const modal = document.getElementById('customAlert');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Form validation function
function validateForm() {
    // Get form field values - update these IDs to match your actual form fields
    const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
    const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
    const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
    const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
    
    // Check if name is empty
    if (!name) {
        showCustomAlert('Please enter your name.', 'error');
        return false;
    }
    
    // Check if name has at least 2 characters
    if (name.length < 2) {
        showCustomAlert('Name must be at least 2 characters long.', 'error');
        return false;
    }
    //validate name to only contain letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        showCustomAlert('Name can only contain letters and spaces.', 'error');
        return false;
    }
    //validate name only to have two names (first and last name)
    const nameParts = name.split(' ');
    if (nameParts.length < 2) {
        showCustomAlert('Please enter both your first and last name.', 'error');
        return false;
    }
    
    // Check if email is empty
    if (!email) {
        showCustomAlert('Please enter your email address.', 'error');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showCustomAlert('Please enter a valid email address (e.g., name@example.com).', 'error');
        return false;
    }
    
   
    //check if phone is empty (if phone field exists)
    if (phone !== undefined && !phone) {
        showCustomAlert('Please enter your phone number.', 'error');
        return false;
    }
    
    // Check phone if it exists and validate format
    if (phone !== undefined && phone) {
        const phoneRegex = /^\+?[0-9\s\-()]{7,}$/; // Basic phone number validation
        if (!phoneRegex.test(phone)) {
            showCustomAlert('Please enter a valid phone number (e.g., +254700000000).', 'error');
            return false;
        }
    }
    // validate phone number format of +254700000000
    if (phone !== undefined && phone) {
        const kenyaPhoneRegex = /^\+2547\d{8}$/; // Kenya phone number format
        if (!kenyaPhoneRegex.test(phone)) {
            showCustomAlert('Please enter a valid Kenyan phone number (e.g., +254700000000).', 'error');
            return false;
        }
    }
      //check if subject is empty (if subject field exists)
    if (document.getElementById('subject')) {
        const subject = document.getElementById('subject').value.trim();
        if (!subject) {
            showCustomAlert('Please enter a subject.', 'error');
            return false;
        }
        // validate subject to only contain letters, numbers, spaces and basic punctuation
        const subjectRegex = /^[a-zA-Z0-9\s.,!?'-]+$/;
        if (!subjectRegex.test(subject)) {
            showCustomAlert('Subject can only contain letters, numbers, spaces and basic punctuation.', 'error');
            return false;
        }
    }    
    //check if service is empty (if service field exists)
    const serviceGroup = document.getElementById('serviceGroup');
    if (serviceGroup) {
        const serviceSelect = serviceGroup.querySelector('select');
        if (serviceSelect && !serviceSelect.value) {
            showCustomAlert('Please select a service.', 'error');
            return false;
        }
    }
    
  
         // Check if message is empty (if message field exists)
    if (message !== undefined && !message) {
        showCustomAlert('Please enter your message.', 'error');
        return false;
    }
    
    // Check if message has at least 10 characters
    if (message !== undefined && message.length < 10) {
        showCustomAlert('Message must be at least 10 characters long.', 'warning');
        return false;
    }
    //validate message to only contain letters, numbers, spaces and basic punctuation
    if (message !== undefined && message) {
        const messageRegex = /^[a-zA-Z0-9\s.,!?'-]+$/;
        if (!messageRegex.test(message)) {
            showCustomAlert('Message can only contain letters, numbers, spaces and basic punctuation.', 'error');
            return false;
        }
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submit-btn');
    if (form) {
        form.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            
            // Validate form before showing success
            if (validateForm()) {
                // If validation passes, show success message
                showCustomAlert('Your message has been sent successfully!', 'success');
                
                // Clear form fields after successful submission
                const nameField = document.getElementById('name');
                const emailField = document.getElementById('email');
                const messageField = document.getElementById('message');
                const phoneField = document.getElementById('phone');
                const serviceGroup = document.getElementById('serviceGroup');
                const subjectField = document.getElementById('subject');
                
                if (nameField) nameField.value = '';
                if (emailField) emailField.value = '';
                if (messageField) messageField.value = '';
                if (phoneField) phoneField.value = '';
                if (subjectField) subjectField.value = '';
                if (serviceGroup) {
                    const serviceSelect = serviceGroup.querySelector('select');
                    if (serviceSelect) serviceSelect.value = '';
                }
            }
        });
    }
    
    // Close alert when clicking the closeAlertBtn
    const closeAlertBtn = document.getElementById('closeAlertBtn');
    if (closeAlertBtn) {
        closeAlertBtn.addEventListener('click', function() {
            closeAlert();
        });
    }
    
    // Close when clicking outside the modal
    window.onclick = function(event) {
        const modal = document.getElementById('customAlert');
        if (event.target === modal) {
            closeAlert();
        }
    }
    
    // ===== HAMBURGER MENU FUNCTIONALITY =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (hamburger && navLinks) {
        
        // Function to open menu
        function openMenu() {
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        }
        
        // Function to close menu
        function closeMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
        }
        
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on a navigation link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Close menu when clicking outside (on the backdrop)
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active')) {
                // Check if click is outside navLinks and not on hamburger
                if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                    closeMenu();
                }
            }
        });
        
        // Close menu when pressing ESC key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Handle window resize - close menu if window becomes larger than mobile breakpoint
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });
    }
    
    // Active link highlighting based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const allNavLinks = document.querySelectorAll('.nav-links a');
    
    allNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkPage === 'home.html') {
            link.classList.add('active');
        } else if (currentPage === 'index.html' && linkPage === 'home.html') {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a, .nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        // Check if it's an anchor link (starts with #)
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Back to top button functionality
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        }
        else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// FAQ Accordion functionality (for contact page)
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    // Close other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }
});
// Simple scroll fade animations - ONLY affects text cards, NOT images
document.addEventListener('DOMContentLoaded', function() {
    
    // ONLY select text elements - NO images
    const elements = document.querySelectorAll('.home-text, .card-1, .card-2, .card-3, .services-section, .project-card, .timeline-item, .team1, .team2, .team3, .team4, .cert-item1, .cert-item2, .cert-item3, .cert-item4, .testimonial-card1, .testimonial-card2, .testimonial-card3, .contact-info-card, .contact-form-card, .faq-item, .profile-p, .stat-item1, .stat-item2, .stat-item3, .stat-item4, .stat-item5');
    
    // Add fade class
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s ease';
    });
    
    // Observer to fade in when scrolled to
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    elements.forEach(el => observer.observe(el));
    
    // Hero text animation
    const heroTitle = document.querySelector('.home h2');
    const heroSlogan = document.querySelector('.slogan');
    const heroText = document.querySelector('.home p');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transition = 'opacity 0.6s ease';
        setTimeout(() => heroTitle.style.opacity = '1', 200);
    }
    if (heroSlogan) {
        heroSlogan.style.opacity = '0';
        heroSlogan.style.transition = 'opacity 0.6s ease';
        setTimeout(() => heroSlogan.style.opacity = '1', 400);
    }
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transition = 'opacity 0.6s ease';
        setTimeout(() => heroText.style.opacity = '1', 600);
    }
});

