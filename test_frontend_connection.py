#!/usr/bin/env python3
"""
Test the exact frontend connection issue
"""
import requests
import json

def test_frontend_connection():
    """Test the exact request the frontend is making"""
    base_url = "http://localhost:5000"
    
    print("🔍 Testing Frontend Connection Issue")
    print("=" * 50)
    
    # Test the exact request the frontend makes
    try:
        # This is the exact request from the error
        response = requests.post(
            f"{base_url}/auth/new/register/validate",
            json={
                "username": "erahul41",
                "email": "rhl.edward@gmail.com", 
                "password": "Neelima99@"
            },
            headers={
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000"
            },
            timeout=10
        )
        
        print(f"✅ POST /auth/new/register/validate: {response.status_code}")
        print(f"   Response: {response.text}")
        print(f"   Headers: {dict(response.headers)}")
        
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: {str(e)}")
        print("   The backend might not be running or accessible")
        
    except requests.exceptions.Timeout as e:
        print(f"❌ Timeout Error: {str(e)}")
        print("   The request timed out")
        
    except Exception as e:
        print(f"❌ Other Error: {str(e)}")
    
    # Test basic connectivity
    print(f"\n🔍 Testing Basic Connectivity")
    print("=" * 50)
    
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"✅ GET /: {response.status_code}")
        print(f"   Response: {response.json()}")
        
    except Exception as e:
        print(f"❌ Basic connectivity failed: {str(e)}")
    
    # Test session endpoint
    try:
        response = requests.get(
            f"{base_url}/auth/new/session",
            headers={"Origin": "http://localhost:3000"},
            timeout=5
        )
        print(f"✅ GET /auth/new/session: {response.status_code}")
        print(f"   Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Session endpoint failed: {str(e)}")

if __name__ == "__main__":
    test_frontend_connection()