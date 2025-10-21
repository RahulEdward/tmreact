// Authentication types
export interface LoginCredentials {
  user_id: string;
  pin: string;
  totp: string;
}

export interface AuthResponse {
  status: string;
  message?: string;
  redirect?: string;
}

// Dashboard/Margin data types
export interface MarginData {
  availablecash: string;
  collateral: string;
  m2munrealized: string;
  m2mrealized: string;
  utiliseddebits: string;
  net?: string;
}

// Order data types
export interface OrderData {
  symbol: string;
  exchange: string;
  action: string;
  quantity: string;
  price: string;
  trigger_price: string;
  pricetype: string;
  product: string;
  orderid: string;
  order_status: string;
  timestamp: string;
}

export interface OrderStats {
  total_buy_orders: number;
  total_sell_orders: number;
  total_completed_orders: number;
  total_open_orders: number;
  total_rejected_orders: number;
}

// Trade data types
export interface TradeData {
  symbol: string;
  exchange: string;
  product: string;
  action: string;
  quantity: string;
  average_price: string;
  trade_value: string;
  orderid: string;
  timestamp: string;
}

// Position data types
export interface PositionData {
  symbol: string;
  exchange: string;
  product: string;
  quantity: string;
  average_price: string;
}

// Holdings data types
export interface HoldingData {
  symbol: string;
  exchange: string;
  quantity: string;
  product: string;
  pnl: string;
  pnlpercent: number;
}

// Portfolio statistics
export interface PortfolioStats {
  totalholdingvalue: number;
  totalinvvalue: number;
  totalprofitandloss: number;
  totalpnlpercentage: number;
}

// API response wrapper
export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}

// WebSocket event types
export interface OrderEvent {
  symbol: string;
  action: string;
  orderid: string;
}

export interface ClosePositionEvent {
  status: string;
  message: string;
}

export interface CancelOrderEvent {
  status: string;
  orderid: string;
  message?: string;
}

export interface ModifyOrderEvent {
  status: string;
  orderid: string;
  message?: string;
}