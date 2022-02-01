const fs = require('fs');
const util = require('util');
const bodyParser = require('koa-body');
const Router = require('koa-router');
const walletValidator = require('wallet-address-validator');//0.2.4
const sluger = require('limax');
const axios = require('axios').default;
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const uploader = require('huge-uploader-nodejs')
//const { WELCOME, PAYOUT_INFO } = require('../config/mail.js');
const adm = new Router();

const { payout_promo_token, payout_token } = require('../config/app.json');

adm.get('/admin/dashboard', authed, async ctx=>{
	ctx.body = await ctx.render('admin_dashboard', {});
});
/* XIRSYS */
adm.get('/admin/xirsys', authed, async ctx=>{
	console.log("URL: ", ctx.url);
	console.log("ORIGIN: ", ctx.origin);
	console.log("HOSTNAME: ", ctx.hostname);
	console.log("protocol: ", ctx.protocol);
	console.log("secure: ", ctx.secure);
ctx.body = await ctx.render('xirsys', { xir_sec: ctx.xir_sec, ya_sec: ctx.ya_sec });	
});

adm.post('/api/get_xirsys', auth, async ctx=>{
let v;
let vsec = ctx.xir_sec;
let vurl="https://Globi:" + vsec + "@global.xirsys.net/_turn/alikon";
	 try{
let bod = await axios.put(vurl, {format: "urls"});
v = bod.data.v.iceServers;
console.log('status: ', bod.data.status);
console.log('statusText: ', bod.data.statusText); 
console.log('v: ', v);
}catch(e){ctx.throw(400, e);}
ctx.body = {xir: v}	
})

adm.post('/api/set_xirsys', auth, async ctx=>{
	let {xir} = ctx.request.body;
	if(!xir)ctx.throw(400, "Ни одного сервера не предоставлено.");
	ctx.body = {xir: ctx.state.xirsys}
	})
	
adm.post("/api/set_xir_sec", auth, async ctx=>{
	let {xirsec} = ctx.request.body;
	if(!xirsec)ctx.throw(400, "No xirsys secret");
	ctx.body = {info: "OK, " + xirsec + " saved!", xirsec};
	})
	
	adm.post("/api/set_ya_sec", auth, async ctx=>{
	let {yasec} = ctx.request.body;
	if(!yasec)ctx.throw(400, "No yandex secret");
	ctx.body = {info: "OK, " + yasec + " saved!", yasec};
	})
	
	/* END XIRSYS */
	
	/* BLOG */
	
	adm.get("/home/write-post", authed, async ctx=>{
	ctx.body = await ctx.render('writePost', {} );
	})
	
adm.post("/api/writePost", auth, bodyParser({ multipart: true, formidable: {} }),
	 async ctx=>{
		 console.log(ctx.request.body)
		let { author, title, body, descr } = ctx.request.body;
		if(!author || !title || !body)ctx.throw(400, "no author or title or body!");
		var titi = sluger(title);
		let db = ctx.db;
		try{
			
			await db.query('insert into blog(auth, title, slug, body, descr) values($1,$2,$3,$4,$5)', [ author, title, titi, body, descr ]);
			}catch(e){
			ctx.throw(400, e);
			}
		ctx.body = { info: "OK, saved!" }
		})
		
		adm.post('/api/save_blog', auth, async ctx=>{
			let { text, id, title, descr } = ctx.request.body;
			if(!text || !id || !title)ctx.throw(400, "No data provided");
			let db = ctx.db;
			let ti = sluger(title);
			try{
				console.log("descr: ", descr);
				await db.query('update blog set title=$1, slug=$2, body=$3 , descr=$4 where id=$5', [ title, ti, text, descr, id ]);
				}catch(e){ctx.throw(400, e);}
				ctx.body = { info: "OK saved!" }
			})
			
adm.post("/api/remove_post", auth, async ctx=>{
	let { id } = ctx.request.body;
	if(!id)ctx.throw(400, "No id");
	let db = ctx.db;
	try{
		await db.query('delete from blog where id=$1', [ id ]);
		}catch(e){ctx.throw(400, e);}
ctx.body = { info: "OK deleted" }	
})			

/* PROFILES */
adm.get('/home/profile', authed, async ctx=>{
ctx.body = await ctx.render( 'profiles', {});	
})

adm.post("/get_session", auth, async ctx=>{
let db = ctx.db;
let res;
try{
	res = await db.query('select session from session');
}catch(e){ctx.throw(400, e);}	
ctx.body = { res: res.rows }
})			

module.exports = adm;

function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated() && ctx.state.user.brole=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
return next()
}else{ ctx.redirect('/');}}
