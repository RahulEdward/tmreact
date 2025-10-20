import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    const baseClass = "px-3 py-2 rounded-md font-medium transition-all duration-200";
    const activeClass = "text-primary bg-primary/20";
    const inactiveClass = "text-primary hover:bg-primary/20 hover:text-primary";
    
    return `${baseClass} ${isActiveRoute(path) ? activeClass : inactiveClass}`;
  };

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4rem'
        }}>
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link to={isAuthenticated ? "/dashboard" : "/"} style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: 'white',
                marginRight: '0.75rem'
              }}>
                TM
              </div>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                TradingMaven
              </span>
            </Link>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div style={{
            display: 'none',
            '@media (min-width: 768px)': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/orderbook" className={navLinkClass('/orderbook')}>
                  Orderbook
                </Link>
                <Link to="/tradebook" className={navLinkClass('/tradebook')}>
                  Tradebook
                </Link>
                <Link to="/positions" className={navLinkClass('/positions')}>
                  Positions
                </Link>
                <Link to="/holdings" className={navLinkClass('/holdings')}>
                  Holdings
                </Link>
                <Link to="/tradingview" className={navLinkClass('/tradingview')}>
                  Tradingview
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className={navLinkClass('/')}>
                  Home
                </Link>
                <Link to="/about" className={navLinkClass('/about')}>
                  About Us
                </Link>
              </>
            )}
          </div>
          
          {/* Auth buttons / Profile menu */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="text-blue-400 px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-blue-900/20"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 hover:bg-blue-800"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center border border-purple-600 text-purple-400 px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-purple-800/50"
                >
                  <span>More</span>
                  <svg 
                    className="ml-1 h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-dark rounded-md shadow-xl z-20 border border-gray-700">
                    <Link 
                      to="/apikey" 
                      className="block px-4 py-2 text-sm text-primary hover:bg-primary/20"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      ApiKey
                    </Link>
                    <Link 
                      to="/logs" 
                      className="block px-4 py-2 text-sm text-primary hover:bg-primary/20"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Logs
                    </Link>
                    <Link 
                      to="/search" 
                      className="block px-4 py-2 text-sm text-primary hover:bg-primary/20"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Search
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-lg border-b border-gray-800 p-4">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/orderbook" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Orderbook
                </Link>
                <Link 
                  to="/tradebook" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tradebook
                </Link>
                <Link 
                  to="/positions" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Positions
                </Link>
                <Link 
                  to="/holdings" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Holdings
                </Link>
                <Link 
                  to="/tradingview" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tradingview
                </Link>
                <Link 
                  to="/apikey" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ApiKey
                </Link>
                <Link 
                  to="/logs" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Logs
                </Link>
                <Link 
                  to="/search" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Search
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-purple-400 hover:bg-purple-800/20 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-primary hover:bg-primary/20 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/login" 
                  className="text-purple-400 hover:bg-purple-800/20 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="text-purple-400 hover:bg-purple-800/20 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;