import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  routeName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class RouteErrorBoundaryClass extends Component<Props & { navigate: (path: string) => void }, State> {
  constructor(props: Props & { navigate: (path: string) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`RouteErrorBoundary caught an error in ${this.props.routeName || 'unknown route'}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    this.props.navigate('/dashboard');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-96 p-4">
          <div className="bg-dark/80 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-red-600 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4">
                <svg className="mx-auto h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Page Error
              </h3>
              
              <p className="text-gray-400 mb-4">
                {this.props.routeName ? `The ${this.props.routeName} page` : 'This page'} encountered an error and couldn't load properly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-sm transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded text-sm transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to use React Router hook
const RouteErrorBoundary: React.FC<Props> = ({ children, routeName }) => {
  const navigate = useNavigate();
  return (
    <RouteErrorBoundaryClass navigate={navigate} routeName={routeName}>
      {children}
    </RouteErrorBoundaryClass>
  );
};

export default RouteErrorBoundary;