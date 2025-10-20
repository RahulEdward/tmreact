import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark/80 backdrop-blur-lg border-t border-gray-800 text-center py-4 text-gray-400 fixed bottom-0 left-0 right-0">
      <p>
        Copyright 2025 |{' '}
        <a 
          href="https://www.tradingmaven.in" 
          className="text-primary hover:text-blue-400 transition duration-150 ease-in-out" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          www.tradingmaven.in
        </a>
        {' '}| Trading Platform for Everyone
      </p>
    </footer>
  );
};

export default Footer;