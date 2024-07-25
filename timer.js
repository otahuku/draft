// 音声ファイルの設定
const audioFiles = [
  'mp3/01_countdown.mp3',
  'mp3/02_draft.mp3',
  'mp3/03_pickup.mp3',
  'mp3/04_pickcheck.mp3'
];

let audio = [];
let picktime = [40, 40, 35, 30, 25, 25, 20, 20, 15, 10, 10, 5, 5, 5, 5];
let cnt = 0;
let npick = 0;
let interval = 5000; // 初期インターバルを5000ミリ秒（5秒）に設定
const MIN_INTERVAL = 1000; // 最小インターバルを1000ミリ秒（1秒）に設定
let timerInterval;
let audioEnabled = false;
let isCheckTimer = false; // チェックタイマーかどうかのフラグ

// iOS判定（ChromeとSafariの両方に対応）
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// 音声ファイルの読み込みと初期化
function initializeAudio() {
  audio = audioFiles.map(file => {
      const audioElement = new Audio(file);
      audioElement.load();
      return audioElement;
  });
  console.log('Audio files initialized');
}

function updateDisplay(time) {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
      timerDisplay.textContent = time.toString().padStart(2, '0');
  }
}

function playAudio(index, muted = false) {
  if (!audioEnabled) {
      console.log('Audio not enabled');
      return Promise.resolve(); // 音声が有効でない場合は即座に解決するPromiseを返す
  }
  if (audio[index]) {
      audio[index].muted = muted;
      audio[index].currentTime = 0;
      return audio[index].play()
          .then(() => console.log(`Playing audio ${index}`))
          .catch(error => {
              console.error('Audio playback failed', error);
              // エラーが発生しても処理を続行するためにresolveしたPromiseを返す
              return Promise.resolve();
          });
  } else {
      console.error(`Audio file at index ${index} not found`);
      return Promise.resolve(); // 音声ファイルが見つからない場合も即座に解決するPromiseを返す
  }
}

function picktimer(isMo) {
  clearInterval(timerInterval);
  if (isMo) {
      picktime = [60, 50, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 5, 5, 5];
  }
  cnt = picktime[npick];  // 現在の npick に基づいて時間を設定
  isCheckTimer = false;
  console.log(`Starting pick timer: ${cnt} seconds`);  // デバッグ情報
  playAudio(2).then(slidesw); // ピックアップ音を鳴らした後にslidesw開始
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

function checktimer(time) {
  clearInterval(timerInterval);
  cnt = time;
  npick = 0; // チェックタイマー開始時にnpickをリセット
  interval = 5000; // インターバルをリセット
  isCheckTimer = true;
  console.log(`Starting check timer: ${cnt} seconds`);  // デバッグ情報
  playAudio(3).then(slidesw); // チェック音を鳴らした後にslidesw開始
}

function updateDisplayAndPlayAudio(time) {
  updateDisplay(time);
  if (time < 11 & cnt != 0) {
      playAudio(0); // 9秒の時点でカウントダウン音を鳴らす
  }
}

function slidesw() {
  const startTime = Date.now();
  const tick = () => {
      const elapsedTime = Date.now() - startTime;
      const secondsElapsed = Math.floor(elapsedTime / 1000);
      
      if (secondsElapsed < cnt) {
          updateDisplayAndPlayAudio(cnt - secondsElapsed);
          requestAnimationFrame(tick);
      } else if (cnt > 0) {
          cnt--;
          updateDisplayAndPlayAudio(cnt);
          setTimeout(slidesw, 1000 - (elapsedTime % 1000));
      } else {
          clearInterval(timerInterval);
          console.log('Attempting to play draft sound');
          playAudio(1)
              .then(() => {
                  console.log('Draft sound played successfully');
                  if (!isCheckTimer) {
                      npick++;
                      if (npick < picktime.length) {
                          interval = Math.max(interval - 200, MIN_INTERVAL);
                          console.log(`Next pick: ${npick}, Next time: ${picktime[npick]}s, Interval: ${interval}ms`);
                          setTimeout(() => picktimer(picktime[npick], false), interval);
                      } else {
                          console.log('All picks completed');
                          updateDisplay(0);
                          npick = 0;
                          interval = 5000;
                      }
                  } else {
                      updateDisplay(0);
                  }
              })
              .catch(error => {
                  console.error('Failed to play draft sound', error);
                  // エラーが発生しても次の処理を続行
                  // ... (エラー処理のコードは前回と同じ)
              });
      }
  };
  
  tick();
}

function enableAudio() {
  audioEnabled = true;
  return Promise.all(audio.map(a => {
      return a.play().then(() => {
          a.pause();
          a.currentTime = 0;
      }).catch(e => console.error('Error enabling audio:', e));
  })).then(() => {
      console.log('Audio enabled');
  }).catch(error => {
      console.error('Failed to enable audio', error);
  });
}

// 初期化と初期表示
document.addEventListener('DOMContentLoaded', () => {
  initializeAudio();
  updateDisplay(0);
  
  const enableAudioButton = document.createElement('button');
  enableAudioButton.textContent = '音声を有効化';
  enableAudioButton.className = 'btn bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded';
  enableAudioButton.onclick = function() {
      enableAudio().then(() => {
          this.style.display = 'none';
          audioEnabled = true;
          console.log('Audio enabled by button click');
      });
  };
  document.querySelector('.container').prepend(enableAudioButton);

  // すべての環境で最初のユーザーインタラクションで音声を有効化
  document.body.addEventListener('click', function() {
      if (!audioEnabled) {
          enableAudio().then(() => {
              console.log('Audio enabled by body click');
          });
      }
  }, { once: true });
});

// デバッグ用の関数
function debugAudio() {
  console.log('Audio enabled:', audioEnabled);
  console.log('Audio objects:', audio);
  audio.forEach((a, index) => {
      console.log(`Audio ${index}: readyState=${a.readyState}, paused=${a.paused}, muted=${a.muted}`);
  });
}

// コンソールからdebugAudio()を呼び出すことでオーディオの状態を確認できます