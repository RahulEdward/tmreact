"""
Vercel Serverless Function Entry Point
This file imports the main Flask app and initializes the database for production
"""
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the main Flask app
from app import app_instance as app

# Initialize database tables on Vercel startup
print("🚀 Initializing TradingBridge on Vercel...")

try:
    from database.auth_db import init_db
    init_db()
    print("✅ Database initialized successfully on Vercel")
except Exception as e:
    print(f"⚠️ Database initialization warning: {str(e)}")
    print("Database will be created on first request")

print("✅ TradingBridge API ready on Vercel!")

# The app is already imported above with all routes registered
# All authentication endpoints are available from blueprints/auth.py
# All other endpoints are available from their respective blueprints

# For Vercel serverless function
if __name__ == '__main__':
    app.run(debug=False)