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

            // Create question HTML
            const questionHTML = `
                <h2>${question.text}</h2>
                ${createAnswerButtons(question.options)}
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
        let buttonsHTML = '';

        for (let i = 0; i < 6; i++) {
            if (i < numOptions) {
                buttonsHTML += `
                    <div class="choice-button button-position" data-answer="${String.fromCharCode(65 + i)}">
                        <img src="resources/Button.png" class="button-img" data-state="default">
                        <span>${options[i]}</span>
                    </div>
                `;
            } else {
                buttonsHTML += `
                    <div class="choice-button button-position" style="visibility: hidden;">
                        <img src="resources/Button.png" class="button-img" data-state="default">
                        <span></span>
                    </div>
                `;
            }
        }

        return buttonsHTML;
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
           
