# blueprints/admin.py

from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify, make_response
from flask import current_app as app
from functools import wraps
from datetime import datetime, timedelta
import traceback
import random
import time
from database.auth_db import get_all_users, get_user_by_username, approve_user, update_user

# Create admin blueprint
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


# Admin login check decorator
def admin_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Use a completely separate cookie for admin sessions
        admin_session = request.cookies.get('admin_session')
        
        if not admin_session or admin_session != 'true':
            flash('Please login as admin first!', 'danger')
            return redirect(url_for('admin.admin_login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        # Hardcoded admin credentials
        if email == 'rhl.edward@gmail.com' and password == 'admin123':
            # Create response with redirect
            response = make_response(redirect(url_for('admin.admin_panel')))
            
            # Set a secure cookie for admin session instead of using Flask session
            # This completely separates admin and user sessions
            response.set_cookie('admin_session', 'true', httponly=True, max_age=86400)
            response.set_cookie('admin_email', email, httponly=True, max_age=86400)
            
            flash('Admin login successful!', 'success')
            return response
        else:
            flash('Invalid admin credentials', 'danger')
            return jsonify({'status': 'error', 'message': 'Invalid admin credentials'})
    return jsonify({'status': 'success', 'message': 'Admin login endpoint'})

@admin_bp.route('/panel')
@admin_login_required
def admin_panel():
    """Admin panel to manage users"""
    try:
        # Get all users
        users = get_all_users()
        print(f"[DEBUG] Total users fetched from DB: {len(users)}")
        for u in users:
            print(f"[DEBUG] User: username={u.username}, user_id={u.user_id}, is_admin={getattr(u, 'is_admin', None)}, is_approved={getattr(u, 'is_approved', None)}")
        # Format expiry dates for display
        for user in users:
            if user.approved_expiry_date:
                user.expiry_formatted = user.approved_expiry_date.strftime('%Y-%m-%d %H:%M')
                # Check if expired
                user.is_expired = datetime.now() > user.approved_expiry_date
            else:
                user.expiry_formatted = 'Not set'
                user.is_expired = False
        users_data = [{
            'id': user.id,
            'username': user.username,
            'user_id': user.user_id,
            'is_approved': user.is_approved,
            'expiry_formatted': user.expiry_formatted if hasattr(user, 'expiry_formatted') else None,
            'is_expired': user.is_expired if hasattr(user, 'is_expired') else False
        } for user in users]
        return jsonify({'status': 'success', 'users': users_data})
    except Exception as e:
        print(f"ERROR in admin_panel: {str(e)}")
        traceback.print_exc()
        flash(f'An error occurred: {str(e)}', 'danger')
        return redirect(url_for('dashboard_bp.dashboard'))

# Routes for user management and notifications

@admin_bp.route('/refresh-users', methods=['GET'])
@admin_login_required
def refresh_users():
    """API endpoint to refresh user list"""
    try:
        users = get_all_users()
        print(f"[DEBUG] refresh_users: Found {len(users)} users")
        return jsonify({
            "status": "success",
            "message": "User list refreshed",
            "user_count": len(users)
        })
    except Exception as e:
        print(f"ERROR in refresh_users: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }), 500

@admin_bp.route('/check-new-users', methods=['GET'])
@admin_login_required
def check_new_users():
    """API endpoint to check for new users"""
    try:
        users = get_all_users()
        print(f"[DEBUG] check_new_users: Found {len(users)} users")
        return jsonify({
            "status": "success",
            "user_count": len(users)
        })
    except Exception as e:
        print(f"ERROR in check_new_users: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }), 500

@admin_bp.route('/logout')
def admin_logout():
    # Create response with redirect
    response = make_response(redirect(url_for('admin.admin_login')))
    
    # Clear admin cookies
    response.delete_cookie('admin_session')
    response.delete_cookie('admin_email')
    
    flash('Admin logged out successfully.', 'success')
    return response

@admin_bp.route('/approve-user', methods=['POST'])
@admin_login_required
def approve_user_route():
    """Approve a user for a specific duration or revoke access"""
    try:
        username = request.form.get('username')
        print(f"DEBUG - approve_user_route - Received request for username: {username}")
        print(f"DEBUG - approve_user_route - Form data: {request.form}")
        
        # Check if this is a revoke request
        revoke = request.form.get('revoke')
        if revoke == 'true':
            print(f"DEBUG - approve_user_route - Revoking access for user: {username}")
            # Update user to revoke access
            update_data = {
                'is_approved': False,
                'approved_start_date': None,
                'approved_expiry_date': None
            }
            result = update_user(username, update_data)
            print(f"DEBUG - approve_user_route - Revoke result: {result}")
            
            if result["status"] == "success":
                flash(f'Access for user {username} has been revoked', 'success')
                return jsonify({"status": "success", "message": "User access revoked successfully"}), 200
            else:
                return jsonify({"status": "error", "message": result["message"]}), 400
        
        # This is an approval request
        print(f"DEBUG - approve_user_route - Processing approval request")
        duration_days = request.form.get('duration')
        print(f"DEBUG - approve_user_route - Duration days: {duration_days}")
        
        if not username or not duration_days:
            print(f"DEBUG - approve_user_route - Missing required fields: username={username}, duration={duration_days}")
            return jsonify({"status": "error", "message": "Username and duration are required"}), 400
        
        # Convert duration to integer
        try:
            duration_days = int(duration_days)
            print(f"DEBUG - approve_user_route - Converted duration to int: {duration_days}")
        except ValueError:
            print(f"DEBUG - approve_user_route - Invalid duration format: {duration_days}")
            return jsonify({"status": "error", "message": "Duration must be a number"}), 400
        
        # Approve user
        print(f"DEBUG - approve_user_route - Calling approve_user with username={username}, duration={duration_days}")
        result = approve_user(username, duration_days)
        print(f"DEBUG - approve_user_route - Approval result: {result}")
        
        if result["status"] == "success":
            flash(f'User {username} approved for {duration_days} days', 'success')
            return jsonify({"status": "success", "message": result["message"], "expiry_date": result["expiry_date"].strftime('%Y-%m-%d %H:%M')}), 200
        else:
            return jsonify({"status": "error", "message": result["message"]}), 400
            
    except Exception as e:
        print(f"ERROR in approve_user_route: {str(e)}")
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"An error occurred: {str(e)}"}), 500
