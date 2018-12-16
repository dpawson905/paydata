var express = require('express');
var router = express.Router();

const {
  getMainPage,
  getAddPay,
  postAddPay
} = require('../controllers/pay');

const {
  asyncErrorHandler,
  isNotAuthenticated
} = require('../middleware');

/* GET main page. */
router.get('/', isNotAuthenticated, asyncErrorHandler(getMainPage));

/* GET addPay page. */
router.get('/add-pay', isNotAuthenticated, asyncErrorHandler(getAddPay));

/* POST addPay page. */
router.post('/add-pay', isNotAuthenticated, asyncErrorHandler(postAddPay));

module.exports = router;