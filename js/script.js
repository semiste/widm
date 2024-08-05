<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Application</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="start-screen" class="screen">
        <img src="resources/background_front.png" alt="Background Front" class="background-image">
        <div class="input-container">
            <h1>Enter Your Name</h1>
            <input type="text" id="name" placeholder="Your Name">
            <button id="start-button">Start</button>
        </div>
    </div>

    <div id="question-screen" class="screen" style="display: none;">
        <div id="question-form"></div>
    </div>

    <audio id="background-music" src="resources/test.mp3" preload="auto"></audio>
    <script src="script.js"></script>
</body>
</html>
