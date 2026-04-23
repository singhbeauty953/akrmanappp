# Razorpay Payment Integration Setup

## Overview
This project now includes a complete Razorpay payment integration for premium subscription handling. Users can securely pay for subscriptions using Razorpay's payment gateway.

## Prerequisites
- Razorpay account (free to create at https://razorpay.com)
- Test API keys from Razorpay dashboard

## Installation & Configuration

### Step 1: Get Razorpay Credentials
1. Sign up at https://razorpay.com
2. Navigate to Settings → API Keys
3. Copy your Key ID and Key Secret

### Step 2: Configure Environment Variables
Add the following to your `.env` file in the backend folder:

```
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### Step 3: Verify Backend Dependencies
Razorpay package is already installed. To verify:

```bash
cd backend
npm list razorpay
```

If not installed, run:
```bash
npm install razorpay
```

## Payment Flow

### User Journey
1. **User clicks "Subscribe Now"** on a plan
2. **Backend creates Razorpay order** and returns order ID
3. **Razorpay payment modal opens** in the browser
4. **User enters payment details** and completes payment
5. **Payment callback is triggered** on the client
6. **Backend verifies the payment signature** using Razorpay's security key
7. **Subscription is activated** after verification
8. **User is redirected to home** with premium access enabled

### Technical Flow

**Frontend (React):**
- Load Razorpay script on SubscriptionPage mount
- Call `/api/subscription/create-order` endpoint
- Open Razorpay modal with order details
- Send payment response to `/api/subscription/verify-payment`
- Refresh user context and navigate to home

**Backend (Node.js):**
- `/api/subscription/create-order` - Creates Razorpay order
- `/api/subscription/verify-payment` - Verifies payment signature and activates subscription
- Payment signature verification using HMAC-SHA256

## API Endpoints

### 1. Create Payment Order
**POST** `/api/subscription/create-order`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "plan": "premium"
}
```

**Response:**
```json
{
  "orderId": "order_xxxxx",
  "amount": 19900,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

### 2. Verify and Activate Subscription
**POST** `/api/subscription/verify-payment`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "plan": "premium",
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "message": "Payment verified and subscription activated successfully",
  "subscription": {
    "plan": "premium",
    "startDate": "2024-04-23T...",
    "endDate": "2024-05-23T...",
    "status": "active"
  },
  "user": {
    "id": "user_id",
    "subscriptionStatus": "active",
    "subscriptionPlan": "premium"
  }
}
```

## Testing

### Test Cards (For Test Mode)
- **Success:** 4111 1111 1111 1111
- **Failure:** 4222 2222 2222 2222

**Expiry:** Any future date
**CVV:** Any 3-4 digit number

### Test Steps
1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm run dev` (in root folder)
3. Navigate to `/subscription`
4. Click "Subscribe Now" on any plan
5. Use test card details above
6. Verify payment and subscription activation

## Files Modified

### Backend
- `backend/models/Subscription.js` - Added Razorpay fields
- `backend/services/paymentService.js` - New payment service
- `backend/controllers/subscriptionController.js` - Updated with payment endpoints
- `backend/routes/subscription.js` - New routes for payment

### Frontend
- `src/pages/SubscriptionPage.jsx` - Integrated Razorpay payment flow
- `src/pages/SubscriptionPage.css` - Added payment info styling

## Security Features

1. **Signature Verification** - All payments verified using HMAC-SHA256
2. **HTTPS Required** - Must use HTTPS in production
3. **Server-side Verification** - Payment verification happens on backend only
4. **Secure Token Storage** - JWT tokens stored securely
5. **User Isolation** - Each user's subscription tied to their ID

## Production Checklist

Before going live:
- [ ] Switch to production Razorpay keys
- [ ] Enable HTTPS/SSL certificate
- [ ] Test with real cards (use Razorpay's test cards for limit testing)
- [ ] Configure webhook for payment status updates (optional)
- [ ] Set up payment failure handling
- [ ] Enable email notifications for payments
- [ ] Monitor payment logs in Razorpay dashboard

## Troubleshooting

### Payment Modal Not Opening
- Check if Razorpay script is loaded: `window.Razorpay` should exist
- Verify `RAZORPAY_KEY_ID` is set correctly
- Check browser console for errors

### Signature Verification Failed
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Verify order ID is the same as returned by backend
- Check that signatures match exactly (case-sensitive)

### Subscription Not Activating
- Check backend logs for verification errors
- Verify JWT token is valid
- Ensure user exists in database

## Support

For Razorpay support:
- Documentation: https://razorpay.com/docs
- Dashboard: https://dashboard.razorpay.com
- Contact: support@razorpay.com
