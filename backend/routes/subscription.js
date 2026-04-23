const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/auth');

router.get('/plans', subscriptionController.getPlans);
router.post('/create-order', authMiddleware, subscriptionController.createOrder);
router.post('/verify-payment', authMiddleware, subscriptionController.verifyAndActivateSubscription);
router.get('/status', authMiddleware, subscriptionController.getSubscriptionStatus);
router.post('/renew', authMiddleware, subscriptionController.renewSubscription);

module.exports = router;
