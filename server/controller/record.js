const { query } = require('./../utils/db-util');


// userWatchingTime
async function collectRecord(ctx) {
    if (ctx.session.user === undefined) {
        ctx.body = {
            code: 0
        }
        return;
    }

    let user = ctx.session.user;
    let req = ctx.request.body;
    let userAns = await query(`select uid from user where usr = '${user}'`);
    console.log(userAns[0].uid);
    let uid = userAns[0].uid;
    let ans = await query(`select rid from userWatchingTime where uid = ${uid}`)

    const opMap = [{
        userInfo: `insert into userWatchingTime (uid, userInfoTime) values(${uid},${req.time})`,
        fileInfo: `insert into userWatchingTime (uid, fileInfoTime) values(${uid},${req.time})`,
        notice: `insert into userWatchingTime (uid, noticeTime) values(${uid},${req.time})`,
        activity: `insert into userWatchingTime (uid, activityTime) values(${uid},${req.time})`,
        auth: `insert into userWatchingTime (uid, authTime) values(${uid},${req.time})`,
    }, {
        userInfo: `update userWatchingTime set userInfoTime = userInfoTime + ${req.time} where uid = ${uid}`,
        fileInfo: `update userWatchingTime set fileInfoTime = fileInfoTime + ${req.time} where uid = ${uid}`,
        notice: `update userWatchingTime set noticeTime = noticeTime + ${req.time} where uid = ${uid}`,
        activity: `update userWatchingTime set activityTime = activityTime + ${req.time} where uid = ${uid}`,
        auth: `update userWatchingTime set authTime = authTime + ${req.time} where uid = ${uid}`,
    }]

    if (ans.length === 0) {
        await query(opMap[0][req.type])
    } else {
        await query(opMap[1][req.type])
    }

    ctx.body = {
        code: 0
    }

}
module.exports = {
    collectRecord
}