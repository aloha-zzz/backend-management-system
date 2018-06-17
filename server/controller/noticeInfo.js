const { query } = require('./../utils/db-util');


async function getUsername(ctx) {
    const data = await query(`select usr from user where auth = 0`);
    ctx.body = {
        code: 0,
        data,
    }
}

async function getNoticeInfo(ctx) {
    const data = await query(`select nid, title, fromer, ntime, content, isread, toer 
    from notification order  by ntime desc`);
    ctx.body = {
        code: 0,
        data
    }
}


async function deleteNoticeInfo(ctx) {
    let id = ctx.request.body.nid;
    const ans = await query(`select nid from notification where nid = ${id}`);
    if (ans.length === 0) {
        ctx.body = {
            code: 0,
            data: '该通知已被其他管理员删除'
        }
        return;
    }

    await query(`delete from notification where nid = ${id}`);
    ctx.body = {
        code: 0,
        data: '删除成功'
    }
}


async function sendNotice(ctx) {
    let req = ctx.request.body;
    console.log(req)

    let add = '';

    let time = req.time;
    let title = req.title;
    let content = req.content;
    let fromer = req.fromer;
    let toer = req.toer;

    toer.map(item => {
        add += `('${title}', '${fromer}', '${time}', '${content}', 2, '${item}'),`
    })

    const prefix = `insert into notification (title, fromer, ntime, content, isread, toer) values`;

    let sql = (prefix + add);

    await query(sql.substring(0, sql.length - 1))
    ctx.body = {
        code: 0,
    }
}


async function modifyNotice(ctx) {
    let req = ctx.request.body;
    console.log(req)
    await query(`update notification set title = '${req.title}', content = '${req.content}' where nid = ${req.nid}`);
    ctx.body = {
        code: 0,
    }
}

module.exports = {
    getUsername,
    getNoticeInfo,
    sendNotice,
    deleteNoticeInfo,
    modifyNotice,
}

