const debug = require('debug')('paydata:register');
const passport = require('passport');
const { validationResult } = require('express-validator/check');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const randomstring = require('randomstring');

const User = require('../../models/user');

const userImgID = randomstring.generate(8);
const userURL = `https://robohash.org/${userImgID}?set=set2`

module.exports = {
  getRegisterPage(req, res, next) {
    res.render('auth/register', {
      level: 'register'
    });
  },

  async postRegisterPage(req, res, next) {
    const checkEmail = await User.findOne({
      email: req.body.email
    });

    if(checkEmail) {
      req.flash('error', 'This email address is already in use.');
      res.redirect('/users/register');
      return;
    }

    const checkUser = await User.findOne({
      username: req.body.username
    });

    if (checkUser) {
      req.flash('error', 'This username is already in use.');
      res.redirect('/users/register');
      return;
    }

    debug('Registering User');
    const newUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      route: req.body.route,
      isVerified: false,
      token: randomstring.generate(64),
      image: userURL
    });

    /* Make first user admin */
    const admin = await User.find({});
    if (admin.length < 1 || admin === 'undefined') {
      newUser.isAdmin = true;
    }

    await User.register(newUser, req.body.password);

    let user = await User.findOne({
      email: req.body.email
    });

    const msg = {
      to: req.body.email,
      from: 'noreply@cportal.online',
      subject: 'Verify your account',
      text: `Hello ${user.username}, please copy and paste this link into
        your browser to verify your account. `,
      html: `Hi there ${user.username},
      <br>
      You need to verify your account before you can login.
      <br>
      <a href="http://${req.headers.host}/users/verify?token=${user.token}">http://${req.headers.host}/users/verify?token=${user.token}</a>
      <br><br>
      Have a plesant day!`,
    };
    sgMail.send(msg);

    req.flash('success', `Welcome ${req.body.username}! Please check your email to verify your account.`);
    res.redirect('/');
  },

  getLoginPage(req, res, next) {
    res.render('auth/login', {
      level: 'login'
    });
  },

  async getValidateUser(req, res, next) {
    const checkUser = await User.findOne({
      'token': req.query.token
    });

    if(!checkUser) {
      req.flash('error', 'That token is invalid');
      return res.redirect('/');
    }

    checkUser.isVerified = true;
    checkUser.token = undefined;
    await checkUser.save();
    req.flash('success', 'You are now verified and may login.');
    res.redirect('/users/login');
  },

  async postLoginPage(req, res, next) {
    const isUserValid = await User.findOne({
      'username': req.body.username
    });

    if(!isUserValid.isVerified) {
      req.flash('error', 'Account is not validated. Please check your email.');
      res.redirect('/users/login');
      return;
    }

    await passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: true,
      successFlash: `Welcome ${req.body.username}`
    })(req, res, next);
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  }
}

