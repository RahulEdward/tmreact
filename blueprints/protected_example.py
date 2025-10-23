# blueprints/protected_example.py

from flask import Blueprint, jsonify, g
from flask_cors import cross_origin
from services.session_service import require_auth, optional_auth

# Create blueprint for protected route examples
protected_bp = Blueprint('protected', __name__, url_prefix='/protected')

@protected_bp.route('/dashboard', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], supports_credentials=True)
@require_auth
def protected_dashboard():
    """Example of a protected route that requires authentication"""
    try:
        # g.current_user is automatically populated by the @require_auth decorator
        user = g.current_user
        
        return jsonify({
            'status': 'success',
            'message': f'Welcome to your dashboard, {user["username"]}!',
            'user': user,
            'data': {
                'dashboard_items': [
                    'Portfolio Overview',
                    'Recent Trades',
                    'Market News',
                    'Account Settings'
                ]
            }
        })
        
    except Exception as e:
        print(f"ERROR in protected_dashboard: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to load dashboard'
        })

@protected_bp.route('/profile', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], supports_credentials=True)
@require_auth
def protected_profile():
    """Example of a protected route for user profile"""
    try:
        user = g.current_user
        
        return jsonify({
            'status': 'success',
            'profile': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'created_at': user['created_at'],
                'account_type': 'Standard',
                'last_login': 'Just now'
            }
        })
        
    except Exception as e:
        print(f"ERROR in protected_profile: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to load profile'
        })

@protected_bp.route('/public-info', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], supports_credentials=True)
@optional_auth
def optional_auth_example():
    """Example of a route with optional authentication"""
    try:
        user = g.current_user  # Will be None if not authenticated
        
        if user:
            message = f"Hello {user['username']}, here's your personalized content!"
            data = {
                'personalized': True,
                'user_specific_data': 'Your recent activity...'
            }
        else:
            message = "Hello anonymous user, here's some public information!"
            data = {
                'personalized': False,
                'public_data': 'General market information...'
            }
        
        return jsonify({
            'status': 'success',
            'message': message,
            'authenticated': user is not None,
            'data': data
        })
        
    except Exception as e:
        print(f"ERROR in optional_auth_example: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to load content'
        })