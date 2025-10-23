from flask import Flask, jsonify
from flask_cors import CORS
from extensions import socketio  # Import SocketIO
from limiter import limiter  # Import the Limiter instance
from blueprints.auth import auth_bp 
from blueprints.dashboard import dashboard_bp
from blueprints.orders import orders_bp
from blueprints.search import search_bp
from blueprints.api_v1 import api_v1_bp
from blueprints.apikey import api_key_bp
from blueprints.log import log_bp
from blueprints.tv_json import tv_json_bp
from blueprints.core import core_bp  # Import the core blueprint
from blueprints.admin import admin_bp  # Import the admin blueprint
from blueprints.protected_example import protected_bp  # Import the protected example blueprint
from blueprints.brokers import brokers_bp  # Import the brokers blueprint

from database.db import db 

from database.auth_db import init_db as ensure_auth_tables_exists
from database.master_contract_db import init_db as ensure_master_contract_tables_exists
from database.apilog_db import init_db as ensure_api_log_tables_exists
from middleware.session_middleware import session_middleware


from dotenv import load_dotenv
import os


# Load environment variables first
load_dotenv()

# Initialize Flask application
app = Flask(__name__)
app.debug = True

# Set secret key and config BEFORE initializing extensions
app.secret_key = os.getenv('APP_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# Session configuration for cross-origin requests
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Allow cookies in cross-origin requests
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JavaScript access for debugging
app.config['SESSION_COOKIE_NAME'] = 'session'  # Default session cookie name
app.config['SESSION_COOKIE_DOMAIN'] = None  # Allow cookies for localhost
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour session lifetime
app.config['SESSION_COOKIE_PATH'] = '/'  # Cookie available for all paths

# Initialize CORS - Allow localhost origins with credentials
from flask import request
from flask_cors import CORS

@app.after_request
def after_request(response):
    """Add CORS headers manually for better control"""
    origin = request.headers.get('Origin')
    
    # Check if origin is localhost or 127.0.0.1 with any port
    if origin:
        import re
        localhost_pattern = r'^https?://(localhost|127\.0\.0\.1)(:\d+)?/?$'
        production_origins = [
            "https://nextjs-frontend-5wsr2khpx-rahuls-projects-4055f2e8.vercel.app",
            "https://nextjs-frontend-5q9rc7ytw-rahuls-projects-4055f2e8.vercel.app"
        ]
        
        if re.match(localhost_pattern, origin) or origin in production_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            response.headers['Access-Control-Expose-Headers'] = 'Content-Type, Authorization'
    
    return response

# Basic CORS setup (the after_request handler will override as needed)
CORS(app, 
     origins="*",
     supports_credentials=False,
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Type", "Authorization"])

# Initialize SocketIO
socketio.init_app(app, cors_allowed_origins="*")

# Initialize Flask-Limiter with the app object - disabled for now
# limiter.init_app(app)


# Initialize SQLAlchemy
db.init_app(app)

# Initialize session middleware
session_middleware.init_app(app)

# Register the blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(search_bp)
app.register_blueprint(api_v1_bp)
app.register_blueprint(api_key_bp)
app.register_blueprint(log_bp)
app.register_blueprint(tv_json_bp)
app.register_blueprint(core_bp)  # Register the core blueprint
app.register_blueprint(admin_bp)  # Admin blueprint enabled
app.register_blueprint(protected_bp)  # Register the protected example blueprint
app.register_blueprint(brokers_bp)  # Register the brokers blueprint


@app.route('/api/test', methods=['GET', 'OPTIONS'])
def test_cors():
    """Simple test endpoint to verify CORS is working"""
    from flask import jsonify
    return jsonify({"status": "success", "message": "CORS is working!"})

@app.route('/health')
def health_check():
    """Health check endpoint for Vercel"""
    from flask import jsonify
    return jsonify({
        "status": "healthy",
        "message": "Backend is running on Vercel!",
        "environment": os.getenv('FLASK_ENV', 'development'),
        "database": "connected"
    })

@app.route('/')
def home():
    """API documentation endpoint"""
    from flask import jsonify
    return jsonify({
        "message": "TradingBridge Backend API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "auth": "/auth/*",
            "dashboard": "/dashboard",
            "orders": "/orderbook, /tradebook, /positions, /holdings",
            "tradingview": "/tradingview",
            "search": "/search/*",
            "api": "/api/v1/*"
        }
    })

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404



# Initialize database tables
with app.app_context():
    # Ensure all the tables exist
    ensure_auth_tables_exists()
    ensure_master_contract_tables_exists()
    ensure_api_log_tables_exists()

# For Vercel deployment
app_instance = app

if __name__ == '__main__':
    
    # Setup ngrok for local development
    # Check if NGROK_ALLOW is set to 'TRUE' in the environment
    if os.getenv('NGROK_ALLOW') == 'TRUE':
        # Setup ngrok if allowed
        from pyngrok import ngrok 
        
        public_url = ngrok.connect(name='flask').public_url  # Assuming Flask runs on the default port 5000
        print(" * ngrok URL: " + public_url + " *")
    else:
        print(" * ngrok is not allowed by environment variable settings *")

    socketio.run(app, debug=True)
