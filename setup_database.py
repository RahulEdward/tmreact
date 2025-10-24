#!/usr/bin/env python3
"""
Complete database setup script for TradingBridge
This script will:
1. Create the database file if it doesn't exist
2. Create all required tables
3. Verify the setup
"""
import sys
import os
import sqlite3
from pathlib import Path

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def ensure_db_directory():
    """Ensure the db directory exists"""
    db_dir = Path("db")
    if not db_dir.exists():
        db_dir.mkdir(parents=True, exist_ok=True)
        print("✅ Created db directory")
    else:
        print("✅ db directory exists")
    return db_dir

def create_database_file(db_path):
    """Create the database file if it doesn't exist"""
    if not db_path.exists():
        # Create an empty database file
        conn = sqlite3.connect(str(db_path))
        conn.close()
        print(f"✅ Created database file: {db_path}")
    else:
        print(f"✅ Database file exists: {db_path}")
    return db_path

def create_tables_directly(db_path):
    """Create tables directly using SQL"""
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    try:
        # Create new_users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS new_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                is_admin INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ Created new_users table")
        
        # Create user_sessions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES new_users(id) ON DELETE CASCADE
            )
        """)
        print("✅ Created user_sessions table")
        
        # Create broker_connections table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS broker_connections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                broker_name TEXT NOT NULL,
                broker_user_id TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES new_users(id) ON DELETE CASCADE,
                UNIQUE(user_id, broker_name)
            )
        """)
        print("✅ Created broker_connections table")
        
        # Create broker_tokens table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS broker_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                connection_id INTEGER NOT NULL,
                auth_token TEXT,
                refresh_token TEXT,
                feed_token TEXT,
                expires_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (connection_id) REFERENCES broker_connections(id) ON DELETE CASCADE
            )
        """)
        print("✅ Created broker_tokens table")
        
        # Create legacy users table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                user_id TEXT UNIQUE NOT NULL,
                apikey TEXT NOT NULL,
                is_admin INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ Created users table (legacy)")
        
        # Create auth_tokens table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS auth_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                user_id TEXT NOT NULL,
                auth_token TEXT,
                feed_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ Created auth_tokens table (legacy)")
        
        conn.commit()
        print("\n✅ All tables created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        import traceback
        traceback.print_exc()
        conn.rollback()
        return False
    finally:
        conn.close()

def verify_tables(db_path):
    """Verify that all tables exist"""
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = cursor.fetchall()
        
        print("\n📋 Tables in database:")
        for table in tables:
            print(f"   - {table[0]}")
        
        required_tables = ['new_users', 'user_sessions', 'broker_connections', 'broker_tokens']
        existing_tables = [t[0] for t in tables]
        
        all_exist = all(table in existing_tables for table in required_tables)
        
        if all_exist:
            print("\n✅ All required tables exist!")
            return True
        else:
            missing = [t for t in required_tables if t not in existing_tables]
            print(f"\n❌ Missing tables: {', '.join(missing)}")
            return False
            
    except Exception as e:
        print(f"❌ Error verifying tables: {str(e)}")
        return False
    finally:
        conn.close()

def create_test_user(db_path):
    """Create a test user for development"""
    from flask_bcrypt import Bcrypt
    bcrypt = Bcrypt()
    
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    try:
        # Check if test user already exists
        cursor.execute("SELECT id FROM new_users WHERE username = ?", ('testuser',))
        if cursor.fetchone():
            print("\n✅ Test user already exists")
            return True
        
        # Create test user
        password_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
        cursor.execute("""
            INSERT INTO new_users (username, email, password_hash, is_active)
            VALUES (?, ?, ?, 1)
        """, ('testuser', 'test@example.com', password_hash))
        
        conn.commit()
        print("\n✅ Created test user:")
        print("   Username: testuser")
        print("   Email: test@example.com")
        print("   Password: password123")
        return True
        
    except Exception as e:
        print(f"\n⚠️  Could not create test user: {str(e)}")
        conn.rollback()
        return False
    finally:
        conn.close()

def main():
    """Main setup function"""
    print("=" * 60)
    print("TradingBridge Database Setup")
    print("=" * 60)
    print()
    
    # Step 1: Ensure db directory exists
    print("Step 1: Checking db directory...")
    db_dir = ensure_db_directory()
    print()
    
    # Step 2: Create database file
    print("Step 2: Creating database file...")
    db_path = db_dir / "secueralgo.db"
    create_database_file(db_path)
    print()
    
    # Step 3: Create tables
    print("Step 3: Creating database tables...")
    if not create_tables_directly(db_path):
        print("\n❌ Setup failed!")
        return False
    print()
    
    # Step 4: Verify tables
    print("Step 4: Verifying tables...")
    if not verify_tables(db_path):
        print("\n❌ Verification failed!")
        return False
    print()
    
    # Step 5: Create test user
    print("Step 5: Creating test user...")
    create_test_user(db_path)
    print()
    
    print("=" * 60)
    print("✅ Database setup complete!")
    print("=" * 60)
    print()
    print("You can now:")
    print("1. Start the Flask backend: python app.py")
    print("2. Register a new user at: http://localhost:3000/new-register")
    print("3. Or login with test user:")
    print("   - Username: testuser")
    print("   - Password: password123")
    print()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
