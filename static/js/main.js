document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuBtn.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuBtn) {
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuBtn) {
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // FAQ accordions
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });

    // Testimonial slider
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    
    if (testimonialDots.length && testimonialItems.length) {
        // Set initial active state
        testimonialDots[0].classList.add('active');
        testimonialItems[0].style.display = 'block';
        
        // Handle dot clicks
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                // Hide all testimonials
                testimonialItems.forEach(item => {
                    item.style.display = 'none';
                });
                
                // Remove active class from all dots
                testimonialDots.forEach(d => {
                    d.classList.remove('active');
                });
                
                // Show selected testimonial and add active class to dot
                testimonialItems[index].style.display = 'block';
                dot.classList.add('active');
            });
        });
        
        // Auto-rotate testimonials
        let currentIndex = 0;
        const autoRotate = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            
            // Hide all testimonials
            testimonialItems.forEach(item => {
                item.style.display = 'none';
            });
            
            // Remove active class from all dots
            testimonialDots.forEach(d => {
                d.classList.remove('active');
            });
            
            // Show current testimonial and add active class to dot
            testimonialItems[currentIndex].style.display = 'block';
            testimonialDots[currentIndex].classList.add('active');
        }, 5000);
        
        // Stop auto-rotate when interacting with dots
        testimonialDots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(autoRotate);
            });
        });
    }

    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset form validation
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('error');
            });
            
            let isValid = true;
            
            // Validate name
            const nameInput = contactForm.querySelector('[name="name"]');
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Por favor, informe seu nome');
                isValid = false;
            }
            
            // Validate email
            const emailInput = contactForm.querySelector('[name="email"]');
            if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Por favor, informe um e-mail válido');
                isValid = false;
            }
            
            // Validate message
            const messageInput = contactForm.querySelector('[name="message"]');
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Por favor, escreva sua mensagem');
                isValid = false;
            }
            
            if (isValid) {
                // Create form data
                const formData = new FormData(contactForm);
                
                // Submit form via AJAX
                fetch('/submit_contact', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        showFormMessage(true, data.message);
                        // Reset form
                        contactForm.reset();
                    } else {
                        // Show error message
                        showFormMessage(false, data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showFormMessage(false, 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
                });
            }
        });
        
        // Input validation on blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.name === 'name' && !input.value.trim()) {
                    showError(input, 'Por favor, informe seu nome');
                } else if (input.name === 'email' && !isValidEmail(input.value)) {
                    showError(input, 'Por favor, informe um e-mail válido');
                } else if (input.name === 'message' && !input.value.trim()) {
                    showError(input, 'Por favor, escreva sua mensagem');
                } else {
                    clearError(input);
                }
            });
            
            // Clear error on input
            input.addEventListener('input', function() {
                clearError(input);
            });
        });
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }
    
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showFormMessage(isSuccess, message) {
        if (!formMessage) return;
        
        formMessage.classList.remove('success', 'error');
        formMessage.classList.add(isSuccess ? 'success' : 'error');
        formMessage.textContent = message;
        formMessage.style.display = 'block';
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Animation on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + windowTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // If element is in viewport
            if ((elementBottom >= windowTop) && (elementTop <= windowBottom)) {
                element.classList.add('animated');
            }
        });
    }
    
    // Check elements on load
    checkIfInView();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkIfInView);
});
