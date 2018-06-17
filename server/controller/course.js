const { query, transaction } = require('./../utils/db-util');

async function getCourse(ctx) {
    const ans = await query(`select * from course a, major b, mtoc c, college d 
        where c.cid = a.cid and c.mid = b.mid and b.xid = d.xid `)
    ctx.body = {
        code: 0,
        data: ans
    }
}

async function addCourse(ctx) {
    let req = ctx.request.body;
    console.log(req)
    let title = req.title;
    let credit = req.credit;
    let major = req.major;
    for (let i = 0, len = major.length; i < len; i++) {
        const ans = await query(`select mid from major where mname = '${major[i]}'`)
        let mid = ans[0].mid;
        const cid = await query(`select max(cid) as cid from course`);
        let maxCid = cid[0].cid;
        console.log('add course')
        await query(`insert into course (cname, credit) values('${title}', '${credit}')`)
        await query(`insert into mtoc (mid, cid) values( ${mid}, ${maxCid + 1} )`) // mtoc 外键要放到后面
       
        // transaction([`insert into course (cname, credit) values('${title}', '${credit}')`,
        //     `insert into mtoc (mid, cid) values( ${mid}, ${maxCid + 1} )`
        // ])
    }

    ctx.body = {
        code: 0,
        data: 'success'
    }
}

async function modifyCourse(ctx) {
    let req = ctx.request.body;

    await query(`update course set cname = '${req.cname}', credit = ${req.credit} where cid = ${req.cid}`)

    ctx.body = {
        code: 0,
    }
}

async function deleteCourse(ctx) {
    let req = ctx.request.body;
    await query(`delete from mtoc where cid = ${req.cid}`);

    await query(`delete from course where cid =${req.cid}`);
    ctx.body = {
        code: 0,
    }
}


async function getMajor(ctx) {
    const ans = await query('select * from major')
    ctx.body = {
        code: 0,
        data: ans
    }

}
module.exports = {
    getCourse,
    deleteCourse,
    addCourse,
    modifyCourse,
    getMajor
}