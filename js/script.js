document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('name-question');
    const questionForm = document.getElementById('question-form');
    const timestampElement = document.getElementById('timestamp');
    const delayBeforeNextQuestion = 1000; // Adjust delay to match the GIF animation time

    // Update timestamp on page load
    function updateTimestamp() {
        const buildTime = document.querySelector('meta[name="build-time"]').getAttribute('content');
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        timestampElement.textContent = `Last build time: ${new Date(buildTime).toLocaleDateString('en-US', options)}`;
    }

    // Load questions from JSON
    fetch('questions.json')
        .then(response => response.json())
        .then(questions => {
            displayQuestions(questions);
        });

    function startBackgroundMusic() {
        backgroundMusic.play().catch(error => {
            console.error('Error playing background music:', error);
        });
    }

    function showQuestion(index) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((q, i) => {
            q.style.display = i === index ? 'block' : 'none';
        });
    }

    function displayQuestions(questions) {
        const container = document.getElementById('question-form');
        container.innerHTML = '';

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.id = `question-${index}`;
            questionDiv.style.display = index === 0 ? 'block' : 'none';

            const questionHTML = `
                <img src="resources/background_exam.png" alt="Background Exam" class="background-image">
                <div class="question-container">
                    <h2>${question.text}</h2>
                    ${question.options.map(option => `
                        <button class="choice-button" data-answer="${option}">
                            <img src="resources/Button.png" class="button-img" data-state="default">
                            <span>${option}</span>
                        </button>
                    `).join('')}
                </div>
            `;

            questionDiv.innerHTML = questionHTML;
            container.appendChild(questionDiv);
        });

        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', handleChoiceClick);
        });
    }

    function handleChoiceClick(event) {
        const button = event.currentTarget;
        const img = button.querySelector('.button-img');
        img.src = 'resources/aButton.gif'; // Change to gif image
        
        // Play sound effect
        const clickSound = new Audio('resources/klik.wav');
        clickSound.play();

        // Delay before showing the next question
        setTimeout(() => {
            img.src = 'resources/Button.png'; // Change back to default image
            const currentQuestionIndex = Array.from(button.closest('.question').parentElement.children).indexOf(button.closest('.question'));
            if (currentQuestionIndex + 1 < document.querySelectorAll('.question').length) {
                showQuestion(currentQuestionIndex + 1);
            } else {
                // Handle form submission here
                submitFormData();
            }
        }, delayBeforeNextQuestion);
    }

    function submitFormData() {
        const formData = new FormData();
        // Collect data from form elements
        document.querySelectorAll('.choice-button').forEach(button => {
            if (button.classList.contains('selected')) {
                formData.append('answers', button.dataset.answer);
            }
        });

        fetch('YOUR_WEB_APP_URL', { // Replace with your Google Apps Script Web App URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        }).then(response => {
            alert('Test submitted successfully!');
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your test.');
        });
    }

    startButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        if (name.trim()) {
            nameQuestion.style.display = 'none';
            questionForm.style.display = 'block';
            startBackgroundMusic(); // Start background music
            updateTimestamp(); // Update timestamp on start
        } else {
            alert('Please enter your name.');
        }
    });

    updateTimestamp(); // Initial timestamp update
});
