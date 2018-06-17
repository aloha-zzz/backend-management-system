const { query } = require('./../utils/db-util');


module.exports = async (ctx) => {
    if (ctx.session.user === undefined) {
        ctx.body = {
            code: 0,
            data: 'no login session'
        }
        return;
    }
    let ans = await query(`select lasttime,lastip from user where usr='${ctx.session.user}'`);
    console.log(ans[0])
    await query(`UPDATE user SET lasttime='${ctx.request.body.time}',lastip='${ctx.request.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]}' where usr='${ctx.session.user}'`)

    ctx.body = {
        code: 0,
        user: ctx.session.user,
        lastTime: ans[0].lasttime,
        lastIp: ans[0].lastip,
        time: ctx.request.body.time,
        ip: ctx.request.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
    }
}
