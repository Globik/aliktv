
const html_head = require('./html_head');
const html_nav_menu = require('./html_nav_menu');
const icons_menu = require('./icons_menu');
const html_admin_nav_menu = require('./html_admin_nav_menu');
const html_footer = require('./html_footer');
const { get_meta } = require('./get_meta');

const { check_age } = require('../config/app.json');
const board_str_ru = `Также обратите внимание на <strong>доску объявлений</strong>.
 Без регистрации и совершенно бесплатно в ней можно разместить свое объявление`;
const board_str_en = `Pay attention on the <strong>message board</strong>. You can write there your messages for free.`;

const main_page = function(n){
const { lusers } = n;
const buser = n.user, roomers = n.roomers; n.current = "main";

return `<!DOCTYPE html><html lang="en"><!-- main_page.js -->
<head>${html_head.html_head({title: `${n.site} - webcam site для видеообщений`,
 meta: 
  get_meta({
url: n.meta.url, 
image: n.meta.image,
 site_name: n.meta.site_name, 
 title: n.meta.main_page.title, 
description: n.meta.main_page.description
}),
csslink: "/css/main2.css", cssl: ["/css/main_page.css", "/css/mediasoup.css"], luser:buser})}
<!-- https://app.onesignal.com -->
${process.env.DEVELOPMENT == "yes" ? '' : '<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>'}
<script src="js/mediasoup-client.js"></script>
</head>
<body>${n.warnig ? `<div id="warnig">${n.warnig}</div>` : ''}
<div id="oldBrowser">You have the old browser. Please use the latest browsers - Firebox oder Chrome.</div>
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${icons_menu.icons_menu(n)}
${buser && buser.brole == 'superadmin' ?  html_admin_nav_menu.html_admin_nav_menu(n) : ''}
${check_age?`
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

${n.m ? n.m.msg : ''}


<div><button onclick="showAnketaForms(this);">вкл вебкамеру</button>&nbsp;&nbsp;<button onclick="stopMedia();">выкл вебкамеру</button></div>

<div id="anketaForms">
 <input type="checkbox" id="use_video" checked="1">video</input>
 <input type="checkbox" id="use_audio" checked="1">audio</input>
<div><label>Your bitcoin addresse:&nbsp;&nbsp;<input type="text" placeholder="Your bitcoin address"></label>&nbsp;&nbsp;<button>save</button></div>
<div><label>Your bank cards number:&nbsp;&nbsp;<input type="text" placeholder="Your bank card number"></label>&nbsp;&nbsp;<button>save</button></div>
<div><label>Your status:&nbsp;&nbsp;<input  type="text" placeholder="Your status"></label>&nbsp;&nbsp;<button>save</button></div>
<div><button id="startTranslation" onclick="publish(this);">Запустить трансляцию</button>&nbsp;&nbsp;<button id="stopTranslation" onclick="unpublish();">остановить трансляцию</button></div>
</div>
<div id="mainpanel">here is my status</div>
<section id="multimedia">
<div id="chatinfo">
<div class="span"><span><b>bitcoins:</b></span><span>0</span>&nbsp;&nbsp;<span><b>viewers:</b></span>&nbsp;<span>0</span>
<span><b>chat:</b></span>&nbsp;<span id="chatCount">0</span>&nbsp;
</div>
<div class="imghalter2" onclick="hide_chat(this);"><img src="/images/FullScreen.png"></div>
</div>
<div id="allwrapper">

<div id="videosection">
	<div id="videowrapper"><div class="knopka" onclick="subscribe(this);"><img src="/images/play2.svg"></div><video id="localVideo" poster="/images/tvpic.jpg"></video></div>

</div>





<hr>




</div></main>
<input type="hidden" id="buserli" value="${buser ? buser.id : 0}">
<input type="hidden" id="buserBname" value="${n.user ? n.user.bname : ''}">
<input type="hidden" id="randomString" value="${n.randomStr}">
<script src="/js/gesamt.js"></script>
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;}

module.exports = { main_page };

