#!/usr/bin/env python3
"""
Check total users and active sessions in the database
"""
import sqlite3
from datetime import datetime
from pathlib import Path

def check_users():
    """Check user statistics"""
    db_path = Path("db/secueralgo.db")
    
    if not db_path.exists():
        print("❌ Database not found!")
        print("Run: python setup_database.py")
        return
    
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    print("=" * 60)
    print("TradingBridge - User Statistics")
    print("=" * 60)
    print()
    
    # Total new users
    cursor.execute("SELECT COUNT(*) FROM new_users")
    total_new_users = cursor.fetchone()[0]
    print(f"📊 Total New Auth Users: {total_new_users}")
    
    # Active new users
    cursor.execute("SELECT COUNT(*) FROM new_users WHERE is_active = 1")
    active_new_users = cursor.fetchone()[0]
    print(f"✅ Active New Auth Users: {active_new_users}")
    
    # Total legacy users
    try:
        cursor.execute("SELECT COUNT(*) FROM users")
        total_legacy_users = cursor.fetchone()[0]
        print(f"📊 Total Legacy Users: {total_legacy_users}")
    except:
        print(f"📊 Total Legacy Users: 0")
    
    print()
    
    # Active sessions
    cursor.execute("""
        SELECT COUNT(*) FROM user_sessions 
        WHERE expires_at > datetime('now')
    """)
    active_sessions = cursor.fetchone()[0]
    print(f"🔐 Active Sessions: {active_sessions}")
    
    # Expired sessions
    cursor.execute("""
        SELECT COUNT(*) FROM user_sessions 
        WHERE expires_at <= datetime('now')
    """)
    expired_sessions = cursor.fetchone()[0]
    print(f"⏰ Expired Sessions: {expired_sessions}")
    
    print()
    
    # Recent registrations (last 24 hours)
    cursor.execute("""
        SELECT COUNT(*) FROM new_users 
        WHERE created_at >= datetime('now', '-1 day')
    """)
    recent_registrations = cursor.fetchone()[0]
    print(f"📈 New Registrations (24h): {recent_registrations}")
    
    # List all new users
    print()
    print("=" * 60)
    print("Registered Users:")
    print("=" * 60)
    
    cursor.execute("""
        SELECT id, username, email, is_active, created_at 
        FROM new_users 
        ORDER BY created_at DESC
    """)
    users = cursor.fetchall()
    
    if users:
        for user in users:
            user_id, username, email, is_active, created_at = user
            status = "✅ Active" if is_active else "❌ Inactive"
            print(f"{user_id}. {username} ({email}) - {status}")
            print(f"   Registered: {created_at}")
            print()
    else:
        print("No users registered yet.")
    
    # Database size
    db_size = db_path.stat().st_size
    db_size_mb = db_size / (1024 * 1024)
    print("=" * 60)
    print(f"💾 Database Size: {db_size_mb:.2f} MB")
    print("=" * 60)
    
    conn.close()

if __name__ == "__main__":
    check_users()
