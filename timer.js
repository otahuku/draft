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

function updateDisplay(time) {
  const left = Math.floor(time / 10);
  const right = time % 10;
  document.getElementById('left').textContent = left;
  document.getElementById('right').textContent = right;
}

function picktimer(npick, isMo) {
  cnt = npick;
  if (isMo) {
      picktime = [60, 50, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 5, 5, 5];
  }
  audio[0].muted = true;
  audio[0].play();
  audio[1].muted = true;
  audio[1].play();
  audio[2].play();
  slidesw();
}

function checktimer(ncheck) {
  cnt = ncheck;
  audio[0].muted = true;
  audio[0].play();
  audio[3].play();
  slidesw();
}

function slidesw() {
  updateDisplay(cnt);

  cnt--;
  if (cnt <= 9) {
      audio[0].muted = false;
      audio[0].play();
  }

  if (cnt === -1) {
      audio[1].muted = false;
      audio[1].play();
  }

  if (cnt >= 0) {
      setTimeout(slidesw, 1000);
  } else {
      npick++;
      interval = Math.max(interval - 200, 1000); // Ensure interval doesn't go below 1 second
      setTimeout(() => picktimer(picktime[npick]), interval);
  }
}

// Initialize display
updateDisplay(0);