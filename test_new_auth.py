#!/usr/bin/env python3
"""
Test the new authentication system
"""
import sys
import os
import requests
import json

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

API_URL = "http://localhost:5000"

def test_register():
    """Test user registration"""
    print("\n" + "="*60)
    print("Testing User Registration")
    print("="*60)
    
    url = f"{API_URL}/auth/new/register"
    data = {
        "username": "testuser2",
        "email": "test2@example.com",
        "password": "Password123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code in [200, 201]:
            print("✅ Registration successful!")
            return True
        elif response.status_code == 409:
            print("⚠️  User already exists (this is okay)")
            return True
        else:
            print("❌ Registration failed!")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_login(username="testuser", password="password123"):
    """Test user login"""
    print("\n" + "="*60)
    print("Testing User Login")
    print("="*60)
    
    url = f"{API_URL}/auth/new/login"
    data = {
        "email": username,
        "password": password
    }
    
    try:
        session = requests.Session()
        response = session.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("status") == "success":
                print("✅ Login successful!")
                return session, result
            else:
                print("❌ Login failed!")
                return None, None
        else:
            print("❌ Login failed!")
            return None, None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None, None

def test_session(session):
    """Test session validation"""
    print("\n" + "="*60)
    print("Testing Session Validation")
    print("="*60)
    
    url = f"{API_URL}/auth/new/session"
    
    try:
        response = session.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("authenticated"):
                print("✅ Session is valid!")
                return True
            else:
                print("❌ Session is not authenticated!")
                return False
        else:
            print("❌ Session check failed!")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_logout(session):
    """Test user logout"""
    print("\n" + "="*60)
    print("Testing User Logout")
    print("="*60)
    
    url = f"{API_URL}/auth/new/logout"
    
    try:
        response = session.post(url, json={})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Logout successful!")
            return True
        else:
            print("❌ Logout failed!")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("TradingBridge Authentication System Test")
    print("="*60)
    print("\nMake sure Flask backend is running on http://localhost:5000")
    print()
    
    # Test 1: Register a new user
    test_register()
    
    # Test 2: Login with test user
    session, login_result = test_login()
    
    if session and login_result:
        # Test 3: Validate session
        test_session(session)
        
        # Test 4: Logout
        test_logout(session)
    
    print("\n" + "="*60)
    print("Test Complete!")
    print("="*60)
    print()

if __name__ == "__main__":
    main()
