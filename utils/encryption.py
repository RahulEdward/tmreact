# utils/encryption.py

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64
import os

class EncryptionService:
    """Service for encrypting and decrypting sensitive data"""
    
    def __init__(self):
        # Get encryption key from environment variable or generate one
        self.encryption_key = os.getenv('ENCRYPTION_KEY')
        if not self.encryption_key:
            # Generate a key from a secret (in production, use a secure secret)
            secret = os.getenv('SECRET_KEY', 'default-secret-key-change-in-production')
            salt = b'tradingbridge_salt_2024'  # In production, use a secure random salt
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
                backend=default_backend()
            )
            key = base64.urlsafe_b64encode(kdf.derive(secret.encode()))
            self.encryption_key = key
        
        self.cipher = Fernet(self.encryption_key)
    
    def encrypt(self, data: str) -> str:
        """
        Encrypt a string
        
        Args:
            data (str): Plain text data to encrypt
            
        Returns:
            str: Encrypted data as base64 string
        """
        if not data:
            return None
        
        try:
            encrypted = self.cipher.encrypt(data.encode())
            return encrypted.decode()
        except Exception as e:
            print(f"ERROR encrypting data: {str(e)}")
            raise
    
    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt an encrypted string
        
        Args:
            encrypted_data (str): Encrypted data as base64 string
            
        Returns:
            str: Decrypted plain text
        """
        if not encrypted_data:
            return None
        
        try:
            decrypted = self.cipher.decrypt(encrypted_data.encode())
            return decrypted.decode()
        except Exception as e:
            print(f"ERROR decrypting data: {str(e)}")
            raise
    
    def encrypt_credentials(self, credentials: dict) -> dict:
        """
        Encrypt sensitive credential fields
        
        Args:
            credentials (dict): Dictionary containing credentials
            
        Returns:
            dict: Dictionary with encrypted credentials
        """
        encrypted = {}
        sensitive_fields = ['client_id', 'api_key', 'pin', 'password', 'secret']
        
        for key, value in credentials.items():
            if key in sensitive_fields and value:
                encrypted[key] = self.encrypt(str(value))
            else:
                encrypted[key] = value
        
        return encrypted
    
    def decrypt_credentials(self, encrypted_credentials: dict) -> dict:
        """
        Decrypt encrypted credential fields
        
        Args:
            encrypted_credentials (dict): Dictionary containing encrypted credentials
            
        Returns:
            dict: Dictionary with decrypted credentials
        """
        decrypted = {}
        sensitive_fields = ['client_id', 'api_key', 'pin', 'password', 'secret']
        
        for key, value in encrypted_credentials.items():
            if key in sensitive_fields and value:
                try:
                    decrypted[key] = self.decrypt(value)
                except:
                    # If decryption fails, might be unencrypted data
                    decrypted[key] = value
            else:
                decrypted[key] = value
        
        return decrypted


# Create a singleton instance
encryption_service = EncryptionService()
