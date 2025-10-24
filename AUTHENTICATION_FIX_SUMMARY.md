# Authentication System - Fix Summary

## Problem
Database was being created in `/tmp/` directory instead of `db/` directory, causing login and registration to fail.

## Root Cause
1. `.env` file had `DATABASE_URL=sqlite:///tmp/secueralgo.db`
2. `VERCEL=1` flag was set, which forced the app to use `/tmp/` path
3. Database tables were not properly initialized

## Solution Applied

### 1. Fixed `.env` Configuration
```env
# Changed from:
DATABASE_URL=sqlite:///tmp/secueralgo.db
FLASK_ENV=production
VERCEL=1

# Changed to:
DATABASE_URL=sqlite:///db/secueralgo.db
FLASK_ENV=development
VERCEL=0
```

### 2. Created Database Setup Script
Created `setup_database.py` which:
- Ensures `db/` directory exists
- Creates `db/secueralgo.db` file
- Creates all required tables:
  - `new_users` - New authentication system users
  - `user_sessions` - Session management
  - `broker_connections` - Broker account connections
  - `broker_tokens` - Broker authentication tokens
  - `users` - Legacy broker users
  - `auth_tokens` - Legacy auth tokens
- Creates a test user for development

### 3. Test User Created
- **Username:** testuser
- **Email:** test@example.com
- **Password:** password123

## Database Tables Structure

### New Authentication System

#### new_users
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- is_active (DEFAULT 1)
- is_admin (DEFAULT 0)
- created_at
- updated_at
```

#### user_sessions
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY -> new_users.id)
- session_token (UNIQUE)
- expires_at
- created_at
```

#### broker_connections
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY -> new_users.id)
- broker_name
- broker_user_id
- is_active
- created_at
- updated_at
```

#### broker_tokens
```sql
- id (PRIMARY KEY)
- connection_id (FOREIGN KEY -> broker_connections.id)
- auth_token
- refresh_token
- feed_token
- expires_at
- created_at
- updated_at
```

## How to Use

### For Development

1. **Start Backend:**
   ```bash
   python app.py
   ```

2. **Start Frontend:**
   ```bash
   cd nextjs-frontend
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Login Options

#### Option 1: New Authentication System
- URL: http://localhost:3000/new-login
- Use email/username and password
- Test credentials:
  - Username: `testuser`
  - Password: `password123`

#### Option 2: Legacy Broker Authentication
- URL: http://localhost:3000/login
- Use broker credentials (Angel One)
- Requires: User ID, PIN, TOTP

### Register New User
- URL: http://localhost:3000/new-register
- Provide: Username, Email, Password
- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

## Testing

### Manual Testing
1. Register a new user at `/new-register`
2. Login with credentials at `/new-login`
3. Access dashboard at `/dashboard`
4. Logout and verify session is cleared

### Automated Testing
Run the test script:
```bash
python test_new_auth.py
```

This will test:
- User registration
- User login
- Session validation
- User logout

## Files Modified

1. `.env` - Fixed database path and environment settings
2. `setup_database.py` - New comprehensive database setup script
3. `test_new_auth.py` - New authentication testing script

## Files Already Existing (No Changes Needed)

1. `database/auth_db.py` - Database models and functions
2. `services/auth_service.py` - Authentication business logic
3. `blueprints/auth.py` - Authentication API endpoints
4. `nextjs-frontend/src/app/new-login/page.tsx` - Login UI
5. `nextjs-frontend/src/app/new-register/page.tsx` - Registration UI

## Verification Checklist

- ✅ Database created in `db/` directory
- ✅ All required tables exist
- ✅ Test user created successfully
- ✅ User registration working
- ✅ User login working
- ✅ Session management working
- ✅ Dashboard accessible after login
- ✅ Logout working

## Future Maintenance

### Database Reset
If you need to reset the database:
```bash
# Delete the database
rm db/secueralgo.db

# Recreate it
python setup_database.py
```

### Add Admin User
To make a user admin, run SQL:
```sql
UPDATE new_users SET is_admin = 1 WHERE username = 'your_username';
```

### Session Cleanup
Sessions expire after 24 hours. To manually clean expired sessions:
```python
from services.auth_service import auth_service
auth_service.cleanup_expired_sessions()
```

## Security Notes

1. **Password Hashing:** Using bcrypt for secure password hashing
2. **Session Tokens:** Random 32-byte tokens for session management
3. **CORS:** Configured for localhost development
4. **Rate Limiting:** Implemented on login endpoint (5 attempts per 5 minutes)

## Production Deployment

For production deployment:

1. Update `.env`:
   ```env
   FLASK_ENV=production
   DATABASE_URL=sqlite:///tmp/secueralgo.db  # For Vercel
   VERCEL=1
   APP_KEY=<strong-random-key>
   ```

2. Use PostgreSQL instead of SQLite for better performance
3. Enable HTTPS
4. Update CORS_ORIGINS with production domain
5. Set secure session cookies

## Support

If you encounter any issues:
1. Check backend logs in terminal
2. Check browser console for frontend errors
3. Verify database exists: `ls -la db/`
4. Run test script: `python test_new_auth.py`
5. Check `.env` configuration

---

**Status:** ✅ Authentication system fully functional
**Date:** 2025-10-24
**Version:** 1.0.0
