# 🚀 Production Deployment Guide - Complete Setup

## Overview
This guide will help you deploy both Backend (Flask) and Frontend (Next.js) to Vercel with the new authentication system.

---

## 📋 Pre-Deployment Checklist

### Backend Requirements
- ✅ Database setup complete (`db/secueralgo.db`)
- ✅ Authentication system working locally
- ✅ `.env` file configured
- ✅ All dependencies in `requirements.txt`

### Frontend Requirements
- ✅ Next.js app building successfully
- ✅ Environment variables configured
- ✅ API endpoints tested locally

---

## 🔧 Step 1: Backend Deployment (Flask to Vercel)

### 1.1 Create Production Environment File

Create `.env.production` in root directory:

```env
# Database Configuration (Vercel uses /tmp)
DATABASE_URL=sqlite:///tmp/secueralgo.db

# Flask Configuration
FLASK_ENV=production
APP_KEY=your-super-secret-production-key-change-this-12345

# Rate Limiting
LOGIN_RATE_LIMIT_MIN=20 per minute
LOGIN_RATE_LIMIT_HOUR=100 per hour

# CORS Origins (Update with your frontend URL)
CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://www.your-frontend-domain.vercel.app

# Vercel Configuration
VERCEL=1
NGROK_ALLOW=FALSE
```

### 1.2 Update `api/index.py` for Production

The file should initialize database on startup:

```python
from app import app_instance as app
from database.auth_db import init_db

# Initialize database tables on Vercel startup
try:
    init_db()
    print("✅ Database initialized on Vercel")
except Exception as e:
    print(f"⚠️ Database initialization warning: {str(e)}")
```

### 1.3 Deploy Backend to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend (from root directory)
vercel --prod
```

### 1.4 Set Environment Variables in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add these variables:

```
FLASK_ENV = production
DATABASE_URL = sqlite:///tmp/secueralgo.db
APP_KEY = your-super-secret-production-key
CORS_ORIGINS = https://your-frontend-domain.vercel.app
VERCEL = 1
NGROK_ALLOW = FALSE
```

### 1.5 Test Backend Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-backend.vercel.app/health

# API documentation
curl https://your-backend.vercel.app/

# Session check
curl https://your-backend.vercel.app/auth/new/session
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "Backend is running on Vercel!",
  "environment": "production",
  "database": "connected"
}
```

---

## 🎨 Step 2: Frontend Deployment (Next.js to Vercel)

### 2.1 Update Frontend Environment Variables

Update `nextjs-frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### 2.2 Deploy Frontend to Vercel

```bash
# Navigate to frontend directory
cd nextjs-frontend

# Deploy to Vercel
vercel --prod
```

### 2.3 Update Backend CORS with Frontend URL

After frontend deployment, update backend environment variables:

1. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
2. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS = https://your-actual-frontend-url.vercel.app
   ```
3. Redeploy backend:
   ```bash
   vercel --prod
   ```

---

## 🔄 Step 3: Database Initialization on Vercel

### Important: Vercel Database Limitations

⚠️ **Vercel uses ephemeral storage** - Database in `/tmp/` is reset on each deployment.

### Solution Options:

#### Option A: Auto-Initialize on Startup (Current Setup)
The database is automatically created when the app starts. However, data will be lost on redeployment.

#### Option B: Use External Database (Recommended for Production)

**PostgreSQL Setup:**

1. Create a PostgreSQL database (e.g., on Supabase, Railway, or Neon)

2. Update `requirements.txt`:
   ```
   psycopg2-binary==2.9.9
   ```

3. Update `.env.production`:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

4. Update `database/auth_db.py` to support PostgreSQL:
   ```python
   # Change SQLite-specific code to be database-agnostic
   ```

---

## 🧪 Step 4: Testing Production Deployment

### 4.1 Test Authentication Flow

1. **Register New User:**
   - Go to: `https://your-frontend.vercel.app/new-register`
   - Create account with username, email, password
   - Should redirect to login

2. **Login:**
   - Go to: `https://your-frontend.vercel.app/new-login`
   - Login with credentials
   - Should redirect to dashboard

3. **Session Persistence:**
   - Refresh the page
   - Should remain logged in
   - Check browser cookies

4. **Logout:**
   - Click logout
   - Should redirect to login page
   - Session should be cleared

### 4.2 Test API Endpoints

```bash
# Set your backend URL
BACKEND_URL="https://your-backend.vercel.app"

# Test registration
curl -X POST $BACKEND_URL/auth/new/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123"
  }'

# Test login
curl -X POST $BACKEND_URL/auth/new/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser",
    "password": "Password123"
  }' \
  -c cookies.txt

# Test session (with cookies)
curl -X GET $BACKEND_URL/auth/new/session \
  -b cookies.txt
```

---

## 📝 Step 5: Post-Deployment Configuration

### 5.1 Update CORS Origins

In Vercel Dashboard → Backend → Environment Variables:

```
CORS_ORIGINS = https://your-frontend.vercel.app,https://www.your-frontend.vercel.app,http://localhost:3000
```

(Keep localhost for local development)

### 5.2 Set Strong Secret Key

Generate a strong secret key:

```python
import secrets
print(secrets.token_hex(32))
```

Update in Vercel Dashboard:
```
APP_KEY = <generated-secret-key>
```

### 5.3 Enable Production Optimizations

In `app.py`, ensure:
```python
app.debug = False  # For production
```

---

## 🔒 Security Checklist

- ✅ Strong `APP_KEY` set in production
- ✅ `FLASK_ENV=production`
- ✅ Debug mode disabled
- ✅ CORS restricted to frontend domain only
- ✅ Rate limiting enabled
- ✅ HTTPS enforced
- ✅ Secure session cookies
- ✅ Password hashing with bcrypt
- ✅ SQL injection protection (SQLAlchemy)

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:**
1. Check `CORS_ORIGINS` in backend environment variables
2. Ensure frontend URL is correct (with https://)
3. Include both www and non-www versions
4. Redeploy backend after changes

### Issue: Database Not Found

**Solution:**
1. Check `DATABASE_URL` in environment variables
2. Ensure `init_db()` is called in `api/index.py`
3. Check Vercel logs: `vercel logs`

### Issue: Session Not Persisting

**Solution:**
1. Check cookie settings in browser
2. Ensure `credentials: 'include'` in frontend fetch calls
3. Verify CORS allows credentials
4. Check session cookie domain settings

### Issue: 500 Internal Server Error

**Solution:**
1. Check Vercel logs: `vercel logs`
2. Verify all environment variables are set
3. Check database initialization
4. Test endpoints locally first

---

## 📊 Monitoring & Logs

### View Backend Logs
```bash
vercel logs <your-backend-url>
```

### View Frontend Logs
```bash
cd nextjs-frontend
vercel logs <your-frontend-url>
```

### Monitor in Vercel Dashboard
- Go to: https://vercel.com/dashboard
- Select project
- View Analytics, Logs, and Performance

---

## 🔄 Continuous Deployment

### Automatic Deployments

Connect your GitHub repository to Vercel:

1. Go to Vercel Dashboard
2. Import Git Repository
3. Select your repo
4. Configure:
   - **Backend:** Root directory = `/`
   - **Frontend:** Root directory = `/nextjs-frontend`
5. Set environment variables
6. Deploy

Now every push to `main` branch will auto-deploy!

---

## 📦 Deployment Scripts

### Backend Deployment Script

Create `deploy-backend.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying Backend to Vercel..."

# Deploy to Vercel
vercel --prod

echo "✅ Backend deployed!"
echo "🔗 Check: https://vercel.com/dashboard"
```

### Frontend Deployment Script

Create `deploy-frontend.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying Frontend to Vercel..."

cd nextjs-frontend

# Deploy to Vercel
vercel --prod

cd ..

echo "✅ Frontend deployed!"
echo "🔗 Check: https://vercel.com/dashboard"
```

### Full Deployment Script

Create `deploy-all.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying Full Stack to Vercel..."

# Deploy Backend
echo "📦 Deploying Backend..."
vercel --prod

# Get backend URL
BACKEND_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*')
echo "Backend URL: $BACKEND_URL"

# Update frontend env
echo "📝 Updating Frontend Environment..."
cd nextjs-frontend
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.production

# Deploy Frontend
echo "📦 Deploying Frontend..."
vercel --prod

cd ..

echo "✅ Full deployment complete!"
```

---

## 🎯 Production URLs

After deployment, you'll have:

- **Backend API:** `https://your-backend.vercel.app`
- **Frontend App:** `https://your-frontend.vercel.app`

### Update These URLs In:

1. **Frontend `.env.production`:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   ```

2. **Backend Environment Variables:**
   ```env
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```

---

## ✅ Final Checklist

### Backend
- ✅ Deployed to Vercel
- ✅ Environment variables set
- ✅ Database initializing on startup
- ✅ Health check endpoint working
- ✅ CORS configured with frontend URL
- ✅ Rate limiting enabled
- ✅ Logs accessible

### Frontend
- ✅ Deployed to Vercel
- ✅ Environment variables set
- ✅ API URL pointing to backend
- ✅ Build successful
- ✅ Pages loading correctly
- ✅ Authentication working

### Testing
- ✅ User registration working
- ✅ User login working
- ✅ Session persistence working
- ✅ Dashboard accessible
- ✅ Logout working
- ✅ CORS working
- ✅ No console errors

---

## 🎉 Success!

Your TradingBridge application is now live in production!

**Next Steps:**
1. Share the frontend URL with users
2. Monitor logs for any issues
3. Set up error tracking (e.g., Sentry)
4. Configure custom domain (optional)
5. Set up database backups (if using external DB)

---

## 📞 Support

If you encounter issues:
1. Check Vercel logs
2. Verify environment variables
3. Test locally first
4. Check CORS configuration
5. Review this guide

**Common Commands:**
```bash
# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>

# Check environment variables
vercel env ls
```

---

**Deployment Date:** 2025-10-24  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
