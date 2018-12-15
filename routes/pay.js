var express = require('express');
var router = express.Router();

const {
  getMainPage
} = require('../controllers/pay');

/* GET main page. */
router.get('/', getMainPage);

module.exports = router;