#!/usr/bin/env python
"""Update database schema to add encrypted credential fields"""

import sqlite3
import os

def update_database():
    """Add encrypted columns to existing database"""
    try:
        # Try multiple possible database locations
        possible_paths = [
            'tmp/secueralgo.db',  # Local tmp folder
            '/tmp/secueralgo.db',
            'db/secueralgo.db',
            'C:/tmp/secueralgo.db',
            os.path.join(os.getcwd(), 'tmp', 'secueralgo.db'),
            os.path.join(os.getcwd(), 'db', 'secueralgo.db')
        ]
        
        db_path = None
        for path in possible_paths:
            if os.path.exists(path):
                db_path = path
                break
        
        if not db_path:
            print(f"❌ Database not found in any of these locations:")
            for path in possible_paths:
                print(f"   - {path}")
            return False
        
        print(f"✅ Found database at: {db_path}")
        print("Updating database schema...")
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(broker_connections);")
        existing_cols = [col[1] for col in cursor.fetchall()]
        print(f"Current columns: {existing_cols}")
        
        # Add columns if they don't exist
        columns_to_add = [
            'encrypted_client_id',
            'encrypted_api_key',
            'encrypted_pin'
        ]
        
        for col_name in columns_to_add:
            if col_name not in existing_cols:
                print(f"Adding column: {col_name}")
                cursor.execute(f"ALTER TABLE broker_connections ADD COLUMN {col_name} TEXT")
                print(f"✅ Added {col_name}")
            else:
                print(f"✓ Column already exists: {col_name}")
        
        conn.commit()
        
        # Verify
        cursor.execute("PRAGMA table_info(broker_connections);")
        final_cols = [col[1] for col in cursor.fetchall()]
        print(f"\nFinal columns: {final_cols}")
        
        conn.close()
        
        print("\n✅ Database tables updated successfully!")
        print("✅ New encrypted credential fields added to broker_connections table")
        return True
    except Exception as e:
        print(f"❌ Error updating database: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = update_database()
    if success:
        print("\n🎉 Database is ready!")
    else:
        print("\n⚠️ Database update failed!")
