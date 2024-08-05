document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const nameQuestion = document.getElementById('name-question');
    const questionForm = document.getElementById('question-form');
    const timestampElement = document.getElementById('timestamp');

    function updateTimestamp() {
        if (timestampElement) {
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
        } else {
            console.error('Timestamp element not found.');
        }
    }

    function submitFormData() {
        const name = document.getElementById('name').value;
        if (!name.trim()) {
            alert('Please enter your name.');
            return;
        }

        const formData = {
            name: name,
            answers: [], // Collect answers if needed
            timeTaken: 0 // Placeholder for time taken
        };

        fetch('https://script.google.com/macros/s/AKfycbxn5t7VjmnJAq8Oi-KmY47JJeHtrDC5guVIUEMG9qFCm_Rl6Vu6ASPAzj6E5hcE79W-/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.text())
        .then(text => {
            alert('Test submitted successfully!');
            console.log(text);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your test.');
        });
    }

    startButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        if (name.trim()) {
            nameQuestion.style.display = 'none';
            questionForm.style.display = 'block';
            updateTimestamp();
        } else {
            alert('Please enter your name.');
        }
    });
});
