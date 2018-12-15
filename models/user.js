const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  route: {
    type: String,
    required: true,
    trim: true
  },
  image: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  }
}, {
  timestamps: true
});

UserSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  interval: 100,
  // 300000ms is 5 min
  maxInterval: 300000,
  // This will completely lock out an account and requires user intervention.
  maxAttempts: 10,
  // unlockInterval: 300000
});

// UserSchema.pre('validate', async function() {
//   if(this.attempts >= 10) {
//     this.deactivated = true;
//     this.save();
//   }
// })

 

module.exports = mongoose.model('User', UserSchema);