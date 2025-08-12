const questions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: "Mars"
    },
    {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
        answer: "Mitochondrion"
    }
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
        button.addEventListener('click', () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });

    updateProgress();
}

function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedOption === correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    scoreText.textContent = `Score: ${score}`;
    loadQuestion();
}

function updateProgress() {
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function showResults() {
    quizContent.style.display = 'none';
    resultsContainer.style.display = 'block';
    finalScore.textContent = `Your final score is ${score} out of ${questions.length}.`;
}

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreText.textContent = `Score: 0`;
    quizContent.style.display = 'block';
    resultsContainer.style.display = 'none';
    loadQuestion();
});

// Initial load
loadQuestion();