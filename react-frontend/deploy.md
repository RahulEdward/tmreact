# React to Flask Deployment Guide

This guide provides complete instructions for integrating the React frontend with your existing Flask backend.

## Quick Start (Automated)

### Option 1: Use the Deployment Script (Recommended)

```bash
cd react-frontend
python deploy-to-flask.py
```

This script will:
- Build the React app
- Copy files to Flask static directory
- Create deployment configuration
- Provide integration instructions

### Option 2: Manual Deployment

1. **Build the React app:**
   ```bash
   cd react-frontend
   npm run build
   ```

2. **Copy build files to Flask:**
   ```bash
   # Windows
   xcopy /E /I dist\* ..\static\react\
   
   # Linux/Mac
   cp -r dist/* ../static/react/
   ```

3. **Integrate with Flask (see Flask Integration section below)**

## Flask Integration

### Method 1: Use the React Blueprint (Recommended)

1. **Copy the blueprint file to your Flask project:**
   ```bash
   cp react-frontend/react_blueprint.py .
   ```

2. **Update your Flask app.py:**
   ```python
   # Add this import at the top
   from react_blueprint import setup_react_integration
   
   # After creating your Flask app, add this line:
   app = setup_react_integration(app)
   ```

3. **Set environment variables:**
   ```bash
   # In your .env file or environment
   SERVE_REACT_FRONTEND=true
   ```

4. **Restart your Flask application**

### Method 2: Manual Integration

If you prefer to integrate manually, add this to your Flask app.py:

```python
from flask import send_from_directory, send_file, jsonify
import os

# Serve React static files
@app.route('/static/react/<path:filename>')
def react_static(filename):
    return send_from_directory('static/react', filename)

# Check if React should be served
def should_serve_react():
    react_available = os.path.exists('static/react/index.html')
    serve_enabled = os.getenv('SERVE_REACT_FRONTEND', 'false').lower() == 'true'
    return react_available and serve_enabled

# Serve React for all frontend routes
@app.route('/')
@app.route('/dashboard')
@app.route('/orderbook')
@app.route('/tradebook')
@app.route('/positions')
@app.route('/holdings')
@app.route('/apikey')
@app.route('/logs')
@app.route('/search')
@app.route('/tradingview')
@app.route('/login')
@app.route('/register')
@app.route('/<path:path>')
def serve_react_app(path=''):
    if should_serve_react():
        return send_file('static/react/index.html')
    else:
        # Fallback to existing Flask routes
        return redirect(url_for('core_bp.home'))
```

## Environment Configuration

### Production Environment

Create or update your `.env` file:

```bash
# React Frontend Configuration
SERVE_REACT_FRONTEND=true
ENABLE_CORS_DEV=false

# Flask Configuration
FLASK_ENV=production
```

### Development Environment

For development with React dev server running separately:

```bash
# React Frontend Configuration
SERVE_REACT_FRONTEND=false
ENABLE_CORS_DEV=true

# Flask Configuration
FLASK_ENV=development
```

## Deployment Strategies

### Strategy 1: Full React Replacement

- Set `SERVE_REACT_FRONTEND=true`
- All routes serve React frontend
- Flask templates are bypassed
- Best for complete migration

### Strategy 2: Gradual Migration

- Keep `SERVE_REACT_FRONTEND=false` initially
- Test React build thoroughly
- Switch to `SERVE_REACT_FRONTEND=true` when ready
- Easy rollback by changing environment variable

### Strategy 3: A/B Testing

- Use feature flags or user segments
- Serve React to specific users
- Monitor performance and user feedback
- Gradual rollout based on results

## Build Optimization

### Production Build Features

- **Code Splitting**: Automatic vendor and route-based splitting
- **Asset Optimization**: Minified CSS/JS with hash-based names
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip-ready assets

### Performance Monitoring

```bash
# Analyze bundle size
npm run analyze

# Preview production build
npm run preview

# Check build output
npm run build && ls -la dist/
```

## Security Configuration

### CORS Setup

For development with separate React server:

```python
# Install flask-cors: pip install flask-cors
from flask_cors import CORS

if app.debug and os.getenv('ENABLE_CORS_DEV') == 'true':
    CORS(app, origins=['http://localhost:5173'], supports_credentials=True)
```

### Environment Variables

- Never expose sensitive data in `VITE_` variables
- Use Flask backend for authentication and sensitive operations
- Configure proper CSP headers

## Monitoring and Debugging

### Frontend Status API

Check deployment status:
```bash
curl http://your-flask-app/api/frontend-status
```

Response includes:
- React build availability
- Configuration status
- Build timestamp
- Deployment information

### Debug Mode

In development, access debug information:
```bash
curl http://your-flask-app/api/react-config
```

### Log Monitoring

- React errors are caught by error boundaries
- Flask logs backend errors
- Monitor both client and server logs

## Rollback Procedures

### Quick Rollback

1. **Disable React serving:**
   ```bash
   export SERVE_REACT_FRONTEND=false
   ```

2. **Restart Flask application**

3. **Application falls back to Flask templates**

### Complete Rollback

1. **Remove React static files:**
   ```bash
   rm -rf static/react/
   ```

2. **Remove React blueprint integration**

3. **Restart Flask application**

## Troubleshooting

### Common Issues

1. **React app not loading:**
   - Check `SERVE_REACT_FRONTEND` environment variable
   - Verify `static/react/index.html` exists
   - Check Flask logs for errors

2. **API calls failing:**
   - Verify API base URL in React build
   - Check CORS configuration
   - Ensure Flask routes are accessible

3. **WebSocket connection issues:**
   - Check WebSocket URL configuration
   - Verify SocketIO compatibility
   - Check firewall/proxy settings

4. **Static assets not loading:**
   - Check static file serving configuration
   - Verify asset paths in build output
   - Check file permissions

### Debug Commands

```bash
# Check React build
cd react-frontend && npm run build

# Verify Flask integration
python -c "from react_blueprint import is_react_available; print(is_react_available())"

# Test production build locally
cd react-frontend && npm run preview

# Check for TypeScript errors
cd react-frontend && npm run type-check
```

### Performance Issues

1. **Slow loading:**
   - Enable gzip compression in Flask
   - Use CDN for static assets
   - Implement proper caching headers

2. **Large bundle size:**
   - Run bundle analyzer: `npm run analyze`
   - Consider code splitting optimization
   - Remove unused dependencies

## Advanced Configuration

### Custom Static Path

```python
# Serve React from custom path
app.static_folder = 'static/react'
app.static_url_path = '/static'
```

### Multiple Environments

```python
# Environment-based configuration
if os.getenv('ENVIRONMENT') == 'production':
    app.config['SERVE_REACT'] = True
elif os.getenv('ENVIRONMENT') == 'staging':
    app.config['SERVE_REACT'] = True
else:
    app.config['SERVE_REACT'] = False
```

### Health Checks

```python
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'react_available': is_react_available(),
        'timestamp': datetime.now().isoformat()
    })
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Flask and React logs
3. Test with the debug endpoints
4. Verify environment configuration