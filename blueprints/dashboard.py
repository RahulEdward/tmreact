# blueprints/dashboard.py

from flask import Blueprint, render_template, session, redirect, url_for, flash, request, jsonify
from flask_cors import cross_origin
from database.auth_db import get_auth_token, check_user_approval
from api.funds import get_margin_data
import json

dashboard_bp = Blueprint('dashboard_bp', __name__, url_prefix='/')

@dashboard_bp.route('/dashboard', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:65028', 'http://127.0.0.1:55235', 'http://127.0.0.1:55236', 'http://localhost:55235', 'http://localhost:55236'], supports_credentials=True)
def dashboard():
    # Check if user is logged in
    if not session.get('logged_in'):
        # Check if this is an API request
        if request.headers.get('Accept') and 'application/json' in request.headers.get('Accept', ''):
            return jsonify({'status': 'error', 'message': 'Authentication required'}), 401
        return redirect(url_for('auth.login'))
    
    # Check if user is approved (skip for admin users)
    if not session.get('is_admin'):
        username = session.get('user')  # Changed from 'username' to 'user'
        approval_status = check_user_approval(username)
        
        if not approval_status['is_valid']:
            # Clear session
            session.clear()
            # Check if this is an API request
            if request.headers.get('Accept') and 'application/json' in request.headers.get('Accept', ''):
                return jsonify({'status': 'error', 'message': approval_status['message']}), 403
            flash(approval_status['message'], 'danger')
            return redirect(url_for('auth.login'))
    
    # Get auth_token from session
    AUTH_TOKEN = session.get('AUTH_TOKEN')  # Changed from 'auth_token' to 'AUTH_TOKEN'

    if AUTH_TOKEN is None:
        # Check if this is an API request
        if request.headers.get('Accept') and 'application/json' in request.headers.get('Accept', ''):
            return jsonify({'status': 'error', 'message': 'Authentication token missing'}), 401
        return redirect(url_for('auth.logout'))
        
    # Get API key from session
    apikey = session.get('apikey')  # Changed from 'api_key' to 'apikey'
    
    try:
        # Get margin data
        response = get_margin_data(AUTH_TOKEN, apikey)
        
        # Extract the data field from the response for use in template
        if isinstance(response, dict) and 'data' in response and isinstance(response['data'], dict):
            margin_data = response['data']
        else:
            print(f"Warning: Unexpected margin data format: {response}")
            margin_data = {}
            
        print(f"Margin data for template: {margin_data}")
        
        # Check if this is an API request (from React frontend)
        if request.headers.get('Accept') and 'application/json' in request.headers.get('Accept', ''):
            # Return JSON data for React frontend
            return jsonify({
                'status': 'success',
                'data': {
                    'availablecash': margin_data.get('availablecash', '0.00'),
                    'collateral': margin_data.get('collateral', '0.00'),
                    'm2munrealized': margin_data.get('m2munrealized', '0.00'),
                    'm2mrealized': margin_data.get('m2mrealized', '0.00'),
                    'utiliseddebits': margin_data.get('utiliseddebits', '0.00'),
                    'net': margin_data.get('net', '0.00')
                }
            })
        else:
            # Return JSON for all requests
            return jsonify({
                'status': 'success',
                'data': {
                    'availablecash': margin_data.get('availablecash', '0.00'),
                    'collateral': margin_data.get('collateral', '0.00'),
                    'utiliseddebits': margin_data.get('utiliseddebits', '0.00'),
                    'net': margin_data.get('net', '0.00')
                }
            })
                              
    except Exception as e:
        print(f"Error processing margin data: {e}")
        # Check if this is an API request
        if request.headers.get('Accept') and 'application/json' in request.headers.get('Accept', ''):
            return jsonify({'status': 'error', 'message': f'Failed to fetch margin data: {str(e)}'}), 500
        else:
            # Return JSON error for all requests
            return jsonify({'status': 'error', 'message': f'Failed to fetch margin data: {str(e)}'}), 500