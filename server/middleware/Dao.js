
let mysql = require('mysql');
let db = require('../conf').db;
const sql = {
    queryUser : "SELECT a.password,a.douyunn,b.query,b.manager,b.total FROM user a LEFT JOIN role b on a.role = b.role WHERE username = ?",
    // queryDanmu = "",
    // getTotal = ""
}

let pool = mysql.createPool(db.mysql);

let exec = {
    findOneByUser(user){

        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection) =>{
                connection.query({
                    sql:sql.queryUser,
                    timeout:4000,
                    values:[user]
                },(error,results,fields)=>{
                    if(error) reject(error);
                    let result = results.length?results[0]:results;
                    console.log(result);
                    resolve(result);
                    connection.release();
                });
                
            });
        });
    }
}

module.exports = exec;