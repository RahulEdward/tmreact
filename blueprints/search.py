from flask import Blueprint, render_template, session, redirect, url_for, request, jsonify
from flask_cors import cross_origin
from database.master_contract_db import search_symbols

search_bp = Blueprint('search_bp', __name__, url_prefix='/search')

@search_bp.route('/token')
def token():
    if not session.get('logged_in'):
        return redirect(url_for('auth.login'))  # Fixed auth_bp.login to auth.login
    return jsonify({'status': 'success', 'message': 'Token endpoint', 'user': session.get('user')})

@search_bp.route('/')
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], supports_credentials=True)
def search():
    if not session.get('logged_in'):
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({'status': 'error', 'message': 'Authentication required'}), 401
        return redirect(url_for('auth.login'))
    
    symbol = request.args.get('symbol')
    exchange = request.args.get('exchange')
    
    # Check if this is a test user and return mock data
    if session.get('user_id') == 'TEST123':
        mock_results = [
            {
                'symbol': 'RELIANCE',
                'brsymbol': 'RELIANCE-EQ',
                'name': 'Reliance Industries Ltd',
                'exchange': 'NSE',
                'brexchange': 'NSE',
                'token': '2885',
                'expiry': '',
                'strike': 0.0,
                'lotsize': 1,
                'instrumenttype': 'EQ',
                'tick_size': 0.05
            },
            {
                'symbol': 'TCS',
                'brsymbol': 'TCS-EQ',
                'name': 'Tata Consultancy Services Ltd',
                'exchange': 'NSE',
                'brexchange': 'NSE',
                'token': '11536',
                'expiry': '',
                'strike': 0.0,
                'lotsize': 1,
                'instrumenttype': 'EQ',
                'tick_size': 0.05
            },
            {
                'symbol': 'INFY',
                'brsymbol': 'INFY-EQ',
                'name': 'Infosys Ltd',
                'exchange': 'NSE',
                'brexchange': 'NSE',
                'token': '1594',
                'expiry': '',
                'strike': 0.0,
                'lotsize': 1,
                'instrumenttype': 'EQ',
                'tick_size': 0.05
            }
        ]
        # Filter by symbol if provided
        if symbol:
            mock_results = [r for r in mock_results if symbol.upper() in r['symbol'].upper()]
        return jsonify({'status': 'success', 'results': mock_results})
    
    results = search_symbols(symbol, exchange)
    
    if not results:
        return "No matching symbols found."
    else:
        # Since results are now objects, we can't directly zip them with columns
        # Instead, we access attributes directly
        results_dicts = [{
            'symbol': result.symbol,
            'brsymbol': result.brsymbol,
            'name': result.name,
            'exchange': result.exchange,
            'brexchange': result.brexchange,
            'token': result.token,
            'expiry': result.expiry,
            'strike': result.strike,
            'lotsize': result.lotsize,
            'instrumenttype': result.instrumenttype,
            'tick_size': result.tick_size
        } for result in results]
        return jsonify({'status': 'success', 'results': results_dicts})

# New endpoint for autocomplete suggestions
@search_bp.route('/suggestions')
@cross_origin(origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], supports_credentials=True)
def get_suggestions():
    if not session.get('logged_in'):
        return jsonify([])
    
    symbol = request.args.get('term', '')  # 'term' is common for jQuery autocomplete
    exchange = request.args.get('exchange', 'NSE')
    
    if not symbol or len(symbol) < 1:
        return jsonify([])
    
    # Check if this is a test user and return mock suggestions
    if session.get('user_id') == 'TEST123':
        mock_suggestions = [
            {
                'label': 'SBI - State Bank of India',
                'value': 'SBIN',
                'token': '3045',
                'exchange': 'NSE'
            },
            {
                'label': 'SBICAP - SBI Capital Markets Ltd',
                'value': 'SBICAP',
                'token': '17094',
                'exchange': 'NSE'
            },
            {
                'label': 'SBICARD - SBI Cards and Payment Services Ltd',
                'value': 'SBICARD',
                'token': '16675',
                'exchange': 'NSE'
            },
            {
                'label': 'SBILIFE - SBI Life Insurance Company Ltd',
                'value': 'SBILIFE',
                'token': '21808',
                'exchange': 'NSE'
            },
            {
                'label': 'RELIANCE - Reliance Industries Ltd',
                'value': 'RELIANCE',
                'token': '2885',
                'exchange': 'NSE'
            },
            {
                'label': 'TCS - Tata Consultancy Services Ltd',
                'value': 'TCS',
                'token': '11536',
                'exchange': 'NSE'
            },
            {
                'label': 'INFY - Infosys Ltd',
                'value': 'INFY',
                'token': '1594',
                'exchange': 'NSE'
            },
            {
                'label': 'HDFCBANK - HDFC Bank Ltd',
                'value': 'HDFCBANK',
                'token': '1333',
                'exchange': 'NSE'
            },
            {
                'label': 'ICICIBANK - ICICI Bank Ltd',
                'value': 'ICICIBANK',
                'token': '4963',
                'exchange': 'NSE'
            },
            {
                'label': 'AXISBANK - Axis Bank Ltd',
                'value': 'AXISBANK',
                'token': '5900',
                'exchange': 'NSE'
            }
        ]
        
        # Filter suggestions based on search term
        filtered_suggestions = [
            s for s in mock_suggestions 
            if symbol.upper() in s['value'].upper() or symbol.upper() in s['label'].upper()
        ]
        
        return jsonify(filtered_suggestions[:10])  # Limit to 10 suggestions
        
    results = search_symbols(symbol, exchange)
    
    # Format suggestions as a list of items
    suggestions = [{
        'label': f"{result.symbol} - {result.name}",
        'value': result.symbol,
        'token': result.token,
        'exchange': result.exchange
    } for result in results[:10]]  # Limit to 10 suggestions
    
    return jsonify(suggestions)