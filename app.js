const koa = require('koa');
const app = new koa();
const router = require('./server/routers/index')
const serve = require("koa-static");
const logger =require('./server/middleware/logger');
const checkIsLogin = require('./server/middleware/checkIsLogin');
const catchWrong = require('./server/middleware/catchWrong');
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const compress = require('koa-compress');

app.keys=['this is my secret'];

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


const options = { threshold: 2048 }; // resouce > 2048kb
app.use(compress(options));

app.use(logger); // 日志
app.use(serve(__dirname)); // 静态资源

app.use(cors({ 
    origin: 'http://127.0.0.1:8080',
    credentials: true,
})) 


app.use(bodyParser())

app.use(session(CONFIG, app));
app.use(checkIsLogin);
app.use(catchWrong);
app.use(router.routes()).use(router.allowedMethods()) // 网络请求



app.listen(3000, () => {
    console.log('server run')
});