from flask import Blueprint, jsonify, request, render_template, session, redirect, url_for
from api.order_api import get_order_book, get_trade_book, get_positions, get_holdings
from mapping.order_data import calculate_order_statistics, map_order_data,map_trade_data, map_position_data, map_portfolio_data, calculate_portfolio_statistics
from mapping.order_data import transform_order_data, transform_tradebook_data, transform_positions_data, transform_holdings_data
# Define the blueprint
orders_bp = Blueprint('orders_bp', __name__, url_prefix='/')

@orders_bp.route('/orderbook')
def orderbook():
    try:
        print("DEBUG - Starting orderbook route handler")
        
        if not session.get('logged_in'):
            print("DEBUG - User not logged in, redirecting to login page")
            return redirect(url_for('auth.login'))
        
        print("DEBUG - User is logged in, session data:", dict(session))
        print("DEBUG - Calling get_order_book()")
        
        order_data = get_order_book()
        print("DEBUG - Order Book Response:", order_data)
    
        # Check if there's an error in the API response
        if order_data.get('status') == 'error':
            error_message = order_data.get('message', 'Unknown error occurred')
            print(f"DEBUG - Order book API error: {error_message}")
            # Instead of logging out, show an error message
            return jsonify({'status': 'error', 'message': error_message, 'data': []})

        try:
            # Process the data if no errors
            print("DEBUG - Calling map_order_data()")
            order_data = map_order_data(order_data=order_data)       
            print("DEBUG - After mapping:", order_data)

            print("DEBUG - Calling calculate_order_statistics()")
            order_stats = calculate_order_statistics(order_data)
            print("DEBUG - Order stats:", order_stats)
            
            print("DEBUG - Calling transform_order_data()")
            order_data = transform_order_data(order_data)
            print("DEBUG - After transform:", order_data)
            
            # Pass the data to the orderbook.html template
            print("DEBUG - Rendering template with data")
            return jsonify({'status': 'success', 'data': order_data, 'stats': order_stats})
        except Exception as e:
            import traceback
            print(f"DEBUG - Error processing order data: {str(e)}")
            traceback.print_exc()
            return jsonify({'status': 'error', 'message': f"Error processing data: {str(e)}", 'data': []})
    except Exception as outer_e:
        import traceback
        print(f"DEBUG - Outer exception in orderbook route: {str(outer_e)}")
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': f"Server error: {str(outer_e)}", 'data': []})


@orders_bp.route('/tradebook')
def tradebook():
    # Check authentication first
    if not session.get('logged_in'):
        # For JSON requests, return 401
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({'status': 'error', 'message': 'Authentication required'}), 401
        # For browser requests, redirect to login
        return redirect(url_for('auth.login'))
    
    try:
        tradebook_data = get_trade_book()
        print(tradebook_data)

        # Check if there's an error in the API response
        if tradebook_data.get('status') == 'error':
            if request.headers.get('Accept') == 'application/json' or request.is_json:
                return jsonify({
                    'status': 'error', 
                    'message': tradebook_data.get('message', 'Failed to fetch trade book')
                }), 500
            return redirect(url_for('auth.logout'))

        # Process the data
        tradebook_data = map_trade_data(trade_data=tradebook_data) 
        tradebook_data = transform_tradebook_data(tradebook_data)
        print(tradebook_data)
        
        # Check if request wants JSON (from React frontend)
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({
                'status': 'success',
                'data': tradebook_data
            })
        else:
            # For direct browser access, redirect to React app
            return redirect('http://localhost:5173/tradebook')
            
    except Exception as e:
        print(f"Error in tradebook API: {str(e)}")
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Failed to fetch trade book data'
            }), 500
        return redirect(url_for('auth.logout'))


@orders_bp.route('/positions')
def positions():
    # Check authentication first
    if not session.get('logged_in'):
        # For JSON requests, return 401
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({'status': 'error', 'message': 'Authentication required'}), 401
        # For browser requests, redirect to login
        return redirect(url_for('auth.login'))
    
    try:
        positions_data = get_positions()
        print(positions_data)

        # Check if there's an error in the API response
        if positions_data.get('status') == 'error':
            if request.headers.get('Accept') == 'application/json' or request.is_json:
                return jsonify({
                    'status': 'error', 
                    'message': positions_data.get('message', 'Failed to fetch positions')
                }), 500
            return redirect(url_for('auth.logout'))

        # Process the data
        positions_data = map_position_data(positions_data)
        positions_data = transform_positions_data(positions_data)
        print(positions_data)
        
        # Check if request wants JSON (from React frontend)
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({
                'status': 'success',
                'data': positions_data
            })
        else:
            # For direct browser access, redirect to React app
            return redirect('http://localhost:5173/positions')
            
    except Exception as e:
        print(f"Error in positions API: {str(e)}")
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Failed to fetch positions data'
            }), 500
        return redirect(url_for('auth.logout'))

@orders_bp.route('/holdings')
def holdings():
    # Check authentication first
    if not session.get('logged_in'):
        # For JSON requests, return 401
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({'status': 'error', 'message': 'Authentication required'}), 401
        # For browser requests, redirect to login
        return redirect(url_for('auth.login'))
    
    try:
        print("DEBUG - Starting holdings route handler")
        print("DEBUG - User is logged in, session data:", dict(session))
        print("DEBUG - Calling get_holdings()")
        
        holdings_data = get_holdings()
        print("DEBUG - Holdings Response:", holdings_data)
        
        # Check if there's an error in the API response
        if holdings_data.get('status') == 'error':
            error_message = holdings_data.get('message', 'Unknown error occurred')
            print(f"DEBUG - Holdings API error: {error_message}")
            
            if request.headers.get('Accept') == 'application/json' or request.is_json:
                return jsonify({
                    'status': 'error', 
                    'message': error_message
                }), 500
            return jsonify({'status': 'error', 'message': error_message, 'data': []})
        
        try:
            # Process the data if no errors
            print("DEBUG - Calling map_portfolio_data()")
            mapped_data = map_portfolio_data(holdings_data)
            print("DEBUG - After mapping:", mapped_data)
            
            print("DEBUG - Calling calculate_portfolio_statistics()")
            portfolio_stats = calculate_portfolio_statistics(mapped_data)
            print("DEBUG - Portfolio stats:", portfolio_stats)
            
            print("DEBUG - Calling transform_holdings_data()")
            transformed_data = transform_holdings_data(mapped_data)
            print("DEBUG - After transform:", transformed_data)
            
            # Check if request wants JSON (from React frontend)
            if request.headers.get('Accept') == 'application/json' or request.is_json:
                return jsonify({
                    'status': 'success',
                    'data': {
                        'holdings': transformed_data,
                        'stats': portfolio_stats
                    }
                })
            else:
                # For direct browser access, redirect to React app
                return redirect('http://localhost:5173/holdings')
                
        except Exception as e:
            import traceback
            print(f"DEBUG - Error processing holdings data: {str(e)}")
            traceback.print_exc()
            
            if request.headers.get('Accept') == 'application/json' or request.is_json:
                return jsonify({
                    'status': 'error',
                    'message': f"Error processing data: {str(e)}"
                }), 500
            return jsonify({'status': 'error', 'message': f"Error processing data: {str(e)}", 'data': []})
            
    except Exception as outer_e:
        import traceback
        print(f"DEBUG - Outer exception in holdings route: {str(outer_e)}")
        traceback.print_exc()
        
        if request.headers.get('Accept') == 'application/json' or request.is_json:
            return jsonify({
                'status': 'error',
                'message': f"Server error: {str(outer_e)}"
            }), 500
        return jsonify({'status': 'error', 'message': f"Server error: {str(outer_e)}", 'data': []})


