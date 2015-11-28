var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Mongoose JS: http://mongoosejs.com/
  res.send('About page.');
});

module.exports = router;
