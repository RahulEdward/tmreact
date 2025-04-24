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
            return render_template('orderbook.html', order_data=[], order_stats={}, error=error_message)

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
            return render_template('orderbook.html', order_data=order_data, order_stats=order_stats, error=None)
        except Exception as e:
            import traceback
            print(f"DEBUG - Error processing order data: {str(e)}")
            traceback.print_exc()
            return render_template('orderbook.html', order_data=[], order_stats={}, error=f"Error processing data: {str(e)}")
    except Exception as outer_e:
        import traceback
        print(f"DEBUG - Outer exception in orderbook route: {str(outer_e)}")
        traceback.print_exc()
        return render_template('orderbook.html', order_data=[], order_stats={}, error=f"Server error: {str(outer_e)}")


@orders_bp.route('/tradebook')
def tradebook():
    if not session.get('logged_in'):
        return redirect(url_for('auth.login'))
    

    tradebook_data = get_trade_book()

    
    # Check if 'data' is None

    if tradebook_data['status'] == 'error':
        return redirect(url_for('auth.logout'))

    
    tradebook_data = map_trade_data(trade_data=tradebook_data) 
    print(tradebook_data)

    tradebook_data = transform_tradebook_data(tradebook_data)
    
    

    return render_template('tradebook.html', tradebook_data=tradebook_data)


@orders_bp.route('/positions')
def positions():
    if not session.get('logged_in'):
        return redirect(url_for('auth.login'))
    
    positions_data = get_positions()
    print(positions_data)

    if positions_data['status'] == 'error':
        return redirect(url_for('auth.logout'))


    positions_data = map_position_data(positions_data)
    

    positions_data = transform_positions_data(positions_data)
    print(positions_data)
        
    return render_template('positions.html', positions_data=positions_data)

@orders_bp.route('/holdings')
def holdings():
    try:
        print("DEBUG - Starting holdings route handler")
        
        if not session.get('logged_in'):
            print("DEBUG - User not logged in, redirecting to login page")
            return redirect(url_for('auth.login'))
        
        print("DEBUG - User is logged in, session data:", dict(session))
        print("DEBUG - Calling get_holdings()")
        
        holdings_data = get_holdings()
        print("DEBUG - Holdings Response:", holdings_data)
        
        # Check if there's an error in the API response
        if holdings_data.get('status') == 'error':
            error_message = holdings_data.get('message', 'Unknown error occurred')
            print(f"DEBUG - Holdings API error: {error_message}")
            # Instead of logging out, show an error message
            return render_template('holdings.html', holdings_data=[], portfolio_stats={}, error=error_message)
        
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
            
            # Pass the data to the holdings.html template
            print("DEBUG - Rendering template with data")
            return render_template('holdings.html', holdings_data=transformed_data, portfolio_stats=portfolio_stats, error=None)
        except Exception as e:
            import traceback
            print(f"DEBUG - Error processing holdings data: {str(e)}")
            traceback.print_exc()
            return render_template('holdings.html', holdings_data=[], portfolio_stats={}, error=f"Error processing data: {str(e)}")
    except Exception as outer_e:
        import traceback
        print(f"DEBUG - Outer exception in holdings route: {str(outer_e)}")
        traceback.print_exc()
        return render_template('holdings.html', holdings_data=[], portfolio_stats={}, error=f"Server error: {str(outer_e)}")


