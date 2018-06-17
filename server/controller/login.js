const { query } = require('./../utils/db-util');

const hash = require('./../utils/hash')
const dayjs = require('dayjs')



module.exports = async (ctx) => {
    let req = ctx.request.body;
    console.log(ctx.session)
    console.log('------')
    let ans = await query(`select usr, uid, lasttime, lastip from user where usr='${req.username}'
    AND pwd='${hash(req.password)}' and auth = 1`)
    console.log(ans[0])

    if (ans.length === 0) {
        ctx.body = {
            code: -2,
            data: 'username or password wrong'
        }
        return;
    }
    let uid = ans[0].uid;
    let reqIp = ctx.request.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    await query(`UPDATE user SET lasttime='${req.time}',lastip='${reqIp}' where usr='${req.username}' AND pwd='${hash(req.password)}'`)
    await query(`insert into admin_loginout(uid, logintime,logouttime, opip, descs)
     values (${uid},'${req.time}', '${dayjs(req.time).add(30, 'minute').format('YYYY-MM-DD HH:mm:ss')}' 
     , '${reqIp}', 'test') `)
    ctx.session.user = req.username;
    ctx.body = {
        data: {
            user: ans[0].usr, time: req.time,
            ip: ctx.request.ip.match(/\d+\.\d+\.\d+\.\d+/)[0],
            lastTime: ans[0].lasttime, lastIp: ans[0].lastip
        },
        code: 0
    }
}