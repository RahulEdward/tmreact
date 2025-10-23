# services/session_service.py

import os
from datetime import datetime, timedelta
from functools import wraps
from flask import session, request, jsonify, g
from database.auth_db import (
    get_user_session, get_new_user_by_id, UserSessions, db_session
)

class SessionService:
    """Service class for handling session management operations"""
    
    def __init__(self):
        self.session_duration_hours = 24  # 24 hours session duration
        self.cleanup_interval_hours = 6   # Clean up expired sessions every 6 hours
    
    def get_current_user_from_session(self):
        """
        Get current user information from Flask session
        
        Returns:
            dict: User information or None if not authenticated
        """
        try:
            # Check if user has new auth session
            if not session.get('new_auth_logged_in') or not session.get('new_auth_session_token'):
                return None
            
            session_token = session.get('new_auth_session_token')
            
            # Validate session token
            session_obj = get_user_session(session_token)
            if not session_obj:
                # Session is invalid, clear session data
                self.clear_session()
                return None
            
            # Get user information
            user = get_new_user_by_id(session_obj.user_id)
            if not user or not user.is_active:
                # User not found or inactive, clear session
                self.clear_session()
                return None
            
            # Update session data with latest user info
            session['new_auth_user_id'] = user.id
            session['new_auth_username'] = user.username
            session['new_auth_email'] = user.email
            
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
            
        except Exception as e:
            print(f"ERROR in get_current_user_from_session: {str(e)}")
            return None
    
    def clear_session(self):
        """Clear all new auth session data from Flask session"""
        try:
            session.pop('new_auth_logged_in', None)
            session.pop('new_auth_user_id', None)
            session.pop('new_auth_username', None)
            session.pop('new_auth_email', None)
            session.pop('new_auth_session_token', None)
            print("Session data cleared")
        except Exception as e:
            print(f"ERROR clearing session: {str(e)}")
    
    def is_authenticated(self):
        """
        Check if current request has valid authentication
        
        Returns:
            bool: True if authenticated, False otherwise
        """
        return self.get_current_user_from_session() is not None
    
    def get_session_info(self):
        """
        Get detailed session information
        
        Returns:
            dict: Session information or None if not authenticated
        """
        try:
            if not session.get('new_auth_session_token'):
                return None
            
            session_token = session.get('new_auth_session_token')
            session_obj = get_user_session(session_token)
            
            if not session_obj:
                return None
            
            return {
                "session_token": session_token,
                "user_id": session_obj.user_id,
                "expires_at": session_obj.expires_at.isoformat() if session_obj.expires_at else None,
                "created_at": session_obj.created_at.isoformat() if session_obj.created_at else None,
                "time_remaining": self._get_time_remaining(session_obj.expires_at)
            }
            
        except Exception as e:
            print(f"ERROR in get_session_info: {str(e)}")
            return None
    
    def _get_time_remaining(self, expires_at):
        """Calculate time remaining until session expires"""
        if not expires_at:
            return None
        
        try:
            now = datetime.now()
            if expires_at > now:
                remaining = expires_at - now
                return {
                    "total_seconds": int(remaining.total_seconds()),
                    "hours": int(remaining.total_seconds() // 3600),
                    "minutes": int((remaining.total_seconds() % 3600) // 60)
                }
            else:
                return {"total_seconds": 0, "hours": 0, "minutes": 0}
        except Exception as e:
            print(f"ERROR calculating time remaining: {str(e)}")
            return None
    
    def extend_session(self, hours=None):
        """
        Extend current session expiration time
        
        Args:
            hours (int): Hours to extend (default: session_duration_hours)
            
        Returns:
            dict: Result with status and new expiration time
        """
        try:
            if not session.get('new_auth_session_token'):
                return {"status": "error", "message": "No active session"}
            
            session_token = session.get('new_auth_session_token')
            session_obj = get_user_session(session_token)
            
            if not session_obj:
                return {"status": "error", "message": "Session not found"}
            
            # Calculate new expiration time
            extension_hours = hours or self.session_duration_hours
            new_expires_at = datetime.now() + timedelta(hours=extension_hours)
            
            # Update session in database
            session_obj.expires_at = new_expires_at
            db_session.commit()
            
            print(f"Session extended for user {session_obj.user_id} until {new_expires_at}")
            
            return {
                "status": "success",
                "message": f"Session extended by {extension_hours} hours",
                "expires_at": new_expires_at.isoformat()
            }
            
        except Exception as e:
            print(f"ERROR extending session: {str(e)}")
            return {"status": "error", "message": "Failed to extend session"}
    
    def cleanup_expired_sessions(self):
        """
        Clean up expired sessions from the database
        
        Returns:
            dict: Result with count of cleaned sessions
        """
        try:
            # Delete expired sessions
            expired_sessions = UserSessions.query.filter(
                UserSessions.expires_at < datetime.now()
            ).all()
            
            count = len(expired_sessions)
            for session_obj in expired_sessions:
                db_session.delete(session_obj)
            
            db_session.commit()
            
            print(f"Cleaned up {count} expired sessions")
            return {"status": "success", "count": count}
            
        except Exception as e:
            print(f"ERROR in cleanup_expired_sessions: {str(e)}")
            return {"status": "error", "message": "Failed to cleanup sessions"}
    
    def get_all_user_sessions(self, user_id):
        """
        Get all active sessions for a user
        
        Args:
            user_id (int): User ID
            
        Returns:
            list: List of active sessions
        """
        try:
            sessions = UserSessions.query.filter_by(user_id=user_id).filter(
                UserSessions.expires_at > datetime.now()
            ).all()
            
            return [{
                "id": s.id,
                "session_token": s.session_token[:10] + "...",  # Truncated for security
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "expires_at": s.expires_at.isoformat() if s.expires_at else None
            } for s in sessions]
            
        except Exception as e:
            print(f"ERROR getting user sessions: {str(e)}")
            return []
    
    def revoke_all_user_sessions(self, user_id, except_current=True):
        """
        Revoke all sessions for a user
        
        Args:
            user_id (int): User ID
            except_current (bool): Whether to keep current session active
            
        Returns:
            dict: Result with count of revoked sessions
        """
        try:
            current_token = session.get('new_auth_session_token') if except_current else None
            
            sessions_to_delete = UserSessions.query.filter_by(user_id=user_id)
            
            if current_token:
                sessions_to_delete = sessions_to_delete.filter(
                    UserSessions.session_token != current_token
                )
            
            sessions = sessions_to_delete.all()
            count = len(sessions)
            
            for session_obj in sessions:
                db_session.delete(session_obj)
            
            db_session.commit()
            
            print(f"Revoked {count} sessions for user {user_id}")
            return {"status": "success", "count": count}
            
        except Exception as e:
            print(f"ERROR revoking user sessions: {str(e)}")
            return {"status": "error", "message": "Failed to revoke sessions"}

# Decorators for route protection

def require_auth(f):
    """
    Decorator to require authentication for a route
    
    Usage:
        @app.route('/protected')
        @require_auth
        def protected_route():
            return jsonify({'message': 'You are authenticated!'})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = session_service.get_current_user_from_session()
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'Authentication required',
                'redirect': '/login'
            }), 401
        
        # Store user in Flask's g object for use in the route
        g.current_user = user
        return f(*args, **kwargs)
    
    return decorated_function

def optional_auth(f):
    """
    Decorator to optionally load user information if authenticated
    
    Usage:
        @app.route('/optional')
        @optional_auth
        def optional_route():
            if g.current_user:
                return jsonify({'message': f'Hello {g.current_user["username"]}!'})
            else:
                return jsonify({'message': 'Hello anonymous user!'})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = session_service.get_current_user_from_session()
        g.current_user = user  # Will be None if not authenticated
        return f(*args, **kwargs)
    
    return decorated_function

# Create a global instance of the session service
session_service = SessionService()