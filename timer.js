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
let timerInterval;
let audioEnabled = false;

// iOS判定
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
  if (!audioEnabled && isIOS) {
      console.log('Audio not enabled on iOS');
      return;
  }
  if (audio[index]) {
      audio[index].muted = muted;
      audio[index].currentTime = 0;
      const playPromise = audio[index].play();
      if (playPromise !== undefined) {
          playPromise.then(_ => {
              console.log(`Playing audio ${index}`);
          }).catch(error => {
              console.error('Audio playback failed', error);
          });
      }
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
  npick = 0; // npickをリセット
  playAudio(2); // ピックアップ音を鳴らす
  slidesw();
}

function checktimer(time) {
  clearInterval(timerInterval);
  cnt = time;
  npick = 0; // npickをリセット
  playAudio(3); // チェック音を鳴らす
  slidesw();
}

function slidesw() {
  updateDisplay(cnt);
  
  if (cnt === 9) {
      playAudio(0); // 9秒の時点でカウントダウン音を鳴らす
      console.log('Attempting to play countdown sound');
  }
  
  if (cnt > 0) {
      timerInterval = setTimeout(() => {
          cnt--;
          slidesw();
      }, 1000);
  } else {
      playAudio(1); // ドラフト音を鳴らす
      console.log('Attempting to play draft sound');
      npick++;
      if (npick < picktime.length) {
          setTimeout(() => picktimer(picktime[npick], false), 5000); // 5秒後に次のカウントダウン
      } else {
          updateDisplay(0); // 全てのカウントダウンが終了したら0を表示
      }
  }
}

// 初期化と初期表示
document.addEventListener('DOMContentLoaded', () => {
  initializeAudio();
  updateDisplay(0);
  
  // iOS向けの音声有効化ボタンを追加
  if (isIOS) {
      const enableAudioButton = document.createElement('button');
      enableAudioButton.textContent = '音声を有効化';
      enableAudioButton.className = 'btn bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded';
      enableAudioButton.onclick = function() {
          audioEnabled = true;
          audio.forEach(a => a.play().then(() => a.pause()).catch(e => console.error('Error enabling audio:', e)));
          this.style.display = 'none';
          console.log('Audio enabled on iOS');
      };
      document.querySelector('.container').prepend(enableAudioButton);
  } else {
      audioEnabled = true;
  }
});