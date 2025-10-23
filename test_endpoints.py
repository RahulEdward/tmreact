#!/usr/bin/env python3
"""
Quick test to check available Flask routes
"""
import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app

def list_routes():
    """List all available routes in the Flask app"""
    print("Available routes in Flask app:")
    print("=" * 50)
    
    with app.app_context():
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods - {'HEAD', 'OPTIONS'})
            print(f"{rule.rule:<40} [{methods}]")
    
    print("=" * 50)
    print(f"Total routes: {len(list(app.url_map.iter_rules()))}")

if __name__ == "__main__":
    list_routes()