# 🚀 Vercel Deployment - Quick Start Guide

## Prerequisites

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

---

## 🎯 Quick Deploy (Recommended)

### Option 1: Deploy Everything at Once

```bash
# Windows
deploy-all.bat

# Linux/Mac
chmod +x deploy-all.sh
./deploy-all.sh
```

### Option 2: Deploy Separately

**Backend:**
```bash
# Windows
deploy-backend.bat

# Linux/Mac
./deploy-backend.sh
```

**Frontend:**
```bash
# Windows
deploy-frontend.bat

# Linux/Mac
./deploy-frontend.sh
```

---

## ⚙️ Environment Variables Setup

### Backend Environment Variables (Vercel Dashboard)

Go to: **Vercel Dashboard → Your Backend Project → Settings → Environment Variables**

Add these variables:

```env
FLASK_ENV=production
DATABASE_URL=sqlite:///tmp/secueralgo.db
APP_KEY=your-super-secret-key-change-this
CORS_ORIGINS=https://your-frontend-url.vercel.app
VERCEL=1
NGROK_ALLOW=FALSE
LOGIN_RATE_LIMIT_MIN=20 per minute
LOGIN_RATE_LIMIT_HOUR=100 per hour
```

### Frontend Environment Variables (Vercel Dashboard)

Go to: **Vercel Dashboard → Your Frontend Project → Settings → Environment Variables**

Add these variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

---

## 🔄 After Setting Environment Variables

**Redeploy both projects:**

```bash
# Backend
vercel --prod

# Frontend
cd nextjs-frontend
vercel --prod
```

---

## ✅ Testing Your Deployment

### 1. Test Backend Health

```bash
curl https://your-backend-url.vercel.app/health
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

### 2. Test Frontend

Open in browser:
```
https://your-frontend-url.vercel.app
```

### 3. Test Authentication

1. Go to: `https://your-frontend-url.vercel.app/new-register`
2. Register a new user
3. Login at: `https://your-frontend-url.vercel.app/new-login`
4. Access dashboard

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error

**Solution:**
1. Update `CORS_ORIGINS` in backend environment variables
2. Include your exact frontend URL
3. Redeploy backend

### Issue: Database Not Found

**Solution:**
1. Check `DATABASE_URL` is set to `sqlite:///tmp/secueralgo.db`
2. Ensure `VERCEL=1` is set
3. Check Vercel logs: `vercel logs`

### Issue: 500 Internal Server Error

**Solution:**
1. Check Vercel logs: `vercel logs <your-url>`
2. Verify all environment variables are set
3. Ensure `api/index.py` is importing correctly

---

## 📊 View Logs

```bash
# Backend logs
vercel logs <your-backend-url>

# Frontend logs
cd nextjs-frontend
vercel logs <your-frontend-url>
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Change `APP_KEY` to a strong random key
- [ ] Update `CORS_ORIGINS` with only your frontend domain
- [ ] Verify `FLASK_ENV=production`
- [ ] Test all authentication flows
- [ ] Check rate limiting is working
- [ ] Verify HTTPS is enforced

---

## 📝 Important Notes

### Database on Vercel

⚠️ **Vercel uses ephemeral storage** - Data in `/tmp/` is reset on each deployment.

**For Production:**
- Use external database (PostgreSQL, MySQL)
- Recommended: Supabase, Railway, or Neon
- Update `DATABASE_URL` to point to external DB

### Current Setup

- ✅ Works for testing and development
- ✅ Database auto-initializes on startup
- ⚠️ Data will be lost on redeployment
- ⚠️ Not suitable for production with real users

---

## 🎯 Production-Ready Setup (Recommended)

### 1. Use External Database

**Example with Supabase (PostgreSQL):**

1. Create Supabase project
2. Get connection string
3. Update backend environment variables:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
4. Update `requirements.txt`:
   ```
   psycopg2-binary==2.9.9
   ```
5. Redeploy

### 2. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Update environment variables with new domain

---

## 🔄 Continuous Deployment

### Connect GitHub Repository

1. Go to Vercel Dashboard
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Backend:** Root directory = `/`
   - **Frontend:** Root directory = `/nextjs-frontend`
5. Set environment variables
6. Deploy

**Now every push to `main` branch will auto-deploy!**

---

## 📞 Support Commands

```bash
# List all deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# View project info
vercel inspect <deployment-url>
```

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Local development working
- [ ] Database setup complete
- [ ] Authentication tested locally
- [ ] Environment variables prepared
- [ ] Vercel CLI installed and logged in

### Backend Deployment
- [ ] Backend deployed to Vercel
- [ ] Environment variables set
- [ ] Health check endpoint working
- [ ] Database initializing
- [ ] Logs checked for errors

### Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] API URL pointing to backend
- [ ] Build successful
- [ ] Pages loading correctly

### Post-Deployment
- [ ] CORS configured correctly
- [ ] Authentication flow tested
- [ ] User registration working
- [ ] User login working
- [ ] Dashboard accessible
- [ ] No console errors
- [ ] Mobile responsive checked

---

## 🎉 Success!

Your application is now live on Vercel!

**URLs:**
- Backend: `https://your-backend.vercel.app`
- Frontend: `https://your-frontend.vercel.app`

**Next Steps:**
1. Share with users
2. Monitor logs
3. Set up error tracking (Sentry)
4. Configure custom domain
5. Set up external database for production

---

**Need Help?**
- Check logs: `vercel logs`
- Review: `PRODUCTION_DEPLOYMENT_GUIDE.md`
- Vercel Docs: https://vercel.com/docs

---

**Last Updated:** 2025-10-24  
**Version:** 1.0.0
