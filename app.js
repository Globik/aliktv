// ssh root@45.89.66.225 (chelikon.space)
const Koa = require('koa');
const fs = require('fs');
const https = require('https');
const dkey = './data/chel_key.pem';
const dcert = './data/chel_cert.pem';
const ca = './data/chel_ca.cert';
const app = new Koa();

var HTTP_PORT = 80;
var HTTPS_PORT = 443;

if(process.env.DEVELOPMENT == "yes"){
 HTTP_PORT = 3000;
 HTTPS_PORT = 8000;
}

app.use(ctx=>{
	ctx.body = 'Hello world!';
	})

var servak;
if(process.env.DEVELOPMENT !== "yes"){
	const ssl_options = {
	key: fs.readFileSync(dkey),
	cert: fs.readFileSync(dcert),
	ca: fs.readFileSync(ca)
	};
	servak = https.createServer(ssl_options, app.callback()).listen(HTTPS_PORT);
	console.log("Must on, port: https://127.0.0.1:", HTTPS_PORT, " started.");
	
}else{
	servak = app.listen(process.env.PORT || HTTP_PORT);
	console.log("Must on http or localhost, port: ", HTTP_PORT, " started.");
}
