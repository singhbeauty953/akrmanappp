# 🏗️ SYSTEM ARCHITECTURE

## 📊 HIGH-LEVEL FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React App (Frontend)                                    │   │
│  │  - Login Page                                           │   │
│  │  - OTP Verification Page                               │   │
│  │  - Subscription Page                                   │   │
│  │  - Auth Context (Global State)                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
                    (HTTP REST API Calls)
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND (Node.js)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Routes:                                                 │   │
│  │  - POST /api/auth/send-otp                              │   │
│  │  - POST /api/auth/verify-otp                            │   │
│  │  - GET  /api/auth/check                                 │   │
│  │  - GET  /api/subscription/plans                         │   │
│  │  - POST /api/subscription/create                        │   │
│  │  - GET  /api/subscription/status                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓↑                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services & Controllers:                                 │   │
│  │  - authController (OTP, JWT tokens)                     │   │
│  │  - subscriptionController (Plans, subscription)         │   │
│  │  - twilioService (SMS sending)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
            ↓              ↓              ↓
    ┌───────────────┐ ┌────────────┐ ┌──────────────┐
    │   MongoDB     │ │  Twilio    │ │  JWT Secret  │
    │   Database    │ │  (SMS OTP) │ │  (Token Auth)│
    │               │ │            │ │              │
    │ - Users       │ │ Sends OTP  │ │ Validates    │
    │ - OTPs        │ │ to phone   │ │ token expiry │
    │ - Subscriptions│ └────────────┘ └──────────────┘
    └───────────────┘
```

---

## 🔐 AUTHENTICATION FLOW

```
USER JOURNEY: LOGIN → OTP → SUBSCRIPTION

1. USER VISITS SITE
   ├─ No token in localStorage
   ├─ AuthContext checks → loading = true
   └─ Show loading spinner

2. USER CLICKS "LOGIN"
   ├─ Navigate to /login page
   ├─ User enters phone: 9999999999
   └─ Click "Send OTP"

3. FRONTEND → BACKEND
   ├─ POST /api/auth/send-otp
   ├─ Payload: { phone: "9999999999" }
   └─ Response: { message: "OTP sent", phone: "9999999999" }

4. TWILIO SMS
   ├─ Twilio receives request from backend
   ├─ Generates OTP: 123456
   ├─ Sends SMS: "Your code is 123456. Valid for 5 minutes"
   └─ MongoDB stores OTP with expiry time

5. USER RECEIVES SMS
   ├─ Opens SMS
   ├─ Copies OTP: 123456
   └─ Enters on verification page

6. FRONTEND → BACKEND
   ├─ POST /api/auth/verify-otp
   ├─ Payload: { phone: "9999999999", code: "123456" }
   └─ Backend validates:
       ├─ OTP exists? ✓
       ├─ Not expired? ✓
       ├─ Not too many attempts? ✓
       ├─ Code matches? ✓
       └─ Success!

7. BACKEND RESPONSE
   ├─ Generates JWT token (valid 30 days)
   ├─ Finds or creates user in MongoDB
   ├─ Returns: {
   │    token: "eyJhbGciOiJIUzI1NiIsInR5...",
   │    user: {
   │      id: "635a1b2c3d4e5f6a7b8c",
   │      phone: "9999999999",
   │      subscriptionStatus: "free"
   │    }
   │  }
   └─ Deletes OTP from database

8. FRONTEND STORES TOKEN
   ├─ localStorage.setItem("token", jwt_token)
   ├─ AuthContext updates:
   │  ├─ user = {...}
   │  ├─ token = jwt_token
   │  └─ loading = false
   └─ Show user navbar with logout button

9. USER CLICKS "💎 PREMIUM"
   ├─ Navigate to /subscription
   ├─ ProtectedRoute checks token
   │  ├─ Token exists? ✓
   │  └─ Allow access ✓
   └─ Show subscription plans

10. USER SELECTS PLAN
    ├─ Click "Subscribe Now" on "Basic" plan
    └─ POST /api/subscription/create
       ├─ Headers: Authorization: Bearer [token]
       ├─ Payload: { plan: "basic" }
       └─ Backend validates JWT token:
           ├─ Token valid? ✓
           ├─ Extract userId from token ✓
           └─ Create subscription record

11. BACKEND CREATES SUBSCRIPTION
    ├─ Insert into Subscription collection:
    │  ├─ userId: "635a1b2c3d4e5f6a7b8c"
    │  ├─ plan: "basic"
    │  ├─ price: 99
    │  ├─ startDate: now
    │  ├─ endDate: now + 30 days
    │  ├─ status: "active"
    │  └─ paymentStatus: "completed"
    ├─ Update User document:
    │  ├─ subscriptionStatus: "active"
    │  ├─ subscriptionPlan: "basic"
    │  ├─ subscriptionEndDate: 2024-05-23
    │  └─ subscriptionStartDate: 2024-04-23
    └─ Response: { message: "Subscription created" }

12. USER SEES SUCCESS
    ├─ Toast: "✓ Subscription activated!"
    ├─ Redirect to home page
    ├─ AuthContext updates with new user data
    ├─ Navbar shows "Basic" plan badge
    └─ User can access premium content

13. USER LOGS OUT
    ├─ Click "Logout"
    ├─ localStorage.removeItem("token")
    ├─ AuthContext resets:
    │  ├─ user = null
    │  ├─ token = null
    │  └─ loading = false
    └─ Redirect to home

14. NEXT TIME USER VISITS
    ├─ localStorage has token
    ├─ AuthContext calls /api/auth/check
    ├─ Backend validates token:
    │  ├─ Token valid? ✓
    │  └─ Find user in database ✓
    ├─ Returns user data
    ├─ AuthContext updates with user
    └─ User logged in automatically!
```

---

## 📡 API ENDPOINT DETAILS

### Auth Endpoints

#### 1. Send OTP
```
POST /api/auth/send-otp
Request:  { phone: "9999999999" }
Response: { message: "OTP sent successfully", phone: "9999999999" }
Status:   200 OK | 400 Bad Request | 500 Error

Actions:
- Delete old OTP if exists
- Generate 6-digit code
- Send SMS via Twilio
- Store OTP in database with 5-min expiry
```

#### 2. Verify OTP
```
POST /api/auth/verify-otp
Request:  { phone: "9999999999", code: "123456" }
Response: {
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    id: "635a1b2c3d4e5f6a7b8c",
    phone: "9999999999",
    subscriptionStatus: "free",
    subscriptionPlan: "free"
  }
}
Status:   200 OK | 400 Bad Request | 500 Error

Actions:
- Find OTP record
- Check expiry, attempts
- Verify code matches
- Create/update user
- Generate JWT token
- Delete OTP
```

#### 3. Check Auth
```
GET /api/auth/check
Headers:  Authorization: Bearer [jwt_token]
Response: {
  user: {
    id: "635a1b2c3d4e5f6a7b8c",
    phone: "9999999999",
    name: "User Name",
    email: "user@example.com",
    subscriptionStatus: "active",
    subscriptionPlan: "basic",
    subscriptionEndDate: "2024-05-23"
  }
}
Status:   200 OK | 401 Unauthorized | 404 Not Found | 500 Error

Actions:
- Verify JWT token
- Find user in database
- Return user data
```

### Subscription Endpoints

#### 4. Get Plans
```
GET /api/subscription/plans
Response: [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    duration: 30,
    features: ["Limited articles", "1 device"]
  },
  {
    id: "premium",
    name: "Premium",
    price: 199,
    duration: 30,
    features: ["All articles", "3 devices", "Offline reading"]
  },
  ...
]
Status:   200 OK | 500 Error
```

#### 5. Create Subscription
```
POST /api/subscription/create
Headers:  Authorization: Bearer [jwt_token]
Request:  { plan: "basic" }
Response: {
  message: "Subscription created successfully",
  subscription: {
    plan: "basic",
    startDate: "2024-04-23",
    endDate: "2024-05-23",
    status: "active"
  },
  user: {
    id: "635a1b2c3d4e5f6a7b8c",
    subscriptionStatus: "active",
    subscriptionPlan: "basic",
    subscriptionEndDate: "2024-05-23"
  }
}
Status:   200 OK | 400 Bad Request | 401 Unauthorized | 500 Error
```

#### 6. Get Subscription Status
```
GET /api/subscription/status
Headers:  Authorization: Bearer [jwt_token]
Response: {
  subscriptionStatus: "active",
  subscriptionPlan: "basic",
  subscriptionEndDate: "2024-05-23",
  isActive: true,
  subscription: { ... full subscription object ... }
}
Status:   200 OK | 401 Unauthorized | 404 Not Found | 500 Error
```

#### 7. Renew Subscription
```
POST /api/subscription/renew
Headers:  Authorization: Bearer [jwt_token]
Request:  { plan: "premium" }
Response: {
  message: "Subscription renewed successfully",
  user: {
    id: "635a1b2c3d4e5f6a7b8c",
    subscriptionStatus: "active",
    subscriptionPlan: "premium",
    subscriptionEndDate: "2024-05-23"
  }
}
Status:   200 OK | 400 Bad Request | 401 Unauthorized | 500 Error
```

---

## 💾 DATABASE RELATIONSHIPS

```
┌──────────────────────────────┐
│           USER               │
├──────────────────────────────┤
│ _id (ObjectId)               │
│ phone (String, unique) ◄─────┼────┐
│ email (String)               │    │
│ name (String)                │    │
│ subscriptionStatus (String)   │    │
│ subscriptionPlan (String)     │    │
│ subscriptionStartDate (Date)  │    │
│ subscriptionEndDate (Date)    │    │
│ createdAt (Date)              │    │
└──────────────────────────────┘    │
         ▲                           │
         │ Has Many                  │
         │                           │
┌──────────────────────────────┐    │
│      SUBSCRIPTION            │    │
├──────────────────────────────┤    │
│ _id (ObjectId)               │    │
│ userId (ObjectId) ───────────┼────┘
│ plan (String)                │
│ price (Number)               │
│ startDate (Date)             │
│ endDate (Date)               │
│ status (String)              │
│ paymentStatus (String)       │
│ createdAt (Date)             │
└──────────────────────────────┘

┌──────────────────────────────┐
│           OTP                │
├──────────────────────────────┤
│ _id (ObjectId)               │
│ phone (String)               │
│ code (String)                │
│ attempts (Number)            │
│ maxAttempts (Number)         │
│ expiresAt (Date) ◄─ Auto-del │
│ createdAt (Date)             │
└──────────────────────────────┘
```

---

## 🔄 STATE MANAGEMENT (React)

```
┌─────────────────────────────────────────┐
│      AuthContext (Global State)         │
├─────────────────────────────────────────┤
│ user: {                                 │
│   id, phone, name, email,               │
│   subscriptionStatus, subscriptionPlan  │
│ } | null                                │
│                                         │
│ token: string | null                    │
│ loading: boolean                        │
│                                         │
│ Methods:                                │
│ - sendOtp(phone)                        │
│ - verifyOtp(phone, code)                │
│ - logout()                              │
│ - checkAuth(token)                      │
└─────────────────────────────────────────┘
         ▲
         │ useAuth() hook
         │
    ┌────────┐
    │ Pages  │
    ├────────┤
    │ Home   │
    │ Login  │
    │ OTP    │
    │ Sub    │
    └────────┘
```

---

## 🛡️ SECURITY LAYERS

```
┌─────────────────┐
│  Frontend       │
├─────────────────┤
│ Input Validate  │ ← Phone: 10 digits only
│ Rate Limit OTP  │ ← 3 attempts max
│ Token Storage   │ ← localStorage
│ Protected Route │ ← Check token before render
└─────────────────┘
         ↓ HTTPS
┌─────────────────┐
│  Backend        │
├─────────────────┤
│ CORS Check      │ ← Frontend URL validation
│ Input Validate  │ ← Phone regex, code format
│ Rate Limit      │ ← Max 3 attempts per OTP
│ JWT Verify      │ ← Token signature check
│ Token Expiry    │ ← 30-day limit
│ OTP Expiry      │ ← 5-minute limit
└─────────────────┘
         ↓
┌─────────────────┐
│  Database       │
├─────────────────┤
│ Password Hash   │ ← bcryptjs (if used)
│ TTL Index       │ ← Auto-delete expired OTP
│ Unique Index    │ ← No duplicate phones
└─────────────────┘
```

---

## 📊 DATA FLOW DIAGRAM

```
User Input → Validation → API Call → JWT Check → Database → Response

┌──────────────┐     ┌───────────────┐     ┌─────────────────┐
│ Phone Input  │────→│ Is 10 digits? │────→│ Valid? Continue │
└──────────────┘     └───────────────┘     └─────────────────┘
                                                    ↓
                                           ┌─────────────────┐
                                           │ POST /send-otp  │
                                           └─────────────────┘
                                                    ↓
                                           ┌─────────────────┐
                                           │ Delete old OTP  │
                                           │ Generate code   │
                                           │ Send via Twilio │
                                           │ Store in DB     │
                                           └─────────────────┘
                                                    ↓
                                           ┌─────────────────┐
                                           │ Response sent   │
                                           │ to frontend     │
                                           └─────────────────┘

(Second step)

┌──────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│ OTP Code Input   │────→│ Is 6 digits?     │────→│ Valid? Continue    │
└──────────────────┘     └──────────────────┘     └────────────────────┘
                                                           ↓
                                                  ┌────────────────────┐
                                                  │ POST /verify-otp   │
                                                  └────────────────────┘
                                                           ↓
                                    ┌──────────────────────────────────┐
                                    │ Find OTP in DB                   │
                                    │ Check expiry ✓                   │
                                    │ Check attempts ✓                 │
                                    │ Check code match ✓               │
                                    │ Create/Find user                 │
                                    │ Generate JWT token               │
                                    │ Delete OTP                       │
                                    └──────────────────────────────────┘
                                                           ↓
                                    ┌──────────────────────────────────┐
                                    │ Response: {token, user}          │
                                    │ Store token in localStorage      │
                                    └──────────────────────────────────┘

(Third step - Protected Route)

┌──────────────────────┐     ┌─────────────────────────┐
│ Click "Premium"      │────→│ Check token exists      │
└──────────────────────┘     └─────────────────────────┘
                                       ↓
                             ┌─────────────────────────┐
                             │ Token found? ✓          │
                             │ Navigate to /subscription
                             └─────────────────────────┘
                                       ↓
                             ┌─────────────────────────┐
                             │ Show subscription plans │
                             └─────────────────────────┘
```

---

This architecture ensures:
- ✅ Scalable design
- ✅ Secure authentication
- ✅ Clear separation of concerns
- ✅ Easy maintenance
- ✅ Production-ready code

