# utils/rate_limiter.py

"""
Simple rate limiting utility for authentication endpoints
"""

import time
from collections import defaultdict, deque
from functools import wraps
from flask import request, jsonify

class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self):
        # Store request timestamps for each IP
        self.requests = defaultdict(deque)
        # Store failed login attempts for each IP
        self.failed_attempts = defaultdict(deque)
    
    def is_rate_limited(self, key, max_requests, window_seconds):
        """
        Check if a key (usually IP address) is rate limited
        
        Args:
            key (str): Identifier (usually IP address)
            max_requests (int): Maximum requests allowed in window
            window_seconds (int): Time window in seconds
            
        Returns:
            bool: True if rate limited, False otherwise
        """
        now = time.time()
        window_start = now - window_seconds
        
        # Clean old requests
        while self.requests[key] and self.requests[key][0] < window_start:
            self.requests[key].popleft()
        
        # Check if limit exceeded
        if len(self.requests[key]) >= max_requests:
            return True
        
        # Add current request
        self.requests[key].append(now)
        return False
    
    def is_login_rate_limited(self, key, max_attempts=5, window_seconds=300):
        """
        Check if login attempts are rate limited (stricter for failed attempts)
        
        Args:
            key (str): Identifier (usually IP address)
            max_attempts (int): Maximum failed attempts allowed
            window_seconds (int): Time window in seconds (default 5 minutes)
            
        Returns:
            bool: True if rate limited, False otherwise
        """
        now = time.time()
        window_start = now - window_seconds
        
        # Clean old failed attempts
        while self.failed_attempts[key] and self.failed_attempts[key][0] < window_start:
            self.failed_attempts[key].popleft()
        
        # Check if limit exceeded
        return len(self.failed_attempts[key]) >= max_attempts
    
    def record_failed_login(self, key):
        """Record a failed login attempt"""
        now = time.time()
        self.failed_attempts[key].append(now)
    
    def clear_failed_attempts(self, key):
        """Clear failed attempts for a key (on successful login)"""
        if key in self.failed_attempts:
            self.failed_attempts[key].clear()
    
    def get_remaining_time(self, key, window_seconds):
        """Get remaining time until rate limit resets"""
        if not self.failed_attempts[key]:
            return 0
        
        oldest_attempt = self.failed_attempts[key][0]
        elapsed = time.time() - oldest_attempt
        remaining = max(0, window_seconds - elapsed)
        return int(remaining)

# Global rate limiter instance
rate_limiter = RateLimiter()

def login_rate_limit(max_attempts=5, window_seconds=300):
    """
    Decorator for login rate limiting
    
    Args:
        max_attempts (int): Maximum failed attempts allowed
        window_seconds (int): Time window in seconds
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client IP
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            if client_ip:
                client_ip = client_ip.split(',')[0].strip()
            else:
                client_ip = request.remote_addr or 'unknown'
            
            # Check if rate limited
            if rate_limiter.is_login_rate_limited(client_ip, max_attempts, window_seconds):
                remaining_time = rate_limiter.get_remaining_time(client_ip, window_seconds)
                return jsonify({
                    'status': 'error',
                    'message': f'Too many failed login attempts. Please try again in {remaining_time} seconds.',
                    'error_code': 'RATE_LIMITED',
                    'retry_after': remaining_time
                }), 429
            
            # Execute the original function
            response = f(*args, **kwargs)
            
            # If it's a failed login, record it
            if hasattr(response, 'status_code') and response.status_code == 401:
                rate_limiter.record_failed_login(client_ip)
            elif hasattr(response, 'status_code') and response.status_code == 200:
                # Successful login, clear failed attempts
                rate_limiter.clear_failed_attempts(client_ip)
            
            return response
        
        return decorated_function
    return decorator

def general_rate_limit(max_requests=20, window_seconds=60):
    """
    Decorator for general rate limiting
    
    Args:
        max_requests (int): Maximum requests allowed
        window_seconds (int): Time window in seconds
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client IP
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            if client_ip:
                client_ip = client_ip.split(',')[0].strip()
            else:
                client_ip = request.remote_addr or 'unknown'
            
            # Check if rate limited
            if rate_limiter.is_rate_limited(client_ip, max_requests, window_seconds):
                return jsonify({
                    'status': 'error',
                    'message': f'Rate limit exceeded. Maximum {max_requests} requests per {window_seconds} seconds.',
                    'error_code': 'RATE_LIMITED'
                }), 429
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator