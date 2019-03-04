const mongoose = require('mongoose');
const debug = require('debug')('paydata:pay');
const Pay = require('../../models/pay');
const User = require('../../models/user');

module.exports = {
  async getMainPage(req, res, next) {
    const user = await User.findById(req.user.id);
    let pay = await Pay.paginate({
      date: {
        $gte: req.query.fromDate,
        $lte: req.query.toDate
      },
      'user.id': {
        $eq: req.user.id
      }
    }, {
      page: req.query.page || 1,
      limit: 25
    });
    let totals = 0;
    pay.docs.forEach(totalPay => {
      totals += totalPay.total
    });
    let totalPaid = (Math.round(totals*Math.pow(10,2))/Math.pow(10,2).toFixed(2))
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    res.render('pay/index', {
      pay,
      totalPaid,
      fromDate,
      toDate,
      user
    })
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
  },

  async getEditPage(req, res, next) {
    const user = await User.findById(req.user.id);
    let foundItem = await Pay.findById(req.params.id);
    if (!foundItem) {
      req.flash('error', 'Something went wrong!');
      res.redirect('back');
      return;
    }
    res.render('pay/edit-pay', {
      user,
      foundItem
    })
  },

  async putEditPage(req, res, next) {
    let editPay = await Pay.findById(req.params.id);
    if(!editPay) {
      req.flash('error', 'Something went wrong!');
      console.log(editPay)
      res.redirect('back');
      return;
    }
    console.log(req.body.accountNumber)
    editPay.date = req.body.date;
    for(let i = 0; i < req.body.accountNumber.length; i++) {
      editPay.accountNumber.push(req.body.accountNumber[i]);
    }
    for(let i = 0; i < req.body.price.length; i++) {
      editPay.price.push(parseFloat(req.body.price[i]));
    }
    let totals = 0;
    editPay.price.forEach(totalPrice => {
      totals += totalPrice
    })
    editPay.total = (Math.round(totals*Math.pow(10,2))/Math.pow(10,2).toFixed(2));
    await editPay.save();
    req.flash('success', 'More items have been added!');
    res.redirect('/pay');
  },

  async deletePayData(req, res, next) {
    let deletePayData = await Pay.findById(req.params.id);
    await deletePayData.remove();
    req.flash('success', `Pay data deleted for ${deletePayData.date}`);
    res.redirect('/pay');
  }
}