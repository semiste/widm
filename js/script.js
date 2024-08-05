document.addEventListener('DOMContentLoaded', function () {
    // Basic setup to test if JavaScript is running
    console.log('JavaScript is running');

    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('name-question');
    const questionForm = document.getElementById('question-form');

    function start() {
        console.log('Start button clicked');
        nameQuestion.style.display = 'none';
        questionForm.style.display = 'block';
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
