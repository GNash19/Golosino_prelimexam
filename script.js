const questions = [
    {
        question: "What does the 'A' in the Avengers tower stand for?",
        options: ["Alliance", "Avengers", "Assemble", "Adamus"],
        answer: "Avengers"
    },
    {
        question: "Who founded Stark Industries?",
        options: ["Tony Stark", "Howard Stark", "Pepper Potts", "Obadiah Stane"],
        answer: "Howard Stark"
    },
    {
        question: "Which stone sits in Loki's scepter in the first Avengers?",
        options: ["Soul", "Time", "Mind", "Power"],
        answer: "Mind"
    },
    {
        question: "Which metal is fused with vibranium in Captain America's shield in some storylines?",
        options: ["Adamantium", "Uru", "Titanium", "Carbon Steel"],
        answer: "Adamantium"
    },
    {
        question: "Who leads S.H.I.E.L.D. during the Avengers Initiative?",
        options: ["Nick Fury", "Phil Coulson", "Maria Hill", "Tony Stark"],
        answer: "Nick Fury"
    },
    {
        question: "What is Thor's hammer named?",
        options: ["Gungnir", "Stormbreaker", "Hofund", "Mjolnir"],
        answer: "Mjolnir"
    },
    {
        question: "Which Infinity Stone controls time?",
        options: ["Power", "Reality", "Time", "Mind"],
        answer: "Time"
    },
    {
        question: "What is the Black Panther's homeland?",
        options: ["Sokovia", "Wakanda", "Latveria", "Genosha"],
        answer: "Wakanda"
    },
    {
        question: "Bruce Banner turns into which hero?",
        options: ["Iron Man", "Hulk", "Hawkeye", "Falcon"],
        answer: "Hulk"
    },
    {
        question: "What metal is synonymous with Wakanda's wealth?",
        options: ["Vibranium", "Adamantium", "Palladium", "Uru"],
        answer: "Vibranium"
    },
    {
        question: "Who says 'I can do this all day'?",
        options: ["Thor", "Steve Rogers", "Natasha Romanoff", "Clint Barton"],
        answer: "Steve Rogers"
    },
    {
        question: "Which AI becomes Vision?",
        options: ["JARVIS", "FRIDAY", "ULTRON", "EDITH"],
        answer: "JARVIS"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let muted = false;
let locked = false;

const landing = document.getElementById('landing');
const startBtn = document.getElementById('start-btn');
const muteBtn = document.getElementById('mute-btn');
const themeBtn = document.getElementById('theme-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreText = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');
const resultsContainer = document.getElementById('results-container');
const qaBlock = document.querySelector('.qa');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const questionCounter = document.getElementById('question-counter');

// Lightweight WebAudio beeps (dummy sfx)
let audioCtx = null;
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function beep({freq=440, time=0.12, type='sine', gain=0.05}) {
    if (muted) return;
    try {
        ensureAudio();
        const ctx = audioCtx; const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.value = gain; o.connect(g); g.connect(ctx.destination);
        const now = ctx.currentTime; o.start(now); o.stop(now + time);
        g.gain.setValueAtTime(gain, now); g.gain.exponentialRampToValueAtTime(0.0001, now + time);
    } catch {}
}
const sfx = {
    start: () => beep({freq: 660, time: 0.18, type: 'triangle', gain: 0.08}),
    correct: () => { beep({freq: 660, time: 0.08, type: 'sine'}); setTimeout(() => beep({freq: 880, time: 0.08, type: 'sine'}), 70); },
    wrong: () => { beep({freq: 220, time: 0.14, type: 'sawtooth', gain: 0.06}); },
    advance: () => beep({freq: 520, time: 0.06, type: 'square'})
};

function setMuted(v) {
    muted = v;
    muteBtn.setAttribute('aria-pressed', String(!muted));
    muteBtn.textContent = muted ? '🔇' : '🔊';
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    questionText.classList.remove('enter');
    void questionText.offsetWidth; // reflow
    questionText.classList.add('enter');
    optionsContainer.innerHTML = '';
    locked = false;

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
    });

    updateProgress();
}

function checkAnswer(selectedOption, btnEl) {
    if (locked) return;
    const correctAnswer = questions[currentQuestionIndex].answer;
    const buttons = [...optionsContainer.querySelectorAll('button')];
    buttons.forEach(b => b.disabled = true);
    locked = true;

    const isCorrect = selectedOption === correctAnswer;
    if (isCorrect) { score++; btnEl.classList.add('correct'); sfx.correct(); }
    else {
        btnEl.classList.add('wrong');
        const rightBtn = buttons.find(b => b.textContent === correctAnswer);
        if (rightBtn) rightBtn.classList.add('correct');
        sfx.wrong();
        questionText.classList.add('shake');
        setTimeout(() => questionText.classList.remove('shake'), 400);
    }
    currentQuestionIndex++;
    scoreText.textContent = `Score: ${score}`;
    setTimeout(() => { sfx.advance(); loadQuestion(); }, 650);
}

function updateProgress() {
    // Fix: Progress should reflect answered questions, reaching 100% when all are completed
    const answeredCount = Math.min(currentQuestionIndex, questions.length);
    const progressPercentage = (answeredCount / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Update question counter
    if (currentQuestionIndex < questions.length) {
        questionCounter.textContent = `Q${currentQuestionIndex + 1}/${questions.length}`;
    } else {
        questionCounter.textContent = `Q${questions.length}/${questions.length}`;
    }
    
    // Animate shine effect on progress bar
    if (progressContainer) {
        progressContainer.style.setProperty('--shine-x', `${progressPercentage}%`);
    }
}

function showResults() {
    resultsContainer.hidden = false;
    qaBlock.style.display = 'none';
    finalScore.textContent = `Your final score is ${score} out of ${questions.length}.`;
    confetti();
}

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreText.textContent = `Score: 0`;
    resultsContainer.hidden = true;
    qaBlock.style.display = '';
    updateProgress(); // Fix: Reset progress bar on restart
    loadQuestion();
});

// Landing and controls
startBtn.addEventListener('click', () => {
    landing.setAttribute('hidden', '');
    sfx.start();
});

muteBtn.addEventListener('click', () => setMuted(!muted));

// Theme toggle functionality
function setTheme(isLight) {
    document.body.classList.toggle('theme-light', isLight);
    themeBtn.setAttribute('aria-pressed', String(isLight));
    themeBtn.textContent = isLight ? '☀️' : '🌙';
    
    // Persist theme preference
    try {
        localStorage.setItem('quiz-theme', isLight ? 'light' : 'dark');
    } catch (e) {
        console.log('Could not save theme preference');
    }
}

themeBtn.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('theme-light');
    setTheme(!isCurrentlyLight);
});

// Load saved theme preference
try {
    const savedTheme = localStorage.getItem('quiz-theme');
    if (savedTheme) {
        setTheme(savedTheme === 'light');
    }
} catch (e) {
    console.log('Could not load theme preference');
}

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm') setMuted(!muted);
    // Keyboard shortcuts for theme (T key)
    if (e.key.toLowerCase() === 't') {
        const isCurrentlyLight = document.body.classList.contains('theme-light');
        setTheme(!isCurrentlyLight);
    }
    // number keys for options
    const num = parseInt(e.key, 10);
    if (!Number.isNaN(num) && num > 0) {
        const idx = num - 1;
        const btns = optionsContainer.querySelectorAll('button');
        const target = btns[idx];
        if (target && !locked) target.click();
    }
});

// Initial load
loadQuestion();
setMuted(false);

// Simple confetti generator (CSS-driven)
function confetti(count = 80) {
    const layer = document.createElement('div');
    layer.className = 'confetti';
    const colors = ['#F9C74F', '#C8102E', '#0B3D91', '#22c55e', '#e11d48'];
    for (let i = 0; i < count; i++) {
        const p = document.createElement('i');
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[Math.floor(Math.random()*colors.length)];
        const d = 6 + Math.random() * 14;
        const delay = Math.random() * 0.6;
        p.style.width = 6 + Math.random() * 6 + 'px';
        p.style.height = 10 + Math.random() * 10 + 'px';
        p.style.animation = `fall ${1.8 + Math.random()*1.6}s ${delay}s linear forwards`;
        layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 4000);
}

// Keyframes for confetti fall injected once
(function injectConfettiKeyframes(){
    const id = 'confetti-kf';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `@keyframes fall { from { transform: translateY(-20px) rotate(0deg); opacity: 1 } to { transform: translateY(100vh) rotate(360deg); opacity: 0.9 } }`;
    document.head.appendChild(style);
})();
