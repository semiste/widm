document.addEventListener('DOMContentLoaded', function () {
    console.log('JavaScript is running');

    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('name-question');
    const questionForm = document.getElementById('question-form');

    let startTime;

    function startTimer() {
        startTime = new Date();
    }

    function getTimeTaken() {
        const endTime = new Date();
        return Math.round((endTime - startTime) / 1000); // Time in seconds
    }

    function startBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.play().catch(error => {
                console.error('Error playing background music:', error);
            });
        }
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
                <div class="question-container">
                    <h2>${question.text}</h2>
                    ${question.options.map(option => `
                        <button class="choice-button" data-answer="${option}">
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
        console.log('Choice clicked');
        const button = event.currentTarget;
        button.classList.toggle('selected');
        const img = button.querySelector('.button-img');
        if (img) {
            img.src = button.classList.contains('selected') ? 'resources/aButton.gif' : 'resources/Button.png'; // Change to gif image
        }
    }

    function submitFormData() {
        const formData = {
            name: document.getElementById('name').value,
            answers: [],
            timeTaken: getTimeTaken() // Get the time taken to complete the test
        };

        document.querySelectorAll('.choice-button.selected').forEach(button => {
            formData.answers.push(button.dataset.answer);
        });

        fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => response.text())
        .then(text => {
            alert('Test submitted successfully!');
            console.log(text);
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your test.');
        });
    }

    function start() {
        console.log('Start button clicked');
        nameQuestion.style.display = 'none';
        questionForm.style.display = 'block';
        startBackgroundMusic();
        startTimer();
        
        // Example of displaying questions
        const questions = [
            { text: 'What is 2+2?', options: ['3', '4', '5'] },
            { text: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris'] }
        ];
        displayQuestions(questions);
    }

    startButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        if (name.trim()) {
            start();
        } else {
            alert('Please enter your name.');
        }
    });
});
