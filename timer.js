// 音声ファイルの設定
const audioFiles = [
    'mp3/01_countdown.mp3',
    'mp3/02_draft.mp3',
    'mp3/03_pickup.mp3',
    'mp3/04_pickcheck.mp3'
  ];
  
  let audio = [];
  let pickTime = [40, 40, 35, 30, 25, 25, 20, 20, 15, 10, 10, 5, 5, 5];
  let cnt = 0;
  let currentPick = 0;
  let interval = 5000; // 初期インターバル: 5000ミリ秒
  const MIN_INTERVAL = 1000; // 最小インターバル: 1000ミリ秒
  let timerInterval = null;
  let audioEnabled = false;
  let isCheckTimer = false; // チェックタイマーかどうかのフラグ
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  let audioContext, buffers = [];
  
  // カウントダウンのアニメーションフレームIDを保持する変数
  let countdownAnimationFrame = null;
  
  // 画面表示用の要素をキャッシュ
  const timerDisplay = document.getElementById('timerDisplay');
  
  function updateDisplay(time) {
    if (timerDisplay) {
      timerDisplay.textContent = String(time).padStart(2, '0');
    }
  }
  
  async function initializeAudio() {
    if (isIOS) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      buffers = await Promise.all(audioFiles.map(loadAudioFile));
    } else {
      audio = audioFiles.map(file => {
        const audioEl = new Audio(file);
        audioEl.load();
        return audioEl;
      });
    }
    console.log('Audio files initialized');
  }
  
  async function loadAudioFile(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  }
  
  /**
   * 指定インデックスの音声を再生する。
   * @param {number} index - 再生する音声ファイルのインデックス
   * @param {boolean} [muted=false] - ミュート再生するか否か
   */
  async function playAudio(index, muted = false) {
    if (!audioEnabled) {
      console.log('Audio not enabled, skipping playback');
      return;
    }
    if (isIOS) {
      const buffer = buffers[index];
      if (buffer) {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        if (!muted) source.connect(audioContext.destination);
        source.start(0);
        console.log(`Playing audio ${index} on iOS`);
        await new Promise(resolve => source.onended = resolve);
      } else {
        console.error(`Audio buffer at index ${index} not found`);
      }
    } else {
      const audioEl = audio[index];
      if (audioEl) {
        audioEl.muted = muted;
        audioEl.currentTime = 0;
        try {
          await audioEl.play();
          console.log(`Playing audio ${index}`);
        } catch (error) {
          console.error('Audio playback failed', error);
        }
      } else {
        console.error(`Audio file at index ${index} not found`);
      }
    }
  }
  
  function pickTimer(isMobile) {
    clearInterval(timerInterval);
    if (isMobile) {
      pickTime = [60, 50, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 5, 5];
    }
    cnt = pickTime[currentPick];
    isCheckTimer = false;
    console.log(`Starting pick timer: ${cnt} seconds`);
  
    // ピックアップ音再生後にカウントダウン開始
    playAudio(2).catch(err => console.error('Failed to play pickup sound', err));
    startCountdown();
  }
  
  function checkTimer(time) {
    clearInterval(timerInterval);
    cnt = time;
    currentPick = 0; // チェックタイマー開始時にリセット
    interval = 5000;
    isCheckTimer = true;
    console.log(`Starting check timer: ${cnt} seconds`);
  
    // チェック音再生後にカウントダウン開始
    playAudio(3).catch(err => console.error('Failed to play check sound', err));
    startCountdown();
  }
  
  async function playDraftSoundAndProceed() {
    console.log('Attempting to play draft sound');
    try {
      await playAudio(1);
      console.log('Draft sound played successfully');
    } catch (error) {
      console.error('Failed to play draft sound', error);
    }
    proceedToNextPick();
  }
  
  function proceedToNextPick() {
    if (!isCheckTimer) {
      currentPick++;
      if (currentPick < pickTime.length) {
        interval = Math.max(interval - 300, MIN_INTERVAL);
        console.log(`Next pick: ${currentPick}, Next time: ${pickTime[currentPick]}s, Interval: ${interval}ms`);
        setTimeout(() => pickTimer(false), interval);
      } else {
        console.log('All picks completed');
        updateDisplay(0);
        currentPick = 0;
        interval = 5000;
      }
    } else {
      updateDisplay(0);
    }
  }
  
  function startCountdown() {
    // すでにカウントダウンが動作していればキャンセルする
    if (countdownAnimationFrame) {
      cancelAnimationFrame(countdownAnimationFrame);
      countdownAnimationFrame = null;
    }
    
    const startTime = Date.now();
    let lastSecond = cnt;
  
    function tick() {
      const elapsedTime = Date.now() - startTime;
      const secondsElapsed = Math.floor(elapsedTime / 1000);
      const currentSecond = Math.max(cnt - secondsElapsed, 0);
  
      if (currentSecond !== lastSecond) {
        lastSecond = currentSecond;
        updateDisplay(currentSecond);
        if (currentSecond < 10 && currentSecond !== 0) {
          playAudio(0).catch(err => console.error('Failed to play countdown sound', err));
        }
      }
  
      if (currentSecond > 0) {
        countdownAnimationFrame = requestAnimationFrame(tick);
      } else {
        countdownAnimationFrame = null;
        playDraftSoundAndProceed();
      }
    }
  
    updateDisplay(cnt); // 初期表示更新
    countdownAnimationFrame = requestAnimationFrame(tick);
  }
  
  // 初期化と初期表示
  document.addEventListener('DOMContentLoaded', async () => {
    await initializeAudio();
    updateDisplay(0);
  
    // 音声有効化ボタンの作成
    const enableAudioButton = document.createElement('button');
    enableAudioButton.textContent = '音声を有効化';
    enableAudioButton.className = 'btn bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded';
    enableAudioButton.onclick = async function() {
      if (isIOS) await audioContext.resume();
      audioEnabled = true;
      this.style.display = 'none';
      console.log('Audio enabled');
    };
    document.querySelector('.container').prepend(enableAudioButton);
  
    // ユーザーのタッチで音声有効化（iOS対応）
    document.body.addEventListener('touchstart', async function() {
      if (!audioEnabled && isIOS) {
        await audioContext.resume();
        audioEnabled = true;
        console.log('Audio enabled by touch');
      }
    }, { once: true });
  });
  