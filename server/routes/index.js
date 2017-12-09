var express = require('express');
var router = express.Router();
var authentication = require('../authentication');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.sendfile('./dist/index.html');
  if (req.session.role) {
    req.session.role=0;
  } 
  res.sendfile('./dist/index.html');
});
router.post('/login',(req,res,next)=>{
    authentication.auth(req,res);
});



module.exports = router;
