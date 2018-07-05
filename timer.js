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
audio[0]=new Audio();
audio[0].src="mp3/01_countdown.mp3";
audio[1]=new Audio();
audio[1].src="mp3/02_draft.mp3";
audio[2]=new Audio();
audio[2].src="mp3/03_pickup.mp3";
audio[3]=new Audio();
audio[3].src="mp3/04_pickcheck.mp3";

var picktime = [40,40,35,30,25,25,20,15,10,10,5,5,5,0];
var cnt=0;
var npick=0;
var ncheck=0;

function picktimer(npick)
{
  cnt = npick;
  audio[0].load();
  audio[1].load();
  audio[2].play();
  slidesw();
}

function checktimer(ncheck)
{
  //チェックタイム
  cnt = ncheck;
  audio[0].load();
  audio[3].play();
  slidesw();
}

function slidesw()
{
  //getElementByIdが使える場合のみ後の処理をする
  if(document.getElementById)
  {
    //スライド中はボタンを押せなくする
    //document.slide.elements[0].disabled=true;
    //id属性が「sd」の画像タグの画像パスを切り替える
    var left = Math.floor((cnt / 10) % 10);
    var right = Math.floor(cnt % 10);
    document.getElementById("left").src = image[left].src;
    document.getElementById("right").src = image[right].src;

    //一つ画像を表示したらカウント用変数cntの値を＋１にする
    cnt--;
    if( cnt <= 9){
      audio[0].play();
    }
    
    if(cnt == -1){
      audio[1].play();
    }
      
    //画像が最後まで表示されたか確認
    if( cnt >= 0 )
    {
      //まだ表示されていなければ、setTimeout()で次の画像を表示する
      var timer1=setTimeout("slidesw()",1000);
    }
    else
    {
      //全て表示されていたら、ボタンを押せるようにして、タイマーを停止する
      //document.slide.elements[0].disabled=false;
      //clearTimeout(timer1);
      npick++;
      var timer2=setTimeout("picktimer(picktime[npick])",5000);
    }

    //clearTimeout(timer2);
  }
}