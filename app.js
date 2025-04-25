const bells = new Audio('./sounds/bell.wav');
const startBtn = document.querySelector('.btn-start');
const stopBtn = document.querySelector('.btn-stop');
const resetBtn = document.querySelector('.btn-reset');
const session = document.querySelector('.minutes');
let myInterval;
let state = true;
let totalSeconds;
let isPaused = false;
let savedSeconds;
let currentAudio = null;

// Function for tracks of music
const tracks = {
    rain: new Audio('./resources/lofi-rain-198277.mp3'),
    background: new Audio('./resources/lofi-background-music-314199.mp3'),
    chill: new Audio('./resources/kitte-bitsu-01-pioggia-chill-lofi-relax-328128.mp3')
};

Object.values(tracks).forEach(track => {
    track.loop = true;
});

// Function to create the music popup
const createMusicPopup = () => {
    const popup = document.createElement('div');
    popup.className = 'music-popup';
    popup.innerHTML = `
        <h3>Background Music</h3>
        <div class="track-container">
            <span class="track-name">Lofi Rain</span>
            <button class="play-button" data-track="rain">▶️ Play</button>
        </div>
        <div class="track-container">
            <span class="track-name">Lofi Background</span>
            <button class="play-button" data-track="background">▶️ Play</button>
        </div>
        <div class="track-container">
            <span class="track-name">Chill Lofi</span>
            <button class="play-button" data-track="chill">▶️ Play</button>
        </div>
    `;
    document.body.appendChild(popup);

    popup.addEventListener('click', (e) => {
        if (e.target.classList.contains('play-button')) {
            const trackName = e.target.dataset.track;
            const track = tracks[trackName];
            
            // Se la traccia corrente è quella cliccata
            if (currentAudio === track && !track.paused) {
                track.pause();
                e.target.textContent = '▶️ Play';
                currentAudio = null;
            } else {
                // Ferma qualsiasi altra traccia in riproduzione
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    document.querySelectorAll('.play-button').forEach(btn => {
                        btn.textContent = '▶️ Play';
                    });
                }
                // Avvia la nuova traccia
                track.play();
                e.target.textContent = '⏹️ Stop';
                currentAudio = track;
            }
        }
    });
};

//Function to pause the timer
const stopTimer = () => {
    clearInterval(myInterval);
    state = true;
    isPaused = true;
    savedSeconds = totalSeconds; 
};

// Function to reset the timer
const resetTimer = () => {
    stopTimer();
    document.querySelector('.minutes').textContent = '25';
    document.querySelector('.seconds').textContent = '00';
};

// Function to update the timer
const updateSeconds = () => {
    const minuteDiv = document.querySelector('.minutes');
    const secondDiv = document.querySelector('.seconds');
    
    totalSeconds--;
    let minutesLeft = Math.floor(totalSeconds / 60);
    let secondsLeft = totalSeconds % 60;
    
    if (secondsLeft < 10) {
        secondDiv.textContent = '0' + secondsLeft;
    } else {
        secondDiv.textContent = secondsLeft;
    }
    
    minuteDiv.textContent = `${minutesLeft}`;
    
    if (minutesLeft === 0 && secondsLeft === 0) {
        bells.play();
        clearInterval(myInterval);
        state = true;
    }
};

// Function to start the timer
const appTimer = () => {
    if (state) {
        state = false;
        totalSeconds = isPaused ? savedSeconds : Number.parseInt(session.textContent) * 60;
        isPaused = false;
        myInterval = setInterval(updateSeconds, 1000);
    } else {
        alert('Session has already started.');
    }
};

// Function to handle the Enter key for starting the timer
document.addEventListener('DOMContentLoaded', () => {
    createMusicPopup();
    startBtn.addEventListener('click', appTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
});
