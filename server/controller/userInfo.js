const { query } = require('./../utils/db-util');


async function getUserInfo(ctx) {
    const data = await query('select uid,usr,xname,mname,status,upcnt,dncnt from user_view')

    ctx.body = {
        code: 0,
        data,
    }
}
async function changeUserStatus(ctx) {
    let req = ctx.request.body;
    // req.status req.uid
    await query(`update user set status =  ${req.status} where uid = ${req.uid}`);
    ctx.body = {
        code: 0
    }
}
async function getUserDetail(ctx) {
    let uid = ctx.request.query.uid;
    const data = await query(`select usr,mail,phone,qq,regip,regtime,lasttime,lastip 
                                from user where uid=${uid}`);
    ctx.body = {
        code: 0,
        data,
    }
}
module.exports = {
    getUserInfo,
    changeUserStatus,
    getUserDetail
}