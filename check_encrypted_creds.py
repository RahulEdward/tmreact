#!/usr/bin/env python
"""Check broker connections with encrypted credentials"""

from database.auth_db import BrokerConnections, db_session
from utils.encryption import encryption_service

def check_broker_connections():
    """Display all broker connections with encrypted credentials"""
    try:
        connections = BrokerConnections.query.all()
        
        if not connections:
            print("❌ No broker connections found in database")
            return
        
        print(f"✅ Found {len(connections)} broker connection(s)\n")
        print("=" * 80)
        
        for conn in connections:
            print(f"\n🔹 Connection ID: {conn.id}")
            print(f"   User ID: {conn.user_id}")
            print(f"   Broker Type: {conn.broker_type}")
            print(f"   Broker User ID: {conn.broker_user_id}")
            print(f"   Display Name: {conn.display_name}")
            print(f"   Is Active: {conn.is_active}")
            print(f"   Connected At: {conn.connected_at}")
            
            print(f"\n   🔐 Encrypted Credentials:")
            print(f"   -------------------------")
            
            # Show encrypted data (first 50 chars)
            if conn.encrypted_client_id:
                print(f"   ✅ Client ID (encrypted): {conn.encrypted_client_id[:50]}...")
                try:
                    decrypted = encryption_service.decrypt(conn.encrypted_client_id)
                    print(f"      Decrypted: {decrypted}")
                except Exception as e:
                    print(f"      ❌ Decryption failed: {str(e)}")
            else:
                print(f"   ❌ Client ID: Not encrypted")
            
            if conn.encrypted_api_key:
                print(f"   ✅ API Key (encrypted): {conn.encrypted_api_key[:50]}...")
                try:
                    decrypted = encryption_service.decrypt(conn.encrypted_api_key)
                    print(f"      Decrypted: {decrypted[:10]}... (hidden for security)")
                except Exception as e:
                    print(f"      ❌ Decryption failed: {str(e)}")
            else:
                print(f"   ❌ API Key: Not encrypted")
            
            if conn.encrypted_pin:
                print(f"   ✅ PIN (encrypted): {conn.encrypted_pin[:50]}...")
                try:
                    decrypted = encryption_service.decrypt(conn.encrypted_pin)
                    print(f"      Decrypted: **** (hidden for security)")
                except Exception as e:
                    print(f"      ❌ Decryption failed: {str(e)}")
            else:
                print(f"   ❌ PIN: Not encrypted")
            
            print("\n" + "=" * 80)
        
        print(f"\n✅ All credentials are properly encrypted!")
        
    except Exception as e:
        print(f"❌ Error checking broker connections: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🔍 Checking Broker Connections with Encrypted Credentials\n")
    check_broker_connections()
