var express = require('express');
var router = express.Router();

// https://segmentfault.com/a/1190000004139342

/* GET todo listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
