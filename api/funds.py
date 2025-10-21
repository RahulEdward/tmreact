# api/funds.py

import os
import http.client
import json

def get_margin_data(auth_token, api_key=None):
    """Fetch margin data from the broker's API using the provided auth token and api_key.
    If api_key is not provided, it will try to get it from environment variables.
    """
    try:
        if api_key is None:
            # Fallback to environment variable if api_key is not provided
            api_key = os.getenv('BROKER_API_KEY')
            
        conn = http.client.HTTPSConnection("apiconnect.angelbroking.com")
        headers = {
            'Authorization': f'Bearer {auth_token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': api_key
        }
        conn.request("GET", "/rest/secure/angelbroking/user/v1/getRMS", '', headers)

        res = conn.getresponse()
        data = res.read()
        margin_data = json.loads(data.decode("utf-8"))

        print(f"Margin Data {margin_data}")

        # Process and return the 'data' key from margin_data if it exists and is not None
        if margin_data.get('data') is not None:
            # Check if data is a dictionary before processing
            if not isinstance(margin_data['data'], dict):
                print(f"Warning: margin_data['data'] is not a dictionary: {type(margin_data['data'])}")
                return margin_data  # Return complete response as is
                
            # Process dictionary values as before
            for key, value in margin_data['data'].items():
                if value is not None and isinstance(value, str):
                    try:
                        margin_data['data'][key] = "{:.2f}".format(float(value))
                    except ValueError:
                        pass
            return margin_data
        else:
            # Return the full margin_data even if 'data' is None
            return margin_data
            
    except Exception as e:
        print(f"Error in get_margin_data: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to fetch margin data: {str(e)}"}