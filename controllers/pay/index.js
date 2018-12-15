const mongoose = require('mongoose');
const Pay = require('../../models/pay');
const User = require('../../models/user');

module.exports = {
  async getMainPage(req, res, next) {
    const user = await User.findById(req.user.id);
    res.render('pay/index', {
      level: 'index',
      user
    });
  }
}