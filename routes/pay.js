var express = require('express');
var router = express.Router();

const {
  getMainPage,
  getAddPay,
  postAddPay,
  getEditPage,
  putEditPage,
  deletePayData
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

/* GET edit page */
router.get('/:id/edit', isNotAuthenticated, asyncErrorHandler(getEditPage));

/* PUT edit page */
router.put('/:id', isNotAuthenticated, asyncErrorHandler(putEditPage));

/* DELETE pay data */
router.delete('/:id', isNotAuthenticated, asyncErrorHandler(deletePayData));

module.exports = router;