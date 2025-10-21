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

from database.db import db 

from database.auth_db import init_db as ensure_auth_tables_exists
from database.master_contract_db import init_db as ensure_master_contract_tables_exists
from database.apilog_db import init_db as ensure_api_log_tables_exists


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

# Session configuration for same-origin requests
app.config['SESSION_COOKIE_SAMESITE'] = None  # Allow cross-site cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JavaScript access for debugging
app.config['SESSION_COOKIE_NAME'] = 'session'  # Default session cookie name
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour session lifetime

# Initialize CORS - Allow specific origins for development
CORS(app, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174",
              "http://127.0.0.1:55235", "http://127.0.0.1:55236", "http://127.0.0.1:57228"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Type", "Authorization"])

# Initialize SocketIO
socketio.init_app(app, cors_allowed_origins="*")

# Initialize Flask-Limiter with the app object - disabled for now
# limiter.init_app(app)


# Initialize SQLAlchemy
db.init_app(app)

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


@app.route('/api/test', methods=['GET', 'OPTIONS'])
def test_cors():
    """Simple test endpoint to verify CORS is working"""
    from flask import jsonify
    return jsonify({"status": "success", "message": "CORS is working!"})

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404



if __name__ == '__main__':
    
    # Setup ngrok
       
    # Check if NGROK_ALLOW is set to 'TRUE' in the environment
    if os.getenv('NGROK_ALLOW') == 'TRUE':
        # Setup ngrok if allowed
        from pyngrok import ngrok 
        
        public_url = ngrok.connect(name='flask').public_url  # Assuming Flask runs on the default port 5000
        print(" * ngrok URL: " + public_url + " *")
    else:
        print(" * ngrok is not allowed by environment variable settings *")


    with app.app_context():
        # Ensure all the tables exist
        
        ensure_auth_tables_exists()
        ensure_master_contract_tables_exists()
        ensure_api_log_tables_exists()

    socketio.run(app)
