var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.sendfile('./dist/index.html');
  if (req.session.role) {
    req.session.role=0;
  } 
  res.sendfile('./dist/index.html');
});


module.exports = router;
