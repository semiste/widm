document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('name-question');
    const questionForm = document.getElementById('question-form');
    const timestampElement = document.getElementById('timestamp');
    const delayBeforeNextQuestion = 1000; // Adjust delay to match the GIF animation time
    const googleWebAppURL = 'https://script.google.com/macros/s/AKfycbwYALiVz5lqQWp-j-MKaWmtnliyZIPt2q8E84jYP5t8Nu9j2oj8Bt4WOV0ntjKOQeYN/exec'; // Replace with your Google Apps Script Web App URL

    // Update timestamp with the last commit time from GitHub API
    function updateTimestamp() {
        fetch('https://api.github.com/repos/semiste/widm/commits?per_page=1')
            .then(response => response.json())
            .then(data => {
                const lastCommitDate = new Date(data[0].commit.committer.date);
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                timestampElement.textContent = `Last build time: ${lastCommitDate.toLocaleDateString('en-US', options)}`;
            })
            .catch(error => {
                console.error('Error fetching last commit time:', error);
                timestampElement.textContent = 'Last build time: Unable to fetch';
            });
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
                    <h2 style="color: white;">${question.text}</h2>
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
    const formData = {
        name: document.getElementById('name').value,
        answers: []
    };

    document.querySelectorAll('.choice-button.selected').forEach(button => {
        formData.answers.push(button.dataset.answer);
    });

    fetch('https://script.google.com/macros/s/AKfycbxh65DBy8ZuLr27bwjkJCWLkUt7KdZ_m7YTYBLE8LM/dev', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

document.getElementById('startButton').addEventListener('click', function() {
    let name = document.getElementById('nameInput').value;
    let answers = []; // Collect answers

    let payload = {
        name: name,
        answers: answers
    };

    fetch('YOUR_WEB_APP_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Success:', data);
        } else {
            console.error('Error:', data.message);
            alert('There was an error submitting your test: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Fetch Error:', error);
        alert('There was an error submitting your test.');
    });
});
