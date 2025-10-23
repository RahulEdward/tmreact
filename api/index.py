from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys

# Add the parent directory to the path so we can import from the main app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)

# Configure CORS for Vercel
CORS(app, 
     origins=['*'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'Accept'],
     supports_credentials=True)

# Simple health check
@app.route('/')
def home():
    return jsonify({
        "message": "TradingBridge Backend API",
        "status": "running",
        "version": "1.0.0",
        "platform": "Vercel",
        "endpoints": {
            "health": "/health",
            "test": "/test",
            "tradingview": "/tradingview"
        }
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running on Vercel!",
        "environment": os.getenv('FLASK_ENV', 'production'),
        "platform": "Vercel Serverless"
    })

@app.route('/test')
def test():
    return jsonify({
        "status": "success",
        "message": "API is working!",
        "timestamp": "2024-10-22"
    })

# Simple TradingView JSON generator
@app.route('/tradingview', methods=['GET', 'POST', 'OPTIONS'])
def tradingview_json():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})
    
    if request.method == 'GET':
        return jsonify({
            "status": "success",
            "message": "TradingView JSON Generator",
            "method": "POST"
        })
    
    try:
        data = request.get_json() or {}
        symbol = data.get('symbol', 'RELIANCE')
        exchange = data.get('exchange', 'NSE')
        product = data.get('product', 'MIS')
        pricetype = data.get('pricetype', 'MARKET')
        
        # Generate JSON template
        json_template = {
            "apikey": "your-api-key-here",
            "strategy": "TradingView",
            "symbol": symbol.upper(),
            "action": "{{strategy.order.action}}",
            "exchange": exchange,
            "pricetype": pricetype,
            "product": product,
            "quantity": "{{strategy.order.contracts}}",
            "position_size": "{{strategy.position_size}}"
        }
        
        # Add price field for limit orders
        if pricetype in ['LIMIT', 'SL']:
            json_template["price"] = "{{strategy.order.price}}"
        
        # Add trigger price for stop loss orders
        if pricetype in ['SL', 'SL-M']:
            json_template["trigger_price"] = "{{strategy.order.price}}"
        
        return jsonify(json_template)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Simple search suggestions
@app.route('/search/suggestions')
def search_suggestions():
    term = request.args.get('term', '').upper()
    exchange = request.args.get('exchange', 'NSE')
    
    # Mock suggestions data
    suggestions = [
        {'label': 'SBIN - State Bank of India', 'value': 'SBIN', 'token': '3045', 'exchange': 'NSE'},
        {'label': 'RELIANCE - Reliance Industries Ltd', 'value': 'RELIANCE', 'token': '2885', 'exchange': 'NSE'},
        {'label': 'TCS - Tata Consultancy Services Ltd', 'value': 'TCS', 'token': '11536', 'exchange': 'NSE'},
        {'label': 'INFY - Infosys Ltd', 'value': 'INFY', 'token': '1594', 'exchange': 'NSE'},
        {'label': 'HDFCBANK - HDFC Bank Ltd', 'value': 'HDFCBANK', 'token': '1333', 'exchange': 'NSE'},
        {'label': 'ICICIBANK - ICICI Bank Ltd', 'value': 'ICICIBANK', 'token': '4963', 'exchange': 'NSE'},
        {'label': 'AXISBANK - Axis Bank Ltd', 'value': 'AXISBANK', 'token': '5900', 'exchange': 'NSE'},
    ]
    
    # Filter suggestions based on search term
    if term:
        filtered = [s for s in suggestions if term in s['value'] or term in s['label'].upper()]
        return jsonify(filtered[:10])
    
    return jsonify(suggestions[:10])

# Simple auth check
@app.route('/auth/check-session')
def check_session():
    return jsonify({
        "status": "success",
        "authenticated": True,
        "user": {"id": "TEST123", "username": "test_user"}
    })

# Test login
@app.route('/auth/test-login', methods=['POST'])
def test_login():
    return jsonify({
        "status": "success",
        "message": "Test login successful",
        "redirect": "/dashboard",
        "user": {"id": "TEST123", "username": "test_user"}
    })

# Error handler
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "available_endpoints": ["/", "/health", "/test", "/tradingview", "/search/suggestions", "/auth/check-session"]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500

# For Vercel
if __name__ == '__main__':
    app.run(debug=False)