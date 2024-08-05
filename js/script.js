document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('start-screen');
    const questionForm = document.getElementById('question-screen');
    const delayBeforeNextQuestion = 1000; // Adjust delay to match the GIF animation time
    const googleWebAppURL = 'https://script.google.com/macros/s/AKfycbztEyQjKgpXJlc9N3lWLslJ8M9eL50thODiqq0NhrHN2FKYGf9M3Z0154_1bSohtptK/exec'; // Replace with your Google Apps Script Web App URL

    let startTime;
    let answers = []; // To store answers

    function startTimer() {
        startTime = new Date();
    }

    function getTimeTaken() {
        const endTime = new Date();
        return Math.round((endTime - startTime) / 1000); // Time in seconds
    }

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
                <div class="question-box">
                    <h2>${question.text}</h2>
                    <div class="question-options">
                        ${createAnswerButtons(question.options)}
                    </div>
                </div>
            `;

            questionDiv.innerHTML = questionHTML;
            container.appendChild(questionDiv);
        });

        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', handleChoiceClick);
        });
    }

    function createAnswerButtons(options) {
        const numOptions = options.length;
        const midPoint = Math.ceil(numOptions / 2);
        const column1 = options.slice(0, midPoint);
        const column2 = options.slice(midPoint);

        return `
            ${column1.length > 0 ? `
                <div class="column column-left">
                    ${column1.map((option, index) => `
                        <button class="choice-button" data-answer="${String.fromCharCode(65 + index)}">
                            <img src="resources/Button.png" class="button-img" data-state="default">
                            <span>${option}</span>
                        </button>
                    `).join('')}
                </div>
            ` : ''}
            ${column2.length > 0 ? `
                <div class="column column-right">
                    ${column2.map((option, index) => `
                        <button class="choice-button" data-answer="${String.fromCharCode(65 + column1.length + index)}">
                            <img src="resources/Button.png" class="button-img" data-state="default">
                            <span>${option}</span>
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }

    function handleChoiceClick(event) {
        const button = event.currentTarget;
        const img = button.querySelector('.button-img');
        img.src = 'resources/aButton.gif'; // Change to gif image
        
        // Play sound effect
        const clickSound = new Audio('resources/klik.wav');
        clickSound.play();

        const answer = button.dataset.answer;
        const currentQuestionIndex = Array.from(button.closest('.question').parentElement.children).indexOf(button.closest('.question'));
        answers[currentQuestionIndex] = answer; // Store the answer

        // Delay before showing the next question
        setTimeout(() => {
            img.src = 'resources/Button.png'; // Change back to default image
            if (currentQuestionIndex + 1 < document.querySelectorAll('.question').length) {
                showQuestion(currentQuestionIndex + 1);
            } else {
                // Handle form submission here
                submitFormData();
            }
        }, delayBeforeNextQuestion);
    }

    function submitFormData() {
        const formData = {
            name: document.getElementById('name').value,
            answers: answers, // Include answers array
            timeTaken: getTimeTaken() // Get the time taken to complete the test
        };

        fetch(googleWebAppURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(formData),
            redirect: 'follow'
        }).then(response => response.text())
        .then(text => {
            alert('Test submitted successfully!');
            console.log(text);
            // Return to the start screen
            resetToStartScreen();
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your test.');
        });
    }

    function resetToStartScreen() {
        nameQuestion.style.display = 'flex';
        questionForm.style.display = 'none';
        document.getElementById('name').value = '';
        answers = [];
    }

    startButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        if (name.trim()) {
            nameQuestion.style.display = 'none';
            questionForm.style.display = 'block';
            startBackgroundMusic(); // Start background music
            startTimer(); // Start timer

            fetch('questions.json')
                .then(response => response.json())
                .then(data => {
                    displayQuestions(data);
                })
                .catch(error => {
                    console.error('Error loading questions:', error);
                    alert('Error loading questions.');
                });
        } else {
            alert('Please enter your name.');
        }
    });
});
