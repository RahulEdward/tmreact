"""
Vercel Serverless Function Entry Point - Minimal Version
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set environment variable for Vercel
os.environ['VERCEL'] = '1'

# Import Flask app
try:
    from app import app_instance as app
except Exception as e:
    print(f"Error importing app: {e}")
    # Create minimal Flask app as fallback
    from flask import Flask, jsonify
    app = Flask(__name__)
    
    @app.route('/')
    @app.route('/health')
    def health():
        return jsonify({
            "status": "error",
            "message": f"Failed to load main app: {str(e)}"
        })

# Export for Vercel
handler = app
