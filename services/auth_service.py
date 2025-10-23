# services/auth_service.py

import os
import re
from datetime import datetime, timedelta
from database.auth_db import (
    create_new_user, get_new_user_by_email, get_new_user_by_username, get_new_user_by_id,
    create_user_session, get_user_session, delete_user_session,
    hash_password, verify_password, generate_session_token, validate_password_strength
)

class AuthService:
    """Service class for handling user authentication operations"""
    
    def __init__(self):
        self.session_duration_hours = 24  # 24 hours session duration
    
    def register_user(self, username, email, password):
        """
        Register a new user with username, email, and password
        
        Args:
            username (str): Unique username
            email (str): Unique email address
            password (str): Plain text password
            
        Returns:
            dict: Result with status, message, and user_id if successful
        """
        try:
            # Validate inputs
            if not username or not email or not password:
                return {"status": "error", "message": "All fields are required"}
            
            # Validate username format (alphanumeric and underscores only, 3-50 chars)
            if not re.match(r'^[a-zA-Z0-9_]{3,50}$', username):
                return {
                    "status": "error", 
                    "message": "Username must be 3-50 characters and contain only letters, numbers, and underscores"
                }
            
            # Validate email format
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, email):
                return {"status": "error", "message": "Please enter a valid email address"}
            
            # Validate password strength
            password_validation = validate_password_strength(password)
            if not password_validation["valid"]:
                return {"status": "error", "message": password_validation["message"]}
            
            # Hash the password
            password_hash = hash_password(password)
            if not password_hash:
                return {"status": "error", "message": "Failed to process password"}
            
            # Create the user
            result = create_new_user(username, email.lower(), password_hash)
            
            if result["status"] == "success":
                print(f"User registration successful: {username} ({email})")
                return {
                    "status": "success",
                    "message": "Registration successful! Please login with your credentials.",
                    "user_id": result["user_id"]
                }
            else:
                return result
                
        except Exception as e:
            print(f"ERROR in register_user: {str(e)}")
            return {"status": "error", "message": "Registration failed. Please try again."}
    
    def authenticate_user(self, email_or_username, password):
        """
        Authenticate a user with email/username and password
        
        Args:
            email_or_username (str): Email address or username
            password (str): Plain text password
            
        Returns:
            dict: Result with status, message, user info, and session_token if successful
        """
        try:
            # Validate inputs
            if not email_or_username or not password:
                return {"status": "error", "message": "Email/username and password are required"}
            
            # Try to find user by email first, then by username
            user = None
            if '@' in email_or_username:
                user = get_new_user_by_email(email_or_username.lower())
            else:
                user = get_new_user_by_username(email_or_username)
            
            if not user:
                return {"status": "error", "message": "Invalid credentials"}
            
            # Check if user is active
            if not user.is_active:
                return {"status": "error", "message": "Account is deactivated. Please contact support."}
            
            # Verify password
            if not verify_password(password, user.password_hash):
                return {"status": "error", "message": "Invalid credentials"}
            
            # Create session
            session_result = self.create_session(user.id)
            if session_result["status"] != "success":
                return {"status": "error", "message": "Failed to create session. Please try again."}
            
            print(f"User authentication successful: {user.username} ({user.email})")
            return {
                "status": "success",
                "message": f"Welcome back, {user.username}!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "created_at": user.created_at.isoformat() if user.created_at else None
                },
                "session_token": session_result["session_token"]
            }
            
        except Exception as e:
            print(f"ERROR in authenticate_user: {str(e)}")
            return {"status": "error", "message": "Authentication failed. Please try again."}
    
    def create_session(self, user_id):
        """
        Create a new session for a user
        
        Args:
            user_id (int): User ID
            
        Returns:
            dict: Result with status, message, and session_token if successful
        """
        try:
            # Generate session token
            session_token = generate_session_token()
            if not session_token:
                return {"status": "error", "message": "Failed to generate session token"}
            
            # Calculate expiration time
            expires_at = datetime.now() + timedelta(hours=self.session_duration_hours)
            
            # Create session in database
            result = create_user_session(user_id, session_token, expires_at)
            
            if result["status"] == "success":
                return {
                    "status": "success",
                    "message": "Session created successfully",
                    "session_token": session_token,
                    "expires_at": expires_at.isoformat()
                }
            else:
                return result
                
        except Exception as e:
            print(f"ERROR in create_session: {str(e)}")
            return {"status": "error", "message": "Failed to create session"}
    
    def validate_session(self, session_token):
        """
        Validate a session token and return user information
        
        Args:
            session_token (str): Session token to validate
            
        Returns:
            dict: Result with status, message, and user info if valid
        """
        try:
            if not session_token:
                return {"status": "error", "message": "Session token is required"}
            
            # Get session from database
            session = get_user_session(session_token)
            if not session:
                return {"status": "error", "message": "Invalid or expired session"}
            
            # Get user information
            user = get_new_user_by_id(session.user_id)
            if not user:
                return {"status": "error", "message": "User not found"}
            
            # Check if user is still active
            if not user.is_active:
                return {"status": "error", "message": "Account is deactivated"}
            
            return {
                "status": "success",
                "message": "Session is valid",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "created_at": user.created_at.isoformat() if user.created_at else None
                },
                "session": {
                    "expires_at": session.expires_at.isoformat() if session.expires_at else None,
                    "created_at": session.created_at.isoformat() if session.created_at else None
                }
            }
            
        except Exception as e:
            print(f"ERROR in validate_session: {str(e)}")
            return {"status": "error", "message": "Session validation failed"}
    
    def logout_user(self, session_token):
        """
        Logout a user by deleting their session
        
        Args:
            session_token (str): Session token to delete
            
        Returns:
            dict: Result with status and message
        """
        try:
            if not session_token:
                return {"status": "error", "message": "Session token is required"}
            
            # Delete session from database
            result = delete_user_session(session_token)
            
            if result["status"] == "success":
                print(f"User logout successful")
                return {"status": "success", "message": "Logged out successfully"}
            else:
                return result
                
        except Exception as e:
            print(f"ERROR in logout_user: {str(e)}")
            return {"status": "error", "message": "Logout failed"}
    
    def get_user_by_session(self, session_token):
        """
        Get user information by session token (convenience method)
        
        Args:
            session_token (str): Session token
            
        Returns:
            dict: User information or None if invalid session
        """
        validation_result = self.validate_session(session_token)
        if validation_result["status"] == "success":
            return validation_result["user"]
        return None
    
    def cleanup_expired_sessions(self):
        """
        Clean up expired sessions from the database
        This should be called periodically (e.g., via a cron job)
        
        Returns:
            dict: Result with status and count of cleaned sessions
        """
        try:
            from database.auth_db import UserSessions, db_session
            
            # Delete expired sessions
            expired_sessions = UserSessions.query.filter(
                UserSessions.expires_at < datetime.now()
            ).all()
            
            count = len(expired_sessions)
            for session in expired_sessions:
                db_session.delete(session)
            
            db_session.commit()
            
            print(f"Cleaned up {count} expired sessions")
            return {"status": "success", "message": f"Cleaned up {count} expired sessions", "count": count}
            
        except Exception as e:
            print(f"ERROR in cleanup_expired_sessions: {str(e)}")
            return {"status": "error", "message": "Failed to cleanup expired sessions"}

# Create a global instance of the auth service
auth_service = AuthService()