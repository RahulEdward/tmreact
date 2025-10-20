# Design Document

## Overview

This design document outlines the architecture for creating a React.js frontend that will replace the existing Flask templates while keeping the Flask backend completely unchanged. The React application will consume the existing Flask routes and API endpoints, maintaining all current functionality while providing a modern, responsive user interface.

The design focuses on creating a React SPA that mirrors the exact functionality of the current Flask templates, using the existing backend infrastructure without any modifications to the Flask application code.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/WebSocket    ┌──────────────────┐
│   React SPA     │ ◄─────────────────► │ Existing Flask   │
│                 │                      │   Application    │
│ - Components    │                      │                  │
│ - State Mgmt    │                      │ - Templates      │
│ - Routing       │                      │ - Blueprints     │
│ - API Calls     │                      │ - Business Logic │
│ - WebSocket     │                      │ - Database       │
└─────────────────┘                      │ - Authentication │
                                         └──────────────────┘
```

### Frontend Architecture (React)

The React application will be built as a separate frontend that communicates with the existing Flask backend:

```
react-frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page-level components matching Flask routes
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer for Flask communication
│   ├── utils/          # Utility functions
│   ├── contexts/       # React contexts for state management
│   ├── types/          # TypeScript type definitions
│   └── assets/         # Static assets (CSS, images, sounds)
├── public/
└── package.json
```

### Backend Integration Strategy

The Flask backend remains completely unchanged. The React frontend will:
```

api/
├── auth/                # Authentication endpoints
├── dashboard/           # Dashboard data endpoints
├── orders/              # Order management endpoints
├── trading/             # Trading-related endpoints
└── admin/               # Administrative endpoints
```

## Components and Interfaces

### Core React Components

#### 1. Layout Components
- **AppLayout**: Main application wrapper with navigation and footer
- **Header**: Navigation bar with user menu and authentication state
- **Sidebar**: Navigation sidebar for authenticated users
- **Footer**: Application footer with branding and links

#### 2. Authentication Components
- **LoginForm**: User authentication form with Client ID, PIN, and TOTP fields
- **RegisterForm**: User registration form
- **ProtectedRoute**: Route wrapper for authenticated-only pages
- **AuthProvider**: Context provider for authentication state management

#### 3. Dashboard Components
- **Dashboard**: Main dashboard page container
- **MetricCard**: Reusable card component for displaying financial metrics
- **MarginData**: Component for displaying margin and balance information
- **RealTimeUpdates**: Component handling WebSocket connections for live data

#### 4. Trading Components
- **OrderBook**: Order book table with filtering and real-time updates
- **TradeBook**: Trade history table with search and pagination
- **Positions**: Current positions display with performance metrics
- **Holdings**: Portfolio holdings with statistics
- **OrderStats**: Statistics cards for order summaries

#### 5. Utility Components
- **DataTable**: Reusable table component with sorting and filtering
- **LoadingSpinner**: Loading state indicator
- **ErrorBoundary**: Error handling wrapper component
- **NotificationSystem**: Toast notifications for user feedback
- **WebSocketManager**: WebSocket connection management

### API Interface Design

#### Authentication Endpoints
```typescript
POST /api/auth/login
Request: { user_id: string, pin: string, totp: string }
Response: { token: string, user: UserData, expires_in: number }

POST /api/auth/logout
Request: { token: string }
Response: { success: boolean }

GET /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
Response: { valid: boolean, user: UserData }
```

#### Dashboard Endpoints
```typescript
GET /api/dashboard/margin
Headers: { Authorization: "Bearer <token>" }
Response: { 
  availablecash: string,
  collateral: string,
  m2munrealized: string,
  m2mrealized: string,
  utiliseddebits: string
}
```

#### Trading Endpoints
```typescript
GET /api/orders/orderbook
Headers: { Authorization: "Bearer <token>" }
Response: { orders: Order[], statistics: OrderStats }

GET /api/orders/tradebook
Headers: { Authorization: "Bearer <token>" }
Response: { trades: Trade[] }

GET /api/orders/positions
Headers: { Authorization: "Bearer <token>" }
Response: { positions: Position[] }

GET /api/orders/holdings
Headers: { Authorization: "Bearer <token>" }
Response: { holdings: Holding[], statistics: PortfolioStats }
```

## Data Models

### Frontend TypeScript Interfaces

```typescript
interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  apiKey: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface Order {
  symbol: string;
  exchange: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  trigger_price: number;
  pricetype: string;
  product: string;
  orderid: string;
  order_status: 'complete' | 'rejected' | 'open';
  timestamp: string;
}

interface MarginData {
  availablecash: string;
  collateral: string;
  m2munrealized: string;
  m2mrealized: string;
  utiliseddebits: string;
}

interface Position {
  symbol: string;
  exchange: string;
  product: string;
  quantity: number;
  average_price: number;
}
```

### State Management Strategy

The application will use React Context API for global state management:

1. **AuthContext**: Manages authentication state, user data, and token
2. **WebSocketContext**: Handles WebSocket connections and real-time updates
3. **NotificationContext**: Manages toast notifications and alerts
4. **ThemeContext**: Handles dark/light theme preferences

## Error Handling

### Frontend Error Handling
- **API Errors**: Centralized error handling in API service layer
- **Network Errors**: Retry mechanisms and offline state detection
- **Authentication Errors**: Automatic token refresh and logout handling
- **Component Errors**: Error boundaries to prevent app crashes
- **Validation Errors**: Form validation with user-friendly messages

### Backend Error Handling
- **Consistent Error Format**: Standardized JSON error responses
- **HTTP Status Codes**: Appropriate status codes for different error types
- **Error Logging**: Maintain existing logging mechanisms
- **CORS Handling**: Proper CORS configuration for React frontend

## Testing Strategy

### Frontend Testing
1. **Unit Tests**: Jest and React Testing Library for component testing
2. **Integration Tests**: Testing API integration and data flow
3. **E2E Tests**: Cypress for end-to-end user journey testing
4. **Accessibility Tests**: Automated accessibility testing with axe-core

### Backend Testing
1. **API Tests**: Maintain existing API endpoint tests
2. **Authentication Tests**: JWT token validation and security tests
3. **WebSocket Tests**: Real-time functionality testing
4. **Performance Tests**: API response time and load testing

### Testing Coverage Goals
- Frontend: 80% code coverage for components and utilities
- Backend: Maintain existing test coverage levels
- E2E: Cover all critical user journeys and workflows

## Security Considerations

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Token Storage**: Secure storage in httpOnly cookies or secure localStorage
- **Token Refresh**: Automatic token refresh mechanism
- **CORS Configuration**: Proper CORS setup for API access

### Data Protection
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Sanitization of user inputs and outputs
- **CSRF Protection**: CSRF tokens for state-changing operations
- **Secure Headers**: Implementation of security headers

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based code splitting for faster initial load
- **Lazy Loading**: Lazy loading of non-critical components
- **Memoization**: React.memo and useMemo for expensive operations
- **Bundle Optimization**: Webpack optimization for smaller bundle sizes

### Backend Optimization
- **Response Caching**: Implement caching for frequently accessed data
- **Database Optimization**: Maintain existing database optimization
- **Compression**: Enable gzip compression for API responses
- **Connection Pooling**: Optimize database connection management

## Migration Strategy

### Phase 1: Backend API Preparation
1. Modify existing Flask routes to return JSON responses
2. Implement JWT authentication system
3. Add CORS configuration
4. Update error handling for API responses

### Phase 2: React Application Setup
1. Create React application structure
2. Implement authentication system
3. Create core layout components
4. Set up routing and navigation

### Phase 3: Feature Migration
1. Migrate dashboard functionality
2. Migrate order book and trading features
3. Migrate user management features
4. Implement real-time WebSocket connections

### Phase 4: Testing and Deployment
1. Comprehensive testing of all features
2. Performance optimization
3. Security audit
4. Production deployment strategy

## Deployment Architecture

### Development Environment
- **Frontend**: React development server (localhost:3000)
- **Backend**: Flask development server (localhost:5000)
- **WebSocket**: Socket.IO for real-time communication

### Production Environment
- **Frontend**: Static files served by CDN or web server
- **Backend**: Flask API server with gunicorn
- **Reverse Proxy**: Nginx for routing and static file serving
- **SSL/TLS**: HTTPS encryption for all communications

This design ensures a smooth migration from Flask templates to React while maintaining all existing functionality and improving the overall user experience through modern web development practices.
1. **U
se existing Flask routes**: Make HTTP requests to current Flask endpoints that return HTML, then parse or use existing API endpoints
2. **Leverage existing API endpoints**: Use the `/api/v1/` endpoints that already return JSON
3. **Maintain session compatibility**: Work with Flask's existing session management
4. **Use existing WebSocket connections**: Connect to the existing SocketIO implementation
5. **Serve static assets**: Host React build files separately or integrate with Flask's static file serving

## Components and Interfaces

### Core Components

#### 1. Authentication Components
- **LoginForm**: Replaces `templates/login.html`
- **RegisterForm**: Replaces `templates/register.html`
- **ProtectedRoute**: Handles route protection and redirects

#### 2. Layout Components
- **Header**: Replaces navigation from `templates/base.html`
- **Footer**: Replaces footer from `templates/base.html`
- **Layout**: Main layout wrapper component

#### 3. Dashboard Components
- **Dashboard**: Replaces `templates/dashboard.html`
- **MarginCard**: Individual margin data display cards
- **StatsGrid**: Grid layout for financial statistics

#### 4. Trading Components
- **OrderBook**: Replaces `templates/orderbook.html`
- **TradeBook**: Replaces `templates/tradebook.html`
- **Positions**: Replaces `templates/positions.html`
- **Holdings**: Replaces `templates/holdings.html`
- **OrderTable**: Reusable table component for order data
- **StatsCards**: Statistics display components

#### 5. Utility Components
- **ApiKeyManager**: Replaces `templates/apikey.html`
- **LogViewer**: Replaces `templates/logs.html`
- **TokenSearch**: Replaces `templates/search.html`
- **TradingView**: Replaces `templates/tradingview.html`

### API Integration Layer

#### Service Classes
```typescript
class FlaskApiService {
  // Authentication
  login(credentials): Promise<AuthResponse>
  logout(): Promise<void>
  
  // Dashboard data
  getDashboardData(): Promise<MarginData>
  
  // Trading data
  getOrderBook(): Promise<OrderData[]>
  getTradeBook(): Promise<TradeData[]>
  getPositions(): Promise<PositionData[]>
  getHoldings(): Promise<HoldingData[]>
  
  // Utility functions
  getApiKeys(): Promise<ApiKeyData>
  getLogs(): Promise<LogData[]>
  searchTokens(query: string): Promise<TokenData[]>
}
```

#### WebSocket Integration
```typescript
class SocketService {
  connect(): void
  disconnect(): void
  onOrderEvent(callback): void
  onClosePosition(callback): void
  onCancelOrder(callback): void
  onModifyOrder(callback): void
}
```

## Data Models

### TypeScript Interfaces

```typescript
interface MarginData {
  availablecash: string
  collateral: string
  m2munrealized: string
  m2mrealized: string
  utiliseddebits: string
}

interface OrderData {
  symbol: string
  exchange: string
  action: string
  quantity: string
  price: string
  trigger_price: string
  pricetype: string
  product: string
  orderid: string
  order_status: string
  timestamp: string
}

interface OrderStats {
  total_buy_orders: number
  total_sell_orders: number
  total_completed_orders: number
  total_open_orders: number
  total_rejected_orders: number
}
```

## Error Handling

### Error Boundaries
- **GlobalErrorBoundary**: Catches and displays application-level errors
- **RouteErrorBoundary**: Handles route-specific errors
- **ComponentErrorBoundary**: Wraps individual components for isolated error handling

### Error States
- **NetworkError**: Handle Flask backend connectivity issues
- **AuthenticationError**: Handle session expiration and auth failures
- **DataError**: Handle malformed or missing data responses
- **ValidationError**: Handle form validation and input errors

## Testing Strategy

### Unit Testing
- **Component Testing**: Test individual React components with React Testing Library
- **Hook Testing**: Test custom hooks with React Hooks Testing Library
- **Service Testing**: Test API service classes with mocked Flask responses
- **Utility Testing**: Test utility functions and helpers

### Integration Testing
- **API Integration**: Test React components with actual Flask backend
- **WebSocket Testing**: Test real-time functionality with SocketIO
- **Authentication Flow**: Test complete login/logout workflows
- **Navigation Testing**: Test React Router integration

### End-to-End Testing
- **User Workflows**: Test complete user journeys from login to trading operations
- **Cross-browser Testing**: Ensure compatibility across different browsers
- **Responsive Testing**: Verify mobile and desktop layouts
- **Performance Testing**: Measure load times and responsiveness

## Deployment Strategy

### Development Setup
1. **Separate Development**: Run React dev server alongside Flask application
2. **Proxy Configuration**: Configure React dev server to proxy API calls to Flask
3. **Hot Reloading**: Maintain fast development feedback loop

### Production Deployment
1. **Build Integration**: Build React app and serve static files through Flask
2. **Route Handling**: Configure Flask to serve React app for frontend routes
3. **Asset Optimization**: Optimize bundle size and loading performance

### Migration Approach
1. **Parallel Development**: Develop React components while Flask app remains operational
2. **Feature Parity**: Ensure each React component matches Flask template functionality
3. **Gradual Rollout**: Option to switch between Flask templates and React components
4. **Fallback Strategy**: Maintain Flask templates as backup during transition