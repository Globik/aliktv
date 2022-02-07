const shortid = require('shortid');
const passport = require('koa-passport');
const bodyParser = require('koa-body');
const Router = require('koa-router');
const crypto = require('crypto')
const axios = require('axios').default;
const fs = require('fs');
const util = require('util');
const path = require('path');
var {spawn} = require('child_process');
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const access = util.promisify(fs.access);
const rmdir = util.promisify(fs.rmdir);

const lstat = util.promisify(fs.lstat);
const {oni} = require('../libs/web_push.js');


const walletValidator = require('wallet-address-validator');//0.2.4
const {RateLimiterMemory} = require('rate-limiter-flexible');
const {site_domain} = require('../config/app.json');

const pub = new Router();

pub.get('/', async ctx => {
    let db = ctx.db;
    let vroom;
    let art;
    try {
        let a = await db.query("select * from vroom where typ='all'");
        if (a.rows && a.rows.length == 1) {
            vroom = a.rows[0];
        }
    } catch (err) {
        console.log(err);
    }

    try {
        let b = await db.query("select*from ads where sub='main'");
        if (b.rows && b.rows.length) {
            art = b.rows[0];
        }
    } catch (e) {
        console.log(e);
    }
    oni("main page", "just_viewed");
    ctx.body = await ctx.render('main_page', {randomStr: shortid.generate(), vroom, art});

});
pub.get('/login', async ctx => {
    ctx.body = await ctx.render('login', {})
})
pub.post('/login', (ctx, next) => {
    if (ctx.isAuthenticated()) {
        if (ctx.state.xhr) {
            ctx.throw(409, 'Already authenticated!')
        } else {
            return ctx.redirect('/')
        }
    }
    return passport.authenticate('local', function (err, user, info, status) {
            if (ctx.state.xhr) {
                if (err) {
                    ctx.body = {success: false, info: err.message};
                    ctx.throw(500, err.message);
                }
                if (user === false) {
                    ctx.body = {success: false, info: info.message}
                    ctx.throw(401, info.message)
                } else {
                    ctx.body = {
                        success: true,
                        info: info.message,
                        nick: info.nick,
                        id: info.id,
                        redirect:/*ctx.session.dorthin ||*/ '/'
                    }
                    return ctx.login(user)
                }
            } else {
                if (err) {
                    ctx.session.bmessage = {success: false, error: err.message};
                    return ctx.redirect('/login');
                }
                if (user === false) {
                    ctx.session.bmessage = {success: false, error: info.message};
                    ctx.redirect('/login')
                } else {
                    ctx.redirect(/*ctx.session.dorthin ||*/ '/')
                    return ctx.login(user)
                }
            }
        }
    )(ctx, next)
})
pub.get('/logout', ctx => {
    ctx.logout();
    ctx.redirect('/');
});
pub.get('/signup', async ctx => {
    let m = ctx.session.bmessage;
    ctx.body = await ctx.render('signup', {errmsg: m});
    delete ctx.session.bmessage;
})


pub.post('/signup', (ctx, next) => {

    if (ctx.isAuthenticated()) {
        if (ctx.state.xhr) {
            ctx.throw(409, 'Already authenticated!')
        } else {
            return ctx.redirect('/')
        }
    }
    let t = ctx.transporter;
    return passport.authenticate('local-signup', async (err, user, info, status) => {
        console.log(err, user, info, status)

        if (user) {
            oni(info.username, "just signed up.");
            t.sendMail({
                from: "",
                to: info.email,
                subject: 'Welcome to the CHELIKON!',
                html: WELCOME({nick: info.username, id: info.user_id}).html
            }, (err, info) => {
                console.log('info  mail: ', info)
                if (err) {
                    console.log(err);
                }
            })
        }


        if (ctx.state.xhr) {
            console.log('XHR!!!!');
            //23505 name already in use
            if (err) {
                ctx.throw(409, err.message)
            }

            if (!user) {
                ctx.body = {success: false, message: info.message, code: info.code, bcode: info.bcode}
            } else {
                ctx.body = {
                    success: true,
                    message: info.message,
                    username: info.username,
                    user_id: info.user_id,
                    redirect:/*ctx.session.dorthin ||*/ '/'
                }
                if (info.items > 0) ctx.session.bmessage = {info: "promo"};
                return ctx.login(user)
            }
        } else {
            if (err) {
                ctx.session.bmessage = {success: false, message: err.message};
                return ctx.redirect('/signup');
            }
            if (!user) {
                ctx.session.bmessage = {success: false, message: info.message, code: info.code, bcode: info.bcode}
                ctx.redirect('/signup')
            } else {
                ctx.session.bmessage = {success: true, msg: info.message}
                ctx.redirect('/')
                return ctx.login(user)
            }
        }
    })(ctx, next)
})
const FORGET_PWD = function (n) {
    return `Forgot your password?\n
We've received a request to reset the password for this email address.\n
To reset your password please click on this link or cut and paste this URL into your browser(link expires in 24 hours):
<a href="${n.page_url}/reset/${n.token}">${n.page_url}/reset/${n.token}</a>
This link takes you to a secure page where you can change your password.
If you don't want to reset your password, please ignore this message. Your password will not be reset.
If you received this email by mistake or believe it is spam, please...`;
}
const FORGET_PWD_HTML = function (n) {
    const TEXT2 = `<html lang="en"><body>
Forgot your password?
<br><br>
We've received a request to reset the password for this email address.
<br><br>
To reset your password please click on this link or cut and paste this URL into your browser(link expires in 24 hours):
<a href="${n.page_url}/reset/${n.token}">${n.page_url}/reset/${n.token}</a>
<br><br>
This link takes you to a secure page where you can change your password.
<br><br>
If you don't want to reset your password, please ignore this message. Your password will not be reset.</body></html>`;
    return TEXT2;
}
pub.get("/reset", async ctx => {
    ctx.body = await ctx.render('reset', {});
})
pub.post("/reset", async ctx => {
    let {email} = ctx.request.body;
    if (!email) ctx.throw(400, "no email provided!");
    console.log(email);
    let db = ctx.db;
    let r;
    try {
        r = await db.query(`select request_password_reset($1)`, [email]);
        //console.log("result: ", r.rows[0].request_password_reset);
    } catch (e) {
        ctx.throw(400, e);
    }
    let ms = `We have sent a password reset email to your email address: <a href="mailto:${email}">${email}</a><br><br> Please check your inbox to continue.`;
    let m = `Мы послали письмо на ваш адрес: <a href="mailto:${email}">${email}</a><br>Если не пришло, пожалуйста, загляните в спам.`
    let t = ctx.transporter;
    t.sendMail({
        from: '',
        to: email,
        subject: 'Смена пароля',
        text: FORGET_PWD({page_url: ctx.origin, token: r.rows[0].request_password_reset}),
        html: FORGET_PWD_HTML({page_url: ctx.origin, token: r.rows[0].request_password_reset})
    }, (err, info) => {
        console.log(info)
        console.log(err);
    })
    ctx.body = {info: m}
})

pub.get('/reset/:token', async ctx => {
// 833410fe-281a-42c1-8544-b7e684ae8e6e
    let r;
    let db = ctx.db;
    let err;
    try {
        let resu = await db.query(`select*from tokens where token=$1 and created_at > now() - interval '2 days'`, [ctx.params.token]);
        console.log('resu: ', resu.rows[0]);
        if (resu.rows.length > 0) {
            r = resu.rows[0].token;
        } else {
            err = "Время ссылки вышло.";
        }
    } catch (e) {
        console.log('error in reset params: ', e.name);
        err = "Страница не найдена.";
    }
    ctx.body = await ctx.render('reset_token', {"reset-token": r, err: err})
})

pub.post("/reset/reset_token", async ctx => {
    let {email, password, token} = ctx.request.body;
    if (!email || !password || !token) ctx.throw(400, "No data provided!")
    let db = ctx.db;
    try {
        await db.query('select reset_password($1, $2, $3)', [email, token, password])
    } catch (e) {
        ctx.throw(400, e)
    }
    ctx.body = {info: "Пароль успешно сменен!"}
})


/* BLOG */

pub.get("/blog", pagination, async ctx => {
    let db = ctx.db;
    let posts;
    try {
        let a = await db.query('select * from blog limit 5');
        if (a.rows.length) posts = a.rows
    } catch (e) {
        console.log(e);
    }

    console.log("B: ", ctx.locals);

    oni('blog ', "just here.");

    ctx.body = await ctx.render('blogs', {locals: ctx.locals, posts: posts});
})

pub.get("/blog/:page", pagination, async ctx => {
    console.log("ctx params: ", ctx.params);
    let {page} = ctx.params;
    page = Number(page);
    if (page <= 0 || page > ctx.locals.total_pages) {
        ctx.redirect("/home/blog");
        //return;
    }
    if (!page) ctx.redirect("/home/blog");
    let posts;
    let db = ctx.db;
    try {
        let a = await db.query('select*from blog limit 5 offset 5*$1', [page - 1]);
        if (a.rows && a.rows.length) posts = a.rows;
    } catch (e) {
        console.log(e);
    }
    ctx.body = await ctx.render('blogs', {locals: ctx.locals, posts: posts})
})

pub.get("/ru/:slug", async ctx => {
    let db = ctx.db;
    let result;
    try {
        result = await db.query('select*from blog where slug=$1', [ctx.params.slug]);
    } catch (e) {
        console.log(e);
    }
    oni('an article ' + ctx.params.slug, " just viewed.");

    ctx.body = await ctx.render('article_v', {result: result.rows[0]})
})

module.exports = pub;

function auth(ctx, next) {
    //for xhr
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.throw(401, "Please log in.")
    }
}

function authed(ctx, next) {
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.redirect('/');
    }
}

const limit = 5;

async function pagination(ctx, next) {
    let db = ctx.db;
    var ab = [];
    var deg = 2;
    ctx.locals = {};
    var map = new Map();
    var page = Number(ctx.params.page) || 1;

    var num = page * 5;

    try {
        let a = await db.query('select from blog');
        if (a.rows.length > 0) {
            console.log("A: ", a.rows.length);
            var total_pages = Math.ceil(a.rows.length / limit);
            console.log("total_pages: ", total_pages);
            for (var i = 0; i < total_pages; i++) {
                ab.push(i + 1);
            }
            ab.forEach(function (el, i) {

                if (total_pages >= 15) {
                    if (i <= 5) {
                        map.set(i, ab.slice(0, 5));
                        console.log('here map 1');
                    }
                    if (i > 5 && i < (total_pages - 5)) {
                        map.set(i, ab.slice((i - 1) - deg, i + deg));
                        console.log('here map 2');
                    }
                    if (i >= total_pages - 5) {
                        map.set(i, ab.slice(total_pages - 5, total_pages));
                        console.log('here map 3');
                    }
                } else {
                    map.set(i, ab.slice(0, total_pages));
                    console.log('here map 4', i, ab);
                }
            })

            console.log("ab: ", ab);
            console.log("map: ", map)
            ctx.locals.total_articles = a.rows.length;
            ctx.locals.total_pages = total_pages;
            ctx.locals.page = page;
            ctx.locals.rang_page = map;
            if (num < a.rows.length) {
                ctx.locals.next = true;
            }
            if (num > 5) {
                ctx.locals.prev = true
            }
        }
    } catch (e) {
        console.log(e);
    }
    return next();
}


