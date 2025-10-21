"""
Example of how to integrate React frontend with your existing Flask app.py

This shows the minimal changes needed to add React support to your Flask application.
"""

# Your existing imports
from flask import Flask, render_template
from extensions import socketio
from limiter import limiter
from blueprints.auth import auth_bp 
from blueprints.dashboard import dashboard_bp
from blueprints.orders import orders_bp
from blueprints.search import search_bp
from blueprints.api_v1 import api_v1_bp
from blueprints.apikey import api_key_bp
from blueprints.log import log_bp
from blueprints.tv_json import tv_json_bp
from blueprints.core import core_bp
from blueprints.admin import admin_bp
from database.db import db 
from database.auth_db import init_db as ensure_auth_tables_exists
from database.master_contract_db import init_db as ensure_master_contract_tables_exists
from database.apilog_db import init_db as ensure_api_log_tables_exists
from dotenv import load_dotenv
import os

# ADD THIS IMPORT for React integration
from react_blueprint import setup_react_integration

# Your existing Flask app setup
app = Flask(__name__)
app.debug = True

socketio.init_app(app)
load_dotenv()

app.secret_key = os.getenv('APP_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

db.init_app(app)

# Your existing blueprint registrations
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(search_bp)
app.register_blueprint(api_v1_bp)
app.register_blueprint(api_key_bp)
app.register_blueprint(log_bp)
app.register_blueprint(tv_json_bp)
app.register_blueprint(core_bp)
app.register_blueprint(admin_bp)

# ADD THIS LINE to enable React integration
app = setup_react_integration(app)

# Your existing error handler
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

# Your existing main block
if __name__ == '__main__':
    
    # Your existing ngrok setup
    if os.getenv('NGROK_ALLOW') == 'TRUE':
        from pyngrok import ngrok 
        public_url = ngrok.connect(name='flask').public_url
        print(" * ngrok URL: " + public_url + " *")
    else:
        print(" * ngrok is not allowed by environment variable settings *")

    with app.app_context():
        ensure_auth_tables_exists()
        ensure_master_contract_tables_exists()
        ensure_api_log_tables_exists()

    socketio.run(app)

"""
That's it! Just add these two lines to your existing app.py:

1. from react_blueprint import setup_react_integration
2. app = setup_react_integration(app)

Then set SERVE_REACT_FRONTEND=true in your environment to enable React serving.

The integration provides:
- Automatic fallback to Flask templates if React is disabled
- Environment-based configuration
- Development CORS support
- Static file serving with proper caching
- Frontend status API endpoints
- Gradual migration support
"""