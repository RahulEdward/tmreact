# auth.py

from flask import Blueprint, request, redirect, url_for, render_template, session, jsonify, flash
from flask import current_app as app
from flask_cors import cross_origin
# Limiter disabled
# from limiter import limiter  # Import the limiter instance
from datetime import datetime, timedelta
import pytz
import http.client
import json
import os
import traceback
import sqlite3
from threading import Thread
from database.auth_db import get_auth_token, store_auth_tokens, get_user_by_username, get_user_by_id, create_user
from database.master_contract_db import master_contract_download
from services.auth_service import auth_service
from utils.rate_limiter import login_rate_limit, general_rate_limit
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

@auth_bp.route('/register', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def register():
    if session.get('logged_in'):
        return redirect(url_for('dashboard_bp.dashboard'))
    
    if request.method == 'GET':
        return jsonify({'status': 'success', 'message': 'Registration endpoint ready', 'method': 'POST'})
    
    elif request.method == 'POST':
        username = request.form.get('username')
        user_id = request.form.get('user_id')
        apikey = request.form.get('apikey')
        
        # Validate inputs
        if not username or not user_id or not apikey:
            error_msg = 'All fields are required'
            return jsonify({'status': 'error', 'message': error_msg})
        
        # Create user in database
        result = create_user(username, user_id, apikey)
        
        if result["status"] == "success":
            success_msg = 'Registration successful! Please login.'
            return jsonify({'status': 'success', 'message': success_msg})
        else:
            error_msg = result["message"]
            return jsonify({'status': 'error', 'message': error_msg})

@auth_bp.route('/check-session', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def check_session():
    """Simple endpoint to check if user session is valid"""
    if session.get('logged_in'):
        return jsonify({
            'status': 'success',
            'authenticated': True,
            'user': session.get('user'),
            'user_id': session.get('user_id')
        })
    else:
        return jsonify({
            'status': 'success',
            'authenticated': False
        })

@auth_bp.route('/login', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def login():
    try:
        if session.get('logged_in'):
            return jsonify({
                'status': 'success',
                'message': 'Already logged in',
                'redirect': '/dashboard'
            })

        if request.method == 'GET':
            return jsonify({'status': 'success', 'message': 'Login endpoint ready', 'method': 'POST'})
        elif request.method == 'POST':
            user_id = request.form.get('user_id')
            pin = request.form.get('pin')
            totp = request.form.get('totp')
            
            # Validate required fields
            if not all([user_id, pin, totp]):
                error_msg = 'All fields are required'
                if request.headers.get('Content-Type') == 'multipart/form-data' or \
                   request.headers.get('X-Requested-With') == 'XMLHttpRequest' or \
                   'application/json' in request.headers.get('Accept', ''):
                    return jsonify({'status': 'error', 'message': error_msg})
                else:
                    return jsonify({'status': 'error', 'message': error_msg})
            
            print(f"Login attempt for user_id: {user_id}")
            
            # Find user in database
            user = get_user_by_id(user_id)
            
            if not user:
                error_msg = 'User not found. Please register first.'
                if request.headers.get('Content-Type') == 'multipart/form-data' or \
                   request.headers.get('X-Requested-With') == 'XMLHttpRequest' or \
                   'application/json' in request.headers.get('Accept', ''):
                    return jsonify({'status': 'error', 'message': error_msg})
                else:
                    return jsonify({'status': 'error', 'message': error_msg})
            
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
                        session.clear()  # Clear any existing session data first
                        
                        # Store user info in session
                        session['user'] = username
                        session['user_id'] = user_id
                        session['apikey'] = apikey
                        session['AUTH_TOKEN'] = auth_token
                        session['FEED_TOKEN'] = feed_token
                        session['logged_in'] = True
                        
                        print(f"Session created successfully for user: {username}")
                        
                        # Store auth tokens in database for persistent access
                        token_result = store_auth_tokens(username, user_id, auth_token, feed_token)
                        if token_result["status"] == "success":
                            print(f"Auth tokens stored in database for user: {username}")
                        else:
                            print(f"ERROR storing auth tokens: {token_result['message']}")
                        
                        # Store admin status in session if applicable
                        user_obj = get_user_by_username(username)
                        if user_obj:
                            print(f"DEBUG: User object found: {user_obj.username}, Admin: {getattr(user_obj, 'is_admin', False)}")
                            # Directly query the database to get admin status
                            try:
                                conn = sqlite3.connect('db/secueralgo.db')
                                cursor = conn.cursor()
                                cursor.execute("SELECT is_admin FROM users WHERE username = ?", (username,))
                                result = cursor.fetchone()
                                conn.close()
                                
                                if result and result[0]:
                                    session['is_admin'] = True
                                    print(f"DEBUG: Set is_admin=True in session for {username}")
                            except Exception as db_error:
                                print(f"ERROR checking admin status: {str(db_error)}")
                        
                        # Start master contract download in the background
                        thread = Thread(target=async_master_contract_download, args=(user,))
                        thread.daemon = True
                        thread.start()
                        
                        print(f"User {username} logged in successfully")
                        
                        # Check if this is an API request (from React frontend)
                        # Always return JSON response since we're now a pure API
                        return jsonify({
                            'status': 'success',
                            'message': f'Welcome back, {username}!',
                            'redirect': '/dashboard'
                        })
                    else:
                        print("Invalid authentication token received")
                        error_msg = 'Invalid authentication token received'
                        if request.headers.get('Content-Type') == 'multipart/form-data' or \
                           request.headers.get('X-Requested-With') == 'XMLHttpRequest' or \
                           'application/json' in request.headers.get('Accept', ''):
                            return jsonify({'status': 'error', 'message': error_msg})
                        else:
                            return jsonify({'status': 'error', 'message': error_msg})
                else:
                    error_msg = response_json.get('message', 'Authentication failed')
                    print(f"Login failed: {error_msg}")
                    if request.headers.get('Content-Type') == 'multipart/form-data' or \
                       request.headers.get('X-Requested-With') == 'XMLHttpRequest' or \
                       'application/json' in request.headers.get('Accept', ''):
                        return jsonify({'status': 'error', 'message': f'Login failed: {error_msg}'})
                    else:
                        return jsonify({'status': 'error', 'message': f'Login failed: {error_msg}'})
            except Exception as api_error:
                print(f"API Connection Error: {str(api_error)}")
                error_msg = 'Connection error: Unable to connect to authentication service. Please try again later.'
                if request.headers.get('Content-Type') == 'multipart/form-data' or \
                   request.headers.get('X-Requested-With') == 'XMLHttpRequest' or \
                   'application/json' in request.headers.get('Accept', ''):
                    return jsonify({'status': 'error', 'message': error_msg})
                else:
                    return jsonify({'status': 'error', 'message': error_msg})
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
    # Handle user logout
    if session.get('logged_in'):
        username = session.get('user')
        
        if username:
            print(f"Logging out user: {username}")
            # Clear auth tokens from database
            try:
                store_auth_tokens(username, session.get('user_id'), "", "")
                print("Auth tokens cleared from database")
            except Exception as e:
                print(f"Error clearing auth tokens: {str(e)}")
        
        # Clear all user session data
        session.pop('user', None)
        session.pop('user_id', None)
        session.pop('apikey', None)
        session.pop('is_admin', None)
        session.pop('logged_in', None)
        session.pop('AUTH_TOKEN', None)
        session.pop('FEED_TOKEN', None)
        print("User session cleared")
    
    return jsonify({'status': 'success', 'message': 'Logged out successfully'})

@auth_bp.route('/test-login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], supports_credentials=True)
def test_login():
    """Test login endpoint for development - bypasses broker authentication"""
    try:
        if request.method == 'POST':
            # Create a test session without broker authentication
            session['logged_in'] = True
            session['user'] = 'test_user'
            session['user_id'] = 'TEST123'
            session['apikey'] = 'test_api_key'
            session['is_admin'] = False
            session['AUTH_TOKEN'] = 'test_auth_token'
            session['FEED_TOKEN'] = 'test_feed_token'
            
            print("Test login successful - session created")
            
            return jsonify({
                'status': 'success',
                'message': 'Test login successful',
                'redirect': '/dashboard',
                'user': {
                    'id': 'TEST123',
                    'username': 'test_user'
                }
            })
    except Exception as e:
        print(f"Test login error: {str(e)}")
        return jsonify({'status': 'error', 'message': f'Test login failed: {str(e)}'})

# New User Authentication System Endpoints

@auth_bp.route('/new/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def new_register():
    """
    New user registration endpoint for email/password authentication
    
    Expected payload:
    {
        "username": "string (3-50 chars, alphanumeric + underscore)",
        "email": "string (valid email format)",
        "password": "string (8+ chars, mixed case, numbers)"
    }
    
    Returns:
    {
        "status": "success|error",
        "message": "string",
        "redirect": "/login" (on success),
        "errors": {} (on validation errors)
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Validate request content type
        if not request.is_json and not request.form:
            return jsonify({
                'status': 'error',
                'message': 'Invalid request format. Expected JSON or form data.',
                'error_code': 'INVALID_REQUEST_FORMAT'
            }), 400
        
        # Get form data or JSON data
        if request.is_json:
            data = request.get_json()
            if not data:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid JSON data',
                    'error_code': 'INVALID_JSON'
                }), 400
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
        else:
            username = request.form.get('username')
            email = request.form.get('email')
            password = request.form.get('password')
        
        # Basic field validation
        validation_errors = {}
        
        if not username:
            validation_errors['username'] = 'Username is required'
        elif not isinstance(username, str):
            validation_errors['username'] = 'Username must be a string'
        
        if not email:
            validation_errors['email'] = 'Email is required'
        elif not isinstance(email, str):
            validation_errors['email'] = 'Email must be a string'
        
        if not password:
            validation_errors['password'] = 'Password is required'
        elif not isinstance(password, str):
            validation_errors['password'] = 'Password must be a string'
        
        if validation_errors:
            return jsonify({
                'status': 'error',
                'message': 'Validation failed',
                'error_code': 'VALIDATION_ERROR',
                'errors': validation_errors
            }), 400
        
        # Sanitize inputs
        username = username.strip()
        email = email.strip().lower()
        
        print(f"New user registration attempt: {username} ({email})")
        
        # Use auth service to register user
        result = auth_service.register_user(username, email, password)
        
        if result["status"] == "success":
            print(f"User registration successful: {username}")
            return jsonify({
                'status': 'success',
                'message': result["message"],
                'redirect': '/login',
                'user_id': result.get("user_id"),
                'next_step': 'Please login with your new credentials'
            }), 201
        else:
            print(f"User registration failed: {result['message']}")
            
            # Determine appropriate error code
            error_code = 'REGISTRATION_FAILED'
            status_code = 400
            
            if 'already exists' in result["message"].lower():
                if 'username' in result["message"].lower():
                    error_code = 'USERNAME_EXISTS'
                elif 'email' in result["message"].lower():
                    error_code = 'EMAIL_EXISTS'
                status_code = 409  # Conflict
            elif 'password' in result["message"].lower():
                error_code = 'INVALID_PASSWORD'
            elif 'email' in result["message"].lower():
                error_code = 'INVALID_EMAIL'
            elif 'username' in result["message"].lower():
                error_code = 'INVALID_USERNAME'
            
            return jsonify({
                'status': 'error',
                'message': result["message"],
                'error_code': error_code
            }), status_code
            
    except Exception as e:
        print(f"ERROR in new_register: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Registration failed due to server error. Please try again.',
            'error_code': 'SERVER_ERROR'
        }), 500

@auth_bp.route('/new/register/validate', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def validate_registration():
    """
    Validate registration data without creating a user
    
    Expected payload:
    {
        "username": "string",
        "email": "string", 
        "password": "string"
    }
    
    Returns:
    {
        "status": "success|error",
        "valid": boolean,
        "errors": {},
        "suggestions": {}
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Get JSON data
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'JSON data required',
                'valid': False
            }), 400
        
        data = request.get_json()
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Invalid JSON data',
                'valid': False
            }), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        errors = {}
        suggestions = {}
        
        # Validate username
        if username:
            import re
            if not re.match(r'^[a-zA-Z0-9_]{3,50}$', username):
                errors['username'] = 'Username must be 3-50 characters and contain only letters, numbers, and underscores'
                suggestions['username'] = 'Try using only letters, numbers, and underscores'
            else:
                # Check if username exists
                from database.auth_db import get_new_user_by_username
                existing_user = get_new_user_by_username(username)
                if existing_user:
                    errors['username'] = 'Username already exists'
                    suggestions['username'] = 'Try adding numbers or underscores to make it unique'
        else:
            errors['username'] = 'Username is required'
        
        # Validate email
        if email:
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, email):
                errors['email'] = 'Please enter a valid email address'
                suggestions['email'] = 'Email should be in format: user@example.com'
            else:
                # Check if email exists
                from database.auth_db import get_new_user_by_email
                existing_user = get_new_user_by_email(email)
                if existing_user:
                    errors['email'] = 'Email already exists'
                    suggestions['email'] = 'Try using a different email address or login instead'
        else:
            errors['email'] = 'Email is required'
        
        # Validate password
        if password:
            from database.auth_db import validate_password_strength
            password_validation = validate_password_strength(password)
            if not password_validation["valid"]:
                errors['password'] = password_validation["message"]
                suggestions['password'] = 'Use at least 8 characters with uppercase, lowercase, and numbers'
        else:
            errors['password'] = 'Password is required'
        
        is_valid = len(errors) == 0
        
        return jsonify({
            'status': 'success',
            'valid': is_valid,
            'errors': errors,
            'suggestions': suggestions,
            'message': 'Validation complete' if is_valid else 'Validation failed'
        })
        
    except Exception as e:
        print(f"ERROR in validate_registration: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Validation failed due to server error',
            'valid': False
        }), 500

@auth_bp.route('/new/login', methods=['POST', 'OPTIONS'])
@login_rate_limit(max_attempts=5, window_seconds=300)  # 5 attempts per 5 minutes
def new_login():
    """
    New user login endpoint for email/password authentication
    
    Expected payload:
    {
        "email": "string (email or username)",
        "password": "string"
    }
    OR
    {
        "username": "string",
        "password": "string"
    }
    
    Returns:
    {
        "status": "success|error",
        "message": "string",
        "user": {} (on success),
        "session": {} (on success),
        "redirect": "/dashboard" (on success)
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Check if user is already logged in
        if session.get('new_auth_logged_in'):
            user_info = {
                'id': session.get('new_auth_user_id'),
                'username': session.get('new_auth_username'),
                'email': session.get('new_auth_email')
            }
            return jsonify({
                'status': 'success',
                'message': 'Already logged in',
                'user': user_info,
                'redirect': '/dashboard'
            })
        
        # Validate request content type
        if not request.is_json and not request.form:
            return jsonify({
                'status': 'error',
                'message': 'Invalid request format. Expected JSON or form data.',
                'error_code': 'INVALID_REQUEST_FORMAT'
            }), 400
        
        # Get form data or JSON data
        if request.is_json:
            data = request.get_json()
            if not data:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid JSON data',
                    'error_code': 'INVALID_JSON'
                }), 400
            email_or_username = data.get('email') or data.get('username')
            password = data.get('password')
        else:
            email_or_username = request.form.get('email') or request.form.get('username')
            password = request.form.get('password')
        
        # Basic field validation
        validation_errors = {}
        
        if not email_or_username:
            validation_errors['email'] = 'Email or username is required'
        elif not isinstance(email_or_username, str):
            validation_errors['email'] = 'Email or username must be a string'
        
        if not password:
            validation_errors['password'] = 'Password is required'
        elif not isinstance(password, str):
            validation_errors['password'] = 'Password must be a string'
        
        if validation_errors:
            return jsonify({
                'status': 'error',
                'message': 'Validation failed',
                'error_code': 'VALIDATION_ERROR',
                'errors': validation_errors
            }), 400
        
        # Sanitize inputs
        email_or_username = email_or_username.strip()
        
        # Log login attempt (without password)
        print(f"New user login attempt: {email_or_username}")
        
        # Use auth service to authenticate user
        result = auth_service.authenticate_user(email_or_username, password)
        
        if result["status"] == "success":
            # Clear any existing session data
            session.clear()
            
            # Store new auth session data
            session['new_auth_logged_in'] = True
            session['new_auth_user_id'] = result["user"]["id"]
            session['new_auth_username'] = result["user"]["username"]
            session['new_auth_email'] = result["user"]["email"]
            session['new_auth_session_token'] = result["session_token"]
            
            # Set session as permanent for proper expiration handling
            session.permanent = True
            
            print(f"New auth login successful: {result['user']['username']}")
            
            # Get session info for response
            from services.session_service import session_service
            session_info = session_service.get_session_info()
            
            return jsonify({
                'status': 'success',
                'message': result["message"],
                'user': result["user"],
                'session': {
                    'expires_at': session_info.get('expires_at') if session_info else None,
                    'time_remaining': session_info.get('time_remaining') if session_info else None
                },
                'redirect': '/dashboard'
            }), 200
        else:
            print(f"New auth login failed: {result['message']}")
            
            # Determine appropriate error code and status
            error_code = 'LOGIN_FAILED'
            status_code = 401
            
            if 'credentials' in result["message"].lower():
                error_code = 'INVALID_CREDENTIALS'
            elif 'deactivated' in result["message"].lower():
                error_code = 'ACCOUNT_DEACTIVATED'
                status_code = 403
            elif 'not found' in result["message"].lower():
                error_code = 'USER_NOT_FOUND'
            
            return jsonify({
                'status': 'error',
                'message': result["message"],
                'error_code': error_code
            }), status_code
            
    except Exception as e:
        print(f"ERROR in new_login: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Login failed due to server error. Please try again.',
            'error_code': 'SERVER_ERROR'
        }), 500

@auth_bp.route('/new/login/validate', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=10, window_seconds=60)  # 10 validation attempts per minute
def validate_login():
    """
    Validate login credentials without creating a session
    
    Expected payload:
    {
        "email": "string (email or username)",
        "password": "string"
    }
    
    Returns:
    {
        "status": "success|error",
        "valid": boolean,
        "user_exists": boolean,
        "message": "string"
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Get JSON data
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'JSON data required',
                'valid': False
            }), 400
        
        data = request.get_json()
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Invalid JSON data',
                'valid': False
            }), 400
        
        email_or_username = data.get('email') or data.get('username')
        password = data.get('password')
        
        if not email_or_username or not password:
            return jsonify({
                'status': 'error',
                'message': 'Email/username and password are required',
                'valid': False,
                'user_exists': False
            }), 400
        
        # Sanitize input
        email_or_username = email_or_username.strip()
        
        # Check if user exists first
        from database.auth_db import get_new_user_by_email, get_new_user_by_username
        
        user = None
        if '@' in email_or_username:
            user = get_new_user_by_email(email_or_username.lower())
        else:
            user = get_new_user_by_username(email_or_username)
        
        user_exists = user is not None
        
        if not user_exists:
            return jsonify({
                'status': 'success',
                'valid': False,
                'user_exists': False,
                'message': 'User not found'
            })
        
        # Check if user is active
        if not user.is_active:
            return jsonify({
                'status': 'success',
                'valid': False,
                'user_exists': True,
                'message': 'Account is deactivated'
            })
        
        # Validate password
        from database.auth_db import verify_password
        password_valid = verify_password(password, user.password_hash)
        
        return jsonify({
            'status': 'success',
            'valid': password_valid,
            'user_exists': True,
            'message': 'Credentials are valid' if password_valid else 'Invalid password'
        })
        
    except Exception as e:
        print(f"ERROR in validate_login: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Validation failed due to server error',
            'valid': False,
            'user_exists': False
        }), 500

@auth_bp.route('/new/session', methods=['GET', 'OPTIONS'])
@general_rate_limit(max_requests=30, window_seconds=60)  # 30 session checks per minute
def new_check_session():
    """
    Check if user has a valid session in the new auth system
    
    Returns:
    {
        "status": "success|error",
        "authenticated": boolean,
        "user": {} (if authenticated),
        "session": {} (if authenticated),
        "message": "string"
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Debug session contents
        print(f"DEBUG: Session contents: {dict(session)}")
        print(f"DEBUG: new_auth_logged_in: {session.get('new_auth_logged_in')}")
        print(f"DEBUG: new_auth_session_token: {session.get('new_auth_session_token')}")
        
        # Check if user has new auth session
        if not session.get('new_auth_logged_in') or not session.get('new_auth_session_token'):
            print("DEBUG: No active session found")
            return jsonify({
                'status': 'success',
                'authenticated': False,
                'message': 'No active session'
            })
        
        # Validate session token with auth service
        session_token = session.get('new_auth_session_token')
        result = auth_service.validate_session(session_token)
        
        if result["status"] == "success":
            # Update session data with latest user info
            session['new_auth_user_id'] = result["user"]["id"]
            session['new_auth_username'] = result["user"]["username"]
            session['new_auth_email'] = result["user"]["email"]
            
            # Get detailed session information
            from services.session_service import session_service
            session_info = session_service.get_session_info()
            
            return jsonify({
                'status': 'success',
                'authenticated': True,
                'user': result["user"],
                'session': {
                    'expires_at': session_info.get('expires_at') if session_info else None,
                    'created_at': session_info.get('created_at') if session_info else None,
                    'time_remaining': session_info.get('time_remaining') if session_info else None,
                    'session_id': session_info.get('session_token', '')[:10] + '...' if session_info else None  # Truncated for security
                },
                'message': 'Session is valid'
            })
        else:
            # Session is invalid, clear session data
            print(f"Invalid session detected: {result.get('message', 'Unknown error')}")
            session.pop('new_auth_logged_in', None)
            session.pop('new_auth_user_id', None)
            session.pop('new_auth_username', None)
            session.pop('new_auth_email', None)
            session.pop('new_auth_session_token', None)
            
            return jsonify({
                'status': 'success',
                'authenticated': False,
                'message': 'Session expired or invalid'
            })
            
    except Exception as e:
        print(f"ERROR in new_check_session: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Session validation failed due to server error',
            'authenticated': False
        }), 500

@auth_bp.route('/new/logout', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=10, window_seconds=60)  # 10 logout attempts per minute
def new_logout():
    """
    Logout user from the new auth system
    
    Optional payload:
    {
        "logout_all": boolean  // If true, logout from all sessions
    }
    
    Returns:
    {
        "status": "success|error",
        "message": "string",
        "sessions_cleared": number (if logout_all is true)
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Get current session info
        session_token = session.get('new_auth_session_token')
        username = session.get('new_auth_username')
        user_id = session.get('new_auth_user_id')
        
        # Check if user wants to logout from all sessions
        logout_all = False
        if request.is_json:
            data = request.get_json()
            if data:
                logout_all = data.get('logout_all', False)
        
        sessions_cleared = 0
        
        # If no active session, still return success (idempotent operation)
        if not session_token:
            return jsonify({
                'status': 'success',
                'message': 'No active session to logout',
                'was_logged_in': False
            })
        
        try:
            if logout_all and user_id:
                # Logout from all sessions for this user
                from services.session_service import session_service
                result = session_service.revoke_all_user_sessions(user_id, except_current=False)
                if result["status"] == "success":
                    sessions_cleared = result["count"]
                    print(f"Logged out from all {sessions_cleared} sessions for user: {username}")
                else:
                    print(f"Failed to logout from all sessions: {result.get('message', 'Unknown error')}")
            else:
                # Logout from current session only
                result = auth_service.logout_user(session_token)
                if result["status"] == "success":
                    sessions_cleared = 1
                    print(f"Auth service logout successful for user: {username}")
                else:
                    print(f"Auth service logout failed: {result.get('message', 'Unknown error')}")
                    # Continue with session cleanup even if database logout fails
        except Exception as logout_error:
            print(f"Error during logout process: {str(logout_error)}")
            # Continue with session cleanup even if logout fails
        
        # Always clear Flask session data
        session.pop('new_auth_logged_in', None)
        session.pop('new_auth_user_id', None)
        session.pop('new_auth_username', None)
        session.pop('new_auth_email', None)
        session.pop('new_auth_session_token', None)
        
        # Clear any other session data that might exist
        session.clear()
        
        print(f"New auth logout successful for user: {username}")
        
        response_data = {
            'status': 'success',
            'message': 'Logged out successfully',
            'was_logged_in': True,
            'redirect': '/login'
        }
        
        if logout_all:
            response_data['sessions_cleared'] = sessions_cleared
            response_data['message'] = f'Logged out from {sessions_cleared} session(s) successfully'
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"ERROR in new_logout: {str(e)}")
        traceback.print_exc()
        
        # Even if there's an error, try to clear the session
        try:
            session.clear()
        except:
            pass
        
        return jsonify({
            'status': 'error',
            'message': 'Logout failed due to server error, but session has been cleared',
            'was_logged_in': True
        }), 500

# Route Protection Middleware

def require_new_auth(f):
    """
    Decorator to require new authentication system login for a route
    
    Usage:
        @app.route('/protected')
        @require_new_auth
        def protected_route():
            # Access current user via g.current_user
            return jsonify({'message': f'Hello {g.current_user["username"]}!'})
    """
    from functools import wraps
    from flask import g
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user has new auth session
        if not session.get('new_auth_logged_in') or not session.get('new_auth_session_token'):
            return jsonify({
                'status': 'error',
                'message': 'Authentication required',
                'error_code': 'AUTH_REQUIRED',
                'redirect': '/login'
            }), 401
        
        # Validate session token
        session_token = session.get('new_auth_session_token')
        result = auth_service.validate_session(session_token)
        
        if result["status"] != "success":
            # Session is invalid, clear session data
            session.pop('new_auth_logged_in', None)
            session.pop('new_auth_user_id', None)
            session.pop('new_auth_username', None)
            session.pop('new_auth_email', None)
            session.pop('new_auth_session_token', None)
            
            return jsonify({
                'status': 'error',
                'message': 'Session expired or invalid',
                'error_code': 'SESSION_EXPIRED',
                'redirect': '/login'
            }), 401
        
        # Store user in Flask's g object for use in the route
        g.current_user = result["user"]
        return f(*args, **kwargs)
    
    return decorated_function

def optional_new_auth(f):
    """
    Decorator to optionally load user information if authenticated with new auth system
    
    Usage:
        @app.route('/optional')
        @optional_new_auth
        def optional_route():
            if g.current_user:
                return jsonify({'message': f'Hello {g.current_user["username"]}!'})
            else:
                return jsonify({'message': 'Hello anonymous user!'})
    """
    from functools import wraps
    from flask import g
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        g.current_user = None  # Default to None
        
        # Check if user has new auth session
        if session.get('new_auth_logged_in') and session.get('new_auth_session_token'):
            session_token = session.get('new_auth_session_token')
            result = auth_service.validate_session(session_token)
            
            if result["status"] == "success":
                g.current_user = result["user"]
            else:
                # Session is invalid, clear session data
                session.pop('new_auth_logged_in', None)
                session.pop('new_auth_user_id', None)
                session.pop('new_auth_username', None)
                session.pop('new_auth_email', None)
                session.pop('new_auth_session_token', None)
        
        return f(*args, **kwargs)
    
    return decorated_function

# Session Management Endpoints

@auth_bp.route('/new/session/info', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def new_session_info():
    """Get detailed session information"""
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        from services.session_service import session_service
        
        session_info = session_service.get_session_info()
        if not session_info:
            return jsonify({
                'status': 'error',
                'message': 'No active session'
            }), 401
        
        user = session_service.get_current_user_from_session()
        
        return jsonify({
            'status': 'success',
            'session': session_info,
            'user': user
        })
        
    except Exception as e:
        print(f"ERROR in new_session_info: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to get session info'
        })

@auth_bp.route('/new/session/extend', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def new_session_extend():
    """Extend current session expiration time"""
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        from services.session_service import session_service
        
        # Get extension hours from request (optional)
        hours = None
        if request.is_json:
            data = request.get_json()
            hours = data.get('hours')
        else:
            hours = request.form.get('hours')
        
        if hours:
            try:
                hours = int(hours)
                if hours <= 0 or hours > 168:  # Max 1 week
                    return jsonify({
                        'status': 'error',
                        'message': 'Extension hours must be between 1 and 168 (1 week)'
                    })
            except ValueError:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid hours value'
                })
        
        result = session_service.extend_session(hours)
        
        if result["status"] == "success":
            return jsonify({
                'status': 'success',
                'message': result["message"],
                'expires_at': result["expires_at"]
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result["message"]
            })
        
    except Exception as e:
        print(f"ERROR in new_session_extend: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to extend session'
        })

@auth_bp.route('/new/session/cleanup', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def new_session_cleanup():
    """Clean up expired sessions (admin endpoint)"""
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        from services.session_service import session_service
        
        # Check if user is authenticated (basic check)
        user = session_service.get_current_user_from_session()
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'Authentication required'
            }), 401
        
        result = session_service.cleanup_expired_sessions()
        
        return jsonify({
            'status': 'success',
            'message': f'Cleaned up {result["count"]} expired sessions',
            'count': result["count"]
        })
        
    except Exception as e:
        print(f"ERROR in new_session_cleanup: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to cleanup sessions'
        })

@auth_bp.route('/new/session/revoke-all', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def new_session_revoke_all():
    """Revoke all sessions for current user except current one"""
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        from services.session_service import session_service
        
        user = session_service.get_current_user_from_session()
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'Authentication required'
            }), 401
        
        result = session_service.revoke_all_user_sessions(user["id"], except_current=True)
        
        if result["status"] == "success":
            return jsonify({
                'status': 'success',
                'message': f'Revoked {result["count"]} other sessions',
                'count': result["count"]
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result["message"]
            })
        
    except Exception as e:
        print(f"ERROR in new_session_revoke_all: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to revoke sessions'
        })