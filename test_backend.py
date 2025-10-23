#!/usr/bin/env python3
"""
Test backend connectivity and endpoints
"""
import requests
import json

def test_backend():
    """Test backend endpoints"""
    base_url = "http://localhost:5000"
    
    print("🔍 Testing Backend Connectivity")
    print("=" * 50)
    
    # Test basic connectivity
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"✅ Backend is running: {response.status_code}")
        print(f"   Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running or not accessible")
        print("   Make sure you're running: python app.py")
        return
    except Exception as e:
        print(f"❌ Error connecting to backend: {str(e)}")
        return
    
    # Test new auth endpoints
    print(f"\n🔐 Testing New Authentication Endpoints")
    print("=" * 50)
    
    endpoints = [
        ("GET", "/auth/new/session"),
        ("POST", "/auth/new/register/validate"),
        ("POST", "/auth/new/register"),
        ("POST", "/auth/new/login")
    ]
    
    for method, endpoint in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{base_url}{endpoint}", timeout=5)
            else:
                # Send empty JSON for POST requests
                response = requests.post(
                    f"{base_url}{endpoint}", 
                    json={}, 
                    headers={"Content-Type": "application/json"},
                    timeout=5
                )
            
            if response.status_code == 404:
                print(f"❌ {method} {endpoint}: 404 Not Found")
            else:
                print(f"✅ {method} {endpoint}: {response.status_code}")
                
        except Exception as e:
            print(f"❌ {method} {endpoint}: Error - {str(e)}")
    
    # Test CORS
    print(f"\n🌐 Testing CORS")
    print("=" * 50)
    
    try:
        response = requests.options(
            f"{base_url}/auth/new/session",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET"
            },
            timeout=5
        )
        print(f"✅ CORS preflight: {response.status_code}")
        print(f"   CORS headers: {dict(response.headers)}")
    except Exception as e:
        print(f"❌ CORS test failed: {str(e)}")

if __name__ == "__main__":
    test_backend()