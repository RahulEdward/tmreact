"""
Vercel Serverless Function - Simplified Entry Point
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set Vercel environment
os.environ['VERCEL'] = '1'

# Simple test to see if imports work
print("Starting Vercel function...")

try:
    # Try importing Flask first
    from flask import Flask, jsonify
    print("Flask imported successfully")
    
    # Try importing the main app
    from app import app_instance as app
    print("Main app imported successfully")
    
except Exception as e:
    print(f"ERROR importing: {str(e)}")
    import traceback
    traceback.print_exc()
    
    # Create minimal error app
    app = Flask(__name__)
    
    @app.route('/')
    @app.route('/health')
    def error():
        return jsonify({
            "status": "error",
            "message": f"Import failed: {str(e)}",
            "hint": "Check Vercel logs for details"
        }), 500

# Export for Vercel
handler = app
