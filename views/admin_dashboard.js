//d.js
//admin_dashboard.js
const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
//const vert_menu=require('./vert_menu.js');
const {js_help}=require('../libs/helper.js');
let admin_dashboard = n=> {
const buser=n.user;
return `<!DOCTYPE html><!-- admin_dashboard.js -->
<html lang="en">
<head>${html_head.html_head({title:"Dashboard", csslink:"/css/main2.css",cssl:["/css/admin_dashboard.css"]})}
<style>
.is_test_btc{background:lightgreen;}
.red{color:red;}
</style>
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole == 'superadmin') ? html_admin_nav_menu.html_admin_nav_menu({}):``)}
<main id="pagewrap">

<div id="right">
hallo ${buser.bname}<br>

<br><hr><section class="sec">
<label>If btc pay enabled? <span id="btc_enabled_span">${n.btc_pay}</span></label><br>
<input id="btcPayInput" type="checkbox" ${n.btc_pay?"checked":""} onchange="is_btc_enabled(this);"></section>
<hr><section class="sec">
<label>If test btc? <span id="btc_test">${n.is_test_btc}</span></label><br>
<input type="checkbox" ${n.is_test_btc?"checked":""} onchange="set_btc_pay(this);">
</section>
<hr>
<section class="sec">
<div id="div_test_btc" class="${n.is_test_btc?'is_test_btc':''}">
<label id="lbtctest">Your test btc address:</label><br>
<!-- 
real BTC
1H2k4KVqXba7a7dZwXmhS8rr1soAEdi1Xy
-->
<!-- tBTC mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE     mod5SqVGMgNJPfS3v6KFKhW8iR7KjexfBE -->
<input id="test_btc_address" type="text" maxlength="35" spellcheck="false" autocomplete="off" 
value="${n.test_btc_address?n.test_btc_address:''}" placeholder="your test btc address">
<button id="saveTestBtcBtn" ${n.test_btc_address?'disabled':''}>save</button>&nbsp;&nbsp;<button onclick="reset_test_btc_adr();">reset</button>
</div></section><hr>
<section class="sec"><div id="div_real_btc" class="${n.is_test_btc?'':'is_test_btc'}">
<label id="lbtcreal">Your real btc address:</label><br>
<input id="btc_address" type="text" maxlength="35" spellcheck="false" autocomplete="off" placeholder="your btc address"
value="${n.btc_address?n.btc_address:''}">
<button id="saveBtcBtn" ${n.btc_address?'disabled':''}>save</button>&nbsp;&nbsp;<button onclick="reset_btc_adr();">reset</button>
</div></section>
<br><label id="lproz">your procent:</label><br><input id="btc_procent" value="${n.btc_percent?n.btc_percent:10}" placeholder="10" type="text">%
<hr>
<section class="sec"><div><!-- 1H2k4KVqXba7a7dZwXmhS8rr1soAEdi1Xy -->
<input id="suka12" type="text" placeholder="your btc address" value="${n.btc_address?n.btc_address:''}">
<button onclick='d_suka(this);'>save btc address</button>
</div></section>
<section class="sec"><div>
<!-- mqwRsYbYjU19m3SP89dREEBkoNUAetf1FK -->
<input id="suka13" type="text" maxlength="35" spellcheck="false" autocomplete="off" 
value="${n.test_btc_address?n.test_btc_address:''}" placeholder="your test btc address">
<button onclick='d_suka2(this);'>save test btc address</button>
</div>
</div></section><hr>
<section class="sec">
<label>If fakes enabled? <span id="fakes_enabled_span">${n.is_fakes_enabled}</span></label><br>
<input id="fakesInput" type="checkbox" ${n.is_fakes_enabled ? "checked" : ""} onchange="set_fakes_enabled(this);">
</section><hr>
</main>
${js_help(["/js/adm_btc_pay.js"])}
<footer id="footer">${html_footer.html_footer({banner:n.banner})}</footer></body></html>`;
}

module.exports={admin_dashboard};
