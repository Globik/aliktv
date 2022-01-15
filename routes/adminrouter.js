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
module.exports = adm;

function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated() && ctx.state.user.brole=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
return next()
}else{ ctx.redirect('/');}}
