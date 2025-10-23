# brokers/angel_adapter.py

import http.client
import json
import os
from datetime import datetime, timedelta
import traceback

class AngelAdapter:
    """Angel One broker adapter for authentication and API operations"""
    
    def __init__(self):
        self.base_url = "apiconnect.angelbroking.com"
        self.api_version = "v1"
    
    def authenticate(self, client_id, pin, totp, api_key):
        """
        Authenticate with Angel One API
        
        Args:
            client_id (str): Angel One client ID
            pin (str): Trading PIN
            totp (str): TOTP code
            api_key (str): API key
            
        Returns:
            dict: Authentication result with tokens
        """
        try:
            print(f"Authenticating with Angel One for client: {client_id}")
            
            conn = http.client.HTTPSConnection(self.base_url)
            
            # Prepare login payload
            payload = json.dumps({
                "clientcode": client_id,
                "password": pin,
                "totp": totp
            })
            
            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-UserType': 'USER',
                'X-SourceID': 'WEB',
                'X-ClientLocalIP': '127.0.0.1',  # Default local IP
                'X-ClientPublicIP': '127.0.0.1',  # Default public IP
                'X-MACAddress': '',
                'X-PrivateKey': api_key
            }
            
            # Make the API request
            conn.request("POST", "/rest/auth/angelbroking/user/v1/loginByPassword", payload, headers)
            res = conn.getresponse()
            data = res.read()
            
            print(f"Angel One API response status: {res.status}")
            response_json = json.loads(data.decode("utf-8"))
            
            if response_json.get('status') == True:
                print("Angel One authentication successful")
                
                # Extract tokens
                data_section = response_json.get('data', {})
                access_token = data_section.get('jwtToken')
                refresh_token = data_section.get('refreshToken')
                feed_token = data_section.get('feedToken')
                
                if not access_token:
                    return {
                        "status": "error",
                        "message": "No access token received from Angel One"
                    }
                
                # Calculate token expiration (Angel tokens typically expire in 24 hours)
                expires_at = datetime.now() + timedelta(hours=24)
                
                return {
                    "status": "success",
                    "message": "Authentication successful",
                    "tokens": {
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "feed_token": feed_token,
                        "expires_at": expires_at
                    },
                    "user_info": {
                        "client_id": client_id,
                        "broker": "angel"
                    }
                }
            else:
                error_message = response_json.get('message', 'Authentication failed')
                print(f"Angel One authentication failed: {error_message}")
                return {
                    "status": "error",
                    "message": error_message
                }
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error in Angel authentication: {str(e)}")
            return {
                "status": "error",
                "message": "Invalid response from Angel One API"
            }
        except Exception as e:
            print(f"ERROR in Angel authentication: {str(e)}")
            traceback.print_exc()
            return {
                "status": "error",
                "message": "Connection error with Angel One API"
            }
    
    def refresh_token(self, refresh_token):
        """
        Refresh Angel One access token
        
        Args:
            refresh_token (str): Refresh token
            
        Returns:
            dict: Refresh result with new tokens
        """
        try:
            if not refresh_token:
                return {
                    "status": "error",
                    "message": "No refresh token provided"
                }
            
            print("Refreshing Angel One token")
            
            conn = http.client.HTTPSConnection(self.base_url)
            
            # Prepare refresh payload
            payload = json.dumps({
                "refreshToken": refresh_token
            })
            
            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-UserType': 'USER',
                'X-SourceID': 'WEB',
                'Authorization': f'Bearer {refresh_token}'
            }
            
            # Make the API request
            conn.request("POST", "/rest/auth/angelbroking/jwt/v1/generateTokens", payload, headers)
            res = conn.getresponse()
            data = res.read()
            
            print(f"Angel One token refresh response status: {res.status}")
            response_json = json.loads(data.decode("utf-8"))
            
            if response_json.get('status') == True:
                print("Angel One token refresh successful")
                
                # Extract new tokens
                data_section = response_json.get('data', {})
                access_token = data_section.get('jwtToken')
                new_refresh_token = data_section.get('refreshToken')
                feed_token = data_section.get('feedToken')
                
                if not access_token:
                    return {
                        "status": "error",
                        "message": "No access token received from refresh"
                    }
                
                # Calculate token expiration
                expires_at = datetime.now() + timedelta(hours=24)
                
                return {
                    "status": "success",
                    "message": "Token refresh successful",
                    "tokens": {
                        "access_token": access_token,
                        "refresh_token": new_refresh_token or refresh_token,
                        "feed_token": feed_token,
                        "expires_at": expires_at
                    }
                }
            else:
                error_message = response_json.get('message', 'Token refresh failed')
                print(f"Angel One token refresh failed: {error_message}")
                return {
                    "status": "error",
                    "message": error_message
                }
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error in Angel token refresh: {str(e)}")
            return {
                "status": "error",
                "message": "Invalid response from Angel One API"
            }
        except Exception as e:
            print(f"ERROR in Angel token refresh: {str(e)}")
            traceback.print_exc()
            return {
                "status": "error",
                "message": "Connection error with Angel One API"
            }
    
    def validate_connection(self, access_token):
        """
        Validate Angel One connection by making a test API call
        
        Args:
            access_token (str): Access token to validate
            
        Returns:
            dict: Validation result
        """
        try:
            if not access_token:
                return {
                    "status": "error",
                    "message": "No access token provided"
                }
            
            print("Validating Angel One connection")
            
            conn = http.client.HTTPSConnection(self.base_url)
            
            # Prepare headers for profile API call
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-UserType': 'USER',
                'X-SourceID': 'WEB',
                'Authorization': f'Bearer {access_token}'
            }
            
            # Make a test API call to get user profile
            conn.request("GET", "/rest/secure/angelbroking/user/v1/getProfile", "", headers)
            res = conn.getresponse()
            data = res.read()
            
            print(f"Angel One validation response status: {res.status}")
            
            if res.status == 200:
                response_json = json.loads(data.decode("utf-8"))
                
                if response_json.get('status') == True:
                    print("Angel One connection validation successful")
                    return {
                        "status": "success",
                        "message": "Connection is valid",
                        "user_profile": response_json.get('data', {})
                    }
                else:
                    error_message = response_json.get('message', 'Connection validation failed')
                    return {
                        "status": "error",
                        "message": error_message
                    }
            else:
                return {
                    "status": "error",
                    "message": f"API call failed with status {res.status}"
                }
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error in Angel validation: {str(e)}")
            return {
                "status": "error",
                "message": "Invalid response from Angel One API"
            }
        except Exception as e:
            print(f"ERROR in Angel connection validation: {str(e)}")
            traceback.print_exc()
            return {
                "status": "error",
                "message": "Connection error with Angel One API"
            }
    
    def get_user_profile(self, access_token):
        """
        Get user profile from Angel One
        
        Args:
            access_token (str): Access token
            
        Returns:
            dict: User profile data
        """
        try:
            validation_result = self.validate_connection(access_token)
            
            if validation_result["status"] == "success":
                return {
                    "status": "success",
                    "profile": validation_result.get("user_profile", {})
                }
            else:
                return validation_result
                
        except Exception as e:
            print(f"ERROR in get_user_profile: {str(e)}")
            return {
                "status": "error",
                "message": "Failed to get user profile"
            }
    
    def logout(self, access_token):
        """
        Logout from Angel One (invalidate token)
        
        Args:
            access_token (str): Access token to invalidate
            
        Returns:
            dict: Logout result
        """
        try:
            if not access_token:
                return {
                    "status": "success",
                    "message": "No token to logout"
                }
            
            print("Logging out from Angel One")
            
            conn = http.client.HTTPSConnection(self.base_url)
            
            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-UserType': 'USER',
                'X-SourceID': 'WEB',
                'Authorization': f'Bearer {access_token}'
            }
            
            # Make logout API call
            conn.request("POST", "/rest/secure/angelbroking/user/v1/logout", "", headers)
            res = conn.getresponse()
            data = res.read()
            
            print(f"Angel One logout response status: {res.status}")
            
            # Angel One logout typically returns success even if token is already invalid
            return {
                "status": "success",
                "message": "Logout successful"
            }
            
        except Exception as e:
            print(f"ERROR in Angel logout: {str(e)}")
            # Don't fail logout on API errors
            return {
                "status": "success",
                "message": "Logout completed (API call failed but token will be removed)"
            }