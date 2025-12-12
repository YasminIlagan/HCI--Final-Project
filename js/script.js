// Toast Notification Function
function showToast(message, type = 'success', icon = '✅') {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// Auto-navigate from splash to welcome screen
window.addEventListener('load', () => {
    setTimeout(() => {
        navigateTo('welcome-screen');
    }, 2000); // Show splash for 2 seconds
});

// Navigation function
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Scroll to top of screen
        const content = targetScreen.querySelector('.content');
        if (content) {
            content.scrollTop = 0;
        }
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

// Sign In handler
function handleSignIn(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    
    showToast('Sign In Successful! 🎉', 'success', '✅');
    navigateTo('home-screen');
}

// Sign Up handler
function handleSignUp(event) {
    event.preventDefault();
    const fullName = event.target[0].value;
    const phoneNumber = event.target[1].value;
    const age = event.target[2].value;
    const password = event.target[3].value;
    const termsAccepted = event.target[4].checked;
    
    if (!termsAccepted) {
        showToast('Please agree to the Terms and Privacy Policy', 'error', '⚠️');
        return;
    }
    
    showToast(`Welcome, ${fullName}! 🎉`, 'success', '✅');
    navigateTo('home-screen');
}

// Social login handler
function socialLogin(platform) {
    showToast(`Logged in with ${platform}! 🎉`, 'success', '✅');
    navigateTo('home-screen');
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

// Journal Functions
function saveNote() {
    const textarea = document.querySelector('.journal-textarea');
    const note = textarea.value;
    
    if (note.trim() === '') {
        showToast('Please write something before saving!', 'error', '⚠️');
        return;
    }
    
    showToast('Note saved successfully! 📝', 'success', '✅');
}

function clearJournal() {
    const textarea = document.querySelector('.journal-textarea');
    if (textarea.value.trim() !== '') {
        if (confirm('Are you sure you want to clear this note and start a new one?')) {
            textarea.value = '';
            showToast('New note ready! 📝', 'info', '✨');
        }
    } else {
        textarea.value = '';
        showToast('New note ready! 📝', 'info', '✨');
    }
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Remove typing indicator
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user-message';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    
    input.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add typing indicator
    const newTypingIndicator = document.createElement('div');
    newTypingIndicator.className = 'typing-indicator';
    newTypingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(newTypingIndicator);
    
    // Simulate Luna response
    setTimeout(() => {
        newTypingIndicator.remove();
        
        const responses = [
            'Thank you for sharing! I\'m here to help you with your wellness journey. 💜',
            'That\'s great to hear! Remember to take care of yourself. ✨',
            'I understand. Let me help you feel better. What else can I do for you? 💕',
            'Your well-being is important. I\'m always here to listen and support you. 🌙'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const lunaMsg = document.createElement('div');
        lunaMsg.className = 'chat-message luna-message';
        lunaMsg.textContent = randomResponse;
        chatMessages.appendChild(lunaMsg);
        
        // Add typing indicator back
        const finalTypingIndicator = document.createElement('div');
        finalTypingIndicator.className = 'typing-indicator';
        finalTypingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(finalTypingIndicator);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        showToast('Chat cleared! Start a new conversation 💬', 'success', '🧹');
    }
}

function sendQuickMessage(topic) {
    const input = document.getElementById('chatInput');
    input.value = `Tell me about ${topic}`;
    sendMessage();
}

// Settings Functions
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        showToast('Logged out successfully! See you soon! 👋', 'success', '✅');
        setTimeout(() => {
            navigateTo('welcome-screen');
        }, 1000);
    }
}

// Account Settings Functions
function changePhoto() {
    // trigger the hidden file input to pick a profile photo
    const input = document.getElementById('profileUpload');
    if (input) input.click();
}

// Keep reference to currently chosen profile file for processing
let currentProfileFile = null;

// Handle profile file selection and preview
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

// Remove background of currently selected profile image using a simple canvas algorithm
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
                    // detect near-white / light background and make transparent
                    if (r >= threshold && g >= threshold && b >= threshold && Math.abs(r - g) < 20 && Math.abs(r - b) < 20) {
                        data[i + 3] = 0; // set alpha = 0
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
    
    setTimeout(() => {
        navigateTo('settings-screen');
    }, 1000);
}