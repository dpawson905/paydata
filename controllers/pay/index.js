const mongoose = require('mongoose');
const debug = require('debug')('paydata:pay');
const Pay = require('../../models/pay');
const User = require('../../models/user');

module.exports = {
  async getMainPage(req, res, next) {
    const user = await User.findById(req.user.id);
    await Pay.find({
      date: {
        $gte: req.query.fromDate,
        $lte: req.query.toDate
      },
      'user.id': {
        $eq: req.user.id
      }
    }, (err, foundPay) => {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      let totals = 0;
      foundPay.forEach(totalPay => {
        totals += totalPay.total
      });
      let totalPaid = (Math.round(totals*Math.pow(10,2))/Math.pow(10,2).toFixed(2))
      let fromDate = req.query.fromDate;
      let toDate = req.query.toDate;
      res.render('pay/index', {
        level: 'mainPay',
        user,
        foundPay,
        totalPaid,
        fromDate,
        toDate
      });
      }).sort({date: 1})
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