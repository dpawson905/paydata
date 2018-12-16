const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaySchema = new Schema({
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  accountNumber: {
    type: [String],
    required: [true, 'Account Number is required']
  },
  price: {
    type: [Number],
    required: [true, 'Price is required']
  },
  total: Number,
  user: {
    id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  }
})

// PaySchema.post('save', async function() {
//   let totals = 0;
//   this.price.forEach(totalPrice => {
//     totals += totalPrice
//   })
//   this.total = (Math.round(totals*Math.pow(10,2))/Math.pow(10,2).toFixed(2));
//   await this.save();
// })

module.exports = mongoose.model('Pay', PaySchema);