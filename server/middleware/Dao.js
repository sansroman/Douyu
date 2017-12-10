
let mysql = require('mysql');
let db = require('../conf').db;
const sql = {
    queryUserByUser : "SELECT a.password,a.douyunn,b.query,b.manager,b.total FROM user a LEFT JOIN role b on a.role = b.role WHERE username = ?",
    queryUser : "SELECT a.password,a.douyunn,b.query,b.manager,b.total FROM user a LEFT JOIN role b on a.role = b.role WHERE username = ? OR douyunn = ?",
    addUser: 'INSERT INTO user (username,password,douyunn) VALUES (?,?,?)',
    getAllUser:'SELECT username,douyunn,uid,role FROM user',
    delUserByUsername :'DELETE  FROM user WHERE username = ?',
    modifyUser:'UPDATE user  set role = ? WHERE username = ?',
    queryDanmu : 'SELECT rid,uid,nn,txt,time FROM danmu WHERE nn = ?'
    // getTotal = ""
}

let pool = mysql.createPool(db.mysql);

let exec = {
    queryDanmu(douyunn){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection) =>{
                connection.query({
                    sql:sql.queryDanmu,
                    timeout:2000,
                    values:[douyunn]
                },(error,results,fields)=>{
                    if(error) reject(error);
                    resolve(results);
                    connection.release();
                });
                
            });
        });
    },
    modifyUser(user,role){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection) =>{
                connection.query({
                    sql:sql.modifyUser,
                    timeout:2000,
                    values:[role,user]
                },(error,results,fields)=>{
                    if(error) reject(error);
                    resolve(results);
                    connection.release();
                });
            });
        })
    },
    delUserByUsername(username){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection) =>{
                connection.query({
                    sql:sql.delUserByUsername,
                    timeout:2000,
                    values:username
                },(error,results,fields)=>{
                    if(error) reject(error);
                    resolve(results);
                    connection.release();
                });
            });
        })
    },
    getAllUser(){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection) =>{
                connection.query({
                    sql:sql.getAllUser,
                    timeout:4000
                },(error,results,fields)=>{
                    if(error) reject(error);
                    resolve(results);
                    connection.release();
                });
            });
        })
    },
    addUser(userInfo){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection) =>{
                connection.query({
                    sql:sql.addUser,
                    timeout:2000,
                    values:userInfo
                },(error,results,fields)=>{
                    if(error) reject(error);
                    resolve(results);
                    connection.release();
                });
            });
        })
    },
    findOneByUser(user){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection) =>{
                connection.query({
                    sql:sql.queryUserByUser,
                    timeout:2000,
                    values:[user]
                },(error,results,fields)=>{
                    if(error) reject(error);
                    let result = results.length?results[0]:results;
                    resolve(result);
                    connection.release();
                });
                
            });
        });
    },
    findOne(user,douyunn){
        
                return new Promise((resolve,reject)=>{
                    pool.getConnection((err,connection) =>{
                        connection.query({
                            sql:sql.queryUser,
                            timeout:4000,
                            values:[user,douyunn]
                        },(error,results,fields)=>{
                            if(error) reject(error);
                            let result = results.length!==0;
                            resolve(result);
                            connection.release();
                        });
                        
                    });
                });
            }
}

module.exports = exec;