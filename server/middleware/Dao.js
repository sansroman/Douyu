let mysql = require('mysql');
let db = require('../conf').db;
const sql = {
  queryUserByUser: "SELECT a.password,a.douyunn,b.query,b.manager,b.total FROM user a LEFT JOIN role b on a.role = b.role WHERE username = ?",
  queryUser: "SELECT a.password,a.douyunn,b.query,b.manager,b.total FROM user a LEFT JOIN role b on a.role = b.role WHERE username = ? OR douyunn = ?",
  addUser: 'INSERT INTO user (username,password,douyunn) VALUES (?,?,?)',
  getAllUser: 'SELECT username,douyunn,uid,role FROM user ORDER BY role LIMIT ?,? ',
  delUserByUsername: 'DELETE  FROM user WHERE username = ?',
  modifyUser: 'UPDATE user  set role = ? WHERE username = ?',
  queryDanmuByUser: 'SELECT rid,uid,nn,txt,time FROM danmu WHERE nn = ? ORDER BY time LIMIT ?,?',
  queryDanmuByUserFuzzy: 'SELECT rid,uid,nn,txt,time FROM danmu WHERE nn LIKE ? LIMIT ?,?',  
  queryDanmuByUid: 'SELECT rid,uid,nn,txt,time FROM danmu WHERE uid = ? ORDER BY time LIMIT ?,?',
  queryDanmuByUidLimit:'SELECT nn,txt FROM danmu where uid = ? ORDER BY time DESC LIMIT 0,30',
  getUserCount: 'SELECT count(*) AS count FROM user ',
  getDanmuCountBynn: 'SELECT count(*) AS count FROM  danmu WHERE nn = ?',
  getDanmuCountByUid: 'SELECT count(*) AS count FROM  danmu WHERE uid = ?',
  getDanmuCountFuzzy: 'SELECT count(*) AS count FROM  danmu WHERE nn LIKE ?',  
  addDanmu: 'INSERT INTO danmu(rid,uid,nn,txt,time) VALUES (?,?,?,?,?)',
  addBlacker: 'INSERT INTO blacker(sid,did,snic,dnic,endtime) VALUES(?,?,?,?,?)',
  getMute:'SELECT snic,count(*) AS count FROM blacker GROUP BY snic ORDER BY count(*) DESC',
  getReviewCount:'SELECT count(*) AS count FROM review ',
  getReview:'SELECT * FROM review ORDER BY identifer DESC LIMIT ?,?',
  getDanmuCount:'SELECT count(*) AS count FROM  danmu'
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
  getDanmuCount() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.getDanmuCount,
          timeout: 2000,
        }, (error, results, fields) => {
          if (error) reject(error);
          resolve(results?results[0].count:0);
          connection.release();
        });
      });
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
      let countState = fuzzy?sql.getDanmuCountFuzzy:sql.getDanmuCountBynn;
      let userState = fuzzy?sql.queryDanmuByUserFuzzy:sql.queryDanmuByUser;
      let time = fuzzy?10000:3000;
      pool.getConnection((err, connection) => {
        connection.query({
          sql: countState,
          timeout: time,
          values: [douyunn]
        }, (error, count, fields) => {
          if (error) reject(error);
          let result ={};
          result.total = count?count[0].count:0;
          pool.getConnection((err, connection) => {
            connection.query({
              sql: userState,
              timeout: time,
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
  queryDanmuByUid(uid,cur) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.getDanmuCountByUid,
          timeout: 2000,
          values: [uid]
        }, (error, count, fields) => {
            if (error) reject(error);
            let result ={};
            result.total = count?count[0].count:0;
            pool.getConnection((err, connection) => {
              connection.query({
                sql: sql.queryDanmuByUid,
                timeout: 3000,
                values: [uid, cur, 20]
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
  getAllUser(cur) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.getUserCount,
          timeout: 3000,
        }, (error, count, fields) => {
          if (error) reject(error);
          let result ={};
          result.total = count?count[0].count:0;
          pool.getConnection((err, connection) => {
            connection.query({
              sql: sql.getAllUser,
              timeout: 4000,
              values: [cur, 20]
            }, (error, results, fields) => {
              if (error) reject(error);
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
  getReview(cur) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query({
          sql: sql.getReviewCount,
          timeout: 3000,
        }, (error, count, fields) => {
          if (error) reject(error);
          let result ={};
          result.total = count?count[0].count:0;
          pool.getConnection((err, connection) => {
            connection.query({
              sql: sql.getReview,
              timeout: 4000,
              values: [cur, 20]
            }, (error, results, fields) => {
              if (error) reject(error);
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
