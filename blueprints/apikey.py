
from flask import Blueprint, jsonify, render_template, request, session, redirect, url_for
from itsdangerous import URLSafeTimedSerializer
from database.auth_db import upsert_api_key , get_api_key
import os


api_key_bp = Blueprint('api_key_bp', __name__, url_prefix='/')

app_secret_key = os.getenv('APP_KEY')

def generate_api_key(user_id):
    serializer = URLSafeTimedSerializer(app_secret_key)
    return serializer.dumps(user_id, salt='api_key')

@api_key_bp.route('/apikey', methods=['GET', 'POST'])
def manage_api_key():
    # Check authentication first
    if not session.get('logged_in'):
        # For JSON requests, return 401
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({'status': 'error', 'message': 'Authentication required'}), 401
        # For browser requests, redirect to login
        return redirect(url_for('auth.login'))
    
    if request.method == 'GET':
        # Get user_id from session
        user_id = session.get('user_id')
        if not user_id:
            if request.headers.get('Accept') == 'application/json' or request.is_json:
                return jsonify({'status': 'error', 'message': 'User ID not found in session'}), 401
            return redirect(url_for('auth.login'))
            
        username = session.get('username')
        # Get API key directly from session
        current_api_key = session.get('api_key')
        
        # If not in session, try to get from database
        if not current_api_key:
            current_api_key = get_api_key(user_id)
            # Validate API key format (must be platform-generated)
            if current_api_key and not is_platform_api_key(current_api_key, user_id):
                # Detected broker key, force regenerate
                current_api_key = generate_api_key(user_id)
                upsert_api_key(user_id, current_api_key)
            # Update session with API key if found
            if current_api_key:
                session['api_key'] = current_api_key
        
        # Generate new API key if none exists
        if not current_api_key:
            current_api_key = generate_api_key(user_id)
            upsert_api_key(user_id, current_api_key)
            session['api_key'] = current_api_key
                
        print(f"DEBUG - API Key Management - User ID: {user_id}, API Key: {current_api_key}")
        
        # Check if request wants JSON (from React frontend)
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({
                'status': 'success',
                'data': {
                    'api_key': current_api_key,
                    'login_username': username
                }
            })
        else:
            # For direct browser access, redirect to React app
            return redirect('http://localhost:5173/apikey')
            
    else:  # POST request for regenerating API key
        # Get user_id from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'Authentication required'}), 401
        
        try:
            # Generate new API key
            api_key = generate_api_key(user_id)
            key_id = upsert_api_key(user_id, api_key)
            
            # Update session with new API key
            session['api_key'] = api_key
            print(f"DEBUG - API Key Regenerated - User ID: {user_id}, New API Key: {api_key}")
            
            if key_id is not None:
                return jsonify({
                    'status': 'success', 
                    'message': 'API key regenerated successfully',
                    'data': {
                        'api_key': api_key,
                        'key_id': key_id
                    }
                })
            else:
                return jsonify({'status': 'error', 'message': 'Failed to regenerate API key'}), 500
                
        except Exception as e:
            print(f"ERROR - API Key Regeneration failed: {str(e)}")
            return jsonify({'status': 'error', 'message': 'Failed to regenerate API key'}), 500


def is_platform_api_key(api_key, user_id):
    """
    Only allow platform-generated keys (using its serializer logic). If the key cannot be deserialized to the same user_id, it's invalid (likely a broker key).
    """
    from itsdangerous import URLSafeTimedSerializer, BadSignature
    try:
        serializer = URLSafeTimedSerializer(app_secret_key)
        decoded_user_id = serializer.loads(api_key, salt='api_key', max_age=10*365*24*3600)  # 10 years
        return str(decoded_user_id) == str(user_id)
    except Exception:
        return False