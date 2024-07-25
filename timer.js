//画像を格納する配列の作成
var image = new Array();

//配列の各要素を画像に特化して、そのパスを記入
image[0]=new Image;
image[0].src="img/0.png";
image[1]=new Image();
image[1].src="img/1.png";
image[2]=new Image();
image[2].src="img/2.png";
image[3]=new Image();
image[3].src="img/3.png";
image[4]=new Image();
image[4].src="img/4.png";
image[5]=new Image();
image[5].src="img/5.png";
image[6]=new Image();
image[6].src="img/6.png";
image[7]=new Image();
image[7].src="img/7.png";
image[8]=new Image();
image[8].src="img/8.png";
image[9]=new Image();
image[9].src="img/9.png";

var audio = new Array();
var audioSources = [
  "mp3/01_countdown.mp3",
  "mp3/02_draft.mp3",
  "mp3/03_pickup.mp3",
  "mp3/04_pickcheck.mp3"
];

var picktime=[40,40,35,30,25,25,20,20,15,10,10,5,5,5,5];
var cnt=0;
var npick=0;
var ncheck=0;
var interval=5000;
var audioInitialized = false;

function initializeAudio() {
  if (!audioInitialized) {
    audioSources.forEach((src, index) => {
      audio[index] = new Audio(src);
      audio[index].load();
    });
    audioInitialized = true;
  }
}

function playAudio(index, muted = false) {
  if (audio[index]) {
    audio[index].muted = muted;
    audio[index].currentTime = 0;
    audio[index].play().catch(e => console.error("Audio play failed", e));
  }
}

function picktimer(npick, isMo)
{
  initializeAudio();
  cnt = npick;
  if(isMo){
    picktime=[60,50,50,45,40,35,30,25,20,15,10,5,5,5,5];
  }
  playAudio(0, true);
  playAudio(1, true);
  playAudio(2);
  slidesw();
}

function checktimer(ncheck)
{
  initializeAudio();
  cnt = ncheck;
  playAudio(0, true);
  playAudio(3);
  slidesw();
}

function slidesw()
{
  if(document.getElementById)
  {
    var left = Math.floor((cnt / 10) % 10);
    var right = Math.floor(cnt % 10);
    document.getElementById("left").src = image[left].src;
    document.getElementById("right").src = image[right].src;

    cnt--;
    if( cnt <= 9 && cnt >= 0){
      playAudio(0);
    }
    
    if(cnt == -1){
      playAudio(1);
    }
      
    if( cnt >= 0 )
    {
      setTimeout(slidesw, 1000);
    }
    else
    {
      npick++;
      
      interval = Math.max(interval - 200, 1000);
      setTimeout(() => picktimer(picktime[npick]), interval);
    }
  }
}

// ユーザーインタラクション後に音声を初期化
document.addEventListener('click', initializeAudio, { once: true });

// 初期表示
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("left").src = image[0].src;
  document.getElementById("right").src = image[0].src;
});