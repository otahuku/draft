//画像を格納する配列の作成
var image = new Array();

//配列の各要素を画像に特化して、そのパスを記入
image[0]=new Image;
image[0].src="img/40.png";
image[1]=new Image();
image[1].src="img/39.png";
image[2]=new Image();
image[2].src="img/38.png";
image[3]=new Image();
image[3].src="img/37.png";
image[4]=new Image();
image[4].src="img/36.png";
image[5]=new Image();
image[5].src="img/35.png";
image[6]=new Image();
image[6].src="img/34.png";
image[7]=new Image();
image[7].src="img/33.png";
image[8]=new Image();
image[8].src="img/32.png";
image[9]=new Image();
image[9].src="img/31.png";
image[10]=new Image();
image[10].src="img/30.png";
image[11]=new Image();
image[11].src="img/29.png";
image[12]=new Image();
image[12].src="img/28.png";
image[13]=new Image();
image[13].src="img/27.png";
image[14]=new Image();
image[14].src="img/26.png";
image[15]=new Image();
image[15].src="img/25.png";
image[16]=new Image();
image[16].src="img/24.png";
image[17]=new Image();
image[17].src="img/23.png";
image[18]=new Image();
image[18].src="img/22.png";
image[19]=new Image();
image[19].src="img/21.png";
image[20]=new Image();
image[20].src="img/20.png";
image[21]=new Image();
image[21].src="img/19.png";
image[22]=new Image();
image[22].src="img/18.png";
image[23]=new Image();
image[23].src="img/17.png";
image[24]=new Image();
image[24].src="img/16.png";
image[25]=new Image();
image[25].src="img/15.png";
image[26]=new Image();
image[26].src="img/14.png";
image[27]=new Image();
image[27].src="img/13.png";
image[28]=new Image();
image[28].src="img/12.png";
image[29]=new Image();
image[29].src="img/11.png";
image[30]=new Image();
image[30].src="img/10.png";
image[31]=new Image();
image[31].src="img/09.png";
image[32]=new Image();
image[32].src="img/08.png";
image[33]=new Image();
image[33].src="img/07.png";
image[34]=new Image();
image[34].src="img/06.png";
image[35]=new Image();
image[35].src="img/05.png";
image[36]=new Image();
image[36].src="img/04.png";
image[37]=new Image();
image[37].src="img/03.png";
image[38]=new Image();
image[38].src="img/02.png";
image[39]=new Image();
image[39].src="img/01.png";
image[40]=new Image();
image[40].src="img/0.png";

var audio = new Array();
audio[0]=new Audio();
audio[0].src="mp3/01_countdown.mp3";
audio[1]=new Audio();
audio[1].src="mp3/02_draft.mp3";
audio[2]=new Audio();
audio[2].src="mp3/03_pickup.mp3";

var picktime = [0,0,5,10,15,15,20,20,25,30,30,35,35,35,40];
var cnt=0;
var npick=0;

function picktimer(npick)
{
  cnt = npick;
  audio[0].load()
  audio[1].load()
  audio[2].play();
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
    document.getElementById("sd").src = image[cnt].src;

    //一つ画像を表示したらカウント用変数cntの値を＋１にする
    cnt++;
    if( cnt >= 32){
      audio[0].play();
    }
    if( cnt == 41){
      audio[1].play();
    }
      
    //画像が最後まで表示されたか確認
    if( cnt <= 40 )
    {
      //まだ表示されていなければ、setTimeout()で次の画像を表示する
      var timer1=setTimeout("slidesw()",1000);
    }
    else
    {
      //全て表示されていたら、ボタンを押せるようにして、タイマーを停止する
      cnt=0;
      //document.slide.elements[0].disabled=false;
      clearTimeout(timer1);
      npick++;
      var timer2=setTimeout("picktimer(picktime[npick])",5000);
    }
    //clearTimeout(timer2);
  }
}