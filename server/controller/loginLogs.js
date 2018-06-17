const { query } = require('./../utils/db-util');


async function getLogs(ctx) {
    let user = ctx.session.user;
    console.log(user)
    const ans = await query(`select b.usr,a.logintime, a.logouttime, a.opip, a.descs from admin_loginout a,user b 
    where a.uid = b.uid and b.usr = '${user}'`)
    console.log(ans);
    ctx.body = {
        code: 0,
        data: ans
    }
}
module.exports = {
    getLogs,
}