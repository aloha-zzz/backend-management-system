const mysql = require("mysql");
const config = require('./../config');
const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
})

function query(sql) {
    console.log(sql);
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                resolve(err);
                return;
            }
            connection.query(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
                connection.release();
            })
        })
    })
}


function transaction(sqlArr) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                resolve(err);
                return;
            }
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }
                (async () => {
                    for (let i = 0, len = sqlArr.length; i < len; i++) {
                        await query(sqlArr[i]).then(() => console.log(i, 'success')).catch((err) => {
                            connection.rollback(() => { reject(err) })
                        })
                    }
                })()
                connection.commit(err => {
                    if (err) {
                        connection.rollback(() => { reject(err) })
                    }
                })
                console.log('Transaction complete')
                resolve('Transaction complete')
                connection.release()
            })
        })
    })
}


module.exports = {
    query,
    transaction
};
