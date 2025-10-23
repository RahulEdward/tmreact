# tests/test_registration.py

"""
Simple test script for the new user registration endpoint
This can be run manually to test the registration functionality
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:5000"  # Adjust based on your Flask app URL
REGISTER_URL = f"{BASE_URL}/auth/new/register"
VALIDATE_URL = f"{BASE_URL}/auth/new/register/validate"

def test_registration_validation():
    """Test the registration validation endpoint"""
    print("Testing registration validation...")
    
    # Test valid data
    valid_data = {
        "username": "testuser123",
        "email": "test@example.com",
        "password": "TestPass123"
    }
    
    try:
        response = requests.post(VALIDATE_URL, json=valid_data)
        print(f"Validation Response: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Validation test failed: {str(e)}")
    
    # Test invalid data
    invalid_data = {
        "username": "ab",  # Too short
        "email": "invalid-email",  # Invalid format
        "password": "weak"  # Too weak
    }
    
    try:
        response = requests.post(VALIDATE_URL, json=invalid_data)
        print(f"Invalid Data Validation Response: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Invalid data test failed: {str(e)}")

def test_user_registration():
    """Test the user registration endpoint"""
    print("\nTesting user registration...")
    
    # Test data
    test_data = {
        "username": "testuser456",
        "email": "testuser456@example.com",
        "password": "SecurePass123"
    }
    
    try:
        response = requests.post(REGISTER_URL, json=test_data)
        print(f"Registration Response: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
        else:
            print("❌ Registration failed")
            
    except Exception as e:
        print(f"Registration test failed: {str(e)}")
    
    # Test duplicate registration
    print("\nTesting duplicate registration...")
    try:
        response = requests.post(REGISTER_URL, json=test_data)
        print(f"Duplicate Registration Response: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 409:
            print("✅ Duplicate registration properly rejected!")
        else:
            print("❌ Duplicate registration handling failed")
            
    except Exception as e:
        print(f"Duplicate registration test failed: {str(e)}")

def test_invalid_registration():
    """Test registration with invalid data"""
    print("\nTesting invalid registration data...")
    
    invalid_cases = [
        {
            "name": "Missing username",
            "data": {"email": "test@example.com", "password": "TestPass123"}
        },
        {
            "name": "Missing email",
            "data": {"username": "testuser", "password": "TestPass123"}
        },
        {
            "name": "Missing password",
            "data": {"username": "testuser", "email": "test@example.com"}
        },
        {
            "name": "Invalid email format",
            "data": {"username": "testuser", "email": "invalid-email", "password": "TestPass123"}
        },
        {
            "name": "Weak password",
            "data": {"username": "testuser", "email": "test@example.com", "password": "weak"}
        }
    ]
    
    for case in invalid_cases:
        try:
            response = requests.post(REGISTER_URL, json=case["data"])
            print(f"{case['name']} - Status: {response.status_code}")
            result = response.json()
            print(f"  Message: {result.get('message', 'No message')}")
            
            if response.status_code == 400:
                print(f"  ✅ {case['name']} properly rejected")
            else:
                print(f"  ❌ {case['name']} should have been rejected")
                
        except Exception as e:
            print(f"  ❌ {case['name']} test failed: {str(e)}")

if __name__ == "__main__":
    print("🧪 Testing User Registration Endpoints")
    print("=" * 50)
    
    # Run tests
    test_registration_validation()
    test_user_registration()
    test_invalid_registration()
    
    print("\n" + "=" * 50)
    print("✅ Registration endpoint tests completed!")
    print("\nTo run these tests:")
    print("1. Start your Flask application")
    print("2. Run: python tests/test_registration.py")
    print("3. Check the output for test results")