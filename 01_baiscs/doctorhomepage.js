// Doctor Homepage JavaScript File
// Healthcare Portal - Comprehensive Medical Dashboard

class DoctorDashboard {
    constructor() {
        this.doctorData = {
            name: "Dr. Emily Smith",
            specialty: "Cardiologist",
            id: "DOC-2024-001",
            initials: "ES"
        };
        
        this.patients = [
            { id: 1, name: "John Doe", condition: "Chest Pain - Priority", time: "9:30 AM", priority: "urgent" },
            { id: 2, name: "Mary Johnson", condition: "Follow-up", time: "10:15 AM", priority: "normal" },
            { id: 3, name: "Robert Wilson", condition: "Routine Checkup", time: "11:00 AM", priority: "normal" },
            { id: 4, name: "Sarah Davis", condition: "Hypertension", time: "11:45 AM", priority: "normal" },
            { id: 5, name: "Michael Brown", condition: "Diabetes Check", time: "2:30 PM", priority: "normal" }
        ];
        
        this.appointments = [
            { patient: "Sarah Davis", time: "In 15 minutes", type: "telemedicine" },
            { patient: "Michael Brown", time: "In 45 minutes", type: "in-person" },
            { patient: "Lisa Anderson", time: "In 1.5 hours", type: "telemedicine" }
        ];
        
        this.messages = [
            { type: "critical", sender: "Lab", content: "Critical values for John Doe", time: "5 min ago" },
            { type: "info", sender: "Nurse", content: "Patient prep completed for 10:15 AM", time: "10 min ago" },
            { type: "admin", sender: "Admin", content: "New insurance authorization", time: "1 hour ago" }
        ];
        
        this.init();
    }
    
    init() {
        this.updateGreeting();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.animateCards();
        this.setupCalendar();
        this.initializeCalculator();
    }
    
    updateGreeting() {
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) greeting = "Good Morning";
        else if (hour < 18) greeting = "Good Afternoon";
        else greeting = "Good Evening";
        
        const welcomeElement = document.querySelector('.welcome-section h1');
        if (welcomeElement) {
            welcomeElement.textContent = `${greeting}, ${this.doctorData.name}`;
        }
    }
    
    setupEventListeners() {
        // Header buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="newConsultation"]')) {
                e.preventDefault();
                this.newConsultation();
            }
            if (e.target.matches('[onclick*="emergencyAlert"]')) {
                e.preventDefault();
                this.emergencyAlert();
            }
            if (e.target.matches('[onclick*="logout"]')) {
                e.preventDefault();
                this.logout();
            }
        });
        
        // Calendar interactions
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => this.viewDaySchedule(day.textContent));
        });
        
        // Patient interactions
        document.querySelectorAll('.patient-item').forEach((item, index) => {
            item.addEventListener('click', () => this.viewPatientDetails(this.patients[index]));
        });
    }
    
    newConsultation() {
        const modal = this.createModal('New Consultation', `
            <form id="consultationForm" class="consultation-form">
                <div class="form-group">
                    <label>Patient Name:</label>
                    <input type="text" name="patientName" required>
                </div>
                <div class="form-group">
                    <label>Consultation Type:</label>
                    <select name="consultationType" required>
                        <option value="">Select Type</option>
                        <option value="routine">Routine Checkup</option>
                        <option value="followup">Follow-up</option>
                        <option value="emergency">Emergency</option>
                        <option value="specialist">Specialist Consultation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Preferred Time:</label>
                    <input type="datetime-local" name="appointmentTime" required>
                </div>
                <div class="form-group">
                    <label>Notes:</label>
                    <textarea name="notes" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Schedule Consultation</button>
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        `);
        
        modal.querySelector('#consultationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleConsultationSubmit(new FormData(e.target));
            modal.remove();
        });
    }
    
    emergencyAlert() {
        if (confirm('This will send an emergency alert to the medical team. Continue?')) {
            this.showNotification('Emergency alert sent to medical team!', 'success');
            this.simulateEmergencyResponse();
        }
    }
    
    simulateEmergencyResponse() {
        setTimeout(() => {
            this.showNotification('Emergency team responding - ETA 3 minutes', 'info');
        }, 2000);
        
        setTimeout(() => {
            this.showNotification('Emergency team arrived', 'success');
        }, 8000);
    }
    
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showNotification('Logging out...', 'info');
            setTimeout(() => {
                window.location.href = 'skdjhg.html';
            }, 2000);
        }
    }
    
    // Medical Calculator Implementation
    initializeCalculator() {
        // BMI Calculator
        window.calculateBMI = (weight, height) => {
            const bmi = weight / ((height / 100) ** 2);
            let category;
            
            if (bmi < 18.5) category = "Underweight";
            else if (bmi < 25) category = "Normal weight";
            else if (bmi < 30) category = "Overweight";
            else category = "Obese";
            
            return { value: bmi.toFixed(1), category };
        };
        
        // Dosage Calculator
        window.calculateDosage = (weight, dosePerKg, frequency = 1) => {
            return (weight * dosePerKg * frequency).toFixed(2);
        };
        
        // GFR Calculator (Cockcroft-Gault)
        window.calculateGFR = (age, weight, creatinine, gender) => {
            const genderFactor = gender.toLowerCase() === 'female' ? 0.85 : 1;
            const gfr = ((140 - age) * weight * genderFactor) / (72 * creatinine);
            return gfr.toFixed(1);
        };
        
        // Body Surface Area Calculator
        window.calculateBSA = (weight, height) => {
            const bsa = Math.sqrt((weight * height) / 3600);
            return bsa.toFixed(2);
        };
    }
    
    medicalCalculator() {
        const modal = this.createModal('Medical Calculator Suite', `
            <div class="calculator-container">
                <div class="calculator-tabs">
                    <button class="tab-btn active" data-tab="bmi">BMI</button>
                    <button class="tab-btn" data-tab="dosage">Dosage</button>
                    <button class="tab-btn" data-tab="gfr">GFR</button>
                    <button class="tab-btn" data-tab="bsa">BSA</button>
                </div>
                
                <!-- BMI Calculator -->
                <div id="bmi-tab" class="tab-content active">
                    <h3>Body Mass Index Calculator</h3>
                    <div class="calc-form">
                        <div class="form-group">
                            <label>Weight (kg):</label>
                            <input type="number" id="bmi-weight" step="0.1" placeholder="70">
                        </div>
                        <div class="form-group">
                            <label>Height (cm):</label>
                            <input type="number" id="bmi-height" step="0.1" placeholder="175">
                        </div>
                        <button onclick="dashboard.calculateBMIResult()" class="btn-primary">Calculate BMI</button>
                        <div id="bmi-result" class="result-display"></div>
                    </div>
                </div>
                
                <!-- Dosage Calculator -->
                <div id="dosage-tab" class="tab-content">
                    <h3>Medication Dosage Calculator</h3>
                    <div class="calc-form">
                        <div class="form-group">
                            <label>Patient Weight (kg):</label>
                            <input type="number" id="dose-weight" step="0.1" placeholder="70">
                        </div>
                        <div class="form-group">
                            <label>Dose per kg (mg/kg):</label>
                            <input type="number" id="dose-per-kg" step="0.1" placeholder="10">
                        </div>
                        <div class="form-group">
                            <label>Frequency (times/day):</label>
                            <input type="number" id="dose-frequency" placeholder="3">
                        </div>
                        <button onclick="dashboard.calculateDosageResult()" class="btn-primary">Calculate Dosage</button>
                        <div id="dosage-result" class="result-display"></div>
                    </div>
                </div>
                
                <!-- GFR Calculator -->
                <div id="gfr-tab" class="tab-content">
                    <h3>Glomerular Filtration Rate (GFR)</h3>
                    <div class="calc-form">
                        <div class="form-group">
                            <label>Age (years):</label>
                            <input type="number" id="gfr-age" placeholder="45">
                        </div>
                        <div class="form-group">
                            <label>Weight (kg):</label>
                            <input type="number" id="gfr-weight" step="0.1" placeholder="70">
                        </div>
                        <div class="form-group">
                            <label>Serum Creatinine (mg/dL):</label>
                            <input type="number" id="gfr-creatinine" step="0.01" placeholder="1.2">
                        </div>
                        <div class="form-group">
                            <label>Gender:</label>
                            <select id="gfr-gender">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <button onclick="dashboard.calculateGFRResult()" class="btn-primary">Calculate GFR</button>
                        <div id="gfr-result" class="result-display"></div>
                    </div>
                </div>
                
                <!-- BSA Calculator -->
                <div id="bsa-tab" class="tab-content">
                    <h3>Body Surface Area Calculator</h3>
                    <div class="calc-form">
                        <div class="form-group">
                            <label>Weight (kg):</label>
                            <input type="number" id="bsa-weight" step="0.1" placeholder="70">
                        </div>
                        <div class="form-group">
                            <label>Height (cm):</label>
                            <input type="number" id="bsa-height" step="0.1" placeholder="175">
                        </div>
                        <button onclick="dashboard.calculateBSAResult()" class="btn-primary">Calculate BSA</button>
                        <div id="bsa-result" class="result-display"></div>
                    </div>
                </div>
            </div>
        `);
        
        this.setupCalculatorTabs(modal);
    }
    
    setupCalculatorTabs(modal) {
        const tabs = modal.querySelectorAll('.tab-btn');
        const contents = modal.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                modal.querySelector(`#${tab.dataset.tab}-tab`).classList.add('active');
            });
        });
    }
    
    calculateBMIResult() {
        const weight = parseFloat(document.getElementById('bmi-weight').value);
        const height = parseFloat(document.getElementById('bmi-height').value);
        
        if (!weight || !height) {
            this.showNotification('Please enter valid weight and height values', 'error');
            return;
        }
        
        const result = window.calculateBMI(weight, height);
        const resultDiv = document.getElementById('bmi-result');
        
        let colorClass = 'normal';
        if (result.value < 18.5 || result.value >= 30) colorClass = 'warning';
        else if (result.value >= 25) colorClass = 'caution';
        
        resultDiv.innerHTML = `
            <div class="result ${colorClass}">
                <h4>BMI: ${result.value} kg/m²</h4>
                <p>Category: ${result.category}</p>
                <div class="bmi-scale">
                    <div class="scale-item ${result.value < 18.5 ? 'active' : ''}">
                        <span>Underweight</span><span>&lt;18.5</span>
                    </div>
                    <div class="scale-item ${result.value >= 18.5 && result.value < 25 ? 'active' : ''}">
                        <span>Normal</span><span>18.5-24.9</span>
                    </div>
                    <div class="scale-item ${result.value >= 25 && result.value < 30 ? 'active' : ''}">
                        <span>Overweight</span><span>25-29.9</span>
                    </div>
                    <div class="scale-item ${result.value >= 30 ? 'active' : ''}">
                        <span>Obese</span><span>≥30</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    calculateDosageResult() {
        const weight = parseFloat(document.getElementById('dose-weight').value);
        const dosePerKg = parseFloat(document.getElementById('dose-per-kg').value);
        const frequency = parseFloat(document.getElementById('dose-frequency').value) || 1;
        
        if (!weight || !dosePerKg) {
            this.showNotification('Please enter valid weight and dose values', 'error');
            return;
        }
        
        const totalDose = window.calculateDosage(weight, dosePerKg, frequency);
        const singleDose = window.calculateDosage(weight, dosePerKg, 1);
        
        document.getElementById('dosage-result').innerHTML = `
            <div class="result normal">
                <h4>Dosage Calculation</h4>
                <p><strong>Single Dose:</strong> ${singleDose} mg</p>
                <p><strong>Total Daily Dose:</strong> ${totalDose} mg</p>
                <p><strong>Frequency:</strong> ${frequency} times per day</p>
                <div class="dosage-note">
                    <small>⚠️ Always verify dosages with drug references and consider patient-specific factors</small>
                </div>
            </div>
        `;
    }
    
    calculateGFRResult() {
        const age = parseFloat(document.getElementById('gfr-age').value);
        const weight = parseFloat(document.getElementById('gfr-weight').value);
        const creatinine = parseFloat(document.getElementById('gfr-creatinine').value);
        const gender = document.getElementById('gfr-gender').value;
        
        if (!age || !weight || !creatinine) {
            this.showNotification('Please enter all required values', 'error');
            return;
        }
        
        const gfr = window.calculateGFR(age, weight, creatinine, gender);
        
        let interpretation = '';
        let colorClass = 'normal';
        
        if (gfr >= 90) {
            interpretation = 'Normal kidney function';
            colorClass = 'normal';
        } else if (gfr >= 60) {
            interpretation = 'Mild decrease in kidney function';
            colorClass = 'caution';
        } else if (gfr >= 30) {
            interpretation = 'Moderate decrease in kidney function';
            colorClass = 'warning';
        } else {
            interpretation = 'Severe decrease in kidney function';
            colorClass = 'critical';
        }
        
        document.getElementById('gfr-result').innerHTML = `
            <div class="result ${colorClass}">
                <h4>GFR: ${gfr} mL/min/1.73m²</h4>
                <p><strong>Interpretation:</strong> ${interpretation}</p>
                <div class="gfr-stages">
                    <small>
                        <strong>Stages:</strong><br>
                        Stage 1: ≥90 (Normal) | Stage 2: 60-89 (Mild) | 
                        Stage 3: 30-59 (Moderate) | Stage 4: 15-29 (Severe) | 
                        Stage 5: &lt;15 (Kidney failure)
                    </small>
                </div>
            </div>
        `;
    }
    
    calculateBSAResult() {
        const weight = parseFloat(document.getElementById('bsa-weight').value);
        const height = parseFloat(document.getElementById('bsa-height').value);
        
        if (!weight || !height) {
            this.showNotification('Please enter valid weight and height values', 'error');
            return;
        }
        
        const bsa = window.calculateBSA(weight, height);
        
        document.getElementById('bsa-result').innerHTML = `
            <div class="result normal">
                <h4>Body Surface Area: ${bsa} m²</h4>
                <p>Used for drug dosing and medical calculations</p>
                <div class="bsa-note">
                    <small>Normal adult BSA range: 1.6 - 2.0 m²</small>
                </div>
            </div>
        `;
    }
    
    // Utility Functions
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles if not already present
        if (!document.getElementById('modal-styles')) {
            this.addModalStyles();
        }
        
        return modal;
    }
    
    addModalStyles() {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 1px solid #eee;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                border-radius: 20px 20px 0 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 30px;
                cursor: pointer;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .modal-body {
                padding: 30px;
            }
            
            .consultation-form, .calc-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .form-group label {
                font-weight: 600;
                color: #2c3e50;
            }
            
            .form-group input, .form-group select, .form-group textarea {
                padding: 12px;
                border: 2px solid #e9ecef;
                border-radius: 10px;
                font-size: 16px;
                transition: border-color 0.3s ease;
            }
            
            .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .form-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }
            
            .btn-primary, .btn-secondary {
                padding: 12px 24px;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-primary {
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .btn-secondary {
                background: #e9ecef;
                color: #495057;
            }
            
            .btn-secondary:hover {
                background: #dee2e6;
            }
            
            .calculator-container {
                min-width: 600px;
            }
            
            .calculator-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }
            
            .tab-btn {
                padding: 12px 24px;
                border: none;
                background: none;
                cursor: pointer;
                font-weight: 600;
                color: #7f8c8d;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
            }
            
            .tab-btn.active, .tab-btn:hover {
                color: #667eea;
                border-bottom-color: #667eea;
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .result-display {
                margin-top: 20px;
            }
            
            .result {
                padding: 20px;
                border-radius: 15px;
                border-left: 5px solid;
            }
            
            .result.normal {
                background: #d4edda;
                border-left-color: #28a745;
                color: #155724;
            }
            
            .result.caution {
                background: #fff3cd;
                border-left-color: #ffc107;
                color: #856404;
            }
            
            .result.warning {
                background: #f8d7da;
                border-left-color: #dc3545;
                color: #721c24;
            }
            
            .result.critical {
                background: #f5c6cb;
                border-left-color: #dc3545;
                color: #721c24;
                font-weight: 600;
            }
            
            .bmi-scale, .gfr-stages, .dosage-note, .bsa-note {
                margin-top: 15px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
            }
            
            .scale-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .scale-item:last-child {
                border-bottom: none;
            }
            
            .scale-item.active {
                font-weight: 600;
                color: #667eea;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add notification styles if not already present
        if (!document.getElementById('notification-styles')) {
            this.addNotificationStyles();
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    addNotificationStyles() {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .notification-success {
                background: linear-gradient(45deg, #4ECDC4, #44A08D);
            }
            
            .notification-error {
                background: linear-gradient(45deg, #FF6B6B, #FF8E8E);
            }
            
            .notification-info {
                background: linear-gradient(45deg, #667eea, #764ba2);
            }
            
            .notification-warning {
                background: linear-gradient(45deg, #FFC371, #FF5F6D);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    startRealTimeUpdates() {
        // Update time every minute
        setInterval(() => {
            this.updateTime();
            this.updateGreeting();
        }, 60000);
        
        // Simulate real-time data updates
        setInterval(() => {
            this.simulateDataUpdates();
        }, 30000);
        
        // Animate urgent items
        setTimeout(() => {
            this.animateUrgentItems();
        }, 3000);
    }
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.title = `Doctor Dashboard - ${timeString}`;
    }
    
    simulateDataUpdates() {
        // Update notification badges
        const badges = document.querySelectorAll('.notification-badge');
        badges.forEach(badge => {
            if (Math.random() > 0.7) {
                const currentValue = parseInt(badge.textContent) || 0;
                badge.textContent = currentValue + 1;
                badge.style.animation = 'pulse 0.5s ease-in-out';
            }
        });
        
        // Update statistics
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            if (Math.random() > 0.8) {
                const currentValue = parseInt(stat.textContent) || 0;
                const change = Math.random() > 0.5 ? 1 : -1;
                stat.textContent = Math.max(0, currentValue + change);
                stat.style.color = change > 0 ? '#4ECDC4' : '#FF6B6B';
                setTimeout(() => {
                    stat.style.color = '#667eea';
                }, 2000);
            }
        });
    }
    
    animateUrgentItems() {
        const urgentItems = document.querySelectorAll('.patient-item.urgent');
        urgentItems.forEach(item => {
            item.style.animation = 'pulse 2s ease-in-out infinite';
        });
    }
    
    animateCards() {
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    setupCalendar() {
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                this.viewDaySchedule(day.textContent);
            });
            
            // Add hover effect
            day.addEventListener('mouseenter', () => {
                if (!day.classList.contains('today')) {
                    day.style.background = '#f8f9fa';
                    day.style.transform = 'scale(1.1)';
                }
            });
            
            day.addEventListener('mouseleave', () => {
                if (!day.classList.contains('today')) {
                    day.style.background = '';
                    day.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    viewDaySchedule(day) {
        const appointments = this.generateDayAppointments(day);
        const modal = this.createModal(`Schedule for September ${day}, 2025`, `
            <div class="schedule-view">
                <div class="schedule-header">
                    <h3>Appointments for September ${day}</h3>
                    <button class="btn-primary" onclick="dashboard.addNewAppointment('${day}')">
                        + Add Appointment
                    </button>
                </div>
                <div class="appointments-list">
                    ${appointments.map(apt => `
                        <div class="appointment-card ${apt.type}">
                            <div class="appointment-time">${apt.time}</div>
                            <div class="appointment-details">
                                <div class="patient-name">${apt.patient}</div>
                                <div class="appointment-type">${apt.condition}</div>
                                <div class="appointment-notes">${apt.notes || 'No notes'}</div>
                            </div>
                            <div class="appointment-actions">
                                <button onclick="dashboard.viewPatientRecord('${apt.patient}')" class="btn-small">View Record</button>
                                <button onclick="dashboard.rescheduleAppointment('${apt.id}')" class="btn-small">Reschedule</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }
    
    generateDayAppointments(day) {
        const appointments = [
            { id: 1, time: "9:00 AM", patient: "John Smith", condition: "Routine Checkup", type: "normal", notes: "Annual physical exam" },
            { id: 2, time: "10:30 AM", patient: "Mary Johnson", condition: "Follow-up", type: "followup", notes: "Blood pressure monitoring" },
            { id: 3, time: "2:00 PM", patient: "Robert Brown", condition: "Consultation", type: "consultation", notes: "Chest pain evaluation" },
            { id: 4, time: "3:30 PM", patient: "Sarah Davis", condition: "Telemedicine", type: "telemedicine", notes: "Diabetes management" }
        ];
        
        // Return subset based on day
        return appointments.slice(0, Math.floor(Math.random() * 4) + 1);
    }
    
    viewPatientDetails(patient) {
        const modal = this.createModal(`Patient: ${patient.name}`, `
            <div class="patient-details">
                <div class="patient-header">
                    <div class="patient-avatar">${patient.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="patient-info">
                        <h3>${patient.name}</h3>
                        <p>Next Appointment: ${patient.time}</p>
                        <p>Condition: ${patient.condition}</p>
                        <p>Priority: <span class="priority-${patient.priority}">${patient.priority.toUpperCase()}</span></p>
                    </div>
                </div>
                
                <div class="patient-tabs">
                    <button class="tab-btn active" data-tab="overview">Overview</button>
                    <button class="tab-btn" data-tab="history">History</button>
                    <button class="tab-btn" data-tab="vitals">Vitals</button>
                    <button class="tab-btn" data-tab="prescriptions">Prescriptions</button>
                </div>
                
                <div id="overview-tab" class="tab-content active">
                    <h4>Patient Overview</h4>
                    <div class="info-grid">
                        <div><strong>Age:</strong> 45 years</div>
                        <div><strong>Gender:</strong> Male</div>
                        <div><strong>Blood Type:</strong> O+</div>
                        <div><strong>Insurance:</strong> Blue Cross</div>
                        <div><strong>Emergency Contact:</strong> Jane Doe (Wife)</div>
                        <div><strong>Phone:</strong> (555) 123-4567</div>
                    </div>
                    <div class="recent-notes">
                        <h5>Recent Notes</h5>
                        <p>Patient reports chest discomfort during physical activity. Scheduled for stress test.</p>
                    </div>
                </div>
                
                <div id="history-tab" class="tab-content">
                    <h4>Medical History</h4>
                    <div class="history-timeline">
                        <div class="history-item">
                            <div class="date">Sep 15, 2025</div>
                            <div class="event">Chest X-Ray - Normal</div>
                        </div>
                        <div class="history-item">
                            <div class="date">Aug 22, 2025</div>
                            <div class="event">Blood Work - Cholesterol slightly elevated</div>
                        </div>
                        <div class="history-item">
                            <div class="date">Jun 10, 2025</div>
                            <div class="event">Annual Physical - Overall good health</div>
                        </div>
                    </div>
                </div>
                
                <div id="vitals-tab" class="tab-content">
                    <h4>Latest Vital Signs</h4>
                    <div class="vitals-grid">
                        <div class="vital-card">
                            <div class="vital-value">120/80</div>
                            <div class="vital-label">Blood Pressure</div>
                            <div class="vital-status normal">Normal</div>
                        </div>
                        <div class="vital-card">
                            <div class="vital-value">72</div>
                            <div class="vital-label">Heart Rate</div>
                            <div class="vital-status normal">Normal</div>
                        </div>
                        <div class="vital-card">
                            <div class="vital-value">98.6°F</div>
                            <div class="vital-label">Temperature</div>
                            <div class="vital-status normal">Normal</div>
                        </div>
                        <div class="vital-card">
                            <div class="vital-value">98%</div>
                            <div class="vital-label">O2 Saturation</div>
                            <div class="vital-status normal">Normal</div>
                        </div>
                    </div>
                </div>
                
                <div id="prescriptions-tab" class="tab-content">
                    <h4>Current Prescriptions</h4>
                    <div class="prescriptions-list">
                        <div class="prescription-item">
                            <div class="medication">Lisinopril 10mg</div>
                            <div class="dosage">Once daily</div>
                            <div class="refills">2 refills remaining</div>
                        </div>
                        <div class="prescription-item">
                            <div class="medication">Atorvastatin 20mg</div>
                            <div class="dosage">Once daily at bedtime</div>
                            <div class="refills">3 refills remaining</div>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="dashboard.prescriptionTool()">Add New Prescription</button>
                </div>
                
                <div class="patient-actions">
                    <button class="btn-primary" onclick="dashboard.startConsultation('${patient.name}')">Start Consultation</button>
                    <button class="btn-secondary" onclick="dashboard.sendMessage('${patient.name}')">Send Message</button>
                    <button class="btn-secondary" onclick="dashboard.scheduleFollowup('${patient.name}')">Schedule Follow-up</button>
                </div>
            </div>
        `);
        
        this.setupPatientTabs(modal);
    }
    
    setupPatientTabs(modal) {
        const tabs = modal.querySelectorAll('.tab-btn');
        const contents = modal.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                modal.querySelector(`#${tab.dataset.tab}-tab`).classList.add('active');
            });
        });
    }
    
    // Additional functionality methods
    prescriptionTool() {
        const modal = this.createModal('e-Prescription System', `
            <div class="prescription-form">
                <div class="form-group">
                    <label>Patient Name:</label>
                    <input type="text" id="rx-patient" placeholder="Search patient...">
                </div>
                <div class="form-group">
                    <label>Medication:</label>
                    <input type="text" id="rx-medication" placeholder="Search medication...">
                </div>
                <div class="form-group">
                    <label>Strength:</label>
                    <input type="text" id="rx-strength" placeholder="e.g., 10mg, 500mg">
                </div>
                <div class="form-group">
                    <label>Quantity:</label>
                    <input type="number" id="rx-quantity" placeholder="30">
                </div>
                <div class="form-group">
                    <label>Directions:</label>
                    <textarea id="rx-directions" rows="3" placeholder="Take one tablet by mouth daily..."></textarea>
                </div>
                <div class="form-group">
                    <label>Refills:</label>
                    <select id="rx-refills">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div class="drug-interaction-check">
                    <button type="button" class="btn-secondary" onclick="dashboard.checkDrugInteractions()">
                        Check Drug Interactions
                    </button>
                </div>
                <div class="form-actions">
                    <button class="btn-primary" onclick="dashboard.sendPrescription()">Send to Pharmacy</button>
                    <button class="btn-secondary" onclick="dashboard.savePrescriptionDraft()">Save as Draft</button>
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `);
    }
    
    checkDrugInteractions() {
        const medication = document.getElementById('rx-medication').value;
        if (!medication) {
            this.showNotification('Please enter a medication first', 'warning');
            return;
        }
        
        // Simulate drug interaction check
        setTimeout(() => {
            this.showNotification(`Checking interactions for ${medication}...`, 'info');
            setTimeout(() => {
                this.showNotification('No major interactions found', 'success');
            }, 2000);
        }, 500);
    }
    
    sendPrescription() {
        const patient = document.getElementById('rx-patient').value;
        const medication = document.getElementById('rx-medication').value;
        
        if (!patient || !medication) {
            this.showNotification('Please fill in patient and medication fields', 'error');
            return;
        }
        
        this.showNotification('Prescription sent to pharmacy successfully!', 'success');
        setTimeout(() => {
            document.querySelector('.modal').remove();
        }, 2000);
    }
    
    labOrders() {
        const modal = this.createModal('Laboratory Orders', `
            <div class="lab-orders-form">
                <div class="form-group">
                    <label>Patient Name:</label>
                    <input type="text" id="lab-patient" placeholder="Search patient...">
                </div>
                <div class="form-group">
                    <label>Test Category:</label>
                    <select id="lab-category">
                        <option value="">Select Category</option>
                        <option value="blood">Blood Work</option>
                        <option value="urine">Urinalysis</option>
                        <option value="imaging">Imaging</option>
                        <option value="cardiac">Cardiac Tests</option>
                        <option value="microbiology">Microbiology</option>
                    </select>
                </div>
                <div class="lab-tests-grid">
                    <h4>Select Tests:</h4>
                    <div class="test-categories">
                        <div class="test-category">
                            <h5>Common Blood Tests</h5>
                            <label><input type="checkbox" value="cbc"> Complete Blood Count (CBC)</label>
                            <label><input type="checkbox" value="bmp"> Basic Metabolic Panel (BMP)</label>
                            <label><input type="checkbox" value="lipid"> Lipid Panel</label>
                            <label><input type="checkbox" value="hba1c"> HbA1c</label>
                            <label><input type="checkbox" value="tsh"> Thyroid (TSH)</label>
                        </div>
                        <div class="test-category">
                            <h5>Cardiac Tests</h5>
                            <label><input type="checkbox" value="ekg"> EKG</label>
                            <label><input type="checkbox" value="echo"> Echocardiogram</label>
                            <label><input type="checkbox" value="stress"> Stress Test</label>
                            <label><input type="checkbox" value="troponin"> Troponin</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Priority:</label>
                    <select id="lab-priority">
                        <option value="routine">Routine</option>
                        <option value="urgent">Urgent</option>
                        <option value="stat">STAT</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Clinical Notes:</label>
                    <textarea id="lab-notes" rows="3" placeholder="Clinical indication for tests..."></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn-primary" onclick="dashboard.submitLabOrder()">Submit Order</button>
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `);
    }
    
    submitLabOrder() {
        const patient = document.getElementById('lab-patient').value;
        const selectedTests = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        
        if (!patient || selectedTests.length === 0) {
            this.showNotification('Please select a patient and at least one test', 'error');
            return;
        }
        
        this.showNotification(`Lab order submitted for ${selectedTests.length} test(s)`, 'success');
        setTimeout(() => {
            document.querySelector('.modal').remove();
        }, 2000);
    }
    
    telemedicine() {
        const modal = this.createModal('Telemedicine Platform', `
            <div class="telemedicine-interface">
                <div class="video-section">
                    <div class="video-placeholder">
                        <div class="video-controls">
                            <button class="control-btn video-btn">📹 Camera</button>
                            <button class="control-btn audio-btn">🎤 Microphone</button>
                            <button class="control-btn screen-btn">🖥️ Screen Share</button>
                            <button class="control-btn end-btn">📞 End Call</button>
                        </div>
                        <div class="connection-status">
                            <div class="status-indicator connected"></div>
                            Connected - Good Quality
                        </div>
                    </div>
                </div>
                <div class="consultation-tools">
                    <div class="tool-section">
                        <h4>Patient Information</h4>
                        <div class="patient-quick-info">
                            <div>Name: Sarah Davis</div>
                            <div>Age: 34</div>
                            <div>Reason: Follow-up consultation</div>
                        </div>
                    </div>
                    <div class="tool-section">
                        <h4>Consultation Tools</h4>
                        <button class="tool-btn" onclick="dashboard.openVitalsSigning()">📊 Digital Vitals</button>
                        <button class="tool-btn" onclick="dashboard.openPrescriptionPad()">💊 e-Prescribe</button>
                        <button class="tool-btn" onclick="dashboard.shareScreen()">📄 Share Documents</button>
                        <button class="tool-btn" onclick="dashboard.scheduleFollowup()">📅 Schedule Follow-up</button>
                    </div>
                </div>
            </div>
        `);
    }
    
    // Initialize the dashboard when DOM is loaded
    static initialize() {
        return new DoctorDashboard();
    }
    
    // Method to handle consultation form submission
    handleConsultationSubmit(formData) {
        const patientName = formData.get('patientName');
        const consultationType = formData.get('consultationType');
        const appointmentTime = formData.get('appointmentTime');
        const notes = formData.get('notes');
        
        // Simulate saving consultation
        this.showNotification(`Consultation scheduled for ${patientName} at ${new Date(appointmentTime).toLocaleString()}`, 'success');
        
        // Add to appointments list (simulation)
        this.appointments.unshift({
            patient: patientName,
            time: new Date(appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type: consultationType === 'telemedicine' ? 'telemedicine' : 'in-person'
        });
        
        // Update UI
        this.refreshAppointmentsList();
    }
    
    refreshAppointmentsList() {
        const appointmentsList = document.querySelector('.appointment-list');
        if (appointmentsList) {
            appointmentsList.innerHTML = this.appointments.slice(0, 3).map(apt => `
                <li class="appointment-item">
                    <div>
                        <div class="appointment-patient">${apt.patient}</div>
                        <div class="appointment-time">${apt.time}</div>
                    </div>
                    <div style="color: ${apt.type === 'telemedicine' ? '#667eea' : '#4ECDC4'};">
                        ${apt.type === 'telemedicine' ? '📱' : '🏥'}
                    </div>
                </li>
            `).join('');
        }
    }
}

// Global variable for dashboard access
let dashboard;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    dashboard = DoctorDashboard.initialize();
    
    // Expose calculator functions globally for onclick handlers
    window.medicalCalculator = () => dashboard.medicalCalculator();
    window.prescriptionTool = () => dashboard.prescriptionTool();
    window.labOrders = () => dashboard.labOrders();
    window.telemedicine = () => dashboard.telemedicine();
    
    // Expose other functions
    window.newConsultation = () => dashboard.newConsultation();
    window.emergencyAlert = () => dashboard.emergencyAlert();
    window.logout = () => dashboard.logout();
    window.viewAllPatients = () => dashboard.showNotification('Opening patient management system...', 'info');
    window.manageAppointments = () => dashboard.showNotification('Opening appointment management...', 'info');
    window.accessRecords = () => dashboard.showNotification('Opening patient records database...', 'info');
    window.viewAnalytics = () => dashboard.showNotification('Loading detailed analytics dashboard...', 'info');
    window.openMessages = () => dashboard.showNotification('Opening message center...', 'info');
    window.referrals = () => dashboard.showNotification('Opening referral system...', 'info');
    window.drugDatabase = () => dashboard.showNotification('Accessing drug interaction database...', 'info');
    window.clinicalGuidelines = () => dashboard.showNotification('Loading clinical guidelines library...', 'info');
    window.insuranceVerification = () => dashboard.showNotification('Opening insurance verification system...', 'info');
    window.billingCenter = () => dashboard.showNotification('Accessing billing and claims center...', 'info');
    window.continuingEducation = () => dashboard.showNotification('Opening CME credits portal...', 'info');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DoctorDashboard;
}