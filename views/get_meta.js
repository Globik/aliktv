const get_meta = n=>{
	return `<!-- get_meta.js -->
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="${n.title}" />
<meta property="og:url" content="${n.url}" />
<meta property="og:image" content="${n.image}" />
<meta property="og:description" content="${n.description}" />

<meta property="og:site_name" content="${n.site_name}" />
<meta itemprop="name" content="${n.title}" />
<meta itemprop="description" content="${n.description}" />`;
}
module.exports = { get_meta }
