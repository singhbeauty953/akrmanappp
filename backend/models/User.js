const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    sparse: true
  },
  name: {
    type: String
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'active', 'expired'],
    default: 'free'
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'gold'],
    default: 'free'
  },
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
