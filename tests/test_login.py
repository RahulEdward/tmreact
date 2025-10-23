# tests/test_login.py

"""
Simple test script for the new user login endpoint
This can be run manually to test the login functionality
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:5000"  # Adjust based on your Flask app URL
LOGIN_URL = f"{BASE_URL}/auth/new/login"
VALIDATE_URL = f"{BASE_URL}/auth/new/login/validate"
SESSION_URL = f"{BASE_URL}/auth/new/session"
REGISTER_URL = f"{BASE_URL}/auth/new/register"

def create_test_user():
    """Create a test user for login testing"""
    print("Creating test user...")
    
    test_user = {
        "username": "logintest123",
        "email": "logintest123@example.com",
        "password": "TestLogin123"
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

def test_login_validation():
    """Test the login validation endpoint"""
    print("\nTesting login validation...")
    
    # Test valid credentials
    valid_data = {
        "email": "logintest123@example.com",
        "password": "TestLogin123"
    }
    
    try:
        response = requests.post(VALIDATE_URL, json=valid_data)
        print(f"Valid credentials validation - Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if result.get('valid'):
            print("✅ Valid credentials properly validated")
        else:
            print("❌ Valid credentials validation failed")
    except Exception as e:
        print(f"❌ Valid credentials test failed: {str(e)}")
    
    # Test invalid credentials
    invalid_data = {
        "email": "logintest123@example.com",
        "password": "WrongPassword"
    }
    
    try:
        response = requests.post(VALIDATE_URL, json=invalid_data)
        print(f"Invalid credentials validation - Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if not result.get('valid'):
            print("✅ Invalid credentials properly rejected")
        else:
            print("❌ Invalid credentials should have been rejected")
    except Exception as e:
        print(f"❌ Invalid credentials test failed: {str(e)}")
    
    # Test non-existent user
    nonexistent_data = {
        "email": "nonexistent@example.com",
        "password": "SomePassword123"
    }
    
    try:
        response = requests.post(VALIDATE_URL, json=nonexistent_data)
        print(f"Non-existent user validation - Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if not result.get('user_exists'):
            print("✅ Non-existent user properly detected")
        else:
            print("❌ Non-existent user should have been detected")
    except Exception as e:
        print(f"❌ Non-existent user test failed: {str(e)}")

def test_successful_login():
    """Test successful login"""
    print("\nTesting successful login...")
    
    login_data = {
        "email": "logintest123@example.com",
        "password": "TestLogin123"
    }
    
    try:
        # Create a session to maintain cookies
        session = requests.Session()
        
        response = session.post(LOGIN_URL, json=login_data)
        print(f"Login Response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            print("✅ Login successful!")
            
            # Test session check
            session_response = session.get(SESSION_URL)
            print(f"Session Check Response: {session_response.status_code}")
            session_result = session_response.json()
            print(f"Session Response: {json.dumps(session_result, indent=2)}")
            
            if session_result.get('authenticated'):
                print("✅ Session properly maintained!")
            else:
                print("❌ Session not properly maintained")
                
        else:
            print("❌ Login failed")
            
    except Exception as e:
        print(f"❌ Login test failed: {str(e)}")

def test_login_with_username():
    """Test login using username instead of email"""
    print("\nTesting login with username...")
    
    login_data = {
        "username": "logintest123",
        "password": "TestLogin123"
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        print(f"Username Login Response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            print("✅ Username login successful!")
        else:
            print("❌ Username login failed")
            
    except Exception as e:
        print(f"❌ Username login test failed: {str(e)}")

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\nTesting invalid login scenarios...")
    
    invalid_cases = [
        {
            "name": "Wrong password",
            "data": {"email": "logintest123@example.com", "password": "WrongPassword"}
        },
        {
            "name": "Non-existent email",
            "data": {"email": "nonexistent@example.com", "password": "TestLogin123"}
        },
        {
            "name": "Missing email",
            "data": {"password": "TestLogin123"}
        },
        {
            "name": "Missing password",
            "data": {"email": "logintest123@example.com"}
        },
        {
            "name": "Empty credentials",
            "data": {"email": "", "password": ""}
        }
    ]
    
    for case in invalid_cases:
        try:
            response = requests.post(LOGIN_URL, json=case["data"])
            print(f"{case['name']} - Status: {response.status_code}")
            result = response.json()
            print(f"  Message: {result.get('message', 'No message')}")
            
            if response.status_code >= 400:
                print(f"  ✅ {case['name']} properly rejected")
            else:
                print(f"  ❌ {case['name']} should have been rejected")
                
        except Exception as e:
            print(f"  ❌ {case['name']} test failed: {str(e)}")

def test_already_logged_in():
    """Test behavior when user is already logged in"""
    print("\nTesting already logged in scenario...")
    
    login_data = {
        "email": "logintest123@example.com",
        "password": "TestLogin123"
    }
    
    try:
        # Create a session to maintain cookies
        session = requests.Session()
        
        # First login
        response1 = session.post(LOGIN_URL, json=login_data)
        if response1.status_code == 200:
            print("✅ First login successful")
            
            # Second login attempt
            response2 = session.post(LOGIN_URL, json=login_data)
            print(f"Second login attempt - Status: {response2.status_code}")
            result = response2.json()
            print(f"Response: {json.dumps(result, indent=2)}")
            
            if result.get('message') and 'already logged in' in result['message'].lower():
                print("✅ Already logged in properly detected")
            else:
                print("❌ Already logged in should have been detected")
        else:
            print("❌ First login failed, cannot test already logged in")
            
    except Exception as e:
        print(f"❌ Already logged in test failed: {str(e)}")

if __name__ == "__main__":
    print("🧪 Testing User Login Endpoints")
    print("=" * 50)
    
    # Create test user first
    test_user = create_test_user()
    
    if test_user:
        # Run tests
        test_login_validation()
        test_successful_login()
        test_login_with_username()
        test_invalid_login()
        test_already_logged_in()
    else:
        print("❌ Cannot run tests without test user")
    
    print("\n" + "=" * 50)
    print("✅ Login endpoint tests completed!")
    print("\nTo run these tests:")
    print("1. Start your Flask application")
    print("2. Run: python tests/test_login.py")
    print("3. Check the output for test results")