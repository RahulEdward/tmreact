#!/usr/bin/env python3
"""
Check database tables and their structure
"""
import sys
import os
import sqlite3

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_database():
    """Check the database tables"""
    try:
        # Try to find the database file
        db_paths = [
            'db/secueralgo.db',
            'secueralgo.db',
            '/tmp/secueralgo.db'
        ]
        
        db_path = None
        for path in db_paths:
            if os.path.exists(path):
                db_path = path
                break
        
        if not db_path:
            print("❌ Database file not found in any of these locations:")
            for path in db_paths:
                print(f"   - {path}")
            return
        
        print(f"✅ Found database at: {db_path}")
        
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n📊 Database Tables ({len(tables)} total):")
        print("=" * 50)
        
        for table in tables:
            table_name = table[0]
            print(f"\n🔹 Table: {table_name}")
            
            # Get table structure
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            
            for col in columns:
                col_id, col_name, col_type, not_null, default, pk = col
                pk_str = " (PRIMARY KEY)" if pk else ""
                null_str = " NOT NULL" if not_null else ""
                default_str = f" DEFAULT {default}" if default else ""
                print(f"   - {col_name}: {col_type}{pk_str}{null_str}{default_str}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            count = cursor.fetchone()[0]
            print(f"   📈 Rows: {count}")
        
        # Check specifically for new auth tables
        print(f"\n🔐 New Authentication System Tables:")
        print("=" * 50)
        
        auth_tables = ['new_users', 'user_sessions', 'broker_connections', 'broker_tokens']
        for table_name in auth_tables:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
            exists = cursor.fetchone()
            
            if exists:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                count = cursor.fetchone()[0]
                print(f"✅ {table_name}: {count} records")
            else:
                print(f"❌ {table_name}: Table not found")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error checking database: {str(e)}")

if __name__ == "__main__":
    check_database()