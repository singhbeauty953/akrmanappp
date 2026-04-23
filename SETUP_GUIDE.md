# 📰 NEWS APP - LOGIN & SUBSCRIPTION SYSTEM SETUP

Your login and subscription system is now fully implemented! Here's what was built:

## ✅ What's Implemented

### Backend (Node.js + Express)
- ✅ User authentication with OTP (SMS via Twilio)
- ✅ JWT token-based sessions (30 days)
- ✅ User & Subscription database models (MongoDB)
- ✅ Subscription plans (Basic, Premium, Gold)
- ✅ Payment/subscription management endpoints
- ✅ CORS configured for frontend

### Frontend (React)
- ✅ Login page with phone number input
- ✅ OTP verification page with countdown timer
- ✅ Auth context for global state management
- ✅ Protected routes (only logged-in users can access)
- ✅ Subscription page with plan selection
- ✅ Navbar updated with Login/Logout buttons
- ✅ User info display after login

---

## 🚀 SETUP INSTRUCTIONS

### 1. MongoDB Setup (Required)
You need a MongoDB database. Choose one:

**Option A: Local MongoDB (Windows)**
```powershell
# Install MongoDB Community
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod

# Keep terminal open
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/news-app`
5. Update `backend\.env` with connection string

---

### 2. Twilio Setup (For SMS OTP)

1. Sign up at https://www.twilio.com
2. Get phone number from Twilio (e.g., +1234567890)
3. Get Account SID & Auth Token from dashboard
4. Update `backend\.env`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

---

### 3. Start Backend Server

```powershell
cd backend
npm install  # (if not done)
npm start

# Should show:
# ╔════════════════════════════════════╗
# ║  News App Backend Running          ║
# ║  Port: 5000                        ║
# ╚════════════════════════════════════╝
```

**Keep this terminal open!**

---

### 4. Start Frontend (New Terminal)

```powershell
cd c:\Users\91989\OneDrive\Desktop\NEWS
npm install
npm run dev

# Open browser: http://localhost:5173
```

---

## 🧪 TEST THE SYSTEM

### 1. Login Flow
1. Click "Login" button in navbar
2. Enter a 10-digit phone number (e.g., 9999999999)
3. Click "Send OTP"
4. Check Twilio console for OTP (or terminal output if in dev mode)
5. Enter OTP on verification page
6. You're logged in! ✓

### 2. Subscription Flow
1. After login, click "💎 Premium" button
2. Choose a plan (Basic/Premium/Gold)
3. Click "Subscribe Now"
4. Subscription activated!
5. Subscription status stored in database

### 3. Protected Routes
- Try accessing `/subscription` without login → redirects to login
- After login → full access

---

## 📁 FILE STRUCTURE

```
backend/
├── .env                          # Environment variables
├── server.js                     # Main server file
├── models/
│   ├── User.js                  # User schema
│   ├── OTP.js                   # OTP schema
│   └── Subscription.js          # Subscription schema
├── controllers/
│   ├── authController.js        # Auth logic
│   └── subscriptionController.js # Subscription logic
├── routes/
│   ├── auth.js                  # Auth endpoints
│   └── subscription.js          # Subscription endpoints
├── middleware/
│   └── auth.js                  # JWT verification
└── services/
    └── twilioService.js         # Twilio integration

src/
├── context/
│   └── AuthContext.jsx          # Global auth state
├── pages/
│   ├── LoginPage.jsx            # Login UI
│   ├── OTPVerifyPage.jsx        # OTP verification UI
│   └── SubscriptionPage.jsx     # Subscription plans UI
├── components/
│   ├── ProtectedRoute.jsx       # Route protection
│   └── Navbar.jsx               # Updated with auth UI
└── main.jsx                     # Routes & AuthProvider
```

---

## 🔑 API ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/send-otp` | ✗ | Send OTP to phone |
| POST | `/api/auth/verify-otp` | ✗ | Verify OTP & get token |
| GET | `/api/auth/check` | ✓ | Check auth status |
| GET | `/api/subscription/plans` | ✗ | Get all plans |
| POST | `/api/subscription/create` | ✓ | Create subscription |
| GET | `/api/subscription/status` | ✓ | Get user subscription |
| POST | `/api/subscription/renew` | ✓ | Renew subscription |

---

## 🔐 Security Notes

1. **JWT Tokens**: Stored in localStorage (valid 30 days)
2. **Rate Limiting**: OTP has 3 max attempts, 5-minute expiry
3. **HTTPS**: Always use HTTPS in production (not localhost)
4. **Env Variables**: Never commit `.env` file to git
5. **CORS**: Frontend URL configured in backend

---

## 📝 PAYMENT INTEGRATION (Optional)

Currently subscriptions are "free" (no actual payment processing).

To add real payments, integrate:
- **Stripe**: For card payments
- **Razorpay**: For Indian users (UPI, cards, wallets)
- **PayPal**: For international users

Let me know if you need help!

---

## 🐛 TROUBLESHOOTING

**Backend won't start:**
- Ensure MongoDB is running
- Check `.env` file exists
- Check port 5000 is not in use

**OTP not sending:**
- Verify Twilio credentials in `.env`
- Check Twilio account has balance
- Check phone number format (10 digits)

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check CORS configuration matches frontend URL
- Browser console should show API errors

---

## 📱 DEPLOYMENT

### Backend Deployment (Heroku, Railway, Render)
1. Push code to GitHub
2. Deploy service will auto-detect Node.js
3. Set environment variables in dashboard
4. Get backend URL

### Frontend Deployment (GoDaddy)
1. Run: `npm run build`
2. Upload `dist/` folder to GoDaddy hosting
3. Update `AuthContext.jsx` API URLs to production backend
4. Test login flow on live site

---

## ✨ NEXT STEPS

1. ✅ Test locally (following steps above)
2. ⏭️ Add real payment gateway (Stripe/Razorpay)
3. ⏭️ Deploy backend to cloud
4. ⏭️ Deploy frontend to GoDaddy
5. ⏭️ Update Twilio for production

Let me know when you're ready to deploy!
