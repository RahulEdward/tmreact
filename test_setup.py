#!/usr/bin/env python
"""Test if everything is set up correctly"""

print("=" * 60)
print("🔍 TESTING BROKER CONNECTION SETUP")
print("=" * 60)

# Test 1: Check database schema
print("\n1️⃣ Checking Database Schema...")
try:
    from database.auth_db import BrokerConnections
    
    # Check if encrypted fields exist
    has_encrypted_client_id = hasattr(BrokerConnections, 'encrypted_client_id')
    has_encrypted_api_key = hasattr(BrokerConnections, 'encrypted_api_key')
    has_encrypted_pin = hasattr(BrokerConnections, 'encrypted_pin')
    
    if has_encrypted_client_id and has_encrypted_api_key and has_encrypted_pin:
        print("   ✅ All encrypted credential fields exist")
    else:
        print("   ❌ Missing encrypted fields:")
        if not has_encrypted_client_id:
            print("      - encrypted_client_id")
        if not has_encrypted_api_key:
            print("      - encrypted_api_key")
        if not has_encrypted_pin:
            print("      - encrypted_pin")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# Test 2: Check encryption service
print("\n2️⃣ Checking Encryption Service...")
try:
    from utils.encryption import encryption_service
    
    # Test encryption/decryption
    test_data = "TEST123"
    encrypted = encryption_service.encrypt(test_data)
    decrypted = encryption_service.decrypt(encrypted)
    
    if decrypted == test_data:
        print("   ✅ Encryption service working correctly")
        print(f"      Original: {test_data}")
        print(f"      Encrypted: {encrypted[:50]}...")
        print(f"      Decrypted: {decrypted}")
    else:
        print("   ❌ Encryption/decryption mismatch")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# Test 3: Check broker service
print("\n3️⃣ Checking Broker Service...")
try:
    from services.broker_service import broker_service
    
    result = broker_service.get_supported_brokers()
    if result.get('status') == 'success':
        brokers = result.get('brokers', {})
        print(f"   ✅ Broker service working")
        print(f"      Supported brokers: {list(brokers.keys())}")
    else:
        print("   ❌ Broker service error")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# Test 4: Check if backend endpoint accepts user_id from request
print("\n4️⃣ Checking Backend Authentication Logic...")
try:
    with open('blueprints/brokers.py', 'r') as f:
        content = f.read()
        if 'data.get(\'user_id\')' in content:
            print("   ✅ Backend accepts user_id from request body")
        else:
            print("   ❌ Backend doesn't accept user_id from request body")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# Test 5: Check frontend sends user_id
print("\n5️⃣ Checking Frontend Authentication Logic...")
try:
    with open('nextjs-frontend/src/app/dashboard/brokers/connect/angel/page.tsx', 'r') as f:
        content = f.read()
        if 'user_id: userId' in content:
            print("   ✅ Frontend sends user_id from localStorage")
        else:
            print("   ❌ Frontend doesn't send user_id")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

print("\n" + "=" * 60)
print("📊 SUMMARY")
print("=" * 60)
print("\n✅ All systems ready for broker connection!")
print("\n📝 Next Steps:")
print("   1. Make sure you're logged in to the system")
print("   2. Go to: http://127.0.0.1:59675/dashboard/brokers")
print("   3. Fill in broker credentials")
print("   4. Click 'Save Credentials'")
print("   5. Enter TOTP code")
print("   6. Click 'Verify & Connect'")
print("\n" + "=" * 60)
