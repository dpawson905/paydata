const mongoose = require('mongoose');
const debug = require('debug')('paydata:pay');
const Pay = require('../../models/pay');
const User = require('../../models/user');

module.exports = {
  async getMainPage(req, res, next) {
    const user = await User.findById(req.user.id);
    const pay = await Pay.find({
      'user.id': req.user.id
    }).sort({date: 1})
    let totals = 0;
    pay.forEach(totalPay => {
      totals += totalPay.total
    });
    let totalPaid = (Math.round(totals*Math.pow(10,2))/Math.pow(10,2).toFixed(2))
    res.render('pay/index', {
      level: 'mainPay',
      user,
      pay,
      totalPaid
    });
  },

  async getAddPay(req, res, next) {
    const user = await User.findById(req.user.id);
    res.render('pay/addPay', {
      level: 'addPay',
      user
    });
  },

  async postAddPay(req, res, next) {
    await Pay.create(req.body, async (err, pay) => {
      if(err) {
        req.flash('error', err.message);
        res.redirect('back');
        return;
      }
      pay.user.id = req.user.id;
      let totals = 0;
      pay.price.forEach(totalPrice => {
        totals += totalPrice
      })
      pay.total = (Math.round(totals*Math.pow(10,2))/Math.pow(10,2).toFixed(2));
      await pay.save();
      req.flash('success', 'The work for the day has been saved');
      res.redirect('/pay');
    })
  }
}