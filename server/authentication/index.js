let findOneByUser = require('../middleware/Dao').findOneByUser;
let bcrypt = require('bcrypt');
const saltRounts = 10;

let authentication = {
    role(req,res,next){
        for(let name in req.roles){
            console.log(req.session.info&&req.session.info[name]&&req.session.info[name]<req.roles[name]);
            if(req.session.info&&req.session.info[name]&&req.session.info[name]>req.roles[name])next();
            else res.redirect('/login');
        }
    },
    auth(req,res){
        let username = req.body.username||"";
        let password = req.body.password||"";
        let message ={};
        findOneByUser(username)
        .then((result)=>{
            if(!result){
                res.status(403).send('未找到该用户');
            }else{
                //     bcrypt.genSalt(saltRounts,(err,salt)=>{
                //     bcrypt.hash(password,salt,(err,hash)=>{
                //         console.log(hash);
                //         if(hash == result.password){
                //             delete result.password;
                //             req.session.info = result;
                //             res.status(200).send({roles:result});
                //         }else{
                //             res.status(403).send('账号密码错误');                
                //         }
                //     });
                // });
                bcrypt.compare(password,result.password,(err,success)=>{
                        if(success){
                            delete result.password;
                            req.session.info = result;
                            let douyunn = result.douyunn;
                            delete result.douyunn;
                            let roles = result;
                            res.status(200).send({roles:result});
                        }else{
                            res.status(403).send('账号密码错误');                
                        }
                })
            }
        })
        

    }
}
module.exports = authentication;