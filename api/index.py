"""
Vercel Serverless Function Entry Point
This file imports the main Flask app for Vercel deployment
"""
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    # Import the main Flask app
    from app import app_instance as app
    
    # Initialize database on first request (lazy loading)
    @app.before_request
    def init_database():
        """Initialize database on first request"""
        if not hasattr(app, '_database_initialized'):
            try:
                from database.auth_db import init_db
                init_db()
                app._database_initialized = True
                print("✅ Database initialized on Vercel")
            except Exception as e:
                print(f"⚠️ Database init warning: {str(e)}")
                app._database_initialized = True  # Mark as attempted
    
    print("✅ TradingBridge API ready on Vercel")
    
except Exception as e:
    print(f"❌ Error loading app: {str(e)}")
    import traceback
    traceback.print_exc()
    
    # Create a minimal error app
    from flask import Flask, jsonify
    app = Flask(__name__)
    
    @app.route('/')
    def error_home():
        return jsonify({
            "status": "error",
            "message": "Application failed to load",
            "error": str(e)
        }), 500
    
    @app.route('/health')
    def error_health():
        return jsonify({
            "status": "error",
            "message": "Application failed to load",
            "error": str(e)
        }), 500