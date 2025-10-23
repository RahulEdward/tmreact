# middleware/session_middleware.py

import threading
import time
from datetime import datetime, timedelta
from services.session_service import session_service

class SessionCleanupMiddleware:
    """Middleware for automatic session cleanup and management"""
    
    def __init__(self, app=None):
        self.app = app
        self.cleanup_thread = None
        self.cleanup_interval = 6 * 3600  # 6 hours in seconds
        self.running = False
        
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize the middleware with Flask app"""
        self.app = app
        
        # Register before_request and after_request handlers
        app.before_request(self.before_request)
        app.after_request(self.after_request)
        
        # Start cleanup thread
        self.start_cleanup_thread()
        
        # Register cleanup on app teardown
        app.teardown_appcontext(self.cleanup_on_teardown)
    
    def before_request(self):
        """Called before each request"""
        # This could be used for request-level session validation
        # Currently just a placeholder for future enhancements
        pass
    
    def after_request(self, response):
        """Called after each request"""
        # Add security headers for session management
        if response and hasattr(response, 'headers'):
            # Ensure session cookies are secure in production
            if self.app and not self.app.debug:
                response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
            
            # Prevent caching of authenticated responses
            if 'new_auth_logged_in' in getattr(response, 'session', {}):
                response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                response.headers['Pragma'] = 'no-cache'
                response.headers['Expires'] = '0'
        
        return response
    
    def start_cleanup_thread(self):
        """Start the background thread for session cleanup"""
        if self.cleanup_thread and self.cleanup_thread.is_alive():
            return
        
        self.running = True
        self.cleanup_thread = threading.Thread(target=self._cleanup_worker, daemon=True)
        self.cleanup_thread.start()
        print("Session cleanup thread started")
    
    def stop_cleanup_thread(self):
        """Stop the background cleanup thread"""
        self.running = False
        if self.cleanup_thread:
            self.cleanup_thread.join(timeout=5)
        print("Session cleanup thread stopped")
    
    def _cleanup_worker(self):
        """Background worker for periodic session cleanup"""
        while self.running:
            try:
                # Wait for the cleanup interval
                time.sleep(self.cleanup_interval)
                
                if not self.running:
                    break
                
                # Perform cleanup within app context
                if self.app:
                    with self.app.app_context():
                        result = session_service.cleanup_expired_sessions()
                        if result["status"] == "success":
                            print(f"Automatic cleanup: removed {result['count']} expired sessions")
                        else:
                            print(f"Automatic cleanup failed: {result.get('message', 'Unknown error')}")
                
            except Exception as e:
                print(f"ERROR in session cleanup worker: {str(e)}")
                # Continue running even if cleanup fails
                continue
    
    def cleanup_on_teardown(self, exception):
        """Cleanup when app context is torn down"""
        # This is called when the app context ends
        # Could be used for request-specific cleanup if needed
        pass
    
    def force_cleanup(self):
        """Force an immediate cleanup of expired sessions"""
        try:
            if self.app:
                with self.app.app_context():
                    return session_service.cleanup_expired_sessions()
            else:
                return session_service.cleanup_expired_sessions()
        except Exception as e:
            print(f"ERROR in force_cleanup: {str(e)}")
            return {"status": "error", "message": str(e)}

# Global instance
session_middleware = SessionCleanupMiddleware()