#!/usr/bin/env python3
"""
Setup Neon PostgreSQL Database
Creates all required tables in Neon database
"""
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def setup_neon_database():
    """Setup Neon PostgreSQL database"""
    print("=" * 60)
    print("Setting up Neon PostgreSQL Database")
    print("=" * 60)
    print()
    
    # Check if DATABASE_URL is set
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not found in .env file!")
        return False
    
    if 'postgresql' not in database_url:
        print("❌ DATABASE_URL is not PostgreSQL!")
        print(f"   Current: {database_url[:50]}...")
        return False
    
    print(f"✅ Database URL configured")
    print(f"   Host: {database_url.split('@')[1].split('/')[0] if '@' in database_url else 'unknown'}")
    print()
    
    # Initialize database
    try:
        print("📦 Initializing database tables...")
        from database.auth_db import init_db
        
        result = init_db()
        
        if result:
            print("✅ Database tables created successfully!")
            print()
            print("Tables created:")
            print("   - new_users")
            print("   - user_sessions")
            print("   - broker_connections")
            print("   - broker_tokens")
            print("   - users (legacy)")
            print("   - auth_tokens (legacy)")
            print()
            
            # Create test user
            print("Creating test user...")
            from flask_bcrypt import Bcrypt
            from database.auth_db import create_new_user
            
            bcrypt = Bcrypt()
            password_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
            
            try:
                user_result = create_new_user('testuser', 'test@example.com', password_hash)
                if user_result['status'] == 'success':
                    print("✅ Test user created:")
                    print("   Username: testuser")
                    print("   Email: test@example.com")
                    print("   Password: password123")
                else:
                    print(f"⚠️  Test user: {user_result['message']}")
            except Exception as e:
                print(f"⚠️  Test user creation: {str(e)}")
            
            print()
            print("=" * 60)
            print("✅ Neon Database Setup Complete!")
            print("=" * 60)
            print()
            print("Next steps:")
            print("1. Test locally: python app.py")
            print("2. Deploy to Vercel: vercel --prod")
            print("3. Update Vercel environment variables")
            print()
            
            return True
        else:
            print("❌ Failed to create database tables")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = setup_neon_database()
    sys.exit(0 if success else 1)
