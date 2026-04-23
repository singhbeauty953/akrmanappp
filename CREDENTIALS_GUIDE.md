# 🔑 QUICK START - GET YOUR CREDENTIALS

This guide helps you get all necessary credentials for the login system.

---

## 1️⃣ MONGODB CREDENTIALS

### Free Option: MongoDB Atlas (Cloud)

**Steps:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account with Google/GitHub
4. Create organization name → Continue
5. Create project (default name is fine)
6. Click "Create" under "Shared"
7. Choose cloud provider: AWS / Google Cloud / Azure
8. Choose region closest to you
9. Click "Create Cluster" (takes 2-3 minutes)

**Get Connection String:**
1. Click "Connect"
2. Choose "Drivers" → Node.js
3. Copy connection string
4. Save to `backend/.env` as:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/news-app
   ```

**Full URL Example:**
```
mongodb+srv://newsapp:myPassword123@cluster0.abc123.mongodb.net/news-app?retryWrites=true&w=majority
```

---

## 2️⃣ TWILIO CREDENTIALS

### Get Free SMS Credits

**Steps:**
1. Go to https://www.twilio.com/try-twilio
2. Sign up with email (free account gets $15 credit)
3. Verify email + phone number
4. Dashboard opens automatically

**Get Account SID & Auth Token:**
1. On dashboard, you see:
   - Account SID: `ACxxxxxxxxxxxxx`
   - Auth Token: `your_auth_token_here`
2. Copy both to `backend/.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   ```

**Get Phone Number:**
1. Click "Phone Numbers" → "Get Started"
2. Choose country (India = +91)
3. Click "Get a Number"
4. Copy phone number
5. Add to `.env`:
   ```
   TWILIO_PHONE_NUMBER=+11234567890
   ```

**Test SMS:**
1. Go to Console → Messaging → Send Test SMS
2. Send to your number
3. You should receive SMS!

---

## 3️⃣ GENERATE JWT SECRET

### Create Random Secret

**Option A: Online Generator**
1. Go to https://www.random.org/strings/
2. Generate 32 character string
3. Add to `.env`:
   ```
   JWT_SECRET=abc123xyz789abc123xyz789abc123xy
   ```

**Option B: PowerShell**
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 126) }) -join ''))
```

**Option C: Linux/Mac**
```bash
openssl rand -base64 32
```

---

## 📝 COMPLETE `.env` FILE TEMPLATE

Copy this to `backend/.env` and fill in your credentials:

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/news-app

# JWT
JWT_SECRET=your_random_secret_key_at_least_32_chars
JWT_EXPIRE=30d

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+91xxxxxxxxxxxx

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# OTP Settings
OTP_EXPIRY=5
OTP_MAX_ATTEMPTS=3
```

---

## ✅ VERIFY SETUP

After filling `.env`, test each connection:

### Test MongoDB
```powershell
cd backend
node
> const mongoose = require('mongoose');
> mongoose.connect(process.env.MONGODB_URI);
> // Wait for connection
> mongoose.connection.close();
> process.exit();
```

### Test Twilio
```powershell
# In backend folder
node
> const twilio = require('twilio');
> const client = twilio('YOUR_SID', 'YOUR_TOKEN');
> client.messages.create({ body: 'Test', from: '+12345...', to: '+91xxxxxxxx' });
> // Should return message object
```

### Test Backend
```powershell
npm start
# Should show: ✓ MongoDB connected
# and server running on port 5000
```

---

## 🛠️ TROUBLESHOOTING

### MongoDB Connection Fails
**Error:** `MongoServerError: connection failed`
- Check internet connection
- Verify credentials in connection string
- Go to MongoDB Atlas → Network Access → Add IP Address
- Click "Add Current IP Address" or use `0.0.0.0/0` (for dev only)

### Twilio SMS Not Sending
**Error:** `Invalid From number`
- Verify phone number format: `+91xxxxxxxxxx` (India example)
- Check Twilio account has credit ($15 free)
- Go to Twilio Console → Verified Caller IDs (if needed)

### JWT Secret Error
**Error:** `jwt malformed`
- Regenerate secret: at least 32 characters
- Ensure no spaces or special characters

---

## 💡 QUICK TEST

Once `.env` is ready:

```powershell
cd backend
npm start

# In another terminal:
cd backend
node
> const mongoose = require('mongoose');
> mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✓ DB Connected')).catch(e => console.log('✗ Error:', e.message));
```

---

## 🚀 NEXT STEPS

1. ✅ Fill in `backend/.env` with credentials above
2. ✅ Test MongoDB connection
3. ✅ Test Twilio SMS
4. ✅ Start backend: `npm start`
5. ✅ Start frontend: `npm run dev`
6. ✅ Test login with OTP
7. ✅ Deploy to production

**Need help?** Check SETUP_GUIDE.md or DEPLOYMENT_GUIDE.md

