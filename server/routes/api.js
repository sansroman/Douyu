var express = require('express');
var router = express.Router();
var authentication = require('../authentication');
let getAllUser = require('../middleware/Dao').getAllUser;
let delUserByUsername = require('../middleware/Dao').delUserByUsername;
let findOneByUser = require('../middleware/Dao').findOneByUser;
let modifyUser = require('../middleware/Dao').modifyUser;
let queryDanmuByUser = require('../middleware/Dao').queryDanmuByUser;
let queryDanmuByUid = require('../middleware/Dao').queryDanmuByUid;




router.get('/danmu',(req,res,next)=>{
    req.roles= {
        query:3
    }
    next();
},authentication.role,(req,res)=>{
    let douyunn = req.query.douyunn||"";
    if(douyunn){
        let cur = req.query.cur*20||0;
        queryDanmuByUser(douyunn,cur).then((results)=>{
            if(results.total==0)res.status(404).send("未找到记录");
            else res.status(200).send(results);
        })
        .catch((err)=>{
            console.log(err);
        })
    }else{
        let uid = req.query.uid||"";
        queryDanmuByUid(uid).then((results)=>{
            if(results.total==0)res.status(404).send("未找到记录");
            else res.status(200).send(results);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
   
})


router.get('/allUser',(req,res,next)=>{
    req.roles= {
        manager:3
    }
    next();
},authentication.role,(req, res) => {
    let cur = req.query.cur*20||0;
    getAllUser(cur)
    .then((results)=>{
        res.status(200).send(results);
    })
    .catch((err)=>{
        console.log(err);
    })
});

router.delete('/user',(req,res,next)=>{
    req.roles= {
        manager:3
    }
    next();
},authentication.role,(req, res) => {
    let username = req.query.username||"";
    findOneByUser(username)
    .then((results)=>{
        if(!results){
            res.status(403).send('未找到该用户');
        }else{
            delUserByUsername(username)
            .then((result)=>{
                res.status(200).send('删除成功');
            })
            .catch((err)=>{
                console.log(err);
                res.status(500).send(err);
            })
        }
    })
})

router.put('/user',(req,res,next)=>{
    req.roles= {
        manager:3
    }
    next();
},authentication.role,(req,res,next)=>{
    req.roles= {
        manager:3
    }
    next();
},(req, res) => {
    let username = req.body.username||"";
    let role = req.body.role||"";
    findOneByUser(username)
    .then((results)=>{
        if(!results){
            res.status(403).send('未找到该用户');
        }else{
            console.log(username);
            console.log(role);
            modifyUser(username,role)
            .then((result)=>{
                res.status(200).send('修改成功');
            })
            .catch((err)=>{
                console.log(err);
                res.status(500).send(err);
            })
        }
    })
})






router.get('/test', (req, res, next) => {
    var random = [];
    random.push(parseInt(Math.random() * 20));
    random.push(parseInt(Math.random() * 20));
    random.push(parseInt(Math.random() * 20));
    random.push(parseInt(Math.random() * 20));
    console.log(random);
  
    var data = {
        title: {
            text: '拉取到的demo',
        },
        tooltip: {},
        legend: {},
        xAxis: ['网站', 'APP', '微信', '微博'],
        series: [{
            name: '数量',
            type: 'bar',
            data: random
        }]
    }
    res.json(data)
  })
  router.get('/line', (req, res, next) => {
    res.json({
        title: {
            text: '动态数据 + 时间坐标轴'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: [10000, 10000]
        }]
    })
  })
  
  var data = []
  
  var now = +new Date(1997, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var value = Math.random() * 1000;
  
  function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(value)
        ]
    }
  }
  for (var i = 0; i < 1000; i++) {
    data.push(randomData());
  }
  
  router.get('/update', (req, res, next) => {
    for (var i = 0; i < 5; i++) {
        data.shift();
        data.push(randomData());
    }
    var option = {
        series: [{
            data: data
        }]
    }
    res.json(option);
  });

module.exports  = router;