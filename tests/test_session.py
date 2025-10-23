# tests/test_session.py

"""
Simple test script for session validation and logout endpoints
This can be run manually to test the session management functionality
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:5000"  # Adjust based on your Flask app URL
LOGIN_URL = f"{BASE_URL}/auth/new/login"
SESSION_URL = f"{BASE_URL}/auth/new/session"
LOGOUT_URL = f"{BASE_URL}/auth/new/logout"
REGISTER_URL = f"{BASE_URL}/auth/new/register"

def create_test_user():
    """Create a test user for session testing"""
    print("Creating test user...")
    
    test_user = {
        "username": "sessiontest123",
        "email": "sessiontest123@example.com",
        "password": "SessionTest123"
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
        "email": "sessiontest123@example.com",
        "password": "SessionTest123"
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

def test_session_validation():
    """Test session validation endpoint"""
    print("\nTesting session validation...")
    
    # Test without login
    try:
        response = requests.get(SESSION_URL)
        print(f"No session validation - Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if not result.get('authenticated'):
            print("✅ Unauthenticated state properly detected")
        else:
            print("❌ Should not be authenticated")
    except Exception as e:
        print(f"❌ No session test failed: {str(e)}")
    
    # Test with valid session
    session = requests.Session()
    if login_user(session):
        try:
            response = session.get(SESSION_URL)
            print(f"Valid session validation - Status: {response.status_code}")
            result = response.json()
            print(f"Response: {json.dumps(result, indent=2)}")
            
            if result.get('authenticated'):
                print("✅ Valid session properly detected")
                
                # Check session details
                if 'session' in result and 'expires_at' in result['session']:
                    print("✅ Session details included")
                else:
                    print("❌ Session details missing")
                    
                # Check user details
                if 'user' in result and 'username' in result['user']:
                    print("✅ User details included")
                else:
                    print("❌ User details missing")
            else:
                print("❌ Valid session not detected")
        except Exception as e:
            print(f"❌ Valid session test failed: {str(e)}")
        
        return session
    
    return None

def test_session_persistence(session_obj):
    """Test that session persists across requests"""
    print("\nTesting session persistence...")
    
    if not session_obj:
        print("❌ No session to test")
        return
    
    try:
        # Make multiple session validation requests
        for i in range(3):
            response = session_obj.get(SESSION_URL)
            result = response.json()
            
            if result.get('authenticated'):
                print(f"✅ Session persistent on request {i+1}")
            else:
                print(f"❌ Session lost on request {i+1}")
                return
            
            time.sleep(1)  # Wait 1 second between requests
        
        print("✅ Session persistence test passed")
        
    except Exception as e:
        print(f"❌ Session persistence test failed: {str(e)}")

def test_logout():
    """Test logout functionality"""
    print("\nTesting logout...")
    
    # Create new session for logout test
    session = requests.Session()
    if not login_user(session):
        print("❌ Cannot test logout without login")
        return
    
    # Verify session exists
    try:
        response = session.get(SESSION_URL)
        if not response.json().get('authenticated'):
            print("❌ Session not found before logout")
            return
        print("✅ Session confirmed before logout")
    except Exception as e:
        print(f"❌ Pre-logout session check failed: {str(e)}")
        return
    
    # Test logout
    try:
        response = session.post(LOGOUT_URL)
        print(f"Logout Response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            print("✅ Logout successful")
            
            # Verify session is cleared
            session_response = session.get(SESSION_URL)
            session_result = session_response.json()
            
            if not session_result.get('authenticated'):
                print("✅ Session properly cleared after logout")
            else:
                print("❌ Session not cleared after logout")
        else:
            print("❌ Logout failed")
            
    except Exception as e:
        print(f"❌ Logout test failed: {str(e)}")

def test_logout_all_sessions():
    """Test logout from all sessions"""
    print("\nTesting logout from all sessions...")
    
    # Create multiple sessions
    sessions = []
    for i in range(2):
        session = requests.Session()
        if login_user(session):
            sessions.append(session)
            print(f"✅ Session {i+1} created")
        else:
            print(f"❌ Failed to create session {i+1}")
    
    if len(sessions) < 2:
        print("❌ Need at least 2 sessions for this test")
        return
    
    # Logout from all sessions using the first session
    try:
        logout_data = {"logout_all": True}
        response = sessions[0].post(LOGOUT_URL, json=logout_data)
        print(f"Logout all Response: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get('status') == 'success':
            print("✅ Logout all successful")
            
            # Verify all sessions are cleared
            all_cleared = True
            for i, session in enumerate(sessions):
                session_response = session.get(SESSION_URL)
                session_result = session_response.json()
                
                if session_result.get('authenticated'):
                    print(f"❌ Session {i+1} not cleared")
                    all_cleared = False
                else:
                    print(f"✅ Session {i+1} cleared")
            
            if all_cleared:
                print("✅ All sessions properly cleared")
            else:
                print("❌ Some sessions not cleared")
        else:
            print("❌ Logout all failed")
            
    except Exception as e:
        print(f"❌ Logout all test failed: {str(e)}")

def test_invalid_session_handling():
    """Test handling of invalid/expired sessions"""
    print("\nTesting invalid session handling...")
    
    # This test would require manually manipulating session tokens
    # For now, we'll test the basic case of no session
    try:
        response = requests.get(SESSION_URL)
        result = response.json()
        
        if not result.get('authenticated') and result.get('message'):
            print("✅ Invalid session properly handled")
        else:
            print("❌ Invalid session handling failed")
            
    except Exception as e:
        print(f"❌ Invalid session test failed: {str(e)}")

def test_logout_idempotency():
    """Test that logout is idempotent (can be called multiple times)"""
    print("\nTesting logout idempotency...")
    
    # Create session and logout
    session = requests.Session()
    if not login_user(session):
        print("❌ Cannot test logout idempotency without login")
        return
    
    try:
        # First logout
        response1 = session.post(LOGOUT_URL)
        if response1.status_code != 200:
            print("❌ First logout failed")
            return
        
        # Second logout (should still succeed)
        response2 = session.post(LOGOUT_URL)
        print(f"Second logout Response: {response2.status_code}")
        result = response2.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response2.status_code == 200 and result.get('status') == 'success':
            print("✅ Logout idempotency test passed")
        else:
            print("❌ Logout idempotency test failed")
            
    except Exception as e:
        print(f"❌ Logout idempotency test failed: {str(e)}")

if __name__ == "__main__":
    print("🧪 Testing Session Validation and Logout Endpoints")
    print("=" * 60)
    
    # Create test user first
    test_user = create_test_user()
    
    if test_user:
        # Run tests
        session = test_session_validation()
        test_session_persistence(session)
        test_logout()
        test_logout_all_sessions()
        test_invalid_session_handling()
        test_logout_idempotency()
    else:
        print("❌ Cannot run tests without test user")
    
    print("\n" + "=" * 60)
    print("✅ Session management tests completed!")
    print("\nTo run these tests:")
    print("1. Start your Flask application")
    print("2. Run: python tests/test_session.py")
    print("3. Check the output for test results")