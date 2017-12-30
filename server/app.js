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
var Client = require('./middleware/utils');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'dysniubi', cookie: { maxAge: 60*1000*60 },resave:true,saveUninitialized:true}))
app.use(express.static(path.join(__dirname, '../dist')));


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



let dys = new Client(154537);
let xiaoyuan = new Client(196);
let ssr = new Client(138286);
let fajie = new Client(67373);
let daanchun = new Client(96291);


module.exports = app;
