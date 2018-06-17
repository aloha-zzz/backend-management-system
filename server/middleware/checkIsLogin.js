module.exports = async (ctx, next) => {
    const dontNeedCheck = ['/login', '/isLogin', '/logout', '/collectRecord'] // 不需要登陆就可以继续的路由

    console.log(ctx.url);
    if (dontNeedCheck.indexOf(ctx.url) > -1) {
        await next();
        return;
    }
    else if (ctx.session.user !== undefined) {
        await next();
        return;
    }
    else {
        ctx.body = {
            code: 3
        }
    }
}
