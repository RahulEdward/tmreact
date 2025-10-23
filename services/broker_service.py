# services/broker_service.py

import os
from datetime import datetime, timedelta
from database.auth_db import (
    create_broker_connection, get_user_broker_connections, store_broker_tokens, get_broker_tokens,
    BrokerConnections, BrokerTokens, db_session
)
from utils.encryption import encryption_service

class BrokerService:
    """Service class for handling broker connections and management"""
    
    def __init__(self):
        self.supported_brokers = {
            "angel": {
                "name": "Angel One",
                "display_name": "Angel One",
                "description": "India's leading discount broker with comprehensive trading features",
                "status": "active",
                "features": ["equity", "derivatives", "commodities", "currency"],
                "required_credentials": ["client_id", "pin", "totp", "api_key"],
                "logo": "/images/brokers/angel-one-logo.png",
                "website": "https://www.angelone.in/",
                "support_url": "https://www.angelone.in/support"
            }
            # Only Angel One for now - other brokers will be added later
        }
    
    def get_supported_brokers(self):
        """
        Get list of supported brokers
        
        Returns:
            dict: List of supported brokers with their details
        """
        try:
            return {
                "status": "success",
                "brokers": self.supported_brokers
            }
        except Exception as e:
            print(f"ERROR in get_supported_brokers: {str(e)}")
            return {"status": "error", "message": "Failed to get supported brokers"}
    
    def connect_broker(self, user_id, broker_type, credentials, display_name=None):
        """
        Connect a broker for a user
        
        Args:
            user_id (int): User ID
            broker_type (str): Type of broker (e.g., 'angel')
            credentials (dict): Broker credentials
            display_name (str): Optional display name for the connection
            
        Returns:
            dict: Result with status and connection details
        """
        try:
            # Validate broker type
            if broker_type not in self.supported_brokers:
                return {"status": "error", "message": f"Unsupported broker type: {broker_type}"}
            
            broker_info = self.supported_brokers[broker_type]
            
            # Check if broker is active
            if broker_info["status"] != "active":
                return {"status": "error", "message": f"{broker_info['display_name']} is not available yet"}
            
            # Validate required credentials
            required_creds = broker_info["required_credentials"]
            missing_creds = [cred for cred in required_creds if cred not in credentials]
            if missing_creds:
                return {
                    "status": "error", 
                    "message": f"Missing required credentials: {', '.join(missing_creds)}"
                }
            
            # Use appropriate broker adapter
            if broker_type == "angel":
                from brokers.angel_adapter import AngelAdapter
                adapter = AngelAdapter()
                auth_result = adapter.authenticate(
                    credentials.get("client_id"),
                    credentials.get("pin"),
                    credentials.get("totp"),
                    credentials.get("api_key")
                )
            else:
                return {"status": "error", "message": f"Broker adapter not implemented for {broker_type}"}
            
            if auth_result["status"] != "success":
                return {
                    "status": "error",
                    "message": f"Broker authentication failed: {auth_result['message']}",
                    "error_code": "INVALID_TOTP" if "totp" in auth_result.get('message', '').lower() else "AUTH_FAILED"
                }
            
            # Encrypt sensitive credentials before storing
            encrypted_creds = {
                'client_id': encryption_service.encrypt(credentials.get("client_id")),
                'api_key': encryption_service.encrypt(credentials.get("api_key")),
                'pin': encryption_service.encrypt(credentials.get("pin"))
            }
            print(f"Credentials encrypted successfully for user {user_id}")
            
            # Create broker connection with encrypted credentials
            connection_result = create_broker_connection(
                user_id=user_id,
                broker_type=broker_type,
                broker_user_id=credentials.get("client_id"),
                display_name=display_name or f"{broker_info['display_name']} - {credentials.get('client_id')}",
                encrypted_credentials=encrypted_creds
            )
            
            if connection_result["status"] != "success":
                return connection_result
            
            connection_id = connection_result["connection_id"]
            
            # Store broker tokens
            token_result = store_broker_tokens(
                connection_id=connection_id,
                access_token=auth_result["tokens"]["access_token"],
                refresh_token=auth_result["tokens"].get("refresh_token"),
                feed_token=auth_result["tokens"].get("feed_token"),
                expires_at=auth_result["tokens"].get("expires_at")
            )
            
            if token_result["status"] != "success":
                print(f"WARNING: Failed to store broker tokens: {token_result['message']}")
            
            print(f"Successfully connected {broker_type} broker for user {user_id}")
            
            return {
                "status": "success",
                "message": f"Successfully connected to {broker_info['display_name']}",
                "connection": {
                    "id": connection_id,
                    "broker_type": broker_type,
                    "broker_name": broker_info["display_name"],
                    "broker_user_id": credentials.get("client_id"),
                    "display_name": display_name or f"{broker_info['display_name']} - {credentials.get('client_id')}",
                    "connected_at": datetime.now().isoformat(),
                    "status": "connected"
                }
            }
            
        except Exception as e:
            print(f"ERROR in connect_broker: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "error", "message": "Failed to connect broker due to server error"}
    
    def get_user_brokers(self, user_id):
        """
        Get all broker connections for a user
        
        Args:
            user_id (int): User ID
            
        Returns:
            dict: Result with status and list of broker connections
        """
        try:
            connections = get_user_broker_connections(user_id)
            
            broker_list = []
            for connection in connections:
                broker_info = self.supported_brokers.get(connection.broker_type, {})
                
                # Get token info for connection status
                tokens = get_broker_tokens(connection.id)
                is_token_valid = False
                if tokens and tokens.expires_at:
                    is_token_valid = tokens.expires_at > datetime.now()
                elif tokens and tokens.access_token:
                    is_token_valid = True  # No expiration info, assume valid
                
                broker_data = {
                    "id": connection.id,
                    "broker_type": connection.broker_type,
                    "broker_name": broker_info.get("display_name", connection.broker_type.title()),
                    "broker_user_id": connection.broker_user_id,
                    "display_name": connection.display_name,
                    "connected_at": connection.connected_at.isoformat() if connection.connected_at else None,
                    "last_sync_at": connection.last_sync_at.isoformat() if connection.last_sync_at else None,
                    "is_active": connection.is_active,
                    "status": "connected" if is_token_valid else "expired",
                    "features": broker_info.get("features", [])
                }
                
                broker_list.append(broker_data)
            
            return {
                "status": "success",
                "brokers": broker_list,
                "count": len(broker_list)
            }
            
        except Exception as e:
            print(f"ERROR in get_user_brokers: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "error", "message": "Failed to get user brokers"}
    
    def disconnect_broker(self, user_id, connection_id):
        """
        Disconnect a broker connection
        
        Args:
            user_id (int): User ID
            connection_id (int): Broker connection ID
            
        Returns:
            dict: Result with status and message
        """
        try:
            # Get the connection to verify ownership
            connection = BrokerConnections.query.filter_by(
                id=connection_id, 
                user_id=user_id, 
                is_active=True
            ).first()
            
            if not connection:
                return {"status": "error", "message": "Broker connection not found"}
            
            # Deactivate the connection
            connection.is_active = False
            
            # Delete associated tokens
            tokens = BrokerTokens.query.filter_by(connection_id=connection_id).all()
            for token in tokens:
                db_session.delete(token)
            
            db_session.commit()
            
            broker_info = self.supported_brokers.get(connection.broker_type, {})
            broker_name = broker_info.get("display_name", connection.broker_type.title())
            
            print(f"Successfully disconnected {connection.broker_type} broker for user {user_id}")
            
            return {
                "status": "success",
                "message": f"Successfully disconnected from {broker_name}"
            }
            
        except Exception as e:
            db_session.rollback()
            print(f"ERROR in disconnect_broker: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "error", "message": "Failed to disconnect broker"}
    
    def refresh_broker_tokens(self, user_id, connection_id):
        """
        Refresh broker tokens for a connection
        
        Args:
            user_id (int): User ID
            connection_id (int): Broker connection ID
            
        Returns:
            dict: Result with status and message
        """
        try:
            # Get the connection
            connection = BrokerConnections.query.filter_by(
                id=connection_id, 
                user_id=user_id, 
                is_active=True
            ).first()
            
            if not connection:
                return {"status": "error", "message": "Broker connection not found"}
            
            # Get current tokens
            tokens = get_broker_tokens(connection_id)
            if not tokens:
                return {"status": "error", "message": "No tokens found for connection"}
            
            # Use appropriate broker adapter to refresh
            if connection.broker_type == "angel":
                from brokers.angel_adapter import AngelAdapter
                adapter = AngelAdapter()
                refresh_result = adapter.refresh_token(tokens.refresh_token)
            else:
                return {"status": "error", "message": f"Token refresh not implemented for {connection.broker_type}"}
            
            if refresh_result["status"] != "success":
                return {
                    "status": "error",
                    "message": f"Token refresh failed: {refresh_result['message']}"
                }
            
            # Update tokens
            token_result = store_broker_tokens(
                connection_id=connection_id,
                access_token=refresh_result["tokens"]["access_token"],
                refresh_token=refresh_result["tokens"].get("refresh_token"),
                feed_token=refresh_result["tokens"].get("feed_token"),
                expires_at=refresh_result["tokens"].get("expires_at")
            )
            
            if token_result["status"] != "success":
                return {"status": "error", "message": "Failed to update tokens"}
            
            # Update last sync time
            connection.last_sync_at = datetime.now()
            db_session.commit()
            
            broker_info = self.supported_brokers.get(connection.broker_type, {})
            broker_name = broker_info.get("display_name", connection.broker_type.title())
            
            return {
                "status": "success",
                "message": f"Successfully refreshed {broker_name} tokens"
            }
            
        except Exception as e:
            db_session.rollback()
            print(f"ERROR in refresh_broker_tokens: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "error", "message": "Failed to refresh broker tokens"}
    
    def get_broker_connection_details(self, user_id, connection_id):
        """
        Get detailed information about a broker connection
        
        Args:
            user_id (int): User ID
            connection_id (int): Broker connection ID
            
        Returns:
            dict: Result with detailed connection information
        """
        try:
            connection = BrokerConnections.query.filter_by(
                id=connection_id, 
                user_id=user_id
            ).first()
            
            if not connection:
                return {"status": "error", "message": "Broker connection not found"}
            
            broker_info = self.supported_brokers.get(connection.broker_type, {})
            tokens = get_broker_tokens(connection_id)
            
            # Check token validity
            is_token_valid = False
            token_expires_at = None
            if tokens:
                if tokens.expires_at:
                    is_token_valid = tokens.expires_at > datetime.now()
                    token_expires_at = tokens.expires_at.isoformat()
                elif tokens.access_token:
                    is_token_valid = True
            
            connection_details = {
                "id": connection.id,
                "broker_type": connection.broker_type,
                "broker_name": broker_info.get("display_name", connection.broker_type.title()),
                "broker_user_id": connection.broker_user_id,
                "display_name": connection.display_name,
                "connected_at": connection.connected_at.isoformat() if connection.connected_at else None,
                "last_sync_at": connection.last_sync_at.isoformat() if connection.last_sync_at else None,
                "is_active": connection.is_active,
                "status": "connected" if is_token_valid else "expired",
                "features": broker_info.get("features", []),
                "description": broker_info.get("description", ""),
                "token_expires_at": token_expires_at,
                "has_tokens": tokens is not None,
                "can_refresh": tokens and tokens.refresh_token is not None
            }
            
            return {
                "status": "success",
                "connection": connection_details
            }
            
        except Exception as e:
            print(f"ERROR in get_broker_connection_details: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "error", "message": "Failed to get connection details"}

# Create a global instance of the broker service
broker_service = BrokerService()