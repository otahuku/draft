// 画像を格納する配列の作成
const images = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `img/${i}.png`;
  return img;
});

// 音声ファイルの設定
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
  const left = Math.floor(time / 10);
  const right = time % 10;
  const leftElement = document.getElementById("left");
  const rightElement = document.getElementById("right");
  
  if (leftElement && rightElement) {
      leftElement.src = images[left].src;
      rightElement.src = images[right].src;
  }
}

function playAudio(index, muted = false) {
  if (audio[index]) {
      audio[index].muted = muted;
      audio[index].currentTime = 0;
      audio[index].play().catch(e => console.error('Audio playback failed', e));
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
  slidesw();
}

function checktimer(time) {
  clearInterval(timerInterval);
  cnt = time;
  playAudio(0, true);
  playAudio(3);
  slidesw();
}

function slidesw() {
  updateDisplay(cnt);
  
  cnt--;
  if (cnt <= 9 && cnt >= 0) {
      playAudio(0);
  }
  
  if (cnt === -1) {
      playAudio(1);
  }
  
  if (cnt >= 0) {
      timerInterval = setTimeout(slidesw, 1000);
  } else {
      npick++;
      if (npick < picktime.length) {
          interval = Math.max(interval - 200, 1000);
          setTimeout(() => picktimer(picktime[npick], false), interval);
      }
  }
}

// 初期表示
document.addEventListener('DOMContentLoaded', () => {
  updateDisplay(0);
});