 

/**
 * HealthSecure Portal - Main JavaScript File
 * Handles authentication, role management, form validation, and UI interactions
 */

class HealthSecurePortal {
    constructor() {
        this.currentRole = 'patient';
        this.isLoggedIn = false;
        this.users = this.loadUsers();
        this.loginAttempts = {};
        this.maxAttempts = 3;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.setupFormValidation();
        this.loadStoredData();
        console.log('HealthSecure Portal initialized');
    }

    /**
     * Load default users (in production, this would come from a secure backend)
     */
    loadUsers() {
        return {
            patient: [
                { username: 'patient1', email: 'patient@example.com', password: 'Patient123!', name: 'John Doe' },
                { username: 'testpatient', email: 'test.patient@healthsecure.com', password: 'SecurePass1!', name: 'Jane Smith' }
            ],
            doctor: [
                { username: 'dr.smith', email: 'doctor@example.com', password: 'Doctor123!', name: 'Dr. Smith' },
                { username: 'dr.johnson', email: 'dr.johnson@healthsecure.com', password: 'MedSecure1!', name: 'Dr. Johnson' }
            ],
            admin: [
                { username: 'admin', email: 'admin@example.com', password: 'Admin123!', name: 'System Admin' },
                { username: 'sysadmin', email: 'admin@healthsecure.com', password: 'AdminSecure1!', name: 'System Administrator' }
            ]
        };
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Role selection buttons
        const roleButtons = document.querySelectorAll('.role-button');
        roleButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleRoleSelection(e));
        });

        // Login form submission
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Input field events
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleLogin(e);
                }
            });
        });

        // Forgot password link
        const forgotPasswordLink = document.querySelector('.forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        }

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    /**
     * Handle role selection
     */
    handleRoleSelection(event) {
        event.preventDefault();
        
        // Remove active class from all buttons
        document.querySelectorAll('.role-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        event.currentTarget.classList.add('active');

        // Determine selected role
        const icon = event.currentTarget.querySelector('i');
        if (icon.classList.contains('fa-user-injured')) {
            this.currentRole = 'patient';
        } else if (icon.classList.contains('fa-user-md')) {
            this.currentRole = 'doctor';
        } else if (icon.classList.contains('fa-user-shield')) {
            this.currentRole = 'admin';
        }

        // Update UI based on role
        this.updateUIForRole();
        
        console.log(`Role selected: ${this.currentRole}`);
    }

    /**
     * Update UI elements based on selected role
     */
    updateUIForRole() {
        const emailInput = document.getElementById('emailUsername');
        const passwordInput = document.getElementById('password');
        
        // Update placeholder text based on role
        const placeholders = {
            patient: 'Enter your email or patient ID',
            doctor: 'Enter your medical license ID or email',
            admin: 'Enter your admin username or email'
        };

        if (emailInput) {
            emailInput.placeholder = placeholders[this.currentRole];
        }

        // Clear any existing values and errors
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        this.clearAllErrors();
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const form = document.querySelector('.login-form');
        if (form) {
            form.setAttribute('novalidate', 'true'); // Disable browser validation
        }
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.id) {
            case 'emailUsername':
                if (!value) {
                    errorMessage = 'Email or username is required';
                    isValid = false;
                } else if (!this.isValidEmailOrUsername(value)) {
                    errorMessage = 'Please enter a valid email or username';
                    isValid = false;
                }
                break;

            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters';
                    isValid = false;
                }
                break;
        }

        this.displayFieldError(field, errorMessage);
        return isValid;
    }

    /**
     * Validate email or username format
     */
    isValidEmailOrUsername(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
        
        return emailRegex.test(value) || usernameRegex.test(value);
    }

    /**
     * Display field-specific error
     */
    displayFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        if (message) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            
            field.parentNode.appendChild(errorDiv);
        }
    }

    /**
     * Clear field-specific error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    /**
     * Clear all form errors
     */
    clearAllErrors() {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
        this.hideNotification();
    }

    /**
     * Handle login form submission
     */
    async handleLogin(event) {
        event.preventDefault();

        const emailUsername = document.getElementById('emailUsername').value.trim();
        const password = document.getElementById('password').value;

        // Clear previous errors
        this.clearAllErrors();

        // Validate form
        const emailValid = this.validateField(document.getElementById('emailUsername'));
        const passwordValid = this.validateField(document.getElementById('password'));

        if (!emailValid || !passwordValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Check for account lockout
        if (this.isAccountLocked(emailUsername)) {
            this.showNotification('Account temporarily locked due to multiple failed attempts. Try again later.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call delay
            await this.delay(1000);

            // Authenticate user
            const authResult = this.authenticateUser(emailUsername, password, this.currentRole);

            if (authResult.success) {
                this.handleSuccessfulLogin(authResult.user);
            } else {
                this.handleFailedLogin(emailUsername, authResult.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('An error occurred during login. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Check if account is locked due to failed attempts
     */
    isAccountLocked(identifier) {
        const attempts = this.loginAttempts[identifier];
        if (!attempts) return false;

        const now = Date.now();
        if (attempts.count >= this.maxAttempts && (now - attempts.lastAttempt) < this.lockoutTime) {
            return true;
        }

        // Reset if lockout time has passed
        if ((now - attempts.lastAttempt) >= this.lockoutTime) {
            delete this.loginAttempts[identifier];
        }

        return false;
    }

    /**
     * Authenticate user credentials
     */
    authenticateUser(identifier, password, role) {
        const roleUsers = this.users[role];
        const user = roleUsers.find(u => 
            u.username === identifier || u.email === identifier
        );

        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Invalid credentials' };
        }

        return { success: true, user: { ...user, role } };
    }

    /**
     * Handle successful login
     */
    handleSuccessfulLogin(user) {
        this.isLoggedIn = true;
        
        // Reset failed attempts
        delete this.loginAttempts[user.username];
        delete this.loginAttempts[user.email];

        // Store session data (in production, use secure tokens)
        this.storeSession(user);

        // Show success message
        this.showNotification(`Welcome back, ${user.name}!`, 'success');

        // Redirect based on role
        setTimeout(() => {
            this.redirectToDashboard(user.role);
        }, 1500);

        console.log('Login successful:', user);
    }

    /**
     * Handle failed login
     */
    handleFailedLogin(identifier, message) {
        // Track failed attempts
        if (!this.loginAttempts[identifier]) {
            this.loginAttempts[identifier] = { count: 0, lastAttempt: 0 };
        }
        
        this.loginAttempts[identifier].count++;
        this.loginAttempts[identifier].lastAttempt = Date.now();

        const remainingAttempts = this.maxAttempts - this.loginAttempts[identifier].count;
        
        if (remainingAttempts > 0) {
            this.showNotification(`${message}. ${remainingAttempts} attempts remaining.`, 'error');
        } else {
            this.showNotification('Account locked due to multiple failed attempts. Try again in 15 minutes.', 'error');
        }
    }

    /**
     * Store user session
     */
    storeSession(user) {
        const sessionData = {
            user: {
                username: user.username,
                name: user.name,
                role: user.role
            },
            loginTime: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        // In production, use secure, httpOnly cookies or JWT tokens
        try {
            sessionStorage.setItem('healthsecure_session', JSON.stringify(sessionData));
        } catch (error) {
            console.warn('Could not store session data');
        }
    }

    /**
     * Load stored session data
     */
    loadStoredData() {
        try {
            const storedSession = sessionStorage.getItem('healthsecure_session');
            if (storedSession) {
                const sessionData = JSON.parse(storedSession);
                if (sessionData.expiresAt > Date.now()) {
                    // Session is still valid
                    console.log('Valid session found for:', sessionData.user.name);
                } else {
                    // Session expired
                    sessionStorage.removeItem('healthsecure_session');
                }
            }
        } catch (error) {
            console.warn('Could not load stored session data');
        }
    }

    /**
     * Set loading state for the login button
     */
    setLoadingState(loading) {
        const loginButton = document.querySelector('.login-button');
        if (!loginButton) return;

        if (loading) {
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        } else {
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Remove existing notification
        this.hideNotification();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="healthSecurePortal.hideNotification()">&times;</button>
            </div>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            maxWidth: '400px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            animation: 'slideInRight 0.3s ease-out'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Auto-hide after 5 seconds
        setTimeout(() => this.hideNotification(), 5000);
    }

    /**
     * Hide notification
     */
    hideNotification() {
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
    }

    /**
     * Handle forgot password
     */
    handleForgotPassword(event) {
        event.preventDefault();
        
        const email = prompt('Please enter your email address:');
        if (email && this.isValidEmailOrUsername(email)) {
            this.showNotification('Password reset instructions sent to your email.', 'info');
            console.log('Password reset requested for:', email);
        } else if (email) {
            this.showNotification('Please enter a valid email address.', 'error');
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(event) {
        // Tab navigation for role buttons
        if (event.key === 'Enter' && event.target.classList.contains('role-button')) {
            event.target.click();
        }

        // Escape key to close notifications
        if (event.key === 'Escape') {
            this.hideNotification();
        }
    }

    /**
     * Redirect to appropriate dashboard
     */
    redirectToDashboard(role) {
        if (role === "doctor") {
            window.location.href = "doctorhomepage.html";
        } else {
            window.location.href = "homepage.html";
        }
    }

    /**
     * Show dashboard demo (for demonstration purposes)
     */
    showDashboardDemo(role) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
        `;

        modal.innerHTML = `
            <h2 style="margin-bottom: 1rem; color: #1f2937;">Login Successful!</h2>
            <p style="margin-bottom: 1.5rem; color: #6b7280;">
                You would now be redirected to the ${role} dashboard.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: #4f46e5; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; cursor: pointer;">
                Close Demo
            </button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    /**
     * Utility function to create delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Logout function (for future use)
     */
    logout() {
        this.isLoggedIn = false;
        try {
            sessionStorage.removeItem('healthsecure_session');
        } catch (error) {
            console.warn('Could not clear session data');
        }
        
        // Reset form
        document.getElementById('emailUsername').value = '';
        document.getElementById('password').value = '';
        this.clearAllErrors();
        
        this.showNotification('You have been logged out successfully.', 'info');
    }

    /**
     * Get current session (for future use)
     */
    getCurrentSession() {
        try {
            const storedSession = sessionStorage.getItem('healthsecure_session');
            if (storedSession) {
                const sessionData = JSON.parse(storedSession);
                if (sessionData.expiresAt > Date.now()) {
                    return sessionData;
                }
            }
        } catch (error) {
            console.warn('Could not retrieve session data');
        }
        return null;
    }
}

// CSS for notifications and error states
const additionalStyles = `
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

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
        }
    `;

// Instantiate the HealthSecurePortal class so logic executes on page load
const healthSecurePortal = new HealthSecurePortal();




/*	Patient:
	•	Username: patient1 or Email: patient@example.com
	•	Password: Patient123!
	•	Doctor:
	•	Username: dr.smith or Email: doctor@example.com
	•	Password: Doctor123!
	•	Admin:
	•	Username: admin or Email: admin@example.com
	•	Password: Admin123! */