module.exports = async (ctx, next) => {
    const start = Date.now();

    console.log(`\x1b[35m==> request \x1b[0m ${ctx.method} ${ctx.url} `);
    await next();
    const end = Date.now() - start;
    console.log(`\x1b[32m <== response \x1b[0m ${ctx.body} ${ctx.status}   response time ${end}ms`);
}