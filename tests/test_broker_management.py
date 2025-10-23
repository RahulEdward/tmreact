# tests/test_broker_management.py

"""
Simple test script for broker management endpoints
This can be run manually to test the broker management functionality
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:5000"  # Adjust based on your Flask app URL
BROKERS_URL = f"{BASE_URL}/brokers"
LOGIN_URL = f"{BASE_URL}/auth/new/login"
REGISTER_URL = f"{BASE_URL}/auth/new/register"

def create_test_user():
    """Create a test user for broker management testing"""
    print("Creating test user...")
    
    test_user = {
        "username": "brokertest123",
        "email": "brokertest123@example.com",
        "password": "BrokerTest123"
    }
    
    try:
        response = requests.post(REGISTER_URL, json=test_user)
        if response.status_code == 201:
            print("✅ Test user created successfully")
            return test_user
        elif response.status_code == 409:
            print("ℹ️ Test user already exists")
            return test_user
        else:
            print(f"❌ Failed to create test user: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        return None

def login_user(session_obj):
    """Login user and return session"""
    login_data = {
        "email": "brokertest123@example.com",
        "password": "BrokerTest123"
    }
    
    try:
        response = session_obj.post(LOGIN_URL, json=login_data)
        if response.status_code == 200:
            print("✅ User logged in successfully")
            return True
        else:
            print(f"❌ Login failed: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return False

def test_get_supported_brokers():
    """Test getting supported brokers"""
    print("\nTesting get supported brokers...")
    
    try:
        response = requests.get(f"{BROKERS_URL}/supported")
        print(f"Supported brokers response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            brokers = result.get('brokers', {})
            print(f"✅ Found {len(brokers)} supported brokers")
            
            # Check if Angel One is available
            if 'angel' in brokers:
                angel_info = brokers['angel']
                print(f"✅ Angel One broker available: {angel_info.get('display_name')}")
                print(f"   Status: {angel_info.get('status')}")
                print(f"   Required credentials: {angel_info.get('required_credentials')}")
            else:
                print("❌ Angel One broker not found")
        else:
            print("❌ Failed to get supported brokers")
            
    except Exception as e:
        print(f"❌ Get supported brokers test failed: {str(e)}")

def test_broker_connection(session_obj):
    """Test broker connection flow"""
    print("\nTesting broker connection...")
    
    # Test data (use dummy credentials for testing)
    connection_data = {
        "credentials": {
            "client_id": "TEST123",
            "pin": "1234",
            "totp": "123456",
            "api_key": "test_api_key"
        },
        "display_name": "Test Angel Connection"
    }
    
    try:
        response = session_obj.post(f"{BROKERS_URL}/connect/angel", json=connection_data)
        print(f"Broker connection response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 201 and result.get('status') == 'success':
            print("✅ Broker connection successful")
            connection = result.get('connection', {})
            print(f"   Connection ID: {connection.get('id')}")
            print(f"   Broker: {connection.get('broker_name')}")
            print(f"   Status: {connection.get('status')}")
            return connection.get('id')
        else:
            print("❌ Broker connection failed (expected with dummy credentials)")
            return None
            
    except Exception as e:
        print(f"❌ Broker connection test failed: {str(e)}")
        return None

def test_get_user_connections(session_obj):
    """Test getting user's broker connections"""
    print("\nTesting get user connections...")
    
    try:
        response = session_obj.get(f"{BROKERS_URL}/user-connections")
        print(f"User connections response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            brokers = result.get('brokers', [])
            count = result.get('count', 0)
            print(f"✅ Found {count} broker connections")
            
            for broker in brokers:
                print(f"   - {broker.get('broker_name')} ({broker.get('status')})")
                
            return brokers
        else:
            print("❌ Failed to get user connections")
            return []
            
    except Exception as e:
        print(f"❌ Get user connections test failed: {str(e)}")
        return []

def test_connection_details(session_obj, connection_id):
    """Test getting connection details"""
    if not connection_id:
        print("\nSkipping connection details test (no connection ID)")
        return
    
    print(f"\nTesting connection details for ID {connection_id}...")
    
    try:
        response = session_obj.get(f"{BROKERS_URL}/connection/{connection_id}")
        print(f"Connection details response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            connection = result.get('connection', {})
            print("✅ Connection details retrieved")
            print(f"   Broker: {connection.get('broker_name')}")
            print(f"   Status: {connection.get('status')}")
            print(f"   Has tokens: {connection.get('has_tokens')}")
            print(f"   Can refresh: {connection.get('can_refresh')}")
        else:
            print("❌ Failed to get connection details")
            
    except Exception as e:
        print(f"❌ Connection details test failed: {str(e)}")

def test_refresh_tokens(session_obj, connection_id):
    """Test token refresh"""
    if not connection_id:
        print("\nSkipping token refresh test (no connection ID)")
        return
    
    print(f"\nTesting token refresh for connection {connection_id}...")
    
    try:
        response = session_obj.post(f"{BROKERS_URL}/refresh/{connection_id}")
        print(f"Token refresh response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            print("✅ Token refresh successful")
        else:
            print("❌ Token refresh failed (expected with test data)")
            
    except Exception as e:
        print(f"❌ Token refresh test failed: {str(e)}")

def test_disconnect_broker(session_obj, connection_id):
    """Test broker disconnection"""
    if not connection_id:
        print("\nSkipping disconnect test (no connection ID)")
        return
    
    print(f"\nTesting broker disconnection for connection {connection_id}...")
    
    try:
        response = session_obj.delete(f"{BROKERS_URL}/disconnect/{connection_id}")
        print(f"Disconnect response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            print("✅ Broker disconnection successful")
        else:
            print("❌ Broker disconnection failed")
            
    except Exception as e:
        print(f"❌ Disconnect test failed: {str(e)}")

def test_unauthenticated_access():
    """Test that endpoints require authentication"""
    print("\nTesting unauthenticated access...")
    
    endpoints = [
        ("GET", f"{BROKERS_URL}/user-connections"),
        ("POST", f"{BROKERS_URL}/connect/angel"),
        ("DELETE", f"{BROKERS_URL}/disconnect/1"),
        ("POST", f"{BROKERS_URL}/refresh/1"),
        ("GET", f"{BROKERS_URL}/connection/1"),
    ]
    
    for method, url in endpoints:
        try:
            if method == "GET":
                response = requests.get(url)
            elif method == "POST":
                response = requests.post(url, json={})
            elif method == "DELETE":
                response = requests.delete(url)
            
            if response.status_code == 401:
                print(f"✅ {method} {url.split('/')[-1]} properly requires authentication")
            else:
                print(f"❌ {method} {url.split('/')[-1]} should require authentication")
                
        except Exception as e:
            print(f"❌ Unauthenticated test failed for {method} {url}: {str(e)}")

if __name__ == "__main__":
    print("🧪 Testing Broker Management System")
    print("=" * 60)
    
    # Test unauthenticated access first
    test_unauthenticated_access()
    
    # Test public endpoint
    test_get_supported_brokers()
    
    # Create test user and login
    test_user = create_test_user()
    
    if test_user:
        # Create session for authenticated tests
        session = requests.Session()
        
        if login_user(session):
            # Test authenticated endpoints
            connection_id = test_broker_connection(session)
            connections = test_get_user_connections(session)
            
            # Use first connection if broker connection failed but we have existing connections
            if not connection_id and connections:
                connection_id = connections[0].get('id')
            
            test_connection_details(session, connection_id)
            test_refresh_tokens(session, connection_id)
            test_disconnect_broker(session, connection_id)
        else:
            print("❌ Cannot run authenticated tests without login")
    else:
        print("❌ Cannot run tests without test user")
    
    print("\n" + "=" * 60)
    print("✅ Broker management tests completed!")
    print("\nTo run these tests:")
    print("1. Start your Flask application")
    print("2. Run: python tests/test_broker_management.py")
    print("3. Check the output for test results")
    print("\nNote: Broker connection tests will fail with dummy credentials,")
    print("but the API structure and authentication should work correctly.")