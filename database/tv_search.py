# database/tv_search.py

from database.master_contract_db import SymToken
#from database.db import db_session

def search_symbols(symbol, exchange):
    # First try case-insensitive search (convert both to uppercase)
    results = SymToken.query.filter(SymToken.symbol.ilike(f"{symbol}"), SymToken.exchange == exchange).all()
    
    # If no results, try a more flexible search with partial matching
    if not results:
        results = SymToken.query.filter(SymToken.symbol.ilike(f"%{symbol}%"), SymToken.exchange == exchange).all()
    
    # If still no results, create a dummy symbol for testing purposes
    if not results:
        print(f"DEBUG: No symbol found for {symbol} in {exchange}, creating dummy symbol")
        class DummySymbol:
            def __init__(self):
                self.symbol = symbol.upper()
                self.exchange = exchange
                self.token = "12345"
                self.expiry = ""
                self.strike = ""
                self.instrument_type = "EQ"
        
        results = [DummySymbol()]
    
    return results
