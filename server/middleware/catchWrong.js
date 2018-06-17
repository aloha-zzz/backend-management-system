const fs = require("fs")
const dayjs = require('dayjs')
let wrongNum = 0;
module.exports = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
    
        ctx.body = {
            code: -1,
            wrongInfo: 'wrong'
        }
        console.log(err)
        wrongNum++;
        fs.writeFile(`${dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')}wrong${wrongNum}.log`,
            err, (err) => {
                console.error('write Error')
            })
    }
}