// Audio files
const audioFiles = [
  'mp3/01_countdown.mp3',
  'mp3/02_draft.mp3',
  'mp3/03_pickup.mp3',
  'mp3/04_pickcheck.mp3'
];

const audio = audioFiles.map(file => {
  const audioElement = new Audio(file);
  audioElement.onerror = () => console.error(`Failed to load audio file: ${file}`);
  return audioElement;
});

let picktime = [40, 40, 35, 30, 25, 25, 20, 20, 15, 10, 10, 5, 5, 5, 5];
let cnt = 0;
let npick = 0;
let interval = 5000;
let timerInterval;

function updateDisplay(time) {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
      timerDisplay.textContent = time.toString().padStart(2, '0');
  } else {
      console.error('Timer display element not found');
  }
}

function playAudio(index, muted = false) {
  if (audio[index]) {
      audio[index].muted = muted;
      audio[index].play().catch(e => console.error('Audio playback failed', e));
  } else {
      console.error(`Audio file at index ${index} not found`);
  }
}

function picktimer(time, isMo) {
  clearInterval(timerInterval);
  cnt = time;
  if (isMo) {
      picktime = [60, 50, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 5, 5, 5];
  }
  playAudio(0, true);
  playAudio(1, true);
  playAudio(2);
  startCountdown();
}

function checktimer(time) {
  clearInterval(timerInterval);
  cnt = time;
  playAudio(0, true);
  playAudio(3);
  startCountdown();
}

function startCountdown() {
  updateDisplay(cnt);
  
  timerInterval = setInterval(() => {
      cnt--;
      updateDisplay(cnt);

      if (cnt <= 9 && cnt > 0) {
          playAudio(0);
      }

      if (cnt === 0) {
          clearInterval(timerInterval);
          playAudio(1);
          npick++;
          
          if (npick < picktime.length) {
              interval = Math.max(interval - 200, 1000);
              setTimeout(() => picktimer(picktime[npick], false), interval);
          }
      }
  }, 1000);
}

// Initialize display when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  updateDisplay(0);
});