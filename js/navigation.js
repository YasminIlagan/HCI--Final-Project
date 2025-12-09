// Success Message Function (like the sign-in message)
function showMessage(type, message) {
    console.log('showMessage called:', type, message);
    
    // Remove any existing message
    const existingMessage = document.querySelector('.success-message-box');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message box
    const messageBox = document.createElement('div');
    messageBox.className = `success-message-box ${type}`;
    messageBox.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
            <span class="message-icon">✓</span>
        </div>
    `;
    document.body.appendChild(messageBox);
    console.log('Message box added to body');

    // Show message with animation
    setTimeout(() => {
        messageBox.classList.add('show');
        console.log('Show class added');
    }, 10);

    // Hide and remove message after 5 seconds (longer duration)
    setTimeout(() => {
        messageBox.classList.remove('show');
        setTimeout(() => {
            messageBox.remove();
        }, 500);
    }, 5000);
}

// Navigation function for separate HTML files
function navigateTo(screenId) {
    const screenMap = {
        'splash-screen': 'splash.html',
        'welcome-screen': 'welcome.html',
        'signin-screen': 'signin.html',
        'signup-screen': 'signup.html',
        'home-screen': 'home.html',
        'period-tracker-screen': 'period-tracker.html',
        'sleep-tracker-screen': 'sleep-tracker.html',
        'wellness-tips-screen': 'wellness-tips.html',
        'journal-screen': 'journal.html',
        'notification-screen': 'notification.html',
        'ask-luna-screen': 'ask-luna.html',
        'insight-screen': 'insight.html',
        'settings-screen': 'settings.html',
        'account-settings-screen': 'account-settings.html'
    };
    
    const targetPage = screenMap[screenId];
    if (targetPage) {
        window.location.href = targetPage;
    }
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Social login handler
function socialLogin(platform) {
    showToast(`Logged in with ${platform}! 🎉`, 'success', '✅');
    setTimeout(() => navigateTo('home-screen'), 1000);
}

// Email and phone validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function validateEmailOrPhone(value) {
    return validateEmail(value) || validatePhone(value);
}

function validatePassword(password) {
    return password.length >= 8;
}

// Mood selection
function selectMood(mood) {
    const moods = {
        'sad': { text: 'Sad', icon: '😢' },
        'bad': { text: 'Not great', icon: '😟' },
        'okay': { text: 'Okay', icon: '😐' },
        'good': { text: 'Good', icon: '😊' },
        'great': { text: 'Great!', icon: '😄' }
    };
    
    const selected = moods[mood];
    showToast(`Mood logged: ${selected.text}`, 'success', selected.icon);
}

// Settings Functions
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        showToast('Logged out successfully! See you soon! 👋', 'success', '✅');
        setTimeout(() => navigateTo('welcome-screen'), 1000);
    }
}

// Profile photo functions
function changePhoto() {
    const input = document.getElementById('profileUpload');
    if (input) input.click();
}

let currentProfileFile = null;

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('profileUpload');
    if (input) {
        input.addEventListener('change', handleProfileUpload);
    }
});

function handleProfileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    currentProfileFile = file;
    const imgEl = document.getElementById('profileImage');
    if (imgEl) {
        const url = URL.createObjectURL(file);
        imgEl.src = url;
    }
}

function removeProfileBg() {
    if (!currentProfileFile) {
        showToast('Please choose a photo first', 'error', '⚠️');
        return;
    }
    showToast('Processing image...', 'info', '⏳');
    processImageRemoveBackground(currentProfileFile, 240)
        .then(dataUrl => {
            const imgEl = document.getElementById('profileImage');
            if (imgEl) imgEl.src = dataUrl;
            showToast('Background removed successfully! ✨', 'success', '✅');
        })
        .catch(err => {
            console.error(err);
            showToast('Background removal failed', 'error', '❌');
        });
}

function processImageRemoveBackground(file, threshold = 240) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const url = URL.createObjectURL(file);
        img.onload = () => {
            try {
                const w = img.naturalWidth;
                const h = img.naturalHeight;
                const max = 800;
                let scale = 1;
                if (Math.max(w, h) > max) scale = max / Math.max(w, h);
                const cw = Math.round(w * scale);
                const ch = Math.round(h * scale);
                const canvas = document.createElement('canvas');
                canvas.width = cw;
                canvas.height = ch;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, cw, ch);
                const imageData = ctx.getImageData(0, 0, cw, ch);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    if (r >= threshold && g >= threshold && b >= threshold && Math.abs(r - g) < 20 && Math.abs(r - b) < 20) {
                        data[i + 3] = 0;
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                const out = canvas.toDataURL('image/png');
                URL.revokeObjectURL(url);
                resolve(out);
            } catch (e) {
                URL.revokeObjectURL(url);
                reject(e);
            }
        };
        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        };
        img.src = url;
    });
}

function saveAccountSettings(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const age = document.getElementById('userAge').value;
    const email = document.getElementById('userEmail').value;
    showToast('Account settings saved successfully! ✅', 'success', '💾');
    setTimeout(() => navigateTo('settings-screen'), 1000);
}

// Sign In handler
function handleSignIn(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('signInEmail');
    const passwordInput = document.getElementById('signin-password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let isValid = true;
    
    // Validate email or phone
    if (!validateEmailOrPhone(email)) {
        emailInput.classList.add('error');
        emailError.classList.add('show');
        isValid = false;
    } else {
        emailInput.classList.remove('error');
        emailError.classList.remove('show');
    }
    
    // Validate password
    if (!validatePassword(password)) {
        passwordInput.classList.add('error');
        passwordError.classList.add('show');
        isValid = false;
    } else {
        passwordInput.classList.remove('error');
        passwordError.classList.remove('show');
    }
    
    if (isValid) {
        showToast('Sign In Successful! 🎉', 'success', '✅');
        setTimeout(() => navigateTo('home-screen'), 1000);
    }
}

// Sign Up handler
function handleSignUp(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('signUpName');
    const phoneInput = document.getElementById('signUpPhone');
    const ageInput = document.getElementById('signUpAge');
    const passwordInput = document.getElementById('signup-password');
    const termsAccepted = event.target.querySelector('input[type="checkbox"]').checked;
    
    const fullName = nameInput.value.trim();
    const phoneNumber = phoneInput.value.trim();
    const age = parseInt(ageInput.value);
    const password = passwordInput.value;
    
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const ageError = document.getElementById('ageError');
    const passwordError = document.getElementById('signupPasswordError');
    
    let isValid = true;
    
    // Validate name
    if (fullName.length < 2) {
        nameInput.classList.add('error');
        nameError.classList.add('show');
        isValid = false;
    } else {
        nameInput.classList.remove('error');
        nameError.classList.remove('show');
    }
    
    // Validate phone
    if (!validatePhone(phoneNumber)) {
        phoneInput.classList.add('error');
        phoneError.classList.add('show');
        isValid = false;
    } else {
        phoneInput.classList.remove('error');
        phoneError.classList.remove('show');
    }
    
    // Validate age
    if (isNaN(age) || age < 13 || age > 100) {
        ageInput.classList.add('error');
        ageError.classList.add('show');
        isValid = false;
    } else {
        ageInput.classList.remove('error');
        ageError.classList.remove('show');
    }
    
    // Validate password
    if (!validatePassword(password)) {
        passwordInput.classList.add('error');
        passwordError.classList.add('show');
        isValid = false;
    } else {
        passwordInput.classList.remove('error');
        passwordError.classList.remove('show');
    }
    
    if (!termsAccepted) {
        showToast('Please agree to the Terms and Privacy Policy', 'error', '⚠️');
        return;
    }
    
    if (isValid) {
        showToast(`Welcome, ${fullName}! 🎉`, 'success', '✅');
        setTimeout(() => navigateTo('home-screen'), 1000);
    }
}
