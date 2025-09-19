// Healthcare Services Portal - JavaScript Module
class HealthcareServices {
    constructor() {
        this.isInitialized = false;
        this.countersAnimated = false;
        this.serviceData = this.initServiceData();
        this.init();
    }

    // Initialize service data
    initServiceData() {
        return {
            cardiology: {
                title: "Cardiology Department",
                doctors: ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Rodriguez"],
                contact: "+1-555-HEART",
                rating: 4.9,
                waitTime: "15 mins",
                features: [
                    "24/7 Emergency Cardiac Care",
                    "Advanced Heart Surgery",
                    "Cardiac Rehabilitation",
                    "Preventive Screenings"
                ]
            },
            neurology: {
                title: "Neurology Department",
                doctors: ["Dr. James Wilson", "Dr. Lisa Park", "Dr. Robert Kumar"],
                contact: "+1-555-BRAIN",
                rating: 4.8,
                waitTime: "20 mins",
                features: [
                    "Advanced Brain Imaging",
                    "Stroke Emergency Unit",
                    "Epilepsy Monitoring",
                    "Neurological Rehabilitation"
                ]
            },
            orthopedics: {
                title: "Orthopedic Department",
                doctors: ["Dr. Anna Thompson", "Dr. David Martinez", "Dr. Kevin Lee"],
                contact: "+1-555-BONES",
                rating: 4.7,
                waitTime: "25 mins",
                features: [
                    "Joint Replacement Surgery",
                    "Sports Injury Treatment",
                    "Physical Therapy",
                    "Minimally Invasive Procedures"
                ]
            },
            // Add more service data as needed
        };
    }

    // Initialize the application
    init() {
        if (this.isInitialized) return;
        
        this.bindEvents();
        this.setupIntersectionObserver();
        this.initializeAnimations();
        this.setupAccessibility();
        this.preloadAssets();
        
        this.isInitialized = true;
        console.log('Healthcare Services Portal initialized successfully');
    }

    // Bind all event listeners
    bindEvents() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            this.handleDOMReady();
        }

        // Service card interactions
        this.bindServiceCardEvents();
        
        // Search functionality
        this.bindSearchEvents();
        
        // Filter functionality
        this.bindFilterEvents();
        
        // Keyboard navigation
        this.bindKeyboardEvents();
        
        // Touch events for mobile
        this.bindTouchEvents();
        
        // Window events
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
    }

    // Handle DOM ready
    handleDOMReady() {
        this.animateCardsOnLoad();
        this.initializeCounters();
        this.setupServiceCards();
        this.createSearchBox();
        this.createFilterButtons();
    }

    // Bind service card events
    bindServiceCardEvents() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            // Mouse events
            card.addEventListener('mouseenter', (e) => this.handleCardHover(e, true));
            card.addEventListener('mouseleave', (e) => this.handleCardHover(e, false));
            card.addEventListener('click', (e) => this.handleCardClick(e));
            
            // Focus events for accessibility
            card.addEventListener('focus', (e) => this.handleCardFocus(e, true));
            card.addEventListener('blur', (e) => this.handleCardFocus(e, false));
            
            // Add data attributes
            card.setAttribute('data-service-index', index);
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Learn more about ${card.querySelector('.service-title').textContent}`);
        });

        // Button events
        const serviceButtons = document.querySelectorAll('.service-btn');
        serviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleServiceButtonClick(e));
        });
    }

    // Handle card hover effects
    handleCardHover(event, isEntering) {
        const card = event.currentTarget;
        const icon = card.querySelector('.service-icon');
        
        if (isEntering) {
            card.style.transform = 'translateY(-10px)';
            icon.style.transform = 'scale(1.1) rotateY(10deg)';
            this.playHoverSound();
        } else {
            card.style.transform = 'translateY(0)';
            icon.style.transform = 'scale(1) rotateY(0)';
        }
    }

    // Handle card click
    handleCardClick(event) {
        const card = event.currentTarget;
        const serviceTitle = card.querySelector('.service-title').textContent.toLowerCase();
        
        // Add click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px)';
        }, 100);
        
        // Show service details
        this.showServiceModal(serviceTitle);
    }

    // Handle service button click
    handleServiceButtonClick(event) {
        event.stopPropagation();
        const card = event.target.closest('.service-card');
        const serviceTitle = card.querySelector('.service-title').textContent.toLowerCase();
        
        // Button animation
        const btn = event.target;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
        
        this.exploreService(serviceTitle);
    }

    // Explore service function
    exploreService(serviceName) {
        const serviceKey = serviceName.replace(/\s+/g, '').toLowerCase();
        const serviceInfo = this.serviceData[serviceKey];
        
        if (serviceInfo) {
            this.showServiceDetails(serviceInfo, serviceName);
        } else {
            this.showGenericServiceInfo(serviceName);
        }
        
        // Track analytics (if available)
        this.trackEvent('service_explored', { service: serviceName });
    }

    // Show service details modal
    showServiceDetails(serviceInfo, serviceName) {
        const modal = this.createModal();
        const modalContent = `
            <div class="service-modal-header">
                <h2>${serviceInfo.title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="service-modal-body">
                <div class="service-info-grid">
                    <div class="service-doctors">
                        <h3>Our Specialists</h3>
                        <ul>
                            ${serviceInfo.doctors.map(doctor => `<li>${doctor}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="service-details">
                        <div class="detail-item">
                            <span class="detail-label">Rating:</span>
                            <span class="detail-value">⭐ ${serviceInfo.rating}/5</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Wait Time:</span>
                            <span class="detail-value">⏱️ ${serviceInfo.waitTime}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Contact:</span>
                            <span class="detail-value">📞 ${serviceInfo.contact}</span>
                        </div>
                    </div>
                </div>
                <div class="service-features-detailed">
                    <h3>Key Services</h3>
                    <ul>
                        ${serviceInfo.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="service-actions">
                    <button class="btn-primary" onclick="healthcareServices.bookAppointment('${serviceName}')">
                        Book Appointment
                    </button>
                    <button class="btn-secondary" onclick="healthcareServices.requestCallback('${serviceName}')">
                        Request Callback
                    </button>
                </div>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Animate modal
        setTimeout(() => modal.classList.add('modal-show'), 10);
        
        // Bind close events
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    // Create modal element
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'service-modal';
        modal.innerHTML = `
            <style>
                .service-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .service-modal.modal-show {
                    opacity: 1;
                }
                .service-modal > div {
                    background: white;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    transform: scale(0.8);
                    transition: transform 0.3s ease;
                }
                .service-modal.modal-show > div {
                    transform: scale(1);
                }
                .service-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 30px;
                    border-bottom: 1px solid #eee;
                }
                .service-modal-body {
                    padding: 30px;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 5px;
                }
                .service-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 30px;
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .service-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }
                .btn-primary, .btn-secondary {
                    padding: 12px 24px;
                    border-radius: 25px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }
                .btn-secondary {
                    background: transparent;
                    border: 2px solid #667eea;
                    color: #667eea;
                }
            </style>
        `;
        return modal;
    }

    // Close modal
    closeModal(modal) {
        modal.classList.remove('modal-show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Book appointment
    bookAppointment(serviceName) {
        alert(`Booking appointment for ${serviceName}. This would integrate with your appointment system.`);
        this.trackEvent('appointment_booked', { service: serviceName });
    }

    // Request callback
    requestCallback(serviceName) {
        alert(`Callback requested for ${serviceName}. This would integrate with your CRM system.`);
        this.trackEvent('callback_requested', { service: serviceName });
    }

    // Create search functionality
    createSearchBox() {
        const container = document.querySelector('.section-header');
        const searchBox = document.createElement('div');
        searchBox.className = 'search-container';
        searchBox.innerHTML = `
            <style>
                .search-container {
                    margin-top: 30px;
                    position: relative;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .search-input {
                    width: 100%;
                    padding: 15px 50px 15px 20px;
                    border: 2px solid #e0e0e0;
                    border-radius: 25px;
                    font-size: 16px;
                    outline: none;
                    transition: border-color 0.3s ease;
                }
                .search-input:focus {
                    border-color: #667eea;
                }
                .search-icon {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }
            </style>
            <input type="text" class="search-input" placeholder="Search services..." id="serviceSearch">
            <i class="fas fa-search search-icon"></i>
        `;
        container.appendChild(searchBox);
    }

    // Bind search events
    bindSearchEvents() {
        const searchInput = document.getElementById('serviceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filterServices(e.target.value);
            }, 300));
        }
    }

    // Filter services based on search
    filterServices(searchTerm) {
        const cards = document.querySelectorAll('.service-card');
        const term = searchTerm.toLowerCase().trim();
        
        cards.forEach(card => {
            const title = card.querySelector('.service-title').textContent.toLowerCase();
            const description = card.querySelector('.service-description').textContent.toLowerCase();
            const features = Array.from(card.querySelectorAll('.service-features li'))
                .map(li => li.textContent.toLowerCase()).join(' ');
            
            const isMatch = title.includes(term) || description.includes(term) || features.includes(term);
            
            if (isMatch || term === '') {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (!card.style.opacity || card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        this.trackEvent('service_searched', { term: searchTerm });
    }

    // Create filter buttons
    createFilterButtons() {
        const container = document.querySelector('.section-header');
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <style>
                .filter-container {
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                }
                .filter-btn {
                    padding: 8px 16px;
                    border: 2px solid #667eea;
                    background: transparent;
                    color: #667eea;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                }
                .filter-btn:hover, .filter-btn.active {
                    background: #667eea;
                    color: white;
                }
            </style>
            <button class="filter-btn active" data-filter="all">All Services</button>
            <button class="filter-btn" data-filter="emergency">Emergency</button>
            <button class="filter-btn" data-filter="surgery">Surgery</button>
            <button class="filter-btn" data-filter="diagnostic">Diagnostic</button>
            <button class="filter-btn" data-filter="therapy">Therapy</button>
        `;
        container.appendChild(filterContainer);
    }

    // Bind filter events
    bindFilterEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                const filterBtns = document.querySelectorAll('.filter-btn');
                filterBtns.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                this.filterByCategory(filter);
            }
        });
    }

    // Filter by category
    filterByCategory(category) {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            const shouldShow = category === 'all' || this.cardMatchesCategory(card, category);
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        this.trackEvent('service_filtered', { category });
    }

    // Check if card matches category
    cardMatchesCategory(card, category) {
        const categoryMap = {
            'emergency': ['cardiology', 'neurology', 'emergency'],
            'surgery': ['orthopedics', 'oncology', 'urology', 'gynecology'],
            'diagnostic': ['ophthalmology', 'dermatology', 'gastroenterology'],
            'therapy': ['psychiatry', 'pulmonology', 'pediatrics']
        };
        
        const cardClass = Array.from(card.classList).find(cls => 
            Object.values(categoryMap).flat().includes(cls)
        );
        
        return categoryMap[category] && categoryMap[category].includes(cardClass);
    }

    // Animate cards on load
    animateCardsOnLoad() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initialize counter animations
    initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                    if (target < 100) {
                        counter.textContent += '%';
                    }
                }
            };
            
            updateCounter();
        };
        
        // Intersection Observer for counter animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.countersAnimated) {
                    const counter = entry.target;
                    setTimeout(() => animateCounter(counter), 
                        Array.from(counters).indexOf(counter) * 200);
                }
            });
            
            if (entries.some(entry => entry.isIntersecting)) {
                this.countersAnimated = true;
            }
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // Setup intersection observer
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        // Observe all service cards
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => observer.observe(card));
    }

    // Keyboard navigation
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            const focusedElement = document.activeElement;
            
            if (e.key === 'Enter' || e.key === ' ') {
                if (focusedElement.classList.contains('service-card')) {
                    e.preventDefault();
                    focusedElement.click();
                }
            }
            
            if (e.key === 'Escape') {
                const modal = document.querySelector('.service-modal');
                if (modal) {
                    this.closeModal(modal);
                }
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.handleArrowKeyNavigation(e);
            }
        });
    }

    // Handle arrow key navigation
    handleArrowKeyNavigation(event) {
        const cards = Array.from(document.querySelectorAll('.service-card'));
        const currentIndex = cards.indexOf(document.activeElement);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % cards.length;
        } else {
            nextIndex = (currentIndex - 1 + cards.length) % cards.length;
        }
        
        cards[nextIndex].focus();
    }

    // Touch events for mobile
    bindTouchEvents() {
        let touchStartY = 0;
        let touchStartTime = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            const diffY = touchStartY - touchEndY;
            
            // Swipe detection
            if (Math.abs(diffY) > 50 && touchDuration < 300) {
                this.handleSwipeGesture(diffY > 0 ? 'up' : 'down');
            }
        }, { passive: true });
    }

    // Handle swipe gestures
    handleSwipeGesture(direction) {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Add subtle swipe animation
                card.style.transform = `translateX(${direction === 'up' ? -5 : 5}px)`;
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            }
        });
    }

    // Handle window resize
    handleResize() {
        const cards = document.querySelectorAll('.service-card');
        
        // Recalculate animations for new viewport
        cards.forEach((card, index) => {
            card.style.transition = 'none';
            setTimeout(() => {
                card.style.transition = '';
            }, 100);
        });
    }

    // Handle scroll events
    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for header
        const header = document.querySelector('.section-header');
        if (header) {
            header.style.transform = `translateY(${rate}px)`;
        }
    }

    // Setup accessibility features
    setupAccessibility() {
        // Add ARIA labels
        const cards = document.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            card.setAttribute('role', 'button');
            card.setAttribute('aria-describedby', `service-desc-${index}`);
            
            const desc = card.querySelector('.service-description');
            if (desc) {
                desc.id = `service-desc-${index}`;
            }
        });
        
        // Add skip links
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #667eea;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Initialize card animations
    initializeAnimations() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            .service-card.in-view {
                animation: slideInUp 0.8s ease-out forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .service-card:focus {
                outline: 3px solid #667eea;
                outline-offset: 4px;
            }
            
            @media (prefers-reduced-motion: reduce) {
                .service-card,
                .service-icon,
                .service-btn {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Preload assets
    preloadAssets() {
        // Preload hover sounds (if implemented)
        // const audio = new Audio('/sounds/hover.mp3');
        // audio.load();
    }

    // Play hover sound
    playHoverSound() {
        // Implement subtle hover sound if needed
        // try {
        //     const audio = new Audio('/sounds/hover.mp3');
        //     audio.volume = 0.1;
        //     audio.play();
        // } catch (e) {
        //     // Ignore audio errors
        // }
    }

    // Track events (integrate with analytics)
    trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Custom analytics
        if (window.analytics) {
            window.analytics.track(eventName, properties);
        }
        
        console.log('Event tracked:', eventName, properties);
    }

    // Utility functions
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API methods
    showService(serviceName) {
        this.exploreService(serviceName);
    }
    
    hideAllModals() {
        const modals = document.querySelectorAll('.service-modal');
        modals.forEach(modal => this.closeModal(modal));
    }
    
    refreshServices() {
        this.animateCardsOnLoad();
    }
    
    // Destroy instance
    destroy() {
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        
        // Clean up modals
        this.hideAllModals();
        
        this.isInitialized = false;
    }
}

// Initialize the healthcare services when DOM is ready
const healthcareServices = new HealthcareServices();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealthcareServices;
}