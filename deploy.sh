#!/bin/bash

echo "🚀 Preparing backend for Vercel deployment..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Please make sure you're logged in to Vercel:"
vercel login

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Backend deployment complete!"
echo "📝 Don't forget to:"
echo "1. Update CORS_ORIGINS in Vercel environment variables"
echo "2. Set DATABASE_URL if using external database"
echo "3. Update frontend API URLs to point to Vercel domain"