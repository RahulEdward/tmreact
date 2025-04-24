# limiter.py

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize Flask-Limiter without the app object
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per minute", "5000 per hour"],
    headers_enabled=True, # Enable headers to show rate limit info
    swallow_errors=True # Don't crash the app if rate limiting fails
)
