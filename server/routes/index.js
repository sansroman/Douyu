var express = require('express');
var router = express.Router();
var authentication = require('../authentication');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.role) {
    req.session.role=0;
  } 
  res.sendfile('./dist/index.html');
});
router.post('/login',authentication.auth);
router.post('/register',authentication.reg);



module.exports = router;
