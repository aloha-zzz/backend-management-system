const { query } = require('./../utils/db-util');

async function getActivity(ctx) {
    const ans = await query(`select * from activity ORDER BY pubtime ASC`);
    ctx.body = {
        code: 0,
        data: ans
    }
}
async function addActivity(ctx) {
    let req = ctx.request.body;
    let user = ctx.session.user
    console.log(req)
    await query(`insert into activity(title, img ,descs ,pubtime,pubuser, imgName) 
        values ('${req.title}','${req.img}','${req.content}','${req.time}','${user}','${req.imgName}')`)
    ctx.body = {
        code: 0
    }
}

async function deleteActivity(ctx) {
    let req = ctx.request.body;
    await query(`delete from activity where aid = ${req.id}`)
    ctx.body = {
        code: 0
    }
}

async function modifyActivity(ctx) {
    let req = ctx.request.body;
    let user = ctx.session.user
    await query(`update  activity 
        set title = '${req.title}', descs = '${req.content}',img ='${req.img}', 
        imgName = '${req.imgName}', pubuser = '${user}',pubtime = '${req.time}' where aid = ${req.aid}`)
    ctx.body = {
        code: 0
    }
}

module.exports = {
    addActivity,
    deleteActivity,
    modifyActivity,
    getActivity,
}