#!/usr/bin/env python3
"""
Create the new authentication system database tables in the correct database
"""
import sys
import os
import sqlite3

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_auth_tables_directly():
    """Create the new authentication tables directly in the existing database"""
    try:
        # Use the existing database path
        db_path = 'db/secueralgo.db'
        
        if not os.path.exists(db_path):
            print(f"❌ Database not found at: {db_path}")
            return False
        
        print(f"🔧 Creating new authentication tables in: {db_path}")
        
        # Connect to the existing database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create new_users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS new_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("✅ Created new_users table")
        
        # Create user_sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES new_users (id) ON DELETE CASCADE
            )
        ''')
        print("✅ Created user_sessions table")
        
        # Create broker_connections table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS broker_connections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                broker_type VARCHAR(50) NOT NULL,
                broker_user_id VARCHAR(100) NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                connection_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES new_users (id) ON DELETE CASCADE
            )
        ''')
        print("✅ Created broker_connections table")
        
        # Create broker_tokens table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS broker_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                connection_id INTEGER NOT NULL,
                access_token TEXT,
                refresh_token TEXT,
                feed_token TEXT,
                expires_at DATETIME,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (connection_id) REFERENCES broker_connections (id) ON DELETE CASCADE
            )
        ''')
        print("✅ Created broker_tokens table")
        
        # Commit changes
        conn.commit()
        conn.close()
        
        print("🎉 All authentication tables created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def verify_tables():
    """Verify the tables were created"""
    try:
        db_path = 'db/secueralgo.db'
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check for new auth tables
        auth_tables = ['new_users', 'user_sessions', 'broker_connections', 'broker_tokens']
        
        print("\n🔍 Verifying tables:")
        for table_name in auth_tables:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
            exists = cursor.fetchone()
            
            if exists:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                count = cursor.fetchone()[0]
                print(f"✅ {table_name}: Found ({count} records)")
            else:
                print(f"❌ {table_name}: Not found")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error verifying tables: {str(e)}")

if __name__ == "__main__":
    if create_auth_tables_directly():
        verify_tables()
    else:
        print("❌ Failed to create authentication tables")