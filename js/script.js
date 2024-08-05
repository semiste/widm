document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('start-screen');
    const questionForm = document.getElementById('question-screen');
    const delayBeforeNextQuestion = 1000; // Adjust delay to match the GIF animation time
    const googleWebAppURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Replace with your Google Apps Script Web App URL

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

            const answersHtml = question.options.map((option, optIndex) => `
                <button class="choice-button" data-answer="${String.fromCharCode(65 + optIndex)}">
                    <img src="resources/Button.png" class="button-img" data-state="default">
                    <span>${option}</span>
                </button>
            `).join('');

            // Arrange buttons into columns based on number of answers
            const columns = Math.ceil(question.options.length / 2);
            const columnWidth = 50; // Adjust column width if needed
            const buttonHtml = Array.from({ length: columns }, (_, colIndex) => {
                return `
                    <div class="choice-column" style="width: ${100 / columns}%; float: left;">
                        ${question.options.slice(colIndex * 2, colIndex * 2 + 2).map((option, optIndex) => `
                            <button class="choice-button" data-answer="${String.fromCharCode(65 + colIndex * 2 + optIndex)}">
                                <img src="resources/Button.png" class="button-img" data-state="default">
                                <span>${option}</span>
                            </button>
                        `).join('')}
                    </div>
                `;
            }).join('');

            questionDiv.innerHTML = `
                <div class="question-container">
                    <h2>${question.text}</h2>
                    <div class="choice-container">
                        ${buttonHtml}
                    </div>
                </div>
            `;

            container.appendChild(questionDiv);
        });

        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', handleChoiceClick);
        });

        adjustButtonTextSize(); // Adjust the font size of answer texts
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
            redirect: 'follow'  // Important for handling redirects
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

    function adjustButtonTextSize() {
        document.querySelectorAll('.choice-button span').forEach(span => {
            const button = span.closest('.choice-button');
            const maxWidth = button.offsetWidth - 60; // 60px for image and margin

            span.style.fontSize = '1.2em'; // Reset to base size
            let currentFontSize = parseFloat(getComputedStyle(span).fontSize);

            while (span.scrollWidth > maxWidth && currentFontSize > 0) {
                currentFontSize -= 0.5;
                span.style.fontSize = `${currentFontSize}px`;
            }
        });
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
