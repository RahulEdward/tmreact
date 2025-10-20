import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import EnterpriseLanding from './pages/EnterpriseLanding';
import Login from './pages/Login';
import Register from './pages/Register';
import CleanDashboard from './pages/CleanDashboard';
import CleanOrderBook from './pages/CleanOrderBook';
import TradeBook from './pages/TradeBook';
import Positions from './pages/Positions';
import Holdings from './pages/Holdings';
import ApiKey from './pages/ApiKey';
import CleanLogs from './pages/CleanLogs';
import Search from './pages/Search';
import TradingView from './pages/TradingView';

// Import layout components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Import notification components
import NotificationContainer from './components/NotificationContainer';
import ErrorBoundary from './components/ErrorBoundary';

const App: FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Router>
              <div className="App">
                <NotificationContainer />
                <Routes>
            {/* Public routes */}
            <Route path="/" element={<EnterpriseLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout>
                  <CleanDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <CleanDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/orderbook" element={
              <ProtectedRoute>
                <Layout>
                  <CleanOrderBook />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tradebook" element={
              <ProtectedRoute>
                <Layout>
                  <TradeBook />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/positions" element={
              <ProtectedRoute>
                <Layout>
                  <Positions />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/holdings" element={
              <ProtectedRoute>
                <Layout>
                  <Holdings />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/apikey" element={
              <ProtectedRoute>
                <Layout>
                  <ApiKey />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/logs" element={
              <ProtectedRoute>
                <Layout>
                  <CleanLogs />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/search" element={
              <ProtectedRoute>
                <Layout>
                  <Search />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tradingview" element={
              <ProtectedRoute>
                <Layout>
                  <TradingView />
                </Layout>
              </ProtectedRoute>
            } />
                </Routes>
              </div>
            </Router>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;