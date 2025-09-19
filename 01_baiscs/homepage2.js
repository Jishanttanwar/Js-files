/**
 * HealthCare+ Portal - Main JavaScript File
 * Handles all interactive functionality for the health portal
 */

class HealthPortal {
    constructor() {
        this.appointments = [];
        this.prescriptions = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDateInputs();
        this.loadStoredData();
        this.setupFormValidation();
        this.initializeAnimations();
        this.setupNotifications();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Modal events
        this.setupModalEvents();
        
        // Form submissions
        this.setupFormSubmissions();
        
        // Navigation events
        this.setupNavigationEvents();
        
        // Search functionality
        this.setupSearchEvents();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    // Modal Management
    setupModalEvents() {
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.closeModal(event.target.id);
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Setup close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (event) => {
                const modal = event.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modal.classList.add('modal-opening');
            document.body.style.overflow = 'hidden';
            
            // Focus first input field
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 300);
            }
            
            // Track modal opening
            this.trackEvent('modal_opened', { modal: modalId });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('modal-closing');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('modal-opening', 'modal-closing');
                document.body.style.overflow = 'auto';
            }, 200);
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                this.closeModal(modal.id);
            }
        });
    }

    // Form Validation and Submission
    setupFormSubmissions() {
        // Login form
        const loginForm = document.querySelector('#loginModal form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Appointment form
        const appointmentForm = document.querySelector('#appointmentModal form');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', this.handleAppointment.bind(this));
        }

        // Prescription refill form
        const prescriptionForm = document.querySelector('#prescriptionModal form');
        if (prescriptionForm) {
            prescriptionForm.addEventListener('submit', this.handlePrescriptionRefill.bind(this));
        }
    }

    setupFormValidation() {
        // Real-time validation for all forms
        document.querySelectorAll('form').forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        
        // Remove existing error styling
        field.classList.remove('error');
        this.removeFieldError(field);

        // Required field validation
        if (isRequired && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        // Password validation
        if (fieldType === 'password' && value) {
            if (value.length < 6) {
                this.showFieldError(field, 'Password must be at least 6 characters');
                return false;
            }
        }

        // Date validation
        if (fieldType === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                this.showFieldError(field, 'Please select a future date');
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
    }

    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        this.removeFieldError(field);
    }

    // Form Handlers
    handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Mock authentication
            if (this.mockLogin(username, password)) {
                this.showNotification('Login successful!', 'success');
                this.closeModal('loginModal');
                this.updateUIForLoggedInUser(username);
                form.reset();
            } else {
                this.showNotification('Invalid credentials. Try demo@healthcare.com / password', 'error');
            }
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    handleAppointment(event) {
        event.preventDefault();
        const form = event.target;
        
        if (!this.validateForm(form)) {
            return;
        }

        const formData = new FormData(form);
        const appointmentData = {
            id: this.generateId(),
            patientName: formData.get('patientName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            department: formData.get('department'),
            preferredDate: formData.get('preferredDate'),
            notes: formData.get('notes'),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Scheduling...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.appointments.push(appointmentData);
            this.saveToStorage('appointments', this.appointments);
            
            this.showNotification('Appointment scheduled successfully! Confirmation email sent.', 'success');
            this.closeModal('appointmentModal');
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Track appointment
            this.trackEvent('appointment_scheduled', {
                department: appointmentData.department,
                date: appointmentData.preferredDate
            });
        }, 2000);
    }

    handlePrescriptionRefill(event) {
        event.preventDefault();
        const form = event.target;
        
        if (!this.validateForm(form)) {
            return;
        }

        const formData = new FormData(form);
        const prescriptionData = {
            id: this.generateId(),
            prescriptionId: formData.get('prescriptionId'),
            medicationName: formData.get('medicationName'),
            pharmacy: formData.get('pharmacy'),
            status: 'processing',
            requestedAt: new Date().toISOString()
        };

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.prescriptions.push(prescriptionData);
            this.saveToStorage('prescriptions', this.prescriptions);
            
            this.showNotification('Prescription refill request submitted successfully!', 'success');
            this.closeModal('prescriptionModal');
            form.reset();
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please correct the errors in the form', 'error');
        }

        return isValid;
    }

    // Navigation and UI
    setupNavigationEvents() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Mobile menu toggle (if exists)
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
    }

    smoothScrollTo(element) {
        const targetPosition = element.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function (ease-in-out)
            const easedPercentage = percentage < 0.5 
                ? 2 * percentage * percentage 
                : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easedPercentage);
            
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }

    // Search Functionality
    setupSearchEvents() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(searchInput.value);
                }
            });
        }
    }

    handleSearch(event) {
        const query = event.target.value.toLowerCase();
        const searchResults = document.getElementById('searchResults');
        
        if (query.length < 2) {
            if (searchResults) searchResults.style.display = 'none';
            return;
        }

        // Mock search data
        const searchData = [
            { type: 'service', title: 'Cardiology Department', description: 'Heart and cardiovascular care' },
            { type: 'service', title: 'Emergency Care', description: '24/7 emergency medical services' },
            { type: 'doctor', title: 'Dr. Smith - Cardiologist', description: 'Specialized in heart conditions' },
            { type: 'service', title: 'Laboratory Services', description: 'Blood tests and diagnostics' },
            { type: 'service', title: 'Pharmacy', description: 'Prescription medications and refills' }
        ];

        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        let searchResults = document.getElementById('searchResults');
        
        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.id = 'searchResults';
            searchResults.className = 'search-results';
            document.querySelector('header').appendChild(searchResults);
        }

        if (results.length === 0) {
            searchResults.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
        } else {
            const resultsHTML = results.map(result => `
                <div class="search-result-item" onclick="healthPortal.selectSearchResult('${result.type}', '${result.title}')">
                    <h4>${result.title}</h4>
                    <p>${result.description}</p>
                </div>
            `).join('');
            
            searchResults.innerHTML = resultsHTML;
        }

        searchResults.style.display = 'block';
    }

    selectSearchResult(type, title) {
        this.hideSearchResults();
        
        if (type === 'service' && title.includes('Cardiology')) {
            this.openModal('appointmentModal');
            // Pre-select cardiology department
            setTimeout(() => {
                const deptSelect = document.getElementById('department');
                if (deptSelect) deptSelect.value = 'cardiology';
            }, 300);
        } else if (title.includes('Emergency')) {
            this.showNotification('For emergencies, call 911 or visit our emergency room immediately!', 'warning');
        } else {
            this.showNotification(`Showing information for: ${title}`, 'info');
        }
    }

    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + K for search
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }
            
            // Alt + A for appointment
            if (event.altKey && event.key === 'a') {
                event.preventDefault();
                this.openModal('appointmentModal');
            }
            
            // Alt + L for login
            if (event.altKey && event.key === 'l') {
                event.preventDefault();
                this.openModal('loginModal');
            }
        });
    }

    // Animations and UI Effects
    initializeAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.action-card, .feature-card').forEach(card => {
            observer.observe(card);
        });

        // Add hover effects to action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    handleScroll() {
        const header = document.querySelector('header');
        const scrolled = window.pageYOffset > 50;
        
        if (scrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Handle responsive behavior
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.hideSearchResults();
        }
    }

    // Notifications System
    setupNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Data Management
    saveToStorage(key, data) {
        try {
            // Note: In actual implementation, this would use localStorage
            // For demo purposes, we'll just store in memory
            this[key] = data;
            console.log(`Saved ${key} to storage:`, data);
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    loadStoredData() {
        // In actual implementation, this would load from localStorage
        this.appointments = [];
        this.prescriptions = [];
        console.log('Loaded stored data');
    }

    // Utility Functions
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Mock Authentication
    mockLogin(username, password) {
        // Demo credentials
        const validCredentials = [
            { username: 'demo@healthcare.com', password: 'password' },
            { username: 'patient@test.com', password: 'test123' },
            { username: 'admin', password: 'admin' }
        ];

        return validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
    }

    updateUIForLoggedInUser(username) {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = `Welcome, ${username.split('@')[0]}`;
            loginBtn.onclick = () => this.showUserMenu();
        }
        
        this.currentUser = username;
        
        // Enable restricted features
        document.querySelectorAll('[data-requires-login]').forEach(element => {
            element.classList.remove('disabled');
        });
    }

    showUserMenu() {
        // Create and show user menu
        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.innerHTML = `
            <div class="user-menu-content">
                <a href="#" onclick="healthPortal.showProfile()">My Profile</a>
                <a href="#" onclick="healthPortal.showAppointments()">My Appointments</a>
                <a href="#" onclick="healthPortal.showPrescriptions()">My Prescriptions</a>
                <a href="#" onclick="healthPortal.logout()">Logout</a>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Position menu
        const loginBtn = document.querySelector('.login-btn');
        const rect = loginBtn.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.right = '20px';
        
        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeUserMenu(e) {
                if (!menu.contains(e.target) && e.target !== loginBtn) {
                    menu.remove();
                    document.removeEventListener('click', closeUserMenu);
                }
            });
        }, 100);
    }

    logout() {
        this.currentUser = null;
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Patient Login';
            loginBtn.onclick = () => this.openModal('loginModal');
        }
        
        this.showNotification('Logged out successfully', 'info');
        
        // Remove user menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) userMenu.remove();
    }

    showProfile() {
        this.showNotification('Profile management coming soon!', 'info');
    }

    showAppointments() {
        if (this.appointments.length === 0) {
            this.showNotification('No appointments found', 'info');
        } else {
            this.showNotification(`You have ${this.appointments.length} appointment(s)`, 'success');
        }
    }

    showPrescriptions() {
        if (this.prescriptions.length === 0) {
            this.showNotification('No prescription refills found', 'info');
        } else {
            this.showNotification(`You have ${this.prescriptions.length} prescription request(s)`, 'success');
        }
    }

    // Analytics and Tracking
    trackEvent(eventName, properties = {}) {
        console.log('Event tracked:', eventName, properties);
        // In production, this would send data to analytics service
    }

    // Date Input Initialization
    initializeDateInputs() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.min = tomorrow.toISOString().split('T')[0];
            
            // Set max date to 6 months from now
            const maxDate = new Date(today);
            maxDate.setMonth(maxDate.getMonth() + 6);
            input.max = maxDate.toISOString().split('T')[0];
        });
    }

    // Health Tips Feature
    showHealthTip() {
        const tips = [
            "Remember to drink at least 8 glasses of water daily!",
            "Take breaks every hour if you work at a computer.",
            "Get at least 7-9 hours of sleep each night.",
            "Include fruits and vegetables in every meal.",
            "Exercise for at least 30 minutes daily.",
            "Practice deep breathing for stress relief.",
            "Schedule regular check-ups with your doctor.",
            "Limit screen time before bedtime for better sleep."
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.showNotification(`💡 Health Tip: ${randomTip}`, 'info', 8000);
    }

    // Emergency Contact Feature
    showEmergencyContacts() {
        const emergencyInfo = `
            <div class="emergency-contacts">
                <h3>🚨 Emergency Contacts</h3>
                <p><strong>Emergency Services:</strong> 911</p>
                <p><strong>Hospital Emergency Room:</strong> (555) 123-EMRG</p>
                <p><strong>Poison Control:</strong> 1-800-222-1222</p>
                <p><strong>Mental Health Crisis:</strong> 988</p>
                <p><strong>Non-Emergency Nurse Line:</strong> (555) 123-NURSE</p>
            </div>
        `;
        
        this.showNotification(emergencyInfo, 'warning', 10000);
    }
}

// Initialize the health portal when DOM is loaded
let healthPortal;

document.addEventListener('DOMContentLoaded', function() {
    healthPortal = new HealthPortal();
    
    // Show welcome message after a delay
    setTimeout(() => {
        healthPortal.showNotification('Welcome to HealthCare+ Portal! 🏥', 'success');
    }, 2000);
    
    // Show health tip after 10 seconds
    setTimeout(() => {
        healthPortal.showHealthTip();
    }, 10000);
});

// Global functions for onclick handlers
function openModal(modalId) {
    if (healthPortal) {
        healthPortal.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (healthPortal) {
        healthPortal.closeModal(modalId);
    }
}

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealthPortal;
}

// Add CSS for notifications and new features
const additionalStyles = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
    }

    .notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        margin-bottom: 10px;
        padding: 15px;
        transform: translateX(100%);
        transition: all 0.3s ease;
        border-left: 4px solid #2196F3;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left-color: #4CAF50;
    }

    .notification-error {
        border-left-color: #f44336;
    }

    .notification-warning {
        border-left-color: #ff9800;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #999;
        padding: 0;
        margin-left: 10px;
    }

    .notification-close:hover {
        color: #333;
    }

    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    }

    .search-result-item {
        padding: 15px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .search-result-item:hover {
        background-color: #f5f5f5;
    }

    .search-result-item:last-child {
        border-bottom: none;
    }

    .search-result-item h4 {
        margin: 0 0 5px 0;
        color: #333;
    }

    .search-result-item p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }

    .no-results {
        padding: 15px;
        text-align: center;
        color: #666;
    }

    .user-menu {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 2000;
        min-width: 200px;
    }

    .user-menu-content {
        padding: 10px 0;
    }

    .user-menu-content a {
        display: block;
        padding: 10px 20px;
        color: #333;
        text-decoration: none;
        transition: background-color 0.2s ease;
    }

    .user-menu-content a:hover {
        background-color: #f5f5f5;
    }

    .field-error {
        color: #f44336;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: block;
    }

    input.error,
    select.error,
    textarea.error {
        border-color: #f44336 !important;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
    }

    .modal-opening .modal-content {
        animation: modalSlideIn 0.3s ease;
    }

    .modal-closing .modal-content {
        animation: modalSlideOut 0.2s ease;
    }

    @keyframes modalSlideIn {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes modalSlideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-30px);
            opacity: 0;
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
    }

    .emergency-contacts {
        text-align: left;
    }

    .emergency-contacts h3 {
        color: #f44336;
        margin-bottom: 15px;
        text-align: center;
    }

    .emergency-contacts p {
        margin: 8px 0;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }

    .emergency-contacts p:last-child {
        border-bottom: none;
    }

    .emergency-contacts strong {
        color: #333;
        display: inline-block;
        width: 160px;
    }

    /* Loading states */
    .btn-loading {
        position: relative;
        color: transparent !important;
    }

    .btn-loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .notification-container {
            left: 10px;
            right: 10px;
            max-width: none;
        }
        
        .notification {
            font-size: 14px;
        }
        
        .user-menu {
            left: 10px;
            right: 10px;
            max-width: none;
        }
    }

    /* Accessibility improvements */
    .modal:focus-within .modal-content {
        outline: 2px solid #4CAF50;
        outline-offset: 2px;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .notification {
            border: 2px solid currentColor;
        }
        
        .search-results {
            border: 2px solid currentColor;
        }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .notification,
        .modal-content,
        .action-card {
            transition: none;
            animation: none;
        }
    }
`;

// Additional utility functions and features
const HealthPortalExtensions = {
    
    // Appointment Management
    getUpcomingAppointments() {
        const today = new Date();
        return healthPortal.appointments.filter(apt => {
            const aptDate = new Date(apt.preferredDate);
            return aptDate >= today && apt.status !== 'cancelled';
        }).sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));
    },

    // Health Records Management
    generateHealthSummary() {
        const summary = {
            totalAppointments: healthPortal.appointments.length,
            pendingAppointments: healthPortal.appointments.filter(apt => apt.status === 'pending').length,
            activePrescriptions: healthPortal.prescriptions.filter(rx => rx.status === 'active').length,
            lastLoginDate: new Date().toISOString(),
            accountCreated: '2024-01-01' // Mock date
        };
        
        return summary;
    },

    // Insurance and Billing
    calculateEstimatedCost(serviceType, hasInsurance = true) {
        const baseCosts = {
            'consultation': 150,
            'cardiology': 300,
            'dermatology': 200,
            'endocrinology': 250,
            'gastroenterology': 275,
            'neurology': 350,
            'orthopedics': 225,
            'pediatrics': 125,
            'psychiatry': 200,
            'radiology': 180,
            'surgery': 1500
        };
        
        const baseCost = baseCosts[serviceType] || 150;
        const insuranceDiscount = hasInsurance ? 0.7 : 1; // 30% discount with insurance
        
        return Math.round(baseCost * insuranceDiscount);
    },

    // Health Education Resources
    getHealthResources(category = 'general') {
        const resources = {
            general: [
                { title: 'Healthy Eating Guidelines', url: '#', type: 'article' },
                { title: 'Exercise for Beginners', url: '#', type: 'video' },
                { title: 'Stress Management Techniques', url: '#', type: 'guide' }
            ],
            cardiology: [
                { title: 'Heart-Healthy Diet', url: '#', type: 'article' },
                { title: 'Understanding Blood Pressure', url: '#', type: 'guide' },
                { title: 'Cardiac Rehabilitation', url: '#', type: 'program' }
            ],
            diabetes: [
                { title: 'Blood Sugar Monitoring', url: '#', type: 'guide' },
                { title: 'Diabetic Meal Planning', url: '#', type: 'tool' },
                { title: 'Exercise with Diabetes', url: '#', type: 'article' }
            ]
        };
        
        return resources[category] || resources.general;
    },

    // Prescription Management
    checkDrugInteractions(medications) {
        // Mock drug interaction checker
        const knownInteractions = {
            'warfarin': ['aspirin', 'ibuprofen'],
            'metformin': ['alcohol'],
            'lisinopril': ['potassium']
        };
        
        const interactions = [];
        medications.forEach(med1 => {
            medications.forEach(med2 => {
                if (med1 !== med2 && knownInteractions[med1.toLowerCase()]) {
                    if (knownInteractions[med1.toLowerCase()].includes(med2.toLowerCase())) {
                        interactions.push(`${med1} may interact with ${med2}`);
                    }
                }
            });
        });
        
        return interactions;
    },

    // Symptom Checker
    symptomChecker(symptoms) {
        // Basic symptom assessment (for educational purposes only)
        const symptomDatabase = {
            'fever': { urgency: 'medium', recommendations: ['Rest', 'Hydration', 'Monitor temperature'] },
            'chest pain': { urgency: 'high', recommendations: ['Seek immediate medical attention'] },
            'headache': { urgency: 'low', recommendations: ['Rest', 'Hydration', 'Over-the-counter pain relief'] },
            'shortness of breath': { urgency: 'high', recommendations: ['Seek immediate medical attention'] },
            'nausea': { urgency: 'low', recommendations: ['Rest', 'Small frequent meals', 'Stay hydrated'] }
        };
        
        const assessment = symptoms.map(symptom => {
            const info = symptomDatabase[symptom.toLowerCase()];
            return info ? { symptom, ...info } : { symptom, urgency: 'unknown', recommendations: ['Consult healthcare provider'] };
        });
        
        const highUrgency = assessment.some(a => a.urgency === 'high');
        
        return {
            assessments: assessment,
            overallUrgency: highUrgency ? 'high' : 'medium',
            disclaimer: 'This is not a substitute for professional medical advice. Consult your healthcare provider for proper diagnosis and treatment.'
        };
    },

    // Telemedicine Features
    checkTelemedEligibility(appointmentType, patientHistory = {}) {
        const telemedicineEligible = [
            'consultation', 'follow-up', 'prescription review', 
            'mental health', 'dermatology consultation'
        ];
        
        const requiresInPerson = [
            'physical examination', 'surgery consultation', 
            'emergency', 'diagnostic imaging'
        ];
        
        if (requiresInPerson.includes(appointmentType.toLowerCase())) {
            return { eligible: false, reason: 'Requires in-person examination' };
        }
        
        if (telemedicineEligible.includes(appointmentType.toLowerCase())) {
            return { eligible: true, platforms: ['Video Call', 'Phone Call', 'Chat'] };
        }
        
        return { eligible: false, reason: 'Appointment type not suitable for telemedicine' };
    },

    // Health Metrics Tracking
    calculateBMI(weight, height, unit = 'metric') {
        let weightKg, heightM;
        
        if (unit === 'imperial') {
            weightKg = weight * 0.453592;
            heightM = height * 0.0254;
        } else {
            weightKg = weight;
            heightM = height / 100;
        }
        
        const bmi = weightKg / (heightM * heightM);
        
        let category;
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
        
        return {
            value: Math.round(bmi * 10) / 10,
            category,
            healthyRange: '18.5 - 24.9'
        };
    },

    // Appointment Reminders
    scheduleReminder(appointment) {
        const aptDate = new Date(appointment.preferredDate);
        const reminderTimes = [
            { days: 7, message: 'Your appointment is in 1 week' },
            { days: 1, message: 'Your appointment is tomorrow' },
            { hours: 2, message: 'Your appointment is in 2 hours' }
        ];
        
        reminderTimes.forEach(reminder => {
            const reminderDate = new Date(aptDate);
            if (reminder.days) {
                reminderDate.setDate(reminderDate.getDate() - reminder.days);
            } else if (reminder.hours) {
                reminderDate.setHours(reminderDate.getHours() - reminder.hours);
            }
            
            // In a real application, this would schedule actual notifications
            console.log(`Reminder scheduled for ${reminderDate}: ${reminder.message}`);
        });
    },

    // Emergency Protocols
    getEmergencyProtocol(emergency) {
        const protocols = {
            'chest pain': {
                immediate: ['Call 911', 'Chew aspirin if not allergic', 'Sit down and rest'],
                avoid: ['Exercise', 'Driving', 'Ignoring symptoms'],
                info: 'Chest pain could indicate a heart attack. Seek immediate medical attention.'
            },
            'severe bleeding': {
                immediate: ['Apply direct pressure', 'Elevate if possible', 'Call 911'],
                avoid: ['Removing embedded objects', 'Using tourniquets unless trained'],
                info: 'Control bleeding while waiting for emergency services.'
            },
            'difficulty breathing': {
                immediate: ['Call 911', 'Sit upright', 'Use rescue inhaler if prescribed'],
                avoid: ['Lying flat', 'Panic', 'Delaying medical care'],
                info: 'Difficulty breathing requires immediate medical evaluation.'
            },
            'allergic reaction': {
                immediate: ['Use EpiPen if available', 'Call 911', 'Remove allergen if known'],
                avoid: ['Waiting to see if it gets better', 'Driving yourself'],
                info: 'Severe allergic reactions can be life-threatening.'
            }
        };
        
        return protocols[emergency.toLowerCase()] || {
            immediate: ['Call 911 for any life-threatening emergency'],
            avoid: ['Delaying professional medical care'],
            info: 'When in doubt, seek immediate medical attention.'
        };
    }
};

// Extend the main HealthPortal class with additional methods
Object.assign(healthPortal?.constructor?.prototype || {}, HealthPortalExtensions);

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator && 'caches' in window) {
    const registerServiceWorker = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/health-portal-sw.js');
            console.log('Service Worker registered successfully:', registration);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    };
    
    window.addEventListener('load', registerServiceWorker);
}

console.log('HealthCare+ Portal JavaScript loaded successfully! 🏥✨');