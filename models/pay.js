const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaySchema = new Schema({
  date: Date,
  accountNumber: String,
  price: [mongoose.Types.Decimal128],
  total: mongoose.Types.Decimal128,
  user: {
    id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  }
})

module.exports = mongoose.model('Pay', PaySchema);