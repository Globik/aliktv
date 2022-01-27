// ssh root@45.89.66.225 (chelikon.space)
const Koa = require('koa');
const fs = require('fs');
const https = require('https');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const koaBody = require('koa-body');
const passport = require('koa-passport');
const WebSocket = require('ws');
const Router = require('koa-router');
const url = require('url');
const Pool = require('pg-pool');
const PgStore = require('./libs/pg-sess.js');
const shortid = require('shortid');
const PS = require('pg-pubsub');
const pgtypes = require('pg').types;
const render = require('./libs/render.js');
const  handleMediasoup  = require("./libs/mediasoup_help.js")
const serve = require('koa-static');
const session = require('koa-session');

const nodemailer = require('nodemailer');

const pubrouter = require('./routes/pubrouter.js');
const adminrouter = require('./routes/adminrouter.js');

const { meta, warnig, site_name } = require('./config/app.json');
var DB_URL = 'postgress://globi:globi@127.0.0.1:5432/globi';

//const pgn=require('pg').native.Client; // see test/pg.js for LD_LIBRARY_PATH
pgtypes.setTypeParser(1114, str=>str);
const pars = url.parse(DB_URL);
const cauth = pars.auth.split(':');
const pg_opts = { user: cauth[0], password: cauth[1], host: pars.hostname, port: pars.port, database: pars.pathname.split('/')[1],
	ssl: false
	//Client:pgn
	};
const pool = new Pool(pg_opts);
const pg_store = new PgStore(pool);
pool.on('connect', function(client){console.log('pool connect')})
pool.on('error', function(err, client){console.log('db err in pool: ', err.name)})
pool.on('acquire', function(client){})
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
app.keys = ['your-secret']
app.use(serve(__dirname + '/public'));
app.use(session({ store: pg_store , maxAge: 24 * 60 * 60 * 1000  }, app))

render(app, { root: 'views', development: (process.env.DEVELOPMENT == "yes" ?  false : false)})
app.use(koaBody());
require('./config/auth.js')(pool, passport)

app.use(passport.initialize())
app.use(passport.session())

function xhr(){
return async function xhr(ctx,next){
ctx.state.xhr = (ctx.request.get('X-Requested-With') === 'XMLHttpRequest')
await next()
}
}
app.use(xhr());
var transporter;
var xirsys;
var ya_sec;
var xir_sec;

app.use(async (ctx, next)=>{
console.log("FROM HAUPT MIDDLEWARE =>", ctx.path, ctx.method);

ctx.state.site = site_name;
ctx.db = pool;
ctx.transporter = transporter;
ctx.state.meta = meta;
ctx.state.warnig = warnig;

ctx.state.xirsys = xirsys;

ctx.ya_sec = ya_sec;
ctx.xir_sec = xir_sec;

if(ctx.request.header["user-agent"]){
	ctx.session.ua = ctx.request.header["user-agent"];
	ctx.session.ref = ctx.request.header["referer"];
	}
if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
if(ctx.path == '/api/set_xirsys'){
	let {xir} = ctx.request.body;
	xirsys = xir;
	ctx.state.xirsys = xirsys;
	try{
	await pool.query(`update prim_adr set xir=$1`, [JSON.stringify(xirsys)])
}catch(e){console.log(e);}
	}else if(ctx.path == "/api/set_ya_sec"){
		let {yasec} = ctx.request.body;
		ya_sec = yasec;
		ctx.ya_sec = ya_sec;
		try{
			await pool.query('update prim_adr set ya_sec=$1', [ya_sec])
			}catch(e){
				console.log(e);
				}
		}else if(ctx.path == "/api/set_xir_sec"){
			let {xirsec} = ctx.request.body;
			xir_sec = xirsec;
			ctx.xir_sec = xir_sec;
			try{
				await pool.query('update prim_adr set xir_sec=$1', [xir_sec])
			}catch(e){
				console.log(e);
				}
			}else{}	
}
	await next();	
})

app.use(pubrouter.routes()).use(pubrouter.allowedMethods());

app.use(adminrouter.routes()).use(adminrouter.allowedMethods());


app.use(async (ctx, next)=>{
console.log('ctx.status!',ctx.status);

try{
await next();

//if(ctx.status === 404) //ctx.throw(404, "fuck not found",{user:"fuck userss"});
}catch(err){
//ctx.status=err.status || 500;
//console.log('THIS>STATUS: ', ctx.status);
console.log("error",err);
if(ctx.status === 404){
ctx.session.error = 'not found';
console.log('method: ', ctx.method, 'ctx.url: ', ctx.url);
if(!ctx.state.xhr)ctx.body = await ctx.render("error",{});
return;

}


}

});

app.on('error', function(err, ctx){
console.log('APP ERROR: ', err.message, 'ctx.url : ', ctx.url);
});


async function rt(){
try{
 await pg_store.setup()
  on_run();
}catch(err){console.log("err setup pg_store", err.name,'\n',err);};
}
rt()

async function on_run(){
	transporter = nodemailer.createTransport(
{
sendmail:true,
newline: 'unix',
path:'/usr/sbin/sendmail'
	} 
)

try{
let a = await access('public/images/tmp', fs.constants.F_OK);
console.log('we got public/images/tmp');	
}catch(e){
try{
await mkdir('public/images/tmp');
console.log('creating directory public/images/tmp')
}catch(e){console.log(e)}	
}



	


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

const wss = new WebSocket.Server({server: servak, /*verifyClient:(info,cb)=>{
	console.log('info.origin: ', info.origin);
if(process.env.DEVELOPMENT === "yes"){cb(true);return;}else{
if(info.origin === ORIGINAL){cb(true);return;}
cb(false);
	}
	}*/
	});
	
function noop(){}
const interval = setInterval(function ping(){
wss.clients.forEach(function each(ws){
if(ws.isAlive === false)return ws.terminate();
ws.isAlive = false;
ws.ping(noop);	
})	
},3000000)
function heartbeat(){this.isAlive = true;}

wss.on('connection', function ws_connect(ws, req){
	console.log('websocket opend');
	ws.id = shortid.generate();
	let data;
  wsend(ws, { type: 'welcome', id: ws.id });
  ws.isAlive = true;
ws.on('pong', heartbeat);
ws.on('message', async function sock_msg(msg){
		try{
	 data = JSON.parse(msg);console.log('data ', data)}catch(e){console.log(e);return;}
	 
	 if(data.request = "mediasoup"){
 handleMediasoup.handleMediasoup(ws, data, WebSocket, wss).mediasoup_t();
 return;
	}
	})
ws.on('close', async function ws_close(){
	console.log("disconnect");
		handleMediasoup.handleMediasoup(ws, data, WebSocket, wss).cleanUpPeer();
	})	
})

function wsend(ws, obj){
console.log("hallo wsend()")
let a;
try{
a=JSON.stringify(obj);
if(ws.readyState === WebSocket.OPEN)ws.send(a);	
}catch(e){console.log('err in stringify: ',e);}	
}

}
