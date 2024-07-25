// 音声ファイルの設定
const audioFiles = [
  'mp3/01_countdown.mp3',
  'mp3/02_draft.mp3',
  'mp3/03_pickup.mp3',
  'mp3/04_pickcheck.mp3'
];

let audio = [];
let picktime = [40, 40, 35, 30, 25, 25, 20, 20, 15, 10, 10, 5, 5, 5];
let cnt = 0;
let npick = 0;
let interval = 5000; // 初期インターバルを5000ミリ秒（5秒）に設定
const MIN_INTERVAL = 1000; // 最小インターバルを1000ミリ秒（1秒）に設定
let timerInterval;
let audioEnabled = false;
let isCheckTimer = false; // チェックタイマーかどうかのフラグ

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
let audioContext;
let buffers = [];

// 音声ファイルの読み込みと初期化
async function initializeAudio() {
  if (isIOS) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      buffers = await Promise.all(audioFiles.map(loadAudioFile));
  } else {
      audio = audioFiles.map(file => {
          const audioElement = new Audio(file);
          audioElement.load();
          return audioElement;
      });
  }
  console.log('Audio files initialized');
}

async function loadAudioFile(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

function updateDisplay(time) {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
      timerDisplay.textContent = time.toString().padStart(2, '0');
  }
}

function playAudio(index, muted = false) {
  return new Promise((resolve, reject) => {
      if (!audioEnabled) {
          console.log('Audio not enabled, skipping playback');
          resolve();
          return;
      }
      if (isIOS) {
          if (buffers[index]) {
              const source = audioContext.createBufferSource();
              source.buffer = buffers[index];
              if (!muted) {
                  source.connect(audioContext.destination);
              }
              source.onended = resolve;
              source.start(0);
              console.log(`Playing audio ${index} on iOS`);
          } else {
              console.error(`Audio buffer at index ${index} not found`);
              resolve();
          }
      } else {
          if (audio[index]) {
              audio[index].muted = muted;
              audio[index].currentTime = 0;
              audio[index].play()
                  .then(() => {
                      console.log(`Playing audio ${index}`);
                      resolve();
                  })
                  .catch(error => {
                      console.error('Audio playback failed', error);
                      resolve();
                  });
          } else {
              console.error(`Audio file at index ${index} not found`);
              resolve();
          }
      }
  });
}

function picktimer(isMo) {
  clearInterval(timerInterval);
  if (isMo) {
      picktime = [60, 50, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 5, 5];
  }
  cnt = picktime[npick];
  isCheckTimer = false;
  console.log(`Starting pick timer: ${cnt} seconds`);
  
  // ピックアップ音を鳴らしつつ、即座にカウントダウンを開始
  playAudio(2).catch(error => console.error('Failed to play pickup sound', error));
  slidesw();
}

function checktimer(time) {
  clearInterval(timerInterval);
  cnt = time;
  npick = 0; // チェックタイマー開始時にnpickをリセット
  interval = 5000; // インターバルをリセット
  isCheckTimer = true;
  console.log(`Starting check timer: ${cnt} seconds`);
  
  // チェック音を鳴らしつつ、即座にカウントダウンを開始
  playAudio(3).catch(error => console.error('Failed to play check sound', error));
  slidesw();
}

function playDraftSoundAndProceed() {
  console.log('Attempting to play draft sound');
  playAudio(1)
      .then(() => {
          console.log('Draft sound played successfully');
          proceedToNextPick();
      })
      .catch(error => {
          console.error('Failed to play draft sound', error);
          proceedToNextPick(); // エラーが発生しても次の処理を続行
      });
}

function proceedToNextPick() {
  if (!isCheckTimer) {
      npick++;
      if (npick < picktime.length) {
          interval = Math.max(interval - 200, MIN_INTERVAL);
          console.log(`Next pick: ${npick}, Next time: ${picktime[npick]}s, Interval: ${interval}ms`);
          setTimeout(() => picktimer(false), interval);
      } else {
          console.log('All picks completed');
          updateDisplay(0);
          npick = 0; // npickをリセット
          interval = 5000; // インターバルをリセット
      }
  } else {
      updateDisplay(0);
  }
}

function slidesw() {
  const startTime = Date.now();
  let lastSecond = cnt;

  const tick = () => {
      const elapsedTime = Date.now() - startTime;
      const secondsElapsed = Math.floor(elapsedTime / 1000);
      const currentSecond = Math.max(cnt - secondsElapsed, 0);
      
      if (currentSecond !== lastSecond) {
          lastSecond = currentSecond;
          updateDisplay(currentSecond);
          if (currentSecond < 11 & currentSecond != 0) {
              playAudio(0).catch(error => console.error('Failed to play countdown sound', error));
          }
      }

      if (currentSecond > 0) {
          requestAnimationFrame(tick);
      } else {
          playDraftSoundAndProceed();
      }
  };
  
  updateDisplay(cnt); // 即座に初期表示を更新
  tick();
}

// 初期化と初期表示
document.addEventListener('DOMContentLoaded', async () => {
  await initializeAudio();
  updateDisplay(0);
  
  const enableAudioButton = document.createElement('button');
  enableAudioButton.textContent = '音声を有効化';
  enableAudioButton.className = 'btn bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded';
  enableAudioButton.onclick = async function() {
      if (isIOS) {
          await audioContext.resume();
      }
      audioEnabled = true;
      this.style.display = 'none';
      console.log('Audio enabled');
  };
  document.querySelector('.container').prepend(enableAudioButton);

  // ユーザーインタラクションで音声を有効化
  document.body.addEventListener('touchstart', async function() {
      if (!audioEnabled && isIOS) {
          await audioContext.resume();
          audioEnabled = true;
          console.log('Audio enabled by touch');
      }
  }, { once: true });
});

// デバッグ用の関数
function debugAudio() {
  console.log('Audio enabled:', audioEnabled);
  console.log('Is iOS:', isIOS);
  if (isIOS) {
      console.log('AudioContext state:', audioContext.state);
      console.log('Buffers loaded:', buffers.length);
  } else {
      console.log('Audio objects:', audio);
      audio.forEach((a, index) => {
          console.log(`Audio ${index}: readyState=${a.readyState}, paused=${a.paused}, muted=${a.muted}`);
      });
  }
}

function debugTimer() {
  console.log('Current pick:', npick);
  console.log('Current time:', cnt);
  console.log('Next pick time:', picktime[npick + 1]);
  console.log('Interval:', interval);
  console.log('Is check timer:', isCheckTimer);
}