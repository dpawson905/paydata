var express = require('express');
var router = express.Router();
const { check, body } = require('express-validator/check');

const {
  getRegisterPage,
  postRegisterPage,
  getLoginPage,
  postLoginPage,
  getValidateUser,
  getLogout
} = require('../controllers/auth');

const {
  asyncErrorHandler
} = require('../middleware')

/* GET register page */
router.get('/register', getRegisterPage);

/* POST register page */
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .trim()
] ,asyncErrorHandler(postRegisterPage));

/* GET validate user */
router.get('/verify', asyncErrorHandler(getValidateUser));


/* GET login page */
router.get('/login', getLoginPage);

/* POST login page */
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .trim()
] ,asyncErrorHandler(postLoginPage));

/* GET logout */
router.get('/logout', getLogout);

module.exports = router;
