const html_head = require('./html_head.js');  
const html_nav_menu = require('./html_nav_menu.js');
const html_admin_nav_menu = require('./html_admin_nav_menu.js');
const html_footer = require('./html_footer.js');
let profiles = n=>{
const buser = n.user;
return `<!DOCTYPE html><html lang="en"><!-- profiles.js --><head>${html_head.html_head({title:"Профили", csslink:"/css/main2.css",
cssl:["/css/profiles.css"]})}
</head><body>
${n.warnig ? `<div id="warnig">${n.warnig}</div>`:''}
<nav class="back">${html_nav_menu.html_nav_menu(n)}</nav>
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap"><div id="right">
<h3>Sessions</h3>
<button onclick="get_session();">get_session</button><br>
<output id="outsession"></output>

<hr>
<form method="POST" action="/api/cb/yam">
<input type="text" name="name" placeholder="name"><input type="text" name="family" placeholder="family"><input type="submit" value="send">
</form>
<hr>
<h1>Mail test</h1>
<h4>gru5@yandex.ru</h4>
<div><input type="text" id="email_test" placeholder="email"></div>
<button onclick="send_mail(this);">send mail</button>
<hr>
</div></main>
<script src='/js/profiles.js'></script>
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}
module.exports = { profiles };
