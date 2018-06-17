module.exports = async (ctx) => {
    if (ctx.session.user === undefined) {
        ctx.body = {
            code: 1,
            data: 'no login'
        }
        return;
    }
    ctx.session = null;
    ctx.body = {
        code: 0,
        data: 'logout success'
    }
}
