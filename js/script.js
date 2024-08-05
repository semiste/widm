document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-button');
    const nameInput = document.getElementById('name');
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const questionForm = document.getElementById('question-form');

    let startTime;
    let questions = [];
    const delayBeforeNextQuestion = 1000;
    const googleWebAppURL = 'https://script.google.com/macros/s/AKfycbxn5t7VjmnJAq8Oi-KmY47JJeHtrDC5guVIUEMG9qFCm_Rl6Vu6ASPAzj6E5hcE79W-/exec';

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
        const questionsElements = document.querySelectorAll('.question');
        questionsElements.forEach((q, i) => {
            q.style.display = i === index ? 'block' : 'none';
        });
    }

    function displayQuestions() {
        questionForm.innerHTML = '';
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.id = `question-${index}`;
            questionDiv.style.display = index === 0 ? 'block' : 'none';

            const questionHTML = `
                <img src="resources/background_exam.png" alt="Background Exam" class="background-image">
                <div class="question-container">
                    <h2 style="color: white;">${question.text}</h2>
                    ${question.options.map(option => `
                        <button class="choice-button" data-answer="${option}">
                            <img src="resources/Button.png" class="button-img">
                            <span>${option}</span>
                        </button>
                    `).join('')}
                </div>
            `;

            questionDiv.innerHTML = questionHTML;
            questionForm.appendChild(questionDiv);
        });

        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', handleChoiceClick);
        });
    }

    function handleChoiceClick(event) {
        const button = event.currentTarget;
        const img = button.querySelector('.button-img');
        img.src = 'resources/aButton.gif';
        
        const clickSound = new Audio('resources/klik.wav');
        clickSound.play();

        setTimeout(() => {
            img.src = 'resources/Button.png';
            const currentQuestionIndex = Array.from(button.closest('.question').parentElement.children).indexOf(button.closest('.question'));
            if (currentQuestionIndex + 1 < document.querySelectorAll('.question').length) {
                showQuestion(currentQuestionIndex + 1);
            } else {
                submitFormData();
            }
        }, delayBeforeNextQuestion);
    }

    function submitFormData() {
        const formData = {
            name: nameInput.value,
            answers: [],
            timeTaken: getTimeTaken()
        };

        document.querySelectorAll('.choice-button.selected').forEach(button => {
            formData.answers.push(button.dataset.answer);
        });

        fetch(googleWebAppURL, {
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

    startButton.addEventListener('click', function () {
        const name = nameInput.value;
        if (name.trim()) {
            startScreen.style.display = 'none';
            questionScreen.style.display = 'block';
            startBackgroundMusic();
            startTimer();
            
            fetch('questions.json')
                .then(response => response.json())
                .then(data => {
                    questions = data;
                    displayQuestions();
                })
                .catch(error => {
                    console.error('Error fetching questions:', error);
                });
        } else {
            alert('Please enter your name.');
        }
    });
});
