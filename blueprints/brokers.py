# blueprints/brokers.py

from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from services.broker_service import broker_service
from services.session_service import require_auth
from utils.rate_limiter import general_rate_limit
import traceback

# Create blueprint for broker management
brokers_bp = Blueprint('brokers', __name__, url_prefix='/brokers')

@brokers_bp.route('/supported', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=20, window_seconds=60)
def get_supported_brokers():
    """
    Get list of supported brokers
    
    Returns:
    {
        "status": "success",
        "brokers": {
            "broker_id": {
                "name": "string",
                "display_name": "string",
                "description": "string",
                "status": "active|coming_soon",
                "features": ["array"],
                "required_credentials": ["array"]
            }
        }
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        result = broker_service.get_supported_brokers()
        
        if result["status"] == "success":
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        print(f"ERROR in get_supported_brokers: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to get supported brokers'
        }), 500

@brokers_bp.route('/connect/<broker_type>', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=20, window_seconds=300)  # 20 connection attempts per 5 minutes (increased for testing)
def connect_broker(broker_type):
    """
    Connect a broker for the authenticated user
    
    Expected payload:
    {
        "credentials": {
            "client_id": "string",
            "pin": "string", 
            "totp": "string",
            "api_key": "string"
        },
        "display_name": "string (optional)"
    }
    
    Returns:
    {
        "status": "success|error",
        "message": "string",
        "connection": {} (on success)
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Validate request data first
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'JSON data required',
                'error_code': 'INVALID_REQUEST_FORMAT'
            }), 400
        
        data = request.get_json()
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Invalid JSON data',
                'error_code': 'INVALID_JSON'
            }), 400
        
        # Check authentication - session or request body
        user_id = session.get('new_auth_user_id') or data.get('user_id')
        
        if not user_id:
            return jsonify({
                'status': 'error',
                'message': 'Authentication required. Please login first.',
                'error_code': 'AUTH_REQUIRED'
            }), 401
        
        print(f"DEBUG: User authenticated with user_id: {user_id}")
        
        credentials = data.get('credentials', {})
        display_name = data.get('display_name')
        
        if not credentials:
            return jsonify({
                'status': 'error',
                'message': 'Broker credentials are required',
                'error_code': 'MISSING_CREDENTIALS'
            }), 400
        
        print(f"Connecting {broker_type} broker for user {user_id}")
        
        # Use broker service to connect
        result = broker_service.connect_broker(
            user_id=user_id,
            broker_type=broker_type,
            credentials=credentials,
            display_name=display_name
        )
        
        if result["status"] == "success":
            return jsonify(result), 201
        else:
            # Determine appropriate status code
            status_code = 400
            if "authentication failed" in result["message"].lower():
                status_code = 401
            elif "not available" in result["message"].lower():
                status_code = 503
            elif "already exists" in result["message"].lower():
                status_code = 409
            
            return jsonify(result), status_code
            
    except Exception as e:
        print(f"ERROR in connect_broker: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to connect broker due to server error',
            'error_code': 'SERVER_ERROR'
        }), 500

@brokers_bp.route('/user-connections', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=30, window_seconds=60)
def get_user_connections():
    """
    Get all broker connections for the authenticated user
    
    Returns:
    {
        "status": "success",
        "brokers": [
            {
                "id": "number",
                "broker_type": "string",
                "broker_name": "string",
                "broker_user_id": "string",
                "display_name": "string",
                "connected_at": "string",
                "last_sync_at": "string",
                "is_active": "boolean",
                "status": "connected|expired",
                "features": ["array"]
            }
        ],
        "count": "number"
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Check authentication - session or query parameter
        user_id = session.get('new_auth_user_id') or request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'status': 'error',
                'message': 'Authentication required',
                'error_code': 'AUTH_REQUIRED'
            }), 401
        
        print(f"DEBUG: Fetching connections for user_id: {user_id}")
        
        # Get user's broker connections
        result = broker_service.get_user_brokers(user_id)
        
        if result["status"] == "success":
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        print(f"ERROR in get_user_connections: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to get broker connections'
        }), 500

@brokers_bp.route('/disconnect/<int:connection_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=10, window_seconds=60)
def disconnect_broker(connection_id):
    """
    Disconnect a broker connection
    
    Returns:
    {
        "status": "success|error",
        "message": "string"
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Check if user is authenticated with new auth system
        if not session.get('new_auth_logged_in') or not session.get('new_auth_user_id'):
            return jsonify({
                'status': 'error',
                'message': 'Authentication required',
                'error_code': 'AUTH_REQUIRED'
            }), 401
        
        user_id = session.get('new_auth_user_id')
        
        print(f"Disconnecting broker connection {connection_id} for user {user_id}")
        
        # Use broker service to disconnect
        result = broker_service.disconnect_broker(user_id, connection_id)
        
        if result["status"] == "success":
            return jsonify(result)
        else:
            status_code = 404 if "not found" in result["message"].lower() else 500
            return jsonify(result), status_code
            
    except Exception as e:
        print(f"ERROR in disconnect_broker: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to disconnect broker'
        }), 500

@brokers_bp.route('/refresh/<int:connection_id>', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=10, window_seconds=300)  # 10 refresh attempts per 5 minutes
def refresh_broker_tokens(connection_id):
    """
    Refresh tokens for a broker connection
    
    Returns:
    {
        "status": "success|error",
        "message": "string"
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Check if user is authenticated with new auth system
        if not session.get('new_auth_logged_in') or not session.get('new_auth_user_id'):
            return jsonify({
                'status': 'error',
                'message': 'Authentication required',
                'error_code': 'AUTH_REQUIRED'
            }), 401
        
        user_id = session.get('new_auth_user_id')
        
        print(f"Refreshing tokens for broker connection {connection_id} for user {user_id}")
        
        # Use broker service to refresh tokens
        result = broker_service.refresh_broker_tokens(user_id, connection_id)
        
        if result["status"] == "success":
            return jsonify(result)
        else:
            status_code = 404 if "not found" in result["message"].lower() else 500
            return jsonify(result), status_code
            
    except Exception as e:
        print(f"ERROR in refresh_broker_tokens: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to refresh broker tokens'
        }), 500

@brokers_bp.route('/connection/<int:connection_id>', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
@general_rate_limit(max_requests=30, window_seconds=60)
def get_connection_details(connection_id):
    """
    Get detailed information about a broker connection
    
    Returns:
    {
        "status": "success",
        "connection": {
            "id": "number",
            "broker_type": "string",
            "broker_name": "string",
            "broker_user_id": "string",
            "display_name": "string",
            "connected_at": "string",
            "last_sync_at": "string",
            "is_active": "boolean",
            "status": "connected|expired",
            "features": ["array"],
            "description": "string",
            "token_expires_at": "string",
            "has_tokens": "boolean",
            "can_refresh": "boolean"
        }
    }
    """
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'success'})
        
        # Check if user is authenticated with new auth system
        if not session.get('new_auth_logged_in') or not session.get('new_auth_user_id'):
            return jsonify({
                'status': 'error',
                'message': 'Authentication required',
                'error_code': 'AUTH_REQUIRED'
            }), 401
        
        user_id = session.get('new_auth_user_id')
        
        # Get connection details
        result = broker_service.get_broker_connection_details(user_id, connection_id)
        
        if result["status"] == "success":
            return jsonify(result)
        else:
            status_code = 404 if "not found" in result["message"].lower() else 500
            return jsonify(result), status_code
            
    except Exception as e:
        print(f"ERROR in get_connection_details: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': 'Failed to get connection details'
        }), 500