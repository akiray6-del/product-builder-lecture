// 4-7-8 Breathing Timer Logic
const phases = [
    { name: 'Inhale', duration: 4, color: 'var(--inhale-color)', scale: 1, pose: 'inhale-pose' },
    { name: 'Hold', duration: 7, color: 'var(--hold-color)', scale: 1, pose: 'hold-pose' },
    { name: 'Exhale', duration: 8, color: 'var(--exhale-color)', scale: 0.4, pose: 'exhale-pose' }
];

let currentPhaseIndex = 0;
let timeLeft = 0;
let cycleCount = 0;
let timerId = null;
let isRunning = false;

const phaseText = document.getElementById('phase-text');
const timerDisplay = document.getElementById('timer-display');
const cycleDisplay = document.getElementById('cycle-count');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const visualizer = document.getElementById('visualizer');
const dogChar = document.querySelector('.dog-pixel-art');

function updateUI() {
    const phase = phases[currentPhaseIndex];
    phaseText.textContent = phase.name;
    timerDisplay.textContent = timeLeft;
    cycleDisplay.textContent = cycleCount;
    
    // Update visualizer color and scale
    visualizer.style.backgroundColor = phase.color;
    
    // Character Pose Management
    dogChar.classList.remove('inhale-pose', 'hold-pose', 'exhale-pose');
    dogChar.classList.add(phase.pose);

    // Inhale: Scale up, Hold: Stay up, Exhale: Scale down
    if (phase.name === 'Inhale') {
        const progress = 1 - (timeLeft / phase.duration);
        const currentScale = 0.4 + (0.6 * progress);
        visualizer.style.transform = `scale(${currentScale})`;
        visualizer.style.opacity = 0.2 + (0.4 * progress);
    } else if (phase.name === 'Hold') {
        visualizer.style.transform = `scale(1)`;
        visualizer.style.opacity = 0.6;
    } else if (phase.name === 'Exhale') {
        const progress = 1 - (timeLeft / phase.duration);
        const currentScale = 1 - (0.6 * progress);
        visualizer.style.transform = `scale(${currentScale})`;
        visualizer.style.opacity = 0.6 - (0.4 * progress);
    }
}

function tick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateUI();
    } else {
        // Switch to next phase
        currentPhaseIndex++;
        
        if (currentPhaseIndex >= phases.length) {
            currentPhaseIndex = 0;
            cycleCount++;
            
            // Limit to 4 cycles as recommended initially
            if (cycleCount >= 4) {
                stopBreathing();
                phaseText.textContent = 'Session Done';
                return;
            }
        }
        
        timeLeft = phases[currentPhaseIndex].duration;
        updateUI();
    }
}

function startBreathing() {
    if (isRunning) return;
    
    isRunning = true;
    currentPhaseIndex = 0;
    cycleCount = 0;
    timeLeft = phases[currentPhaseIndex].duration;
    
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    
    updateUI();
    timerId = setInterval(tick, 1000);
}

function stopBreathing() {
    isRunning = false;
    clearInterval(timerId);
    
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    
    currentPhaseIndex = 0;
    timeLeft = 0;
    phaseText.textContent = 'Ready';
    timerDisplay.textContent = '0';
    visualizer.style.transform = 'scale(0.4)';
    visualizer.style.opacity = 0.2;
    
    dogChar.classList.remove('inhale-pose', 'hold-pose', 'exhale-pose');
}

startBtn.addEventListener('click', startBreathing);
stopBtn.addEventListener('click', stopBreathing);

// Theme Toggle Logic
const themeButton = document.getElementById('theme-button');
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        themeButton.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        themeButton.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setTheme(true);
}

themeButton.addEventListener('click', () => {
    setTheme(!body.classList.contains('dark-mode'));
});
