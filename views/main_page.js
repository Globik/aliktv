const html_head = require('./html_head');
const html_nav_menu = require('./html_nav_menu');
const icons_menu = require('./icons_menu');
const html_admin_nav_menu = require('./html_admin_nav_menu');
const html_footer = require('./html_footer');
const {get_meta}=require('./get_meta');
const redact_proto = require("./redact_proto.js");
const {check_age, site_domain} = require('../config/app.json');
const {disqus} = require('../libs/disqus.js');
function abba(){
		var x=1;
}

const main_page = function (n) {
	const buser = n.user;
	n.current = "main";

	return `<!DOCTYPE html><html lang="en"><!-- main_page.js -->
<head>${html_head.html_head({
		title: `${n.site} - webcam site для видеообщений`,
		meta:
			get_meta({
				url: n.meta.url,
				image: n.meta.image,
				site_name: n.meta.site_name,
				title: n.meta.main_page.title,
				description: n.meta.main_page.description
			}),
		csslink: "/css/main2.css", cssl: ["/css/main_page.css", "/css/mediasoup.css"], luser: buser
	})}
<!-- https://app.onesignal.com -->
${process.env.DEVELOPMENT == "yes" ? '' : '<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>'}
<script src="js/mediasoup-client.js"></script>
</head>
<body>${n.warnig ? `<div id="warnig">${n.warnig}</div>` : ''}
<div id="oldBrowser">You have the old browser. Please use the latest browsers - Firebox oder Chrome.</div>
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${icons_menu.icons_menu(n)}
${buser && buser.brole == 'superadmin' ? html_admin_nav_menu.html_admin_nav_menu(n) : ''}
${check_age ? `
<script>
function check_age(){
if(is_local_storage()){
if(localStorage.getItem('age')==1){
return;
}
}
if(is_dialogi()){
dialogConfirm2.showModal();
dialogConfirm2.onclose = function(ev){
//alert(ev.target.returnValue);
ev.target.returnValue == 'true' ? gsiska() : gpiska();
function gsiska(){set_yes();}
function gpiska(){say_no();}
}
}else{
window.location.href = "#message_box2";
var qtar = document.querySelector('.overlay:target');
if(qtar){
qtar.onclick = function(){in_rem_hash();}
}
}
}
check_age();
function say_yes(){
window.location.href = "#";
in_rem_hash();
set_yes();
}
function say_no(){
window.location.href = "https://www.yandex.ru";
}
function set_yes(){
if(is_local_storage()){
localStorage.setItem('age', 1);
}
}
</script>
` : ''}
${n.banner && n.banner.length ? `<div id="haupt-banner">${get_banner(n.banner)}</div>` : ''}

<main id="pagewrap">
<div id="right">
<section id="sectionPerson" itemscope itemtype="http://schema.org/Person">
<div id="personFotoContainer" >
<img itemprop="image" src="${process.env.DEVELOPMENT == 'yes' ? '/images/me.jpeg' : `https://${site_domain}/images/me.jpeg`}" alt="Программист Алик Гафаров" >
</div>
<div id="personInfo">
<header itemprop="name"><strong>Гафаров Алик</strong></header>
<p>
<span itemprop="jobTitle">Веб-разработчик, WebRTC-специалист, бизнес-консультант в сфере <strong>монетизаций видеостримов</strong>.</span>
<br><a itemprop="email" href="mailto:globalikslivov@gmail.com">globalikslivov@gmail.com</a>
<br>Телеграм: <a itemprop="url" href="https://t.me/Globik2">@Globik2</a>
</p>
</div>
</section>
<div id="vidCameraBtns"><button id="startMediaBtn" onclick="showAnketaForms(this);"${n.vroom ? ' disabled' : ''}>вкл вебкамеру</button>&nbsp;&nbsp;<button id="stopMediaBtn" onclick="stopMedia(this);"${n.vroom ? ' disabled' : ''}>выкл вебкамеру</button></div>

<div id="anketaForms">
 <input type="checkbox" id="use_video" checked="1">video</input>
 <input type="checkbox" id="use_audio" checked="1">audio</input>
 <!--
<div><label>Your bitcoin addresse:&nbsp;&nbsp;<input type="text" placeholder="Your bitcoin address"></label>&nbsp;&nbsp;<button>save</button></div>
<div><label>Your bank cards number:&nbsp;&nbsp;<input type="text" placeholder="Your bank card number"></label>&nbsp;&nbsp;<button>save</button></div>
<div><label>Your status:&nbsp;&nbsp;<input  type="text" placeholder="Your status"></label>&nbsp;&nbsp;<button>save</button></div>
-->
<div><button id="startTranslation" onclick="publish(this);" disabled>Запустить трансляцию</button>&nbsp;&nbsp;
<button id="stopTranslation" onclick="unpublish(this);"${n.vroom ? ' disabled' : ''}>остановить трансляцию</button></div>
</div>
${n.vroom ? `<div id="mainpanel">${n.vroom.descr}</div>` : ''}
<section id="multimedia">
<div id="chatinfo">
<div class="span"><!-- <span><b>bitcoins:</b></span><span>0</span>&nbsp;&nbsp; --><span><b>зрителей:</b></span>&nbsp;<span id="vV">${n.vroom ? n.vroom.v : 0}</span>
<!-- <span><b>chat:</b></span>&nbsp;<span id="chatCount">0</span>&nbsp;-->
</div>
<div class="imghalter2" onclick="hide_chat(this);"><img src="/images/FullScreen.png"></div>
</div>
<div id="allwrapper">

<div id="videosection">
<div id="videowrapper"><div id="knopkaSubscribe" class="knopka" onclick="subscribe(this);"><img src="/images/play2.svg"></div><video id="localVideo" poster="${n.vroom ? n.vroom.poster : '/images/tvpic.jpg'}"></video></div>
</div>

</section>
<canvas height="400" id="meter" width="100"></canvas>

<audio controls id="mum" src="/musik/ex.ogg">&nbsp;</audio>
<button id="sw">start</button>
<script>

var cnv=document.getElementById('meter');
var c=cnv.getContext('2d');


var w=100;
var h=400;
var dau=document.getElementById('mum');
//var au=new Audio();
var audio;
dau.onplay=dawaj;
 function init(){
audio=new window.AudioContext();

}

document.querySelector('#sw').addEventListener('click', dawaj, false);

function dawaj(){
	init();
  audio.resume().then(() => {
    console.log('Playback resumed successfully');
    //init();
    //requestAnimationFrame(draw);
    dau.play();
    
var analyser=audio.createAnalyser();//ScriptProcessor(1024,1,1);

var source=audio.createMediaElementSource(dau);

analyser.fftSize = 1024;
var bufferLength = analyser.fftSize;
console.log(bufferLength);
var dataArray = new Float32Array(bufferLength);


analyser.getFloatTimeDomainData(dataArray);

c.fillStyle='#555';
c.fillRect(0,0,w,h);


source.connect(audio.destination);
source.connect(analyser);
analyser.connect(audio.destination);


analyser.onaudioprocess=function(e){
	//alert(1);
	console.log('process');
		
var out=e.outputBuffer.getChannelData(0);
var int=e.inputBuffer.getChannelData(0);
var max=0;
for(var i=0;i<int.length;i++){
out[i]=0;
max=int[i]>max?int[i]:max;
}
var db=20*Math.log(Math.max(max,Math.pow(10,-72/20)))/Math.LN10;
var grad=c.createLinearGradient(w/10,h*.2,w/10,h*.95);
grad.addColorStop(0,'red');
grad.addColorStop(-6/-72,'yellow');
grad.addColorStop(1,'green');
c.fillStyle='#555';
c.fillRect(0,0,w,h);
c.fillStyle=grad;
c.fillRect(w/10,h*.8*(db/-72),w*8/10,(h*.95)-h*.8*(db/-72));
c.fillStyle='white';
c.font='Arial 12pt';
c.fillText(Math.round(db*100)/100+'dB',w/2,h-h*.025);
}
  });
}

</script>
	audio id="audio2" controls src="/musik/ex.ogg"><canvas id="cnv2"></canvas>
<script>


// Set up audio context
//window.AudioContext = window.AudioContext || window.webkitAudioContext;
//const audioContext = new AudioContext();
var audioCtx, audioCtx2;
/**
 * Retrieves audio from an external source, the initializes the drawing function
 * @param {String} url the url of the audio we'd like to fetch
 */
const drawAudio = function(url){
	//alert('draw');
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))));
}
/*
var audio = document.getElementById('audio');
audio.play();
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    */
   // var audioCtx;
    function binit(){
audioCtx=new window.AudioContext();
audioCtx2=new window.AudioContext();

}
getAudio();
    async function getAudio() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
 // const audioCtx = new AudioContext();
 binit();
 //drawAudio('/musik/ex.ogg');
 audioCtx.resume().then(function(){
	 drawAudio('/musik/ex.ogg');
  analyzer = audioCtx.createAnalyser();
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyzer);
})
}
/**
 * Filters the AudioBuffer retrieved from an external source
 * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
 * @returns {Array} an array of floating point numbers
 */
 //audio.onplay=function(e){alert(1)}
const filterData = audioBuffer => {
  const rawData = audioBuffer.getChannelData(0); // We only need to worknumbersnumbersnumbersnumbersnumbersnumbers with one channel of data
  const samples = 70; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  }
  return filteredData;
};

/**
 * Normalizes the audio data to make a cleaner illustration 
 * @param {Array} filteredData the data from filterData()
 * @returns {Array} an normalized array of floating point numbers
 */
const normalizeData = filteredData => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

/**
 * Draws the audio file into a canvas element.
 * @param {Array} normalizedData The filtered array returned from filterData()
 <script>
 * @returns {Array} a normalized array of data
 */
const draw = normalizedData => {
  //alert('set up the canvas')
  const canvas = document.getElementById("cnv2");
  const dpr = window.devicePixelRatio || 1;
  const padding = 20;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

  // draw the line segments
  const width = canvas.offsetWidth / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    const x = width * i;
    let height = normalizedData[i] * canvas.offsetHeight - padding;
    if (height < 0) {
        height = 0;
    } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, width, (i + 1) % 2);
  }
};

/**
 * A utility function for drawing our line segments
 * @param {AudioContext} ctx the audio context 
 * @param {number} x  the x coordinate of the beginning of the line segment
 * @param {number} height the desired height of the line segment
 * @param {number} width the desired width of the line segment
 * @param {boolean} isEven whether or not the segmented is even-numbered
 */
const drawLineSegment = (ctx, x, height, width, isEven) => {
  ctx.lineWidth = 1; // 
  console.log('how thick the line is');
  ctx.strokeStyle = "#fff"; // what color our line is
  ctx.beginPath();
  height = isEven ? height : -height;
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
  ctx.lineTo(x + width, 0);
  ctx.stroke();
};

//drawAudio('/musik/ex.ogg');
</script>
<article id="rArticle">
${n.art ? n.art.art : 'Пусто.'}
</article>
${buser && buser.brole == 'superadmin' ? redact_proto.redact_proto("/api/save_post_main", "main") : ''}
${buser && buser.brole == "superadmin" ? "<script src='/js/redact.js'></script>" : ""}
<hr>
Сейчас на сайте <span id="spanWhosOn">0</span> человек.<hr>
${disqus({page_id: "main"})}


</div></main>
<input type="hidden" id="buserli" value="${buser ? buser.id : 0}">
<input type="hidden" id="buserBname" value="${n.user ? n.user.bname : ''}">
<input type="hidden" id="randomString" value="${n.randomStr}">
<script src="/js/gesamt.js"></script>
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}

module.exports = {main_page};

