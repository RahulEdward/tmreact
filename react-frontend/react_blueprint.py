"""
React Frontend Blueprint for Flask Integration

This blueprint provides a complete integration solution for serving
the React frontend from Flask with fallback to existing templates.
"""

from flask import Blueprint, send_from_directory, send_file, jsonify, redirect, url_for, current_app, abort
import os
from datetime import datetime
import json

# Create the React blueprint
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

def get_deployment_info():
    """Get deployment information if available"""
    try:
        info_path = os.path.join(current_app.root_path, 'static', 'react', 'deployment-info.json')
        if os.path.exists(info_path):
            with open(info_path, 'r') as f:
                return json.load(f)
    except:
        pass
    return None

# Static file serving
@react_bp.route('/static/react/<path:filename>')
def react_static(filename):
    """Serve React static assets with proper headers"""
    static_dir = os.path.join(current_app.root_path, 'static', 'react')
    
    # Add cache headers for static assets
    response = send_from_directory(static_dir, filename)
    
    # Set cache headers based on file type
    if filename.endswith(('.js', '.css', '.woff', '.woff2', '.ttf', '.eot')):
        # Cache static assets for 1 year
        response.headers['Cache-Control'] = 'public, max-age=31536000'
    elif filename.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico')):
        # Cache images for 1 month
        response.headers['Cache-Control'] = 'public, max-age=2592000'
    
    return response

# API endpoints
@react_bp.route('/api/frontend-status')
def frontend_status():
    """Get comprehensive frontend status information"""
    react_index = os.path.join(current_app.root_path, 'static', 'react', 'index.html')
    react_available = os.path.exists(react_index)
    
    status = {
        'react_available': react_available,
        'serve_react_enabled': os.getenv('SERVE_REACT_FRONTEND', 'false').lower() == 'true',
        'should_serve_react': should_serve_react(),
        'cors_enabled': os.getenv('ENABLE_CORS_DEV', 'false').lower() == 'true',
        'build_time': None,
        'version': 'development',
        'deployment_info': get_deployment_info()
    }
    
    if react_available:
        try:
            build_time = os.path.getmtime(react_index)
            status['build_time'] = datetime.fromtimestamp(build_time).isoformat()
        except:
            pass
        
        # Check for production build indicators
        manifest_path = os.path.join(current_app.root_path, 'static', 'react', '.vite', 'manifest.json')
        if os.path.exists(manifest_path):
            status['version'] = 'production'
    
    return jsonify(status)

@react_bp.route('/api/react-config')
def react_config():
    """Get React configuration for debugging"""
    if not current_app.debug:
        abort(404)  # Only available in debug mode
    
    config = {
        'environment': os.getenv('FLASK_ENV', 'production'),
        'debug': current_app.debug,
        'serve_react': should_serve_react(),
        'react_available': is_react_available(),
        'static_folder': current_app.static_folder,
        'root_path': current_app.root_path,
        'env_vars': {
            'SERVE_REACT_FRONTEND': os.getenv('SERVE_REACT_FRONTEND'),
            'ENABLE_CORS_DEV': os.getenv('ENABLE_CORS_DEV'),
        }
    }
    
    return jsonify(config)

# Route handlers with fallback strategy
class ReactRouteHandler:
    """Handler for React routes with Flask template fallbacks"""
    
    @staticmethod
    def create_handler(fallback_endpoint=None, template_name=None):
        """Create a route handler with specific fallback"""
        def handler():
            if should_serve_react():
                # Serve React app
                react_index = os.path.join(current_app.root_path, 'static', 'react', 'index.html')
                return send_file(react_index)
            else:
                # Fallback strategy
                if fallback_endpoint:
                    try:
                        return redirect(url_for(fallback_endpoint))
                    except:
                        pass
                
                if template_name:
                    try:
                        from flask import render_template
                        return render_template(template_name)
                    except:
                        pass
                
                # Final fallback to home
                try:
                    return redirect(url_for('core_bp.home'))
                except:
                    abort(404)
        
        return handler

# Define all React routes with their Flask fallbacks
routes_config = [
    ('/', 'core_bp.home', 'index.html'),
    ('/dashboard', 'dashboard_bp.dashboard', 'dashboard.html'),
    ('/orderbook', 'orders_bp.orderbook', 'orderbook.html'),
    ('/tradebook', 'orders_bp.tradebook', 'tradebook.html'),
    ('/positions', 'orders_bp.positions', 'positions.html'),
    ('/holdings', 'orders_bp.holdings', 'holdings.html'),
    ('/apikey', 'api_key_bp.api_key', 'apikey.html'),
    ('/logs', 'log_bp.logs', 'logs.html'),
    ('/search', 'search_bp.search', 'search.html'),
    ('/tradingview', 'tv_json_bp.tradingview', 'tradingview.html'),
    ('/login', 'auth_bp.login', 'login.html'),
    ('/register', 'auth_bp.register', 'register.html'),
]

# Register all routes
for route_path, fallback_endpoint, template_name in routes_config:
    handler = ReactRouteHandler.create_handler(fallback_endpoint, template_name)
    react_bp.add_url_rule(route_path, f'serve_{route_path.strip("/") or "home"}', handler)

# Catch-all route for React Router (must be registered last)
@react_bp.route('/<path:path>')
def serve_react_routes(path):
    """Catch-all route for React Router client-side routing"""
    if should_serve_react():
        # Check if it's a request for a static file
        static_file = os.path.join(current_app.root_path, 'static', 'react', path)
        if os.path.exists(static_file) and os.path.isfile(static_file):
            return send_file(static_file)
        
        # Serve React app for client-side routing
        react_index = os.path.join(current_app.root_path, 'static', 'react', 'index.html')
        if os.path.exists(react_index):
            return send_file(react_index)
    
    # Let Flask handle unknown routes (will trigger 404)
    abort(404)

# CORS configuration
def configure_cors_for_development(app):
    """Configure CORS for development when React runs on different port"""
    if not app.debug:
        return
    
    if os.getenv('ENABLE_CORS_DEV', 'false').lower() != 'true':
        return
    
    try:
        from flask_cors import CORS
        
        CORS(app, 
             origins=[
                 'http://localhost:5173', 
                 'http://127.0.0.1:5173',
                 'http://localhost:3000',
                 'http://127.0.0.1:3000'
             ], 
             supports_credentials=True,
             allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
             methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'])
        
        print(" * CORS enabled for React development")
        
    except ImportError:
        print(" * Warning: flask-cors not installed, CORS not configured")
        print(" * Install with: pip install flask-cors")

# Main setup function
def setup_react_integration(app):
    """
    Complete setup function to integrate React with Flask app
    
    Usage:
        from react_blueprint import setup_react_integration
        app = setup_react_integration(app)
    """
    
    # Register the React blueprint with higher priority
    # This ensures React routes are checked before other blueprints
    app.register_blueprint(react_bp, url_prefix='')
    
    # Configure CORS for development
    configure_cors_for_development(app)
    
    # Add context processor for template variables
    @app.context_processor
    def inject_react_status():
        return {
            'react_available': is_react_available(),
            'should_serve_react': should_serve_react()
        }
    
    # Log configuration
    react_enabled = should_serve_react()
    react_available = is_react_available()
    
    print(f" * React frontend available: {react_available}")
    print(f" * React frontend enabled: {react_enabled}")
    
    if react_enabled:
        print(" * Serving React frontend for all routes")
        deployment_info = get_deployment_info()
        if deployment_info:
            print(f" * React build deployed: {deployment_info.get('deployment_time', 'unknown')}")
    else:
        print(" * Using Flask templates (React disabled or not available)")
        if not react_available:
            print(" * To enable React: build frontend and set SERVE_REACT_FRONTEND=true")
    
    return app

# Utility functions for manual integration
def enable_react_frontend():
    """Enable React frontend serving"""
    os.environ['SERVE_REACT_FRONTEND'] = 'true'

def disable_react_frontend():
    """Disable React frontend serving (use Flask templates)"""
    os.environ['SERVE_REACT_FRONTEND'] = 'false'

def toggle_react_frontend():
    """Toggle React frontend serving"""
    current = os.getenv('SERVE_REACT_FRONTEND', 'false').lower() == 'true'
    os.environ['SERVE_REACT_FRONTEND'] = 'false' if current else 'true'
    return not current

# Export the blueprint and setup function
__all__ = ['react_bp', 'setup_react_integration', 'enable_react_frontend', 'disable_react_frontend']