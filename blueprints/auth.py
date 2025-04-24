# auth.py

from flask import Blueprint, request, redirect, url_for, render_template, session, jsonify, flash
from flask import current_app as app
# Limiter disabled
# from limiter import limiter  # Import the limiter instance
from datetime import datetime, timedelta
import pytz
import http.client
import json
import os
import traceback
from threading import Thread
from database.auth_db import upsert_auth, get_user_by_username, get_user_by_id, create_user
from database.master_contract_db import master_contract_download
from flask_bcrypt import Bcrypt

# Initialize Bcrypt
bcrypt = Bcrypt()

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Access environment variables
LOGIN_RATE_LIMIT_MIN = os.getenv("LOGIN_RATE_LIMIT_MIN", "20 per minute")
LOGIN_RATE_LIMIT_HOUR = os.getenv("LOGIN_RATE_LIMIT_HOUR", "100 per hour")

# Function to verify password
def verify_password(password, password_hash):
    try:
        # Check if password_hash is not None and is a valid string
        if not password_hash:
            print("ERROR: password_hash is None or empty")
            return False
            
        # Convert string to bytes if needed
        if isinstance(password, str):
            password = password.encode('utf-8')
            
        if isinstance(password_hash, str):
            password_hash = password_hash.encode('utf-8')
            
        # Verify the password
        return bcrypt.check_password_hash(password_hash, password)
    except Exception as e:
        print(f"ERROR in verify_password: {str(e)}")
        traceback.print_exc()
        return False

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

def async_master_contract_download(user):
    """
    Asynchronously download the master contract and emit a WebSocket event upon completion.
    """
    try:
        print(f"Starting master contract download for user: {user}")
        master_contract_status = master_contract_download()
        print(f"Master contract download completed with status: {master_contract_status}")
        return master_contract_status
    except Exception as e:
        print(f"ERROR in master contract download: {str(e)}")
        traceback.print_exc()
        return False

def get_session_expiry_time():
    try:
        now_utc = datetime.now(pytz.timezone('UTC'))
        now_ist = now_utc.astimezone(pytz.timezone('Asia/Kolkata'))
        print(f"Current time (IST): {now_ist}")
        
        target_time_ist = now_ist.replace(hour=3, minute=0, second=0, microsecond=0)
        if now_ist > target_time_ist:
            target_time_ist += timedelta(days=1)
            
        remaining_time = target_time_ist - now_ist
        print(f"Session will expire at: {target_time_ist} (in {remaining_time})")
        return remaining_time
    except Exception as e:
        print(f"ERROR in get_session_expiry_time: {str(e)}")
        traceback.print_exc()
        # Return a default of 24 hours
        return timedelta(hours=24)

@auth_bp.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error="Rate limit exceeded"), 429

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if session.get('logged_in'):
        return redirect(url_for('dashboard_bp.dashboard'))
    
    if request.method == 'GET':
        return render_template('register.html')
    
    elif request.method == 'POST':
        username = request.form.get('username')
        user_id = request.form.get('user_id')
        apikey = request.form.get('apikey')
        
        # Validate inputs
        if not username or not user_id or not apikey:
            flash('All fields are required', 'danger')
            return render_template('register.html')
        
        # Create user in database
        result = create_user(username, user_id, apikey)
        
        if result["status"] == "success":
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash(result["message"], 'danger')
            return render_template('register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    try:
        if session.get('logged_in'):
            return redirect(url_for('dashboard_bp.dashboard'))

        if request.method == 'GET':
            return render_template('login.html')
        elif request.method == 'POST':
            user_id = request.form.get('user_id')
            pin = request.form.get('pin')
            totp = request.form.get('totp')
            
            # Validate required fields
            if not all([user_id, pin, totp]):
                flash('All fields are required', 'danger')
                return render_template('login.html')
            
            print(f"Login attempt for user_id: {user_id}")
            
            # Find user in database
            user = get_user_by_id(user_id)
            
            if not user:
                flash('User not found. Please register first.', 'danger')
                return render_template('login.html')
            
            username = user.username
            apikey = user.apikey
            
            # Skip PIN verification since we don't store hashed pins in the database
            # We'll rely on the Angel One API to verify credentials
            
            print(f"Connecting to AngelOne API for authentication...")
            conn = http.client.HTTPSConnection("apiconnect.angelbroking.com")
            
            # Prepare login payload
            payload = json.dumps({
                "clientcode": user_id,
                "password": pin,
                "totp": totp
            })

            # Get client IP
            client_ip = request.remote_addr
            
            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-UserType': 'USER',
                'X-SourceID': 'WEB',
                'X-ClientLocalIP': client_ip,
                'X-ClientPublicIP': client_ip,
                'X-MACAddress': '',
                'X-PrivateKey': apikey
            }

            # Make the API request
            try:
                print(f"Sending authentication request to AngelOne API...")
                conn.request("POST", "/rest/auth/angelbroking/user/v1/loginByPassword", payload, headers)
                res = conn.getresponse()
                data = res.read()
                
                print(f"Received response from AngelOne API: Status {res.status}")
                response_json = json.loads(data.decode("utf-8"))
                
                # Process API response
                if response_json.get('status') == True:
                    print("Authentication successful")
                    auth_token = response_json.get('data', {}).get('jwtToken')
                    refresh_token = response_json.get('data', {}).get('refreshToken')
                    feed_token = response_json.get('data', {}).get('feedToken')
                    
                    if auth_token:
                        # Store tokens in session
                        session['auth_token'] = auth_token
                        session['refresh_token'] = refresh_token
                        session['feed_token'] = feed_token
                        session['api_key'] = apikey
                        session['user_id'] = user_id
                        session['username'] = username
                        session['logged_in'] = True
                        
                        # Start master contract download in the background
                        thread = Thread(target=async_master_contract_download, args=(user,))
                        thread.daemon = True
                        thread.start()
                        
                        print(f"User {username} logged in successfully")
                        flash(f'Welcome back, {username}!', 'success')
                        return redirect(url_for('dashboard_bp.dashboard'))
                    else:
                        print("Invalid authentication token received")
                        flash('Invalid authentication token received', 'danger')
                        return render_template('login.html')
                else:
                    error_msg = response_json.get('message', 'Authentication failed')
                    print(f"Login failed: {error_msg}")
                    flash(f'Login failed: {error_msg}', 'danger')
                    return render_template('login.html')
            except Exception as api_error:
                print(f"API Connection Error: {str(api_error)}")
                flash(f'Connection error: Unable to connect to authentication service. Please try again later.', 'danger')
                return render_template('login.html')
    except Exception as outer_e:
        import traceback
        print(f"CRITICAL ERROR in login route: {str(outer_e)}")
        traceback.print_exc()
        error_message = f"Server error: {str(outer_e)}"
        # Fallback to a very basic error page if template rendering fails
        return f"""<!DOCTYPE html>
        <html>
        <head><title>Login Error</title></head>
        <body>
            <h1>Login Error</h1>
            <p>{error_message}</p>
            <p><a href="/">Return to home</a></p>
        </body>
        </html>""", 200

@auth_bp.route('/logout')
def logout():
    if session.get('logged_in'):
        username = session.get('user')
        
        if username:
            print(f"Logging out user: {username}")
            # Revoke auth token in database
            inserted_id = upsert_auth(username, "", revoke=True)
            if inserted_id:
                print(f"Auth token revoked successfully, ID: {inserted_id}")
            else:
                print("Failed to revoke auth token in database")
        
        # Clear session
        session.pop('user', None)
        session.pop('user_id', None)
        session.pop('apikey', None)
        session.pop('is_admin', None)
        session.pop('logged_in', None)
        session.pop('AUTH_TOKEN', None)
        session.pop('FEED_TOKEN', None)
        print("Session cleared")
    
    flash('You have been logged out successfully', 'success')
    return redirect(url_for('auth.login'))