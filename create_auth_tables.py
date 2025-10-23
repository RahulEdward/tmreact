#!/usr/bin/env python3
"""
Create the new authentication system database tables
"""
import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.auth_db import init_db

def create_tables():
    """Create the new authentication tables"""
    try:
        print("🔧 Creating new authentication system tables...")
        
        # Initialize the database tables
        result = init_db()
        
        if result:
            print("✅ Successfully created authentication tables!")
            print("   - new_users")
            print("   - user_sessions") 
            print("   - broker_connections")
            print("   - broker_tokens")
        else:
            print("❌ Failed to create tables")
            
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_tables()