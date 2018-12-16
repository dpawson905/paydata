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
  asyncErrorHandler,
  isAuthenticated,
  isNotAuthenticated
} = require('../middleware');

/* GET register page */
router.get('/register', isAuthenticated, getRegisterPage);

/* POST register page */
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .trim()
], isAuthenticated ,asyncErrorHandler(postRegisterPage));

/* GET validate user */
router.get('/verify', isAuthenticated, asyncErrorHandler(getValidateUser));


/* GET login page */
router.get('/login', isAuthenticated, getLoginPage);

/* POST login page */
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .trim()
], isAuthenticated, asyncErrorHandler(postLoginPage));

/* GET logout */
router.get('/logout', isNotAuthenticated, getLogout);

module.exports = router;
