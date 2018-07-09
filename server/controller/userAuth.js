const { query } = require('./../utils/db-util');

const hash = require('./../utils/hash');


async function getAuthUserInfo(ctx) {
    const data = await query(`select uid, usr, mail, phone, qq, xname, mname, auth from user_view`);
    ctx.body = {
        code: 0,
        data,
    }
}

async function verifyLogin(ctx) {
    let req = ctx.request.body;
    console.log(ctx.session.user)
    const ans = await query(`select usr from user where usr = '${ctx.session.user}' and pwd = '${hash(req.password)}'`)

    if (ans.length === 0) {
        ctx.body = {
            code: -2,
            wrongInfo: 'username or password wrong'
        }
        return;
    }

    ctx.body = {
        code: 0
    }

}

async function changeAuth(ctx) {
    let req = ctx.request.body;
    console.log(req);
    await query(`update user set auth = 1 where uid = ${req.uid}`)
    ctx.body = {
        code: 0,
        data: '修改成功'
    }
}

module.exports = {
    getAuthUserInfo,
    changeAuth,
    verifyLogin,
}
