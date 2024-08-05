document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('name-question');
    const questionForm = document.getElementById('question-form');
    const choiceButtons = document.querySelectorAll('.choice-button');
    
    let currentQuestionIndex = 0;
    const questions = document.querySelectorAll('.question');
    const delayBeforeNextQuestion = 1000; // Delay in milliseconds (adjust as needed)

    function startBackgroundMusic() {
        backgroundMusic.play();
    }

    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.style.display = i === index ? 'block' : 'none';
        });
    }

    function handleChoiceClick(event) {
        const button = event.currentTarget;
        const img = button.querySelector('.button-img');
        img.src = 'abutton.gif'; // Change to gif image
        
        // Play sound effect
        const clickSound = new Audio('klik.wav');
        clickSound.play();

        // Delay before showing the next question
        setTimeout(() => {
            img.src = 'button.png'; // Change back to default image
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion(currentQuestionIndex);
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
            startBackgroundMusic();
            showQuestion(currentQuestionIndex);
        } else {
            alert('Please enter your name.');
        }
    });

    choiceButtons.forEach(button => {
        button.addEventListener('click', handleChoiceClick);
    });
});
