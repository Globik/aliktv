//html_nav_menu.js
const { check_age } = require('../config/app.json');
const html_nav_menu = n=>{
return `<!-- html_nav_menu.js -->
<a href="/" id="aSite"><strong id="strongSite">${n.site}</strong>&nbsp;<strong id="strongWebcam">webcam</strong>
<div id="webcamBitcoin">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<g><path d="M500,148.7C306,148.7,148.7,306,148.7,500S306,851.3,500,851.3c194,0,351.3-157.3,351.3-351.3S694,148.7,500,148.7z M571.2,703.4c-4,0-8,0-12,0V794h-55.5v-90.6c-12.4,0-24.8,0-37,0V794h-55.5v-90.6c-60.7,0-107.3,0-107.3,0l1.9-58.3c0,0,31.4,0,42.5,0c11.1,0,21.3-6.5,21.3-26.8c0-20.3,0-231.1,0-245.9c0-14.8-9.2-20.3-27.7-20.3c-18.5,0-41.6,0-41.6,0v-57.3c0,0,53.3,0,110.9,0V206h55.5v88.7c13.2,0,25.7,0,37,0V206h55.5v89.8c56.5,4.8,126.9,27.2,135,86.8c9.3,68.4-46.2,96.1-46.2,96.1s74.9,17.6,74.9,93.4C722.8,647.9,684.9,703.4,571.2,703.4z"/><path d="M537.9,521.3c-16.6,0-27.7,0-27.7,0h-43.4v118.3c6,0,21.6,0,61,0c59.2,0,87.8-24,87.8-68.4C615.6,526.8,554.6,521.3,537.9,521.3z"/><path d="M588.7,405.7c0-45.3-54.6-49.9-82.3-49.9c-20,0-33.6,0-39.8,0v108.6h73.4C559.5,461.8,588.7,446.6,588.7,405.7z"/><path d="M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,949.3C251.8,949.3,50.7,748.1,50.7,500C50.7,251.8,251.8,50.7,500,50.7c248.2,0,449.3,201.2,449.3,449.3C949.3,748.2,748.2,949.3,500,949.3z"/></g>
</svg>
</div></a>

<label id="lb-menu-all" class="lb-menu-all" onclick="dowas1();">
 <div class="spinner diagonal part-1"></div>
 <div class="spinner horizontal"></div>
 <div class="spinner diagonal part-2"></div>
</label>

<ul id="miniMenu" class="">
<li><a href="/"><div class="muka"><span>Стримы</span></div></a>
<li><a href="/blog"><div class="muka"><span>Блог</span></div></a>
${n.user ? `<li><a href="/logout" id="login_pop"><div class="muka"><span>Выйти</span></div></a>` :
`<li><a href="/login"><div class="muka"><span>Войти</span></div></a>`}
${!n.user ? '<li><a href="/signup"><div class="muka"><span>Регистрация</span></div></a>' : ''}
</ul>

<a href="#." class="overlay" id="message_box"></a>
<output id="out_box" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<div id="inbox"></div>
</output>
${check_age?`
<a href="#.+" class="overlay" id="message_box2"></a>
<output id="out_box2" class="popi">
<!-- <div class="wrap-close"><a href="#." class="close"></a></div> -->
<div id="inbox2">Вам исполнилось 18 лет? | Are you 18?</div>
<button class="yesno" onclick="say_no();">нет | no</button><button class="yesno" onclick="say_yes();">да | yes</button>
</output>
<dialog  id="dialogConfirm2">
<div id="inbox32">Вам исполнилось 18 лет? Are you 18?</div>
<form id="dialogForm2" method="dialog" style="display:nne;">
<button type="submit" value="false">нет  no</button><button type="submit" value="true">да | yes</button>
</form>
</dialog>
`:''}
<dialog  id="dialogConfirm">
<div id="inbox3"></div>
<form id="dialogForm" method="dialog" style="display:nne;">
<button id="dialogCancelbtn" type="reset" onclick="dialogConfirm.close();">cancel</button>
<button type="submit" value="true">yes</button><button type="submit" value="false">no</button>
</form>
</dialog>

<output class="alert" id="alert_id">
<div id="inbox2"></div>
</output>
<script src="/js/nav.js"></script><!-- end of html_nav_menu.js -->`;}
module.exports = { html_nav_menu };
