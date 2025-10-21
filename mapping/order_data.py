import json
from database.token_db import get_symbol, get_oa_symbol 

def map_order_data(order_data):
    """
    Processes and modifies a list of order dictionaries based on specific conditions.
    
    Parameters:
    - order_data: A list of dictionaries, where each dictionary represents an order.
    
    Returns:
    - The modified order_data with updated 'tradingsymbol' and 'product' fields.
    """
    # First check if order_data is valid
    if not isinstance(order_data, dict):
        print("Invalid order data format: not a dictionary")
        return []
        
    # Check if 'status' is in the response
    if 'status' in order_data and order_data.get('status') == 'error':
        print(f"Error in order data: {order_data.get('message', 'Unknown error')}")
        return []
        
    # Check if 'data' exists and is not None
    if 'data' not in order_data or order_data['data'] is None:
        print("No data available in order response.")
        return []
        
    # Extract the actual order data
    order_list = order_data['data']
    
    # Ensure order_list is a list
    if not isinstance(order_list, list):
        print(f"Expected order data to be a list, but got {type(order_list)}")
        return []
    
    # Process each order in the list
    if order_list:
        for order in order_list:
            # Extract the instrument_token and exchange for the current order
            symboltoken = order['symboltoken']
            exchange = order['exchange']
            
            # Use the get_symbol function to fetch the symbol from the database
            symbol_from_db = get_symbol(symboltoken, exchange)
            
            # Check if a symbol was found; if so, update the trading_symbol in the current order
            if symbol_from_db:
                order['tradingsymbol'] = symbol_from_db
                if (order['exchange'] == 'NSE' or order['exchange'] == 'BSE') and order['producttype'] == 'DELIVERY':
                    order['producttype'] = 'CNC'
                               
                elif order['producttype'] == 'INTRADAY':
                    order['producttype'] = 'MIS'
                
                elif order['exchange'] in ['NFO', 'MCX', 'BFO', 'CDS'] and order['producttype'] == 'CARRYFORWARD':
                    order['producttype'] = 'NRML'
            else:
                print(f"Symbol not found for token {symboltoken} and exchange {exchange}. Keeping original trading symbol.")
                
    return order_data


def calculate_order_statistics(order_data):
    """
    Calculates statistics from order data, including totals for buy orders, sell orders,
    completed orders, open orders, and rejected orders.

    Parameters:
    - order_data: A list of dictionaries, where each dictionary represents an order.

    Returns:
    - A dictionary containing counts of different types of orders.
    """
    # Initialize counters
    total_buy_orders = total_sell_orders = 0
    total_completed_orders = total_open_orders = total_rejected_orders = 0

    # Handle empty input
    if not order_data:
        print("Warning: calculate_order_statistics received empty order_data list")
        return {
            'total_buy_orders': 0,
            'total_sell_orders': 0,
            'total_completed_orders': 0,
            'total_open_orders': 0,
            'total_rejected_orders': 0
        }
        
    try:
        for order in order_data:
            # Count buy and sell orders
            if order.get('transactiontype') == 'BUY':
                total_buy_orders += 1
            elif order.get('transactiontype') == 'SELL':
                total_sell_orders += 1
            
            # Count orders based on their status
            if order.get('status') == 'complete':
                total_completed_orders += 1
            elif order.get('status') == 'open':
                total_open_orders += 1
            elif order.get('status') == 'rejected':
                total_rejected_orders += 1
    except Exception as e:
        import traceback
        print(f"Error in calculate_order_statistics: {str(e)}")
        traceback.print_exc()
        # Return zeros on error rather than crashing
        return {
            'total_buy_orders': 0,
            'total_sell_orders': 0,
            'total_completed_orders': 0,
            'total_open_orders': 0,
            'total_rejected_orders': 0
        }

    # Compile and return the statistics
    return {
        'total_buy_orders': total_buy_orders,
        'total_sell_orders': total_sell_orders,
        'total_completed_orders': total_completed_orders,
        'total_open_orders': total_open_orders,
        'total_rejected_orders': total_rejected_orders
    }


def transform_order_data(orders):
    # Handle empty input
    if not orders:
        print("Warning: transform_order_data received empty orders list")
        return []
        
    # Directly handling a dictionary assuming it's the structure we expect
    if isinstance(orders, dict):
        # Convert the single dictionary into a list of one dictionary
        orders = [orders]

    transformed_orders = []
    
    try:
        for order in orders:
            # Make sure each item is indeed a dictionary
            if not isinstance(order, dict):
                print(f"Warning: Expected a dict, but found a {type(order)}. Skipping this item.")
                continue

            transformed_order = {
                "symbol": order.get("tradingsymbol", ""),
                "exchange": order.get("exchange", ""),
                "action": order.get("transactiontype", ""),
                "quantity": order.get("quantity", 0),
                "price": order.get("price", 0.0),
                "trigger_price": order.get("triggerprice", 0.0),
                "pricetype": order.get("ordertype", ""),
                "product": order.get("producttype", ""),
                "orderid": order.get("orderid", ""),
                "order_status": order.get("status", ""),
                "timestamp": order.get("updatetime", "")
            }

            transformed_orders.append(transformed_order)
    except Exception as e:
        import traceback
        print(f"Error in transform_order_data: {str(e)}")
        traceback.print_exc()
        # Return empty list on error rather than crashing
        return []

    return transformed_orders



def map_trade_data(trade_data):
    """
    Processes and modifies a list of order dictionaries based on specific conditions.
    
    Parameters:
    - order_data: A list of dictionaries, where each dictionary represents an order.
    
    Returns:
    - The modified order_data with updated 'tradingsymbol' and 'product' fields.
    """
        # Check if 'data' is None
    if trade_data['data'] is None:
        # Handle the case where there is no data
        # For example, you might want to display a message to the user
        # or pass an empty list or dictionary to the template.
        print("No data available.")
        trade_data = {}  # or set it to an empty list if it's supposed to be a list
    else:
        trade_data = trade_data['data']
        


    if trade_data:
        for order in trade_data:
            # Extract the instrument_token and exchange for the current order
            symbol = order['tradingsymbol']
            exchange = order['exchange']
            
            # Use the get_symbol function to fetch the symbol from the database
            symbol_from_db = get_oa_symbol(symbol, exchange)
            
            # Check if a symbol was found; if so, update the trading_symbol in the current order
            if symbol_from_db:
                order['tradingsymbol'] = symbol_from_db
                if (order['exchange'] == 'NSE' or order['exchange'] == 'BSE') and order['producttype'] == 'DELIVERY':
                    order['producttype'] = 'CNC'
                               
                elif order['producttype'] == 'INTRADAY':
                    order['producttype'] = 'MIS'
                
                elif order['exchange'] in ['NFO', 'MCX', 'BFO', 'CDS'] and order['producttype'] == 'CARRYFORWARD':
                    order['producttype'] = 'NRML'
            else:
                print(f"Unable to find the symbol {symbol} and exchange {exchange}. Keeping original trading symbol.")
                
    return trade_data




def transform_tradebook_data(tradebook_data):
    transformed_data = []
    for trade in tradebook_data:
        transformed_trade = {
            "symbol": trade.get('tradingsymbol', ''),
            "exchange": trade.get('exchange', ''),
            "product": trade.get('producttype', ''),
            "action": trade.get('transactiontype', ''),
            "quantity": trade.get('quantity', 0),
            "average_price": trade.get('fillprice', 0.0),
            "trade_value": trade.get('tradevalue', 0),
            "orderid": trade.get('orderid', ''),
            "timestamp": trade.get('filltime', '')
        }
        transformed_data.append(transformed_trade)
    return transformed_data


def map_position_data(position_data):
    return map_order_data(position_data)


def transform_positions_data(positions_data):
    transformed_data = []
    for position in positions_data:
        transformed_position = {
            "symbol": position.get('tradingsymbol', ''),
            "exchange": position.get('exchange', ''),
            "product": position.get('producttype', ''),
            "quantity": position.get('quantity', 0),
            "average_price": position.get('avgnetprice', 0.0),
        }
        transformed_data.append(transformed_position)
    return transformed_data

def transform_holdings_data(holdings_data):
    transformed_data = []
    
    # Check if holdings_data is valid and has the expected structure
    if not holdings_data or not isinstance(holdings_data, dict):
        print("Invalid holdings data format: not a dictionary or empty")
        return transformed_data
    
    # Check if 'holdings' key exists
    if 'holdings' not in holdings_data:
        print("No 'holdings' key in holdings data")
        return transformed_data
    
    # Check if holdings is a list
    if not isinstance(holdings_data['holdings'], list):
        print(f"Expected holdings to be a list, but got {type(holdings_data['holdings'])}")
        return transformed_data
    
    # Process each holding
    for holdings in holdings_data['holdings']:
        transformed_position = {
            "symbol": holdings.get('tradingsymbol', ''),
            "exchange": holdings.get('exchange', ''),
            "quantity": holdings.get('quantity', 0),
            "product": holdings.get('product', ''),
            "pnl": holdings.get('profitandloss', 0.0),
            "pnlpercent": holdings.get('pnlpercentage', 0.0)
        }
        transformed_data.append(transformed_position)
    
    return transformed_data

def map_portfolio_data(portfolio_data):
    """
    Processes and modifies a list of Portfolio dictionaries based on specific conditions and
    ensures both holdings and totalholding parts are transmitted in a single response.
    
    Parameters:
    - portfolio_data: A dictionary, where keys are 'holdings' and 'totalholding',
                      and values are lists/dictionaries representing the portfolio information.
    
    Returns:
    - The modified portfolio_data with 'product' fields changed for 'holdings' and 'totalholding' included.
    """
    # Check if 'data' is None or doesn't contain 'holdings'
    if portfolio_data.get('data') is None or 'holdings' not in portfolio_data['data']:
        print("No data available.")
        # Return an empty structure or handle this scenario as needed
        return {}

    # Directly work with 'data' for clarity and simplicity
    data = portfolio_data['data']

    # Modify 'product' field for each holding if applicable
    if data.get('holdings'):
        for portfolio in data['holdings']:
            symbol = portfolio['tradingsymbol']
            exchange = portfolio['exchange']
            symbol_from_db = get_oa_symbol(symbol, exchange)
            
            # Check if a symbol was found; if so, update the trading_symbol in the current order
            if symbol_from_db:
                portfolio['tradingsymbol'] = symbol_from_db
            if portfolio['product'] == 'DELIVERY':
                portfolio['product'] = 'CNC'  # Modify 'product' field
            else:
                print("AngelOne Portfolio - Product Value for Delivery Not Found or Changed.")
    
    # The function already works with 'data', which includes 'holdings' and 'totalholding',
    # so we can return 'data' directly without additional modifications.
    return data


def calculate_portfolio_statistics(holdings_data):
    # Initialize default values
    totalholdingvalue = 0
    totalinvvalue = 0
    totalprofitandloss = 0
    totalpnlpercentage = 0
    
    # Check if holdings_data is valid and has the expected structure
    if not holdings_data or not isinstance(holdings_data, dict):
        print("Invalid holdings data format: not a dictionary or empty")
        return {
            'totalholdingvalue': totalholdingvalue,
            'totalinvvalue': totalinvvalue,
            'totalprofitandloss': totalprofitandloss,
            'totalpnlpercentage': totalpnlpercentage
        }
    
    # Check if 'totalholding' key exists
    if 'totalholding' not in holdings_data:
        print("No 'totalholding' key in holdings data")
        return {
            'totalholdingvalue': totalholdingvalue,
            'totalinvvalue': totalinvvalue,
            'totalprofitandloss': totalprofitandloss,
            'totalpnlpercentage': totalpnlpercentage
        }
    
    # Get values with fallback to defaults
    totalholding = holdings_data['totalholding']
    if isinstance(totalholding, dict):
        totalholdingvalue = totalholding.get('totalholdingvalue', 0)
        totalinvvalue = totalholding.get('totalinvvalue', 0)
        totalprofitandloss = totalholding.get('totalprofitandloss', 0)
        totalpnlpercentage = totalholding.get('totalpnlpercentage', 0)

    return {
        'totalholdingvalue': totalholdingvalue,
        'totalinvvalue': totalinvvalue,
        'totalprofitandloss': totalprofitandloss,
        'totalpnlpercentage': totalpnlpercentage
    }


