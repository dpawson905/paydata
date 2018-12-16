var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Catch all to throw a 404 page */
router.get("*", (req, res) => {
  res.render('error');
});

module.exports = router;
