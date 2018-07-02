const child_process = require('child_process');


function spawn(entrance) {
    let worker = child_process.exec(`node ${entrance}`);
    worker.on('exit', (code) => {
        if(code !== 0){
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