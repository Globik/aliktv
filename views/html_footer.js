
const { vk, telega } = require('../config/app.json');
const html_footer = n=>{let a = new Date();
return `<!-- html_footer.js -->
<section id="socseti"><header><b>Я в соцсетях</b></header>
<a href="${vk}"><img src="/images/vk.png"></a>
<a href="${telega}"><img src="/images/telegram-64x64.png"></a>
</section>
<section><span>&#9400; 2020 - </span><span>${a.getFullYear()}г.</span></section>

<!-- html_footer.js -->
`;
}
module.exports = { html_footer };
