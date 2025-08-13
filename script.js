const questions = [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
    { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"], answer: "Mitochondrion" }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreText = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const quizContent = document.getElementById('quiz-content');
const resultsContainer = document.getElementById('results-container');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
    });

    updateProgress();
}

function checkAnswer(selectedOption, button) {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedOption === correctAnswer) {
        score++;
        button.style.backgroundColor = "#c8f7c5";
    } else {
        button.style.backgroundColor = "#f8d7da";
    }
    setTimeout(() => {
        currentQuestionIndex++;
        scoreText.textContent = `Score: ${score}`;
        loadQuestion();
    }, 700);
}

function updateProgress() {
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function showResults() {
    quizContent.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    finalScore.textContent = `Your final score is ${score} out of ${questions.length}.`;
}

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreText.textContent = `Score: 0`;
    quizContent.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    loadQuestion();
});

musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = "🔊";
    } else {
        music.pause();
        musicToggle.textContent = "🔇";
    }
});

loadQuestion();
