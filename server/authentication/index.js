let findOneByUser = require('../middleware/Dao').findOneByUser;
let findOne = require('../middleware/Dao').findOne;
let addUser = require('../middleware/Dao').addUser;
let users = require('../middleware/statistics').users;


let bcrypt = require('bcrypt');
const saltRounts = 10;

let authentication = {
    role(req,res,next){
        for(let name in req.roles){
            if(req.session.info&&req.session.info[name]&&req.session.info[name]>=req.roles[name]) next();
            else res.status(403).send('权限不足');
        }
    },
    reg(req,res,next){
        let username = req.body.username||"";
        let password = req.body.password||"";
        let douyunn = req.body.douyunn||"";
        findOne(username,douyunn)
        .then((hasResult)=>{
            if(hasResult){
                res.status(403).send('该用户或斗鱼ID已存在');
            }else{
                bcrypt.genSalt(saltRounts,(err,salt)=>{
                    bcrypt.hash(password,salt,(err,hash)=>{
                        let userInfo =[];
                        userInfo.push(username);
                        userInfo.push(hash);
                        userInfo.push(douyunn);
                        addUser(userInfo)
                        .then((result)=>{
                            res.status(200).send('注册成功！');
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    });
                });
            }
        })
    },
    auth(req,res){
        users.incr();
        let username = req.body.username||"";
        let password = req.body.password||"";
        let message ={};
        findOneByUser(username)
        .then((result)=>{
            if(!result){
                res.status(fr).send('未找到该用户');
            }else{
                bcrypt.compare(password,result.password,(err,success)=>{
                        if(success){
                            delete result.password;
                            req.session.info = result;
                            let douyunn = result.douyunn;
                            delete result.douyunn;
                            let roles = result;
                            res.status(200).send({douyunn:douyunn,roles:result});
                        }else{
                            res.status(403).send('账号密码错误');                
                        }
                })
            }
        })
        

    }
}
module.exports = authentication;