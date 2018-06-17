const { query } = require('./../utils/db-util');

async function getFileInfo(ctx) {
    const ans = await query('select * from file_view');
    console.log(ans)
    ctx.body = {
        code: 0,
        data: ans
    }
}

async function changeFileStatus(ctx) {
    let req = ctx.request.body;
    console.log(req);
    // req.user
    // req.fid
    // req.status
    // req.time

    await query(`update file_info set status = ${req.status} where fid = ${req.fid}`)
    const ans = await query(`select uid from user where usr = ${req.user}`)
    let uid = ans[0].uid;
    await query(`insert into file_op(fid, uid, optime, opip, type) 
    values (${req.fid},${uid},'${req.time}','${ctx.request.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]}',4)`)
    ctx.body = {
        code: 0
    }
}

async function getFileOp(ctx) {
    console.log(ctx.request.query)
    let fid = ctx.request.query.fid;
    const ans = await query(`select * from file_op_view where fid = ${fid}`)
    ctx.body = {
        code: 0,
        data: ans
    }
}


module.exports = {
    getFileInfo,
    changeFileStatus,
    getFileOp,
}