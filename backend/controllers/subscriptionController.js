const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { createOrder, verifyPayment } = require('../services/paymentService');

const PLANS = {
  basic: { price: 99, durationDays: 30 },
  premium: { price: 199, durationDays: 30 },
  gold: { price: 299, durationDays: 30 }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = Object.entries(PLANS).map(([key, value]) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      price: value.price,
      duration: value.durationDays,
      features: key === 'basic' 
        ? ['Limited articles', '1 device']
        : key === 'premium'
        ? ['All articles', '3 devices', 'Offline reading']
        : ['All features', 'Unlimited devices', 'Priority support']
    }));
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.userId;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];
    
    try {
      const razorpayOrder = await createOrder(
        planDetails.price,
        `sub_${userId}_${Date.now()}`,
        `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`
      );

      res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (paymentError) {
      return res.status(500).json({ error: paymentError.message });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.verifyAndActivateSubscription = async (req, res) => {
  try {
    const { 
      plan, 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature 
    } = req.body;
    const userId = req.user.userId;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Verify payment signature
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const planDetails = PLANS[plan];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planDetails.durationDays);

    // Create subscription record
    const subscription = new Subscription({
      userId,
      plan,
      price: planDetails.price,
      durationDays: planDetails.durationDays,
      endDate,
      status: 'active',
      paymentStatus: 'completed',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    await subscription.save();

    // Update user with subscription details
    const user = await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionStartDate: new Date(),
      subscriptionEndDate: endDate
    }, { returnDocument: 'after' });

    res.json({
      message: 'Payment verified and subscription activated successfully',
      subscription: {
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status
      },
      user: {
        id: user._id,
        phone: user.phone,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEndDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    console.error('Verify subscription error:', error);
    res.status(500).json({ error: 'Failed to verify and activate subscription' });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subscription = await Subscription.findOne({
      userId,
      status: 'active'
    });

    res.json({
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionEndDate: user.subscriptionEndDate,
      isActive: user.subscriptionStatus === 'active' && user.subscriptionEndDate > new Date(),
      subscription: subscription || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};

exports.renewSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.userId;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planDetails.durationDays);

    const subscription = new Subscription({
      userId,
      plan,
      price: planDetails.price,
      durationDays: planDetails.durationDays,
      endDate,
      status: 'active',
      paymentStatus: 'completed'
    });

    await subscription.save();

    const user = await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionEndDate: endDate
    }, { returnDocument: 'after' });

    res.json({
      message: 'Subscription renewed successfully',
      user: {
        id: user._id,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEndDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to renew subscription' });
  }
};

