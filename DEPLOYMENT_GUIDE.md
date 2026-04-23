# 🌐 DEPLOYMENT GUIDE - NEWS APP

Complete step-by-step guide to deploy your Login & Subscription system.

---

## 📋 CHECKLIST BEFORE DEPLOYMENT

- [ ] Backend `.env` file filled with real credentials
- [ ] MongoDB database ready (Atlas or local)
- [ ] Twilio account set up with SMS capability
- [ ] Frontend build tested locally (`npm run build`)
- [ ] All API calls tested in dev mode
- [ ] Git repository initialized (if using version control)

---

## 🗄️ STEP 1: DEPLOY DATABASE (MongoDB)

### Use MongoDB Atlas (Recommended)

1. **Create Account** → https://www.mongodb.com/cloud/atlas
2. **Create Cluster**:
   - Choose free tier
   - Select region close to your users
3. **Get Connection String**:
   - Click "Connect" → "Connect Your Application"
   - Copy string: `mongodb+srv://username:password@cluster.mongodb.net/news-app`
4. **Create Database User**:
   - Username: `newsapp_user`
   - Password: (save securely)
5. **Allow IP Access**:
   - Security → Network Access
   - Add your IP or `0.0.0.0/0` (not for production!)

**Connection String Format:**
```
mongodb+srv://newsapp_user:yourpassword@news-cluster.mongodb.net/news-app?retryWrites=true&w=majority
```

---

## 🚀 STEP 2: DEPLOY BACKEND

### Option A: Deploy to Heroku

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Login to Heroku**:
   ```powershell
   heroku login
   ```
3. **Create App**:
   ```powershell
   cd backend
   heroku create news-app-backend
   ```
4. **Set Environment Variables**:
   ```powershell
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set TWILIO_ACCOUNT_SID=your_sid
   heroku config:set TWILIO_AUTH_TOKEN=your_token
   heroku config:set TWILIO_PHONE_NUMBER=+1234567890
   heroku config:set JWT_SECRET=your_random_secret_key_12345
   heroku config:set FRONTEND_URL=https://yourdomain.com
   ```
5. **Deploy**:
   ```powershell
   git push heroku main
   ```
6. **View Logs**:
   ```powershell
   heroku logs --tail
   ```

**Your backend URL**: `https://news-app-backend.herokuapp.com`

---

### Option B: Deploy to Railway.app

1. **Go to**: https://railway.app
2. **Connect GitHub** (or drag & drop backend folder)
3. **Add Services**:
   - Select "Discover" → MongoDB (auto-setup)
4. **Set Environment Variables**:
   - Railway dashboard → Variables tab
   - Copy all from `.env` file
5. **Deploy**: Auto-deploys on git push

**Your backend URL**: `https://your-project.railway.app`

---

### Option C: Deploy to Render.com

1. **Go to**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables**: Add from `.env`
5. **Deploy**: Auto-deploys

**Your backend URL**: `https://your-service.onrender.com`

---

## 🌍 STEP 3: DEPLOY FRONTEND TO GODADDY

### Option A: Using GoDaddy Hosting (cPanel)

1. **Build Frontend**:
   ```powershell
   cd c:\Users\91989\OneDrive\Desktop\NEWS
   npm run build
   # Creates 'dist' folder
   ```

2. **Update API URLs** (BEFORE building):
   - Edit `src/context/AuthContext.jsx`
   - Replace `http://localhost:5000` with your backend URL
   - Example: `https://news-app-backend.herokuapp.com`

3. **Rebuild**:
   ```powershell
   npm run build
   ```

4. **Upload to GoDaddy**:
   - Log in to GoDaddy cPanel
   - Open "File Manager"
   - Navigate to `public_html`
   - Delete old files (if any)
   - Upload all files from `dist/` folder

5. **Create `.htaccess`** (important for React Router):
   - In `public_html`, create file `.htaccess`
   - Paste this:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

6. **Test**: Visit your domain → should see news app

---

### Option B: Deploy Frontend to Netlify (Easier)

1. **Build**:
   ```powershell
   npm run build
   ```

2. **Go to**: https://netlify.com
3. **Drag & drop `dist` folder** → auto-deploys
4. **Set Environment Variables**:
   - Site Settings → Build & Deploy → Environment
   - (Or update URLs before building)

**Your frontend URL**: `https://your-site.netlify.app`

---

### Option C: Deploy to Vercel

1. **Go to**: https://vercel.com
2. **Import Project** → Select git repository
3. **Deploy** → Done!

---

## 🔧 UPDATE FRONTEND AFTER BACKEND DEPLOYMENT

Edit `src/context/AuthContext.jsx`:

```javascript
// BEFORE (Local):
const response = await fetch('http://localhost:5000/api/auth/check', {

// AFTER (Production):
const response = await fetch('https://news-app-backend.herokuapp.com/api/auth/check', {
```

**Replace in 3 places:**
1. `sendOtp` function
2. `verifyOtp` function  
3. `checkAuth` function

Then rebuild and redeploy!

---

## 📊 POST-DEPLOYMENT CHECKLIST

After deployment, test:

- [ ] Frontend loads without errors
- [ ] Login page accessible (`/login`)
- [ ] OTP sending works
- [ ] OTP verification works
- [ ] Subscription page loads (`/subscription`)
- [ ] Can subscribe to plans
- [ ] User info persists on refresh
- [ ] Logout works
- [ ] Protected routes work

---

## 🔒 SECURITY CHECKLIST

- [ ] All `.env` variables are secrets (not in code)
- [ ] MongoDB IP whitelist configured
- [ ] HTTPS enabled on frontend (auto on most platforms)
- [ ] Twilio credentials not exposed
- [ ] JWT secret is random & strong
- [ ] CORS configured for production domain only

---

## 🆘 TROUBLESHOOTING DEPLOYMENT

### Backend won't start:
```powershell
# Check logs
heroku logs --tail
# or
railway logs
```

### Frontend can't connect to backend:
- Check CORS configuration
- Verify backend URL in AuthContext.jsx
- Check network tab in browser DevTools

### MongoDB connection errors:
- Verify connection string
- Check IP whitelist on MongoDB Atlas
- Ensure database exists

### Twilio OTP not sending:
- Check Twilio balance/credits
- Verify phone number format
- Check SMS logs in Twilio dashboard

---

## 💰 COST BREAKDOWN

| Service | Free Tier | Production |
|---------|-----------|-----------|
| MongoDB Atlas | 500 MB | $9-57/month |
| Heroku | Deprecated | $7+/month |
| Railway | 500 hrs | $5+/month |
| Render | Free tier available | Variable |
| Netlify | 100 GB bandwidth | Included |
| GoDaddy Hosting | $2.99 /month | $2.99-8.99/month |
| Twilio SMS | $0.0075 per SMS | $0.0075 per SMS |

---

## 📞 PRODUCTION TIPS

1. **Set up monitoring**: Use New Relic, DataDog, or Sentry
2. **Enable backups**: MongoDB Atlas auto-backup
3. **Add logging**: Store logs for debugging
4. **Rate limiting**: Prevent abuse of auth endpoints
5. **Email support**: Add help email to your app
6. **Status page**: Monitor uptime with Uptime Robot
7. **CDN**: Use Cloudflare for faster delivery

---

## 🎉 YOU'RE LIVE!

Once deployed:
1. Share your domain with users
2. Users can sign up with phone OTP
3. Users can choose subscription plans
4. View user data in MongoDB Atlas

**Congratulations! Your news app is now live!** 🚀

