# database/auth_db.py

import os
import secrets
import string
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, UniqueConstraint
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean  
from sqlalchemy.sql import func
from dotenv import load_dotenv
from database.db import db 
from cachetools import TTLCache
import traceback
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt()

# Define a cache for the auth tokens and api_key with a max size and a 30-second TTL
auth_cache = TTLCache(maxsize=1024, ttl=30)
api_key_cache = TTLCache(maxsize=1024, ttl=30)

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    # Always use local db for development, /tmp only for Vercel production
    if os.getenv('VERCEL') or os.getenv('VERCEL_ENV'):
        DATABASE_URL = 'sqlite:///tmp/secueralgo.db'
    else:
        # For local development, use the existing database
        DATABASE_URL = 'sqlite:///db/secueralgo.db'
    print(f"WARNING: DATABASE_URL not found in .env, using default: {DATABASE_URL}")

try:
    engine = create_engine(
        DATABASE_URL,
        pool_size=50,  # Increase pool size
        max_overflow=100,  # Increase overflow
        pool_timeout=10  # Increase timeout to 10 seconds
    )
    
    db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    Base = declarative_base()
    Base.query = db_session.query_property()
    
    print(f"Database engine created successfully for: {DATABASE_URL}")
except Exception as e:
    print(f"ERROR creating database engine: {str(e)}")
    traceback.print_exc()
    raise

class Auth(Base):
    __tablename__ = 'auth'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    auth = Column(Text, nullable=False)  # Changed from String(1000) to Text for larger tokens
    is_revoked = Column(Boolean, default=False)  
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

class AuthTokens(Base):
    __tablename__ = 'auth_tokens'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), nullable=False)
    user_id = Column(String(255), nullable=False)
    access_token = Column(Text, nullable=False)
    feed_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

class ApiKeys(Base):
    __tablename__ = 'api_keys'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, unique=True)
    api_key = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())

# New User Authentication System Models

# Users table for the new authentication system
class NewUsers(Base):
    __tablename__ = 'new_users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

# User Sessions table for session management
class UserSessions(Base):
    __tablename__ = 'user_sessions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    session_token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())

# Broker Connections table for managing broker accounts
class BrokerConnections(Base):
    __tablename__ = 'broker_connections'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    broker_type = Column(String(50), nullable=False)
    broker_user_id = Column(String(100), nullable=False)
    display_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    connected_at = Column(DateTime(timezone=True), default=func.now())
    last_sync_at = Column(DateTime(timezone=True))
    # Encrypted credential fields
    encrypted_client_id = Column(Text)  # Encrypted client ID
    encrypted_api_key = Column(Text)    # Encrypted API key
    encrypted_pin = Column(Text)        # Encrypted PIN

# Broker Tokens table for storing broker authentication tokens
class BrokerTokens(Base):
    __tablename__ = 'broker_tokens'
    id = Column(Integer, primary_key=True)
    connection_id = Column(Integer, nullable=False)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text)
    feed_token = Column(Text)
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

# Legacy Users table for multi-user support (keeping for backward compatibility)
class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    user_id = Column(String(255), unique=True, nullable=False)
    apikey = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    approved_start_date = Column(DateTime(timezone=True), nullable=True)
    approved_expiry_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())

def init_db():
    print("Initializing Auth DB")
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"ERROR initializing database: {str(e)}")
        traceback.print_exc()
        raise

def upsert_auth(name, auth_token, revoke=False):
    """Store or update authentication token for a user"""
    if not name:
        print(f"ERROR in upsert_auth: Empty username")
        return None
        
    if not auth_token and not revoke:
        print(f"ERROR in upsert_auth: Empty auth token for user: {name}")
        return None
    
    print(f"Upserting auth token for user: {name}, token length: {len(auth_token) if auth_token else 0}, revoke: {revoke}")
    
    try:
        auth_obj = Auth.query.filter_by(name=name).first()
        
        if auth_obj:
            # Update existing auth object
            auth_obj.auth = auth_token
            auth_obj.is_revoked = revoke
            print(f"Updating existing auth record for {name} (ID: {auth_obj.id})")
        else:
            # Create new auth object
            auth_obj = Auth(name=name, auth=auth_token, is_revoked=revoke)
            db_session.add(auth_obj)
            print(f"Creating new auth record for {name}")
        
        db_session.commit()
        print(f"Successfully upserted auth token for {name}, ID: {auth_obj.id}")
        
        # Clear cache
        cache_key = f"auth-{name}"
        if cache_key in auth_cache:
            del auth_cache[cache_key]
            
        return auth_obj.id
        
    except Exception as e:
        db_session.rollback()
        print(f"ERROR in upsert_auth: {str(e)}")
        traceback.print_exc()
        return None

def get_auth_token(name):
    """Get authentication token for a user, using cache when available"""
    if not name:
        print(f"ERROR in get_auth_token: Empty username")
        return None
        
    cache_key = f"auth-{name}"
    
    if cache_key in auth_cache:
        auth_obj = auth_cache[cache_key]
        # Ensure that auth_obj is an instance of Auth, not a string
        if isinstance(auth_obj, Auth) and not auth_obj.is_revoked:
            return auth_obj.auth
        else:
            del auth_cache[cache_key]  # Remove invalid cache entry
            return None
    else:
        auth_obj = get_auth_token_dbquery(name)
        if isinstance(auth_obj, Auth) and not auth_obj.is_revoked:
            auth_cache[cache_key] = auth_obj  # Store the Auth object, not the string
            return auth_obj.auth
        return None

def get_auth_token_dbquery(name):
    """Query database directly for auth token"""
    if not name:
        print(f"ERROR in get_auth_token_dbquery: Empty username")
        return None
        
    try:
        auth_obj = Auth.query.filter_by(name=name).first()
        if auth_obj and not auth_obj.is_revoked:
            print(f"Successfully fetched auth token for {name} from database")
            return auth_obj  # Return the Auth object
        else:
            print(f"No valid auth token found for name '{name}'.")
            return None
    except Exception as e:
        print(f"ERROR while querying the database for auth token: {str(e)}")
        traceback.print_exc()
        return None

def upsert_api_key(user_id, api_key):
    """Store or update API key for a user"""
    if not user_id:
        print("ERROR in upsert_api_key: user_id is empty")
        return None
        
    if not api_key:
        print(f"ERROR in upsert_api_key: api_key is empty for user_id: {user_id}")
        return None
    
    try:
        api_key_obj = ApiKeys.query.filter_by(user_id=user_id).first()
        
        if api_key_obj:
            api_key_obj.api_key = api_key
            print(f"Updating existing API key for user_id: {user_id}")
        else:
            api_key_obj = ApiKeys(user_id=user_id, api_key=api_key)
            db_session.add(api_key_obj)
            print(f"Creating new API key for user_id: {user_id}")
            
        db_session.commit()
        
        # Clear cache
        cache_key = f"api-key-{user_id}"
        if cache_key in api_key_cache:
            del api_key_cache[cache_key]
            
        return api_key_obj.id
        
    except Exception as e:
        db_session.rollback()
        print(f"ERROR in upsert_api_key: {str(e)}")
        traceback.print_exc()
        return None

def get_api_key(user_id):
    """Get API key for a user, using cache when available"""
    if not user_id:
        print("ERROR in get_api_key: user_id is empty")
        return None
        
    cache_key = f"api-key-{user_id}"
    
    if cache_key in api_key_cache:
        print(f"Cache hit for {cache_key}.")
        return api_key_cache[cache_key]
    else:
        api_key_obj = get_api_key_dbquery(user_id)
        if api_key_obj is not None:
            api_key_cache[cache_key] = api_key_obj
        return api_key_obj

def get_api_key_dbquery(user_id):
    """Query database directly for API key"""
    if not user_id:
        print("ERROR in get_api_key_dbquery: user_id is empty")
        return None
        
    try:
        api_key_obj = ApiKeys.query.filter_by(user_id=user_id).first()
        if api_key_obj:
            print(f"Successfully fetched API key for user_id: {user_id} from database")
            return api_key_obj.api_key
        else:
            print(f"No API key found for user_id '{user_id}'.")
            return None
    except Exception as e:
        print(f"ERROR while querying the database for API key: {str(e)}")
        traceback.print_exc()
        return None

# User management functions

def create_user(username, user_id, apikey, is_admin=False):
    """Create a new user in the database"""
    if not username or not user_id or not apikey:
        print("ERROR in create_user: Missing required fields")
        return {"status": "error", "message": "All fields are required"}
    
    try:
        # Check if username already exists
        existing_user = Users.query.filter_by(username=username).first()
        if existing_user:
            print(f"ERROR in create_user: Username {username} already exists")
            return {"status": "error", "message": "Username already exists"}
            
        # Check if user_id already exists
        existing_id = Users.query.filter_by(user_id=user_id).first()
        if existing_id:
            print(f"ERROR in create_user: User ID {user_id} already exists")
            return {"status": "error", "message": "User ID already exists"}
        
        # Create new user
        user = Users(username=username, user_id=user_id, apikey=apikey, is_admin=is_admin)
        db_session.add(user)
        
        # Also add to ApiKeys table
        api_key = ApiKeys(user_id=user_id, api_key=apikey)
        db_session.add(api_key)
        
        db_session.commit()
        print(f"Successfully created user: {username}")
        return {"status": "success", "message": "User created successfully"}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR creating user: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def get_user_by_username(username):
    """Get user details by username"""
    if not username:
        print("ERROR in get_user_by_username: username is empty")
        return None
        
    try:
        user = Users.query.filter_by(username=username).first()
        if user:
            print(f"Successfully fetched user by username: {username}")
            return user
        else:
            print(f"User not found with username: {username}")
            return None
    except Exception as e:
        print(f"ERROR getting user by username: {str(e)}")
        traceback.print_exc()
        return None

def get_user_by_id(user_id):
    """Get user details by user_id"""
    if not user_id:
        print("ERROR in get_user_by_id: user_id is empty")
        return None
        
    try:
        user = Users.query.filter_by(user_id=user_id).first()
        if user:
            print(f"Successfully fetched user by user_id: {user_id}")
            return user
        else:
            print(f"User not found with user_id: {user_id}")
            return None
    except Exception as e:
        print(f"ERROR getting user by user_id: {str(e)}")
        traceback.print_exc()
        return None

def get_all_users():
    """Get all users from the database"""
    try:
        users = Users.query.all()
        print(f"Successfully fetched {len(users)} users")
        return users
    except Exception as e:
        print(f"ERROR getting all users: {str(e)}")
        traceback.print_exc()
        return []

def update_user(username, new_data):
    """Update user details"""
    if not username:
        print("ERROR in update_user: username is empty")
        return {"status": "error", "message": "Username is required"}
        
    if not new_data:
        print("ERROR in update_user: new_data is empty")
        return {"status": "error", "message": "No data to update"}
    
    try:
        user = Users.query.filter_by(username=username).first()
        if not user:
            print(f"ERROR in update_user: User {username} not found")
            return {"status": "error", "message": "User not found"}
        
        # Update user fields if provided in new_data
        if 'user_id' in new_data:
            # Check if new user_id already exists
            existing = Users.query.filter_by(user_id=new_data['user_id']).first()
            if existing and existing.username != username:
                print(f"ERROR in update_user: User ID {new_data['user_id']} already exists")
                return {"status": "error", "message": "User ID already exists"}
            user.user_id = new_data['user_id']
            
        if 'apikey' in new_data:
            user.apikey = new_data['apikey']
            
            # Also update in ApiKeys table
            api_key_obj = ApiKeys.query.filter_by(user_id=user.user_id).first()
            if api_key_obj:
                api_key_obj.api_key = new_data['apikey']
            else:
                api_key_obj = ApiKeys(user_id=user.user_id, api_key=new_data['apikey'])
                db_session.add(api_key_obj)
        
        # Handle approval fields
        if 'is_approved' in new_data:
            user.is_approved = new_data['is_approved']
            
        if 'approved_start_date' in new_data:
            user.approved_start_date = new_data['approved_start_date']
            
        if 'approved_expiry_date' in new_data:
            user.approved_expiry_date = new_data['approved_expiry_date']
            
        if 'is_admin' in new_data:
            user.is_admin = new_data['is_admin']
            
        db_session.commit()
        print(f"Successfully updated user: {username}")
        return {"status": "success", "message": "User updated successfully"}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR updating user: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def approve_user(username, duration_days):
    """Approve a user for a specific duration"""
    if not username:
        print("ERROR in approve_user: username is empty")
        return {"status": "error", "message": "Username is required"}
    
    if not isinstance(duration_days, int) or duration_days <= 0:
        print(f"ERROR in approve_user: Invalid duration: {duration_days}")
        return {"status": "error", "message": "Duration must be a positive integer"}
    
    try:
        user = Users.query.filter_by(username=username).first()
        if not user:
            print(f"ERROR in approve_user: User {username} not found")
            return {"status": "error", "message": "User not found"}
        
        # Set approval status and dates
        start_date = datetime.now()
        expiry_date = start_date + timedelta(days=duration_days)
        
        user.is_approved = True
        user.approved_start_date = start_date
        user.approved_expiry_date = expiry_date
        
        db_session.commit()
        
        print(f"Successfully approved user {username} for {duration_days} days (until {expiry_date})")
        return {
            "status": "success", 
            "message": f"User approved for {duration_days} days",
            "expiry_date": expiry_date
        }
    except Exception as e:
        db_session.rollback()
        print(f"ERROR approving user: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def check_user_approval(username):
    """Check if a user is approved and the approval is not expired - ADMIN APPROVAL DISABLED"""
    if not username:
        print("ERROR in check_user_approval: username is empty")
        return {"is_valid": False, "message": "Username is required"}
    
    try:
        user = Users.query.filter_by(username=username).first()
        if not user:
            print(f"ERROR in check_user_approval: User {username} not found")
            return {"is_valid": False, "message": "User not found"}
        
        # ADMIN APPROVAL FEATURE DISABLED - All registered users are automatically approved
        print(f"User {username} automatically approved (admin approval disabled)")
        return {
            "is_valid": True, 
            "message": "User automatically approved (admin approval disabled)"
        }
    except Exception as e:
        print(f"ERROR checking user approval: {str(e)}")
        traceback.print_exc()
        return {"is_valid": False, "message": f"Error checking approval status: {str(e)}"}

def delete_user(username):
    """Delete a user from the database"""
    if not username:
        print("ERROR in delete_user: username is empty")
        return {"status": "error", "message": "Username is required"}
    
    try:
        user = Users.query.filter_by(username=username).first()
        if not user:
            print(f"ERROR in delete_user: User {username} not found")
            return {"status": "error", "message": "User not found"}
        
        # Delete related auth tokens
        auth = Auth.query.filter_by(name=username).first()
        if auth:
            db_session.delete(auth)
            print(f"Deleted auth token for user: {username}")
        
        # Delete related API keys
        api_key = ApiKeys.query.filter_by(user_id=user.user_id).first()
        if api_key:
            db_session.delete(api_key)
            print(f"Deleted API key for user: {username}")
        
        # Delete the user
        db_session.delete(user)
        db_session.commit()
        
        print(f"Successfully deleted user: {username}")
        return {"status": "success", "message": "User deleted successfully"}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR deleting user: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

# Auth Tokens Management Functions
def store_auth_tokens(username, user_id, access_token, feed_token, refresh_token=None, expires_at=None):
    """Store or update auth tokens for a user"""
    try:
        # Check if tokens already exist for this user
        existing_token = AuthTokens.query.filter_by(username=username).first()
        
        if existing_token:
            # Update existing tokens
            existing_token.access_token = access_token
            existing_token.feed_token = feed_token
            existing_token.refresh_token = refresh_token
            existing_token.expires_at = expires_at
            existing_token.is_active = True
            existing_token.updated_at = datetime.now()
            print(f"Updated auth tokens for user: {username}")
        else:
            # Create new token record
            new_token = AuthTokens(
                username=username,
                user_id=user_id,
                access_token=access_token,
                feed_token=feed_token,
                refresh_token=refresh_token,
                expires_at=expires_at,
                is_active=True
            )
            db_session.add(new_token)
            print(f"Created new auth tokens for user: {username}")
        
        db_session.commit()
        return {"status": "success", "message": "Auth tokens stored successfully"}
        
    except Exception as e:
        db_session.rollback()
        print(f"ERROR storing auth tokens: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def get_auth_tokens(username):
    """Get auth tokens for a user"""
    try:
        token_record = AuthTokens.query.filter_by(username=username, is_active=True).first()
        
        if token_record:
            return {
                "status": "success",
                "access_token": token_record.access_token,
                "feed_token": token_record.feed_token,
                "refresh_token": token_record.refresh_token,
                "expires_at": token_record.expires_at,
                "created_at": token_record.created_at
            }
        else:
            return {"status": "error", "message": "No active tokens found for user"}
            
    except Exception as e:
        print(f"ERROR getting auth tokens: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

# New User Authentication System Functions

def create_new_user(username, email, password_hash):
    """Create a new user in the new authentication system"""
    if not username or not email or not password_hash:
        print("ERROR in create_new_user: Missing required fields")
        return {"status": "error", "message": "All fields are required"}
    
    try:
        # Check if username already exists
        existing_user = NewUsers.query.filter_by(username=username).first()
        if existing_user:
            print(f"ERROR in create_new_user: Username {username} already exists")
            return {"status": "error", "message": "Username already exists"}
            
        # Check if email already exists
        existing_email = NewUsers.query.filter_by(email=email).first()
        if existing_email:
            print(f"ERROR in create_new_user: Email {email} already exists")
            return {"status": "error", "message": "Email already exists"}
        
        # Create new user
        user = NewUsers(username=username, email=email, password_hash=password_hash)
        db_session.add(user)
        db_session.commit()
        
        print(f"Successfully created new user: {username}")
        return {"status": "success", "message": "User created successfully", "user_id": user.id}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR creating new user: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def get_new_user_by_email(email):
    """Get user details by email from new users table"""
    if not email:
        print("ERROR in get_new_user_by_email: email is empty")
        return None
        
    try:
        user = NewUsers.query.filter_by(email=email).first()
        if user:
            print(f"Successfully fetched user by email: {email}")
            return user
        else:
            print(f"User not found with email: {email}")
            return None
    except Exception as e:
        print(f"ERROR getting user by email: {str(e)}")
        traceback.print_exc()
        return None

def get_new_user_by_username(username):
    """Get user details by username from new users table"""
    if not username:
        print("ERROR in get_new_user_by_username: username is empty")
        return None
        
    try:
        user = NewUsers.query.filter_by(username=username).first()
        if user:
            print(f"Successfully fetched user by username: {username}")
            return user
        else:
            print(f"User not found with username: {username}")
            return None
    except Exception as e:
        print(f"ERROR getting user by username: {str(e)}")
        traceback.print_exc()
        return None

def get_new_user_by_id(user_id):
    """Get user details by ID from new users table"""
    if not user_id:
        print("ERROR in get_new_user_by_id: user_id is empty")
        return None
        
    try:
        user = NewUsers.query.filter_by(id=user_id).first()
        if user:
            print(f"Successfully fetched user by ID: {user_id}")
            return user
        else:
            print(f"User not found with ID: {user_id}")
            return None
    except Exception as e:
        print(f"ERROR getting user by ID: {str(e)}")
        traceback.print_exc()
        return None

def create_user_session(user_id, session_token, expires_at):
    """Create a new user session"""
    if not user_id or not session_token or not expires_at:
        print("ERROR in create_user_session: Missing required fields")
        return {"status": "error", "message": "All fields are required"}
    
    try:
        # Remove any existing sessions for this user
        existing_sessions = UserSessions.query.filter_by(user_id=user_id).all()
        for session in existing_sessions:
            db_session.delete(session)
        
        # Create new session
        session = UserSessions(user_id=user_id, session_token=session_token, expires_at=expires_at)
        db_session.add(session)
        db_session.commit()
        
        print(f"Successfully created session for user ID: {user_id}")
        return {"status": "success", "message": "Session created successfully"}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR creating user session: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def get_user_session(session_token):
    """Get user session by token"""
    if not session_token:
        print("ERROR in get_user_session: session_token is empty")
        return None
        
    try:
        session = UserSessions.query.filter_by(session_token=session_token).first()
        if session:
            # Check if session is expired
            if session.expires_at > datetime.now():
                print(f"Successfully fetched valid session for token")
                return session
            else:
                print(f"Session expired, removing from database")
                db_session.delete(session)
                db_session.commit()
                return None
        else:
            print(f"Session not found for token")
            return None
    except Exception as e:
        print(f"ERROR getting user session: {str(e)}")
        traceback.print_exc()
        return None

def delete_user_session(session_token):
    """Delete a user session"""
    if not session_token:
        print("ERROR in delete_user_session: session_token is empty")
        return {"status": "error", "message": "Session token is required"}
    
    try:
        session = UserSessions.query.filter_by(session_token=session_token).first()
        if session:
            db_session.delete(session)
            db_session.commit()
            print(f"Successfully deleted session")
            return {"status": "success", "message": "Session deleted successfully"}
        else:
            print(f"Session not found for deletion")
            return {"status": "error", "message": "Session not found"}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR deleting user session: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def create_broker_connection(user_id, broker_type, broker_user_id, display_name=None, encrypted_credentials=None):
    """Create a new broker connection with encrypted credentials"""
    if not user_id or not broker_type or not broker_user_id:
        print("ERROR in create_broker_connection: Missing required fields")
        return {"status": "error", "message": "User ID, broker type, and broker user ID are required"}
    
    try:
        # Check if connection already exists
        existing_connection = BrokerConnections.query.filter_by(
            user_id=user_id, 
            broker_type=broker_type, 
            broker_user_id=broker_user_id
        ).first()
        
        if existing_connection:
            print(f"Broker connection already exists for user {user_id}, broker {broker_type}")
            return {"status": "error", "message": "Broker connection already exists"}
        
        # Create new connection with encrypted credentials
        connection = BrokerConnections(
            user_id=user_id,
            broker_type=broker_type,
            broker_user_id=broker_user_id,
            display_name=display_name or f"{broker_type} - {broker_user_id}",
            encrypted_client_id=encrypted_credentials.get('client_id') if encrypted_credentials else None,
            encrypted_api_key=encrypted_credentials.get('api_key') if encrypted_credentials else None,
            encrypted_pin=encrypted_credentials.get('pin') if encrypted_credentials else None
        )
        db_session.add(connection)
        db_session.commit()
        
        print(f"Successfully created broker connection with encrypted credentials for user {user_id}")
        return {"status": "success", "message": "Broker connection created successfully", "connection_id": connection.id}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR creating broker connection: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def get_user_broker_connections(user_id):
    """Get all broker connections for a user"""
    if not user_id:
        print("ERROR in get_user_broker_connections: user_id is empty")
        return []
        
    try:
        connections = BrokerConnections.query.filter_by(user_id=user_id, is_active=True).all()
        print(f"Successfully fetched {len(connections)} broker connections for user {user_id}")
        return connections
    except Exception as e:
        print(f"ERROR getting user broker connections: {str(e)}")
        traceback.print_exc()
        return []

def store_broker_tokens(connection_id, access_token, refresh_token=None, feed_token=None, expires_at=None):
    """Store or update broker tokens for a connection"""
    if not connection_id or not access_token:
        print("ERROR in store_broker_tokens: Missing required fields")
        return {"status": "error", "message": "Connection ID and access token are required"}
    
    try:
        # Check if tokens already exist for this connection
        existing_tokens = BrokerTokens.query.filter_by(connection_id=connection_id).first()
        
        if existing_tokens:
            # Update existing tokens
            existing_tokens.access_token = access_token
            existing_tokens.refresh_token = refresh_token
            existing_tokens.feed_token = feed_token
            existing_tokens.expires_at = expires_at
            existing_tokens.updated_at = datetime.now()
            print(f"Updated broker tokens for connection {connection_id}")
        else:
            # Create new token record
            tokens = BrokerTokens(
                connection_id=connection_id,
                access_token=access_token,
                refresh_token=refresh_token,
                feed_token=feed_token,
                expires_at=expires_at
            )
            db_session.add(tokens)
            print(f"Created new broker tokens for connection {connection_id}")
        
        db_session.commit()
        return {"status": "success", "message": "Broker tokens stored successfully"}
    except Exception as e:
        db_session.rollback()
        print(f"ERROR storing broker tokens: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "message": f"Database error: {str(e)}"}

def get_broker_tokens(connection_id):
    """Get broker tokens for a connection"""
    if not connection_id:
        print("ERROR in get_broker_tokens: connection_id is empty")
        return None
        
    try:
        tokens = BrokerTokens.query.filter_by(connection_id=connection_id).first()
        if tokens:
            print(f"Successfully fetched broker tokens for connection {connection_id}")
            return tokens
        else:
            print(f"No broker tokens found for connection {connection_id}")
            return None
    except Exception as e:
        print(f"ERROR getting broker tokens: {str(e)}")
        traceback.print_exc()
        return None

# Password and Session Utility Functions

def hash_password(password):
    """Hash a password using bcrypt"""
    try:
        if isinstance(password, str):
            password = password.encode('utf-8')
        password_hash = bcrypt.generate_password_hash(password, rounds=12)
        return password_hash.decode('utf-8')
    except Exception as e:
        print(f"ERROR hashing password: {str(e)}")
        traceback.print_exc()
        return None

def verify_password(password, password_hash):
    """Verify a password against its hash"""
    try:
        if not password_hash:
            print("ERROR: password_hash is None or empty")
            return False
            
        if isinstance(password, str):
            password = password.encode('utf-8')
            
        if isinstance(password_hash, str):
            password_hash = password_hash.encode('utf-8')
            
        return bcrypt.check_password_hash(password_hash, password)
    except Exception as e:
        print(f"ERROR verifying password: {str(e)}")
        traceback.print_exc()
        return False

def generate_session_token():
    """Generate a secure random session token"""
    try:
        # Generate a 256-bit (32 byte) random token
        token = secrets.token_urlsafe(32)
        return token
    except Exception as e:
        print(f"ERROR generating session token: {str(e)}")
        traceback.print_exc()
        return None

def validate_password_strength(password):
    """Validate password meets security requirements"""
    if not password:
        return {"valid": False, "message": "Password is required"}
    
    if len(password) < 8:
        return {"valid": False, "message": "Password must be at least 8 characters long"}
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    
    if not has_upper:
        return {"valid": False, "message": "Password must contain at least one uppercase letter"}
    
    if not has_lower:
        return {"valid": False, "message": "Password must contain at least one lowercase letter"}
    
    if not has_digit:
        return {"valid": False, "message": "Password must contain at least one number"}
    
    return {"valid": True, "message": "Password meets security requirements"}