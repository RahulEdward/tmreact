# blueprints/dashboard.py

from flask import Blueprint, render_template, session, redirect, url_for, flash
from database.auth_db import get_auth_token, check_user_approval
from api.funds import get_margin_data
import json

dashboard_bp = Blueprint('dashboard_bp', __name__, url_prefix='/')

@dashboard_bp.route('/dashboard')
def dashboard():
    # Check if user is logged in
    if not session.get('logged_in'):
        return redirect(url_for('auth.login'))
    
    # Check if user is approved (skip for admin users)
    if not session.get('is_admin'):
        username = session.get('user')  # Changed from 'username' to 'user'
        approval_status = check_user_approval(username)
        
        if not approval_status['is_valid']:
            # Clear session
            session.clear()
            flash(approval_status['message'], 'danger')
            return redirect(url_for('auth.login'))
    
    # Get auth_token from session
    AUTH_TOKEN = session.get('AUTH_TOKEN')  # Changed from 'auth_token' to 'AUTH_TOKEN'

    if AUTH_TOKEN is None:
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
        
        # Pass to template
        return render_template('dashboard.html', margin_data=margin_data)
                              
    except Exception as e:
        print(f"Error processing margin data: {e}")
        # Set empty dict if there's an error
        return render_template('dashboard.html', margin_data={}, error=str(e))