const child_process = require('child_process');
const fs = require('fs');
const dayjs = require('dayjs');

let num = 0;
function spawn(entrance) {
    let worker = child_process.exec(`node ${entrance}`);
    worker.on('exit', (code) => {
        if (code !== 0) {
            fs.writeFile(`Logs/${dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')}Exit${num}.log`,
                `proccess ${num} exit with code ${code} `, (err) => {
                    console.error('write Error, ' + err);
                    num++;
                })
            spawn(entrance);
        }
    })
    worker.stdout.on('data', (data) => {
        console.log(data);
    })
    worker.stderr.on('data', (data) => {
        console.log('Err: ', data)
    })
}


spawn('app.js')