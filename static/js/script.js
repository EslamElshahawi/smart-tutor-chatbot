// Global variables
let currentSessionId = null;
let selectedCluster = null;

// DOM elements
const clusterSelection = document.getElementById('clusterSelection');
const chatInterface = document.getElementById('chatInterface');
const welcomeMessage = document.getElementById('welcomeMessage');
const startBtn = document.getElementById('startBtn');
const clusterCards = document.querySelectorAll('.cluster-card');
const clusterBadge = document.getElementById('clusterBadge');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const newSessionBtn = document.getElementById('newSessionBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showWelcomeMessage();
});

// Setup event listeners
function setupEventListeners() {
    // Cluster card selection
    clusterCards.forEach(card => {
        card.addEventListener('click', () => selectCluster(card));
    });

    // Start button
    startBtn.addEventListener('click', startChatSession);

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // New session button
    newSessionBtn.addEventListener('click', resetToClusterSelection);

    // Input validation
    messageInput.addEventListener('input', validateInput);
}

// Select cluster
function selectCluster(card) {
    // Remove previous selection
    clusterCards.forEach(c => c.classList.remove('selected'));
    
    // Select current card
    card.classList.add('selected');
    selectedCluster = parseInt(card.dataset.cluster);
    
    // Enable start button
    startBtn.disabled = false;
    startBtn.textContent = `Start Learning as Cluster ${selectedCluster}!`;
}

// Start chat session
async function startChatSession() {
    if (selectedCluster === null) return;

    try {
        startBtn.disabled = true;
        startBtn.textContent = 'Starting...';

        const response = await fetch('/start_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cluster: selectedCluster })
        });

        const data = await response.json();

        if (response.ok) {
            currentSessionId = data.session_id;
            showChatInterface();
            addMessage('assistant', data.message);
            updateClusterBadge();
        } else {
            throw new Error(data.error || 'Failed to start session');
        }
    } catch (error) {
        console.error('Error starting session:', error);
        alert('Failed to start chat session. Please try again.');
        startBtn.disabled = false;
        startBtn.textContent = 'Start Learning!';
    }
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !currentSessionId) return;

    // Add user message to chat
    addMessage('user', message);
    messageInput.value = '';
    sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: currentSessionId,
                message: message
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Hide typing indicator and add assistant message
            hideTypingIndicator();
            addMessage('assistant', data.message);
        } else {
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        hideTypingIndicator();
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

// Add message to chat
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Update cluster badge
function updateClusterBadge() {
    const clusterNames = ['Persistent', 'Engaged', 'Independent', 'Proactive'];
    clusterBadge.textContent = `Cluster ${selectedCluster}: ${clusterNames[selectedCluster]}`;
}

// Show chat interface
function showChatInterface() {
    clusterSelection.style.display = 'none';
    welcomeMessage.style.display = 'none';
    chatInterface.style.display = 'block';
    messageInput.focus();
}

// Reset to cluster selection
function resetToClusterSelection() {
    // Clear chat
    chatMessages.innerHTML = '';
    currentSessionId = null;
    selectedCluster = null;
    
    // Reset UI
    clusterCards.forEach(c => c.classList.remove('selected'));
    startBtn.disabled = true;
    startBtn.textContent = 'Start Learning!';
    
    // Show cluster selection
    chatInterface.style.display = 'none';
    clusterSelection.style.display = 'block';
    welcomeMessage.style.display = 'block';
}

// Show welcome message
function showWelcomeMessage() {
    welcomeMessage.style.display = 'block';
}

// Validate input
function validateInput() {
    const message = messageInput.value.trim();
    sendBtn.disabled = !message || !currentSessionId;
}

// Add some fun animations and interactions
function addFunInteractions() {
    // Add confetti effect when starting session
    startBtn.addEventListener('click', () => {
        if (selectedCluster !== null) {
            createConfetti();
        }
    });

    // Add hover effects to cluster cards
    clusterCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Simple confetti effect
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#ff6b6b', '#ffa500', '#4ecdc4'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Initialize fun interactions
addFunInteractions();

// Add accessibility features
function addAccessibilityFeatures() {
    // Add ARIA labels
    messageInput.setAttribute('aria-label', 'Type your question here');
    sendBtn.setAttribute('aria-label', 'Send message');
    
    // Add keyboard navigation for cluster cards
    clusterCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Select cluster ${index}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectCluster(card);
            }
        });
    });
    
    // Add focus management
    startBtn.addEventListener('click', () => {
        setTimeout(() => messageInput.focus(), 100);
    });
}

// Initialize accessibility features
addAccessibilityFeatures();
