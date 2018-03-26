var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var api = require('./routes/api');
var app = express();
var DanmuListener = require('./middleware/utils_plus');
var addDanmu = require('./middleware/Dao').addDanmu;
let total = require('./middleware/statistics').total;


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));
app.use(cookieParser());
app.use(session({ secret: 'dysniubi', cookie: { maxAge: 60*1000*60 },resave:true,saveUninitialized:true}))
app.use(express.static(path.join(__dirname, '../dist')));


app.use(function(req,res,next) {
  if (!/https/.test(req.protocol)){
     res.redirect("https://" + req.headers.host + req.url);
  } else {
     return next();
  } 
});
app.use('/api',api);
app.use('/', index);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



let longzhu = new DanmuListener(['777777','xuxubaobao']);
let temp = [];
longzhu.start() 
longzhu.on('message',(msg)=>{
  total.incr();
  addDanmu([msg.roomId,msg.uid,msg.name,msg.content,msg.time]);
})

module.exports = app;
