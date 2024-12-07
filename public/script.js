let startTime;
let focusTime = 0;
let progressTime = 0;
let focusInterval;
let progressInterval;
let paused = true;
let progressPosition = 0;
let activityCount = 0;
let goalActivities = 0;
let flashingWord = 'Custom Message';
let musicPlaying = false;
let backgroundMusic;

const maxProgressTime = 30 * 60;
const progressStep = 1;
const progressTrail = '---------------';
const progressLength = 15;

function updateDigitalClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('digitalClock').textContent = `${hours}:${minutes}:${seconds}`;
}

function updateFocusTime() {
    if (!paused) {
        focusTime += 1;
        const elapsedHours = Math.floor(focusTime / 3600).toString().padStart(2, '0');
        const elapsedMinutes = Math.floor((focusTime % 3600) / 60).toString().padStart(2, '0');
        const elapsedSeconds = (focusTime % 60).toString().padStart(2, '0');
        document.getElementById('elapsedTime').textContent = `集中時間: ${elapsedHours}:${elapsedMinutes}:${elapsedSeconds}`;
    }
}

function startTimers() {
    focusInterval = setInterval(updateFocusTime, 1000);
    progressInterval = setInterval(updateProgressBarPosition, progressStep * 1000);
}

function toggleTimers() {
    paused = !paused;
    if (!paused) {
        startTimers();
    } else {
        clearInterval(focusInterval);
        clearInterval(progressInterval);
    }
}

function resetProgress() {
    progressPosition = 0;
    progressTime = 0;
    clearInterval(progressInterval);
    document.getElementById('progressDot').style.transform = `translateX(${progressPosition}px)`;
    document.getElementById('progressTrail').textContent = progressTrail;
    updateProgressTimeDisplay(0, 0);
}

function updateProgressBarPosition() {
    if (!paused && progressTime < maxProgressTime) {
        progressTime += progressStep;
        updateProgressTimeDisplay(Math.floor(progressTime / 60), progressTime % 60);
        const maxPosition = document.getElementById('progressDot').parentElement.clientWidth - document.getElementById('progressDot').clientWidth;
        progressPosition = (progressTime / maxProgressTime) * maxPosition;
        const filledBlocks = Math.floor((progressTime / maxProgressTime) * progressLength);
        const currentTrail = '='.repeat(filledBlocks) + progressTrail.slice(filledBlocks);
        document.getElementById('progressDot').style.transform = `translateX(${progressPosition}px)`;
        document.getElementById('progressTrail').textContent = currentTrail;
        if (progressTime >= maxProgressTime) {
            activityCount++;
            updateLoadingBar(activityCount);
            playCompletionSound();
            showStars();
            toggleTimers();
            resetProgress();
        }
    }
}

function updateProgressTimeDisplay(minutes, seconds) {
    document.getElementById('progressTimeStart').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('progressTimeEnd').textContent = `${Math.floor(maxProgressTime / 60).toString().padStart(2, '0')}:${(maxProgressTime % 60).toString().padStart(2, '0')}`;
}

function updateLoadingBar(activities) {
    const loadingBar = document.getElementById('loadingBar');
    const percentage = goalActivities > 0 ? (activities / goalActivities) * 100 : 0;
    let loadingText = '';
    for (let i = 0; i <= 10; i++) {
        if (i * 10 <= percentage) {
            loadingText += '<span style="color: #0f0;">█</span>';
        } else {
            loadingText += '<span style="color: #fff;">▒</span>';
        }
    }
    loadingBar.innerHTML = `${loadingText} ${percentage.toFixed(0)}%`;
}

function playCompletionSound() {
    const audio = new Audio('alert.mp3');
    audio.play();
}

function selectMusic() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        backgroundMusic.src = url;
        playMusic();
    };
    fileInput.click();
}

function toggleMusic() {
    if (backgroundMusic.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

function playMusic() {
    if (backgroundMusic && !musicPlaying) {
        backgroundMusic.play();
        musicPlaying = true;
        document.getElementById('pauseMusicButton').textContent = '🌠';
    }
}

function pauseMusic() {
    if (backgroundMusic && musicPlaying) {
        backgroundMusic.pause();
        musicPlaying = false;
        document.getElementById('pauseMusicButton').textContent = '💫';
    }
}

function setGoalActivities() {
    const goalInput = document.getElementById('activityGoal');
    const inputValue = parseInt(goalInput.value, 10);
    if (inputValue > 0 && Number.isInteger(inputValue)) {
        goalActivities = inputValue;
    } else {
        goalActivities = 0;
    }
    updateLoadingBar(activityCount);
    const wordInput = prompt("Enter a word to display:");
    if (wordInput) {
        flashingWord = wordInput;
        document.getElementById('flashingWord').textContent = flashingWord;
    }
}

function setupFlashingWord() {
    setInterval(() => {
        document.getElementById('flashingWord').classList.toggle('fade');
    }, 1000);
}

function showStars() {
    const checklist = document.getElementById('checklist');
    checklist.innerHTML = '';
    for (let i = 0; i < activityCount; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        checklist.appendChild(star);
    }
}

window.onload = function() {
    setInterval(updateDigitalClock, 1000);
    backgroundMusic = document.getElementById('backgroundMusic');
    document.getElementById('toggleButton').onclick = toggleTimers;
    document.getElementById('resetProgressButton').onclick = resetProgress;
    document.getElementById('setGoalButton').onclick = setGoalActivities;
    document.getElementById('selectMusicButton').onclick = selectMusic;
    document.getElementById('pauseMusicButton').onclick = toggleMusic;
    setupFlashingWord();
};
