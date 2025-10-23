#!/usr/bin/env python3
"""
Recreate the complete database with all tables
"""
import os
import sqlite3
import shutil

def recreate_database():
    """Recreate the complete database"""
    try:
        # Ensure db directory exists
        os.makedirs('db', exist_ok=True)
        
        db_path = 'db/secueralgo.db'
        
        print(f"🔧 Creating database at: {db_path}")
        
        # Create new database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create all original tables
        print("📋 Creating original tables...")
        
        # auth table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS auth (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                auth TEXT NOT NULL,
                is_revoked BOOLEAN,
                created_at DATETIME,
                updated_at DATETIME
            )
        ''')
        
        # auth_tokens table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS auth_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(255) NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                access_token TEXT NOT NULL,
                feed_token TEXT NOT NULL,
                refresh_token TEXT,
                expires_at DATETIME,
                is_active BOOLEAN,
                created_at DATETIME,
                updated_at DATETIME
            )
        ''')
        
        # api_keys table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS api_keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR NOT NULL,
                api_key TEXT NOT NULL,
                created_at DATETIME
            )
        ''')
        
        # users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(255) NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                apikey VARCHAR(255) NOT NULL,
                is_admin BOOLEAN,
                is_approved BOOLEAN,
                approved_start_date DATETIME,
                approved_expiry_date DATETIME,
                created_at DATETIME
            )
        ''')
        
        # order_logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS order_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                api_type TEXT NOT NULL,
                request_data TEXT NOT NULL,
                response_data TEXT NOT NULL,
                created_at DATETIME
            )
        ''')
        
        # symtoken table (basic structure)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS symtoken (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol VARCHAR NOT NULL,
                brsymbol VARCHAR NOT NULL,
                name VARCHAR,
                exchange VARCHAR,
                brexchange VARCHAR,
                expiry VARCHAR,
                strike FLOAT,
                lotsize INTEGER,
                instrumenttype VARCHAR,
                tick_size FLOAT
            )
        ''')
        
        print("✅ Created original tables")
        
        # Create new authentication tables
        print("🔐 Creating new authentication tables...")
        
        # new_users table
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
        
        # user_sessions table
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
        
        # broker_connections table
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
        
        # broker_tokens table
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
        
        print("✅ Created new authentication tables")
        
        # Commit and close
        conn.commit()
        conn.close()
        
        print("🎉 Database recreated successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error recreating database: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    recreate_database()