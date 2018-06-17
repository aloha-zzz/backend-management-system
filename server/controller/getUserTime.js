
const { query } = require('./../utils/db-util');

async function getUserTime(ctx) {
    let usr = ctx.request.query.userName;
    if (usr === '') {
        usr = ctx.session.user
    }
    const data = await query(`select userInfoTime, fileInfoTime, activityTime, noticeTime, authTime 
    from user a, userWatchingTime b where a.uid = b.uid and a.usr = '${usr}'`);

    ctx.body = {
        code: 0,
        data
    }
}

async function getAllUserTime(ctx) {
    const data = await query(`select SUM(userInfoTime) as userInfoTime, 
    sum(fileInfoTime) as fileInfoTime, sum(activityTime) as activityTime,
    sum(noticeTime) as noticeTime, sum(authTime) as authTime from userWatchingTime`);
    ctx.body = {
        code: 0,
        data,
    }
}

async function getUserHasTime(ctx) {
    const data = await query(`select a.usr from user a, userWatchingTime b
         where b.uid = a.uid`)
    ctx.body = {
        code: 0,
        data
    }
}

module.exports = {
    getUserTime,
    getAllUserTime,
    getUserHasTime
}