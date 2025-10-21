# Flask Integration for React Frontend
# Complete integration solution with fallback strategy

from flask import Blueprint, send_from_directory, send_file, jsonify, redirect, url_for, current_app
import os
from datetime import datetime

# Create a blueprint for React integration
react_bp = Blueprint('react_bp', __name__)

def is_react_available():
    """Check if React build is available"""
    react_index = os.path.join(current_app.root_path, 'static', 'react', 'index.html')
    return os.path.exists(react_index)

def should_serve_react():
    """Determine if React should be served based on environment and availability"""
    # Check environment variable
    serve_react = os.getenv('SERVE_REACT_FRONTEND', 'false').lower() == 'true'
    # Check if React build is available
    react_available = is_react_available()
    
    return serve_react and react_available

# Serve React static assets
@react_bp.route('/static/react/<path:filename>')
def react_static(filename):
    """Serve React static assets with proper caching headers"""
    static_dir = os.path.join(current_app.root_path, 'static', 'react')
    return send_from_directory(static_dir, filename)

# API endpoint to check frontend status
@react_bp.route('/api/frontend-status')
def frontend_status():
    """Check React frontend availability and configuration"""
    react_index = os.path.join(current_app.root_path, 'static', 'react', 'index.html')
    react_available = os.path.exists(react_index)
    
    status = {
        'react_available': react_available,
        'serve_react_enabled': os.getenv('SERVE_REACT_FRONTEND', 'false').lower() == 'true',
        'should_serve_react': should_serve_react(),
        'build_time': None,
        'version': 'development'
    }
    
    if react_available:
        status['build_time'] = datetime.fromtimestamp(os.path.getmtime(react_index)).isoformat()
        
        # Try to read version from build manifest
        try:
            manifest_path = os.path.join(current_app.root_path, 'static', 'react', '.vite', 'manifest.json')
            if os.path.exists(manifest_path):
                import json
                with open(manifest_path, 'r') as f:
                    manifest = json.load(f)
                    status['version'] = 'production'
        except:
            pass
    
    return jsonify(status)

# Main route handler with fallback strategy
def create_react_route_handler(fallback_route=None, fallback_blueprint=None):
    """Create a route handler that serves React with fallback to Flask templates"""
    def route_handler():
        if should_serve_react():
            # Serve React app
            react_index = os.path.join(current_app.root_path, 'static', 'react', 'index.html')
            return send_file(react_index)
        else:
            # Fallback to Flask templates
            if fallback_route and fallback_blueprint:
                return redirect(url_for(f'{fallback_blueprint}.{fallback_route}'))
            elif fallback_route:
                return redirect(url_for(fallback_route))
            else:
                # Default fallback to core home
                return redirect(url_for('core_bp.home'))
    
    return route_handler

# Register React routes with fallbacks
@react_bp.route('/')
def serve_home():
    return create_react_route_handler('home', 'core_bp')()

@react_bp.route('/dashboard')
def serve_dashboard():
    return create_react_route_handler('dashboard', 'dashboard_bp')()

@react_bp.route('/orderbook')
def serve_orderbook():
    return create_react_route_handler('orderbook', 'orders_bp')()

@react_bp.route('/tradebook')
def serve_tradebook():
    return create_react_route_handler('tradebook', 'orders_bp')()

@react_bp.route('/positions')
def serve_positions():
    return create_react_route_handler('positions', 'orders_bp')()

@react_bp.route('/holdings')
def serve_holdings():
    return create_react_route_handler('holdings', 'orders_bp')()

@react_bp.route('/apikey')
def serve_apikey():
    return create_react_route_handler('api_key', 'api_key_bp')()

@react_bp.route('/logs')
def serve_logs():
    return create_react_route_handler('logs', 'log_bp')()

@react_bp.route('/search')
def serve_search():
    return create_react_route_handler('search', 'search_bp')()

@react_bp.route('/tradingview')
def serve_tradingview():
    return create_react_route_handler('tradingview', 'tv_json_bp')()

@react_bp.route('/login')
def serve_login():
    return create_react_route_handler('login', 'auth_bp')()

@react_bp.route('/register')
def serve_register():
    return create_react_route_handler('register', 'auth_bp')()

# Catch-all route for React Router (must be last)
@react_bp.route('/<path:path>')
def serve_react_routes(path):
    """Catch-all route for React Router paths"""
    if should_serve_react():
        # Check if it's a static file request
        static_file = os.path.join(current_app.root_path, 'static', 'react', path)
        if os.path.exists(static_file) and os.path.isfile(static_file):
            return send_file(static_file)
        
        # Serve React app for client-side routing
        react_index = os.path.join(current_app.root_path, 'static', 'react', 'index.html')
        return send_file(react_index)
    else:
        # Let Flask handle unknown routes (will trigger 404)
        from flask import abort
        abort(404)

# CORS configuration for development
def configure_cors_for_development(app):
    """Configure CORS for development when React runs on different port"""
    try:
        from flask_cors import CORS
        
        if app.debug and os.getenv('ENABLE_CORS_DEV', 'false').lower() == 'true':
            CORS(app, 
                 origins=['http://localhost:5173', 'http://127.0.0.1:5173'], 
                 supports_credentials=True,
                 allow_headers=['Content-Type', 'Authorization'],
                 methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
            print(" * CORS enabled for development")
    except ImportError:
        print(" * flask-cors not installed, skipping CORS configuration")

# Integration helper functions
def setup_react_integration(app):
    """Complete setup function to integrate React with Flask app"""
    
    # Register the React blueprint
    app.register_blueprint(react_bp)
    
    # Configure CORS for development
    configure_cors_for_development(app)
    
    # Set up static file serving
    if should_serve_react():
        print(" * React frontend enabled")
        print(f" * React build available: {is_react_available()}")
    else:
        print(" * Using Flask templates (React disabled or not available)")
    
    return app

# Environment configuration helper
def create_env_file():
    """Create .env configuration for React integration"""
    env_content = """
# React Frontend Configuration
SERVE_REACT_FRONTEND=false
ENABLE_CORS_DEV=false

# Set to true to serve React frontend instead of Flask templates
# SERVE_REACT_FRONTEND=true

# Set to true to enable CORS for development (when React runs on different port)
# ENABLE_CORS_DEV=true
"""
    
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env.react')
    if not os.path.exists(env_path):
        with open(env_path, 'w') as f:
            f.write(env_content.strip())
        print(f" * Created React configuration file: {env_path}")

# Usage instructions:
"""
To integrate this with your Flask app:

1. Add to your app.py:
   from react-frontend.flask-integration-example import setup_react_integration
   
   # After creating your Flask app
   app = setup_react_integration(app)

2. Build the React frontend:
   cd react-frontend
   npm run build
   
3. Copy build files to Flask static directory:
   cp -r react-frontend/dist/* static/react/
   
4. Set environment variable to enable React:
   export SERVE_REACT_FRONTEND=true
   
5. Restart your Flask application

The integration provides:
- Automatic fallback to Flask templates if React is not available
- Environment-based configuration
- Development CORS support
- Static file serving with proper caching
- Frontend status API endpoint
"""