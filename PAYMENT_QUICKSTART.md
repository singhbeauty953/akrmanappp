# 🎯 Quick Start: Razorpay Payment Setup

## 3-Minute Setup

### Step 1: Get Razorpay Keys (1 min)
1. Go to https://razorpay.com
2. Sign up (free account)
3. Verify email
4. Go to Settings → API Keys
5. Copy your **Key ID** and **Key Secret** (they start with `rzp_test_` for testing)

### Step 2: Update .env File (1 min)
Open `backend/.env` and update:
```
RAZORPAY_KEY_ID=rzp_test_xxxxx          ← Paste your Key ID
RAZORPAY_KEY_SECRET=xxxxxxxx             ← Paste your Key Secret
```

### Step 3: Restart Backend (1 min)
```bash
cd backend
npm run dev
```

## ✅ Ready to Go!

The payment integration is now live. Users can:
1. Click "Subscribe Now" on any plan
2. See Razorpay payment modal
3. Enter test card details (see below)
4. Get instant premium access

## 🧪 Test Payment

**Test Card (Success):**
- Card: 4111 1111 1111 1111
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- Name: Any name

**Test Card (Failure):**
- Card: 4222 2222 2222 2222
(Same expiry/CVV format)

## 📁 What Changed

**Backend:**
- ✨ `services/paymentService.js` - Payment logic
- 🔄 `controllers/subscriptionController.js` - Two new endpoints
- 🔄 `routes/subscription.js` - Two new routes
- 🔄 `models/Subscription.js` - Added payment fields

**Frontend:**
- 🔄 `src/pages/SubscriptionPage.jsx` - Razorpay modal
- 🔄 `src/pages/SubscriptionPage.css` - Styling

## 🔑 Key Endpoints

**1. Create Payment Order**
```
POST /api/subscription/create-order
Authorization: Bearer <token>
Body: { "plan": "premium" }
```

**2. Verify & Activate Subscription**
```
POST /api/subscription/verify-payment
Authorization: Bearer <token>
Body: {
  "plan": "premium",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

## 🚀 Going Live

When ready for production:
1. Get live keys from Razorpay (rzp_live_*)
2. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
3. Enable HTTPS on your server
4. Update CORS/origin settings if needed

## ❓ Troubleshooting

**Payment modal not opening?**
- Check browser console for errors
- Verify Razorpay script loaded: Open DevTools → Network tab → search "checkout.razorpay"

**Signature verification failed?**
- Double-check RAZORPAY_KEY_SECRET is correct
- Make sure it's not truncated

**Still not working?**
- See `PAYMENT_SETUP.md` for detailed troubleshooting

## 📖 Learn More

- Razorpay Docs: https://razorpay.com/docs
- Dashboard: https://dashboard.razorpay.com
- Full Setup Guide: See `PAYMENT_SETUP.md`

---

🎉 You're all set! Payment processing is now live.
