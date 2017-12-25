let mysql = require('mysql');
let db = require('../conf').db;
const sql = {
  queryUserByUser: "SELECT a.password,a.douyunn,b.query,b.manager,b.total FROM user a LEFT JOIN role b on a.role = b.role WHERE username = ?",
  queryUser: "SELECT a.password,a.douyunn,b.query,b.manager,b.total FROM user a LEFT JOIN role b on a.role = b.role WHERE username = ? OR douyunn = ?",
  addUser: 'INSERT INTO user (username,password,douyunn) VALUES (?,?,?)',
  getAllUser: 'SELECT username,douyunn,uid,role FROM user LIMIT ?,?',
  delUserByUsername: 'DELETE  FROM user WHERE username = ?',
  modifyUser: 'UPDATE user  set role = ? WHERE username = ?',
  queryDanmuByUser: 'SELECT rid,uid,nn,txt,time FROM danmu WHERE nn = ? LIMIT ?,?',
  queryDanmuByUser: 'SELECT rid,uid,nn,txt,time FROM danmu LIKE nn = ? LIMIT ?,?',  
  queryDanmuByUid: 'SELECT nn FROM danmu WHERE uid = ? GROUP BY nn',
  getUserCount: 'SELECT count(*) AS count FROM user ',
  getDanmuCount: 'SELECT count(*) AS count FROM  danmu WHERE nn = ?',
  getDanmuCount: 'SELECT count(*) AS count FROM  danmu LIKE nn = ?',  
  addDanmu: 'INSERT INTO danmu(rid,uid,nn,txt,time) VALUES (?,?,?,?,?)',
  addBlacker: 'INSERT INTO blacker(sid,did,snic,dnic,endtime) VALUES(?,?,?,?,?)',
  getMute:"SELECT snic,count(*) AS count FROM blacker GROUP BY snic ORDER BY count(*) DESC"
  // getTotal = ""
}

let pool = mysql.createPool(db.mysql);

let exec = {
  addDanmu(data) {
    pool.getConnection((err, connection) => {
      connection.query({
        sql: sql.addDanmu,
        timeout: 3000,
        values: data
      }, (error, results, fields) => {
        if (error && error.code === 'PROTOCOL_CONNECTION_LOST') {
          connect();
        } else if (error) {
          console.log(error);
          throw error;
        }
      });
      connection.release();
    })
  },
  addBlacker(data) {
    pool.getConnection((err, connection) => {
      connection.query({
        sql: sql.addBlacker,
        timeout: 3000,
        values: data
      }, (error, results, fields) => {
        if (error && error.code === 'PROTOCOL_CONNECTION_LOST') {
          connect();
        } else if (error) {
          console.log(error);
          throw error;
        }
      });
      connection.release();
    })
  },
  queryDanmuByUser(douyunn, cur,fuzzy) {
    return new Promise((resolve, reject) => {
      countState = fuzzy?sql.getDanmuCountFuzzy:sql.getDanmuCount;
      userState = fuzzy?sql.queryDanmuByUserFuzzy:sql.queryDanmuByUser;
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.getDanmuCount,
          timeout: 3000,
          values: [douyunn]
        }, (error, count, fields) => {
          if (error) reject(error);
          let result ={};
          result.total = count?count[0].count:0;
          pool.getConnection((err, connection) => {
            connection.query({
              sql: sql.queryDanmuByUser,
              timeout: 5000,
              values: [douyunn, cur, 20]
            }, (error, results, fields) => {
              result.result = results;
              resolve(result);
              connection.release();
            });
          });
          connection.release();          
        });

      });
    });
  },
  queryDanmuByUid(uid) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.queryDanmuByUid,
          timeout: 2000,
          values: [uid]
        }, (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          connection.release();
        });

      });
    });
  },
  modifyUser(user, role) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.modifyUser,
          timeout: 2000,
          values: [role, user]
        }, (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          connection.release();
        });
      });
    })
  },
  delUserByUsername(username) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.delUserByUsername,
          timeout: 2000,
          values: username
        }, (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          connection.release();
        });
      });
    })
  },
  getAllUser() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.getAllUser,
          timeout: 4000,
          values: [0, 20]
        }, (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          connection.release();
        });
      });
    })
  },
  addUser(userInfo) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.addUser,
          timeout: 2000,
          values: userInfo
        }, (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          connection.release();
        });
      });
    })
  },
  findOneByUser(user) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.queryUserByUser,
          timeout: 2000,
          values: [user]
        }, (error, results, fields) => {
          if (error) reject(error);
          let result = results.length ? results[0] : results;
          resolve(result);
          connection.release();
        });

      });
    });
  },
  findOne(user, douyunn) {

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.queryUser,
          timeout: 4000,
          values: [user, douyunn]
        }, (error, results, fields) => {
          if (error) reject(error);
          let result = results.length !== 0;
          resolve(result);
          connection.release();
        });

      });
    });
  },
  GetMuteList() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.getMute,
          timeout: 4000
        }, (error, results, fields) => {
          if (error) reject(error);
          let result = {
            nnList:[],
            countList:[]
          }
          results.forEach(element => {
            result.nnList.push(element.snic);
            result.countList.push(element.count);
          });
          resolve(result);
          connection.release();
        });

      });
    });
  }
}

module.exports = exec;
