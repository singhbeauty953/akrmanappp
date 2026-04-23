const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../services/twilioService');

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Delete old OTP if exists
    await OTP.deleteOne({ phone });

    // Generate and send OTP
    const code = await sendOTP(phone);

    // Save OTP to database
    const otp = new OTP({
      phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    await otp.save();

    res.json({ message: 'OTP sent successfully', phone });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and code required' });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ phone });
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await OTP.deleteOne({ phone });
      return res.status(400).json({ error: 'Too many attempts' });
    }

    if (otpRecord.code !== code) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified - create or update user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Delete OTP
    await OTP.deleteOne({ phone });

    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEndDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error checking auth' });
  }
};
