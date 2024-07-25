// Audio files
const audio = [
  new Audio('mp3/01_countdown.mp3'),
  new Audio('mp3/02_draft.mp3'),
  new Audio('mp3/03_pickup.mp3'),
  new Audio('mp3/04_pickcheck.mp3')
];

let picktime = [40, 40, 35, 30, 25, 25, 20, 20, 15, 10, 10, 5, 5, 5, 5];
let cnt = 0;
let npick = 0;
let interval = 5000;
let timerInterval;

function updateDisplay(time) {
  const timerDisplay = document.getElementById('timerDisplay');
  timerDisplay.textContent = time.toString().padStart(2, '0');
}

function picktimer(time, isMo) {
  clearInterval(timerInterval);
  cnt = time;
  if (isMo) {
      picktime = [60, 50, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 5, 5, 5];
  }
  audio[0].muted = true;
  audio[0].play();
  audio[1].muted = true;
  audio[1].play();
  audio[2].play();
  startCountdown();
}

function checktimer(time) {
  clearInterval(timerInterval);
  cnt = time;
  audio[0].muted = true;
  audio[0].play();
  audio[3].play();
  startCountdown();
}

function startCountdown() {
  updateDisplay(cnt);
  
  timerInterval = setInterval(() => {
      cnt--;
      updateDisplay(cnt);

      if (cnt <= 9 && cnt > 0) {
          audio[0].muted = false;
          audio[0].play();
      }

      if (cnt === 0) {
          clearInterval(timerInterval);
          audio[1].muted = false;
          audio[1].play();
          npick++;
          
          if (npick < picktime.length) {
              interval = Math.max(interval - 200, 1000); // Ensure interval doesn't go below 1 second
              setTimeout(() => picktimer(picktime[npick], false), interval);
          }
      }
  }, 1000);
}

// Initialize display
updateDisplay(0);