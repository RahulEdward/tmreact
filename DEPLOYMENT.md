# 🚀 Vercel Deployment Guide

## Backend Deployment to Vercel

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Quick Deploy
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Manual Deploy Steps

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard**
   ```
   FLASK_ENV=production
   DATABASE_URL=sqlite:///tmp/secueralgo.db
   APP_KEY=your-secret-key-here
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   VERCEL=1
   NGROK_ALLOW=FALSE
   ```

3. **Update Frontend API URLs**
   - Replace `http://localhost:5000` with your Vercel backend URL
   - Update in all frontend files

### Important Notes

- ✅ **SQLite Database**: Uses `/tmp` directory on Vercel (ephemeral)
- ✅ **SocketIO**: Configured for polling mode (Vercel compatible)
- ✅ **CORS**: Pre-configured for common domains
- ✅ **Rate Limiting**: Enabled for production
- ✅ **Error Handling**: Production-ready error responses

### File Structure
```
├── vercel.json          # Vercel configuration
├── requirements.txt     # Python dependencies
├── app.py              # Main Flask app (Vercel ready)
├── extensions.py       # SocketIO config for Vercel
├── deploy.bat          # Windows deployment script
├── deploy.sh           # Linux/Mac deployment script
└── DEPLOYMENT.md       # This guide
```

### Post-Deployment Checklist

1. ✅ Backend deployed to Vercel
2. ⬜ Environment variables set in Vercel dashboard
3. ⬜ Frontend API URLs updated
4. ⬜ CORS origins updated with frontend domain
5. ⬜ Test webhook functionality
6. ⬜ Test TradingView JSON generation

### Troubleshooting

**Database Issues:**
- Vercel uses ephemeral storage, data resets on each deployment
- Consider using external database (PostgreSQL, MySQL) for production

**SocketIO Issues:**
- Vercel doesn't support WebSocket, uses polling mode
- Real-time features may have slight delays

**CORS Issues:**
- Update CORS_ORIGINS environment variable with your frontend domain
- Add both www and non-www versions if needed

### Next Steps

After backend deployment:
1. Deploy frontend to Vercel/Netlify
2. Update all API endpoints in frontend
3. Test complete application flow
4. Set up monitoring and logging

🎉 **Your backend is now ready for Vercel deployment!**