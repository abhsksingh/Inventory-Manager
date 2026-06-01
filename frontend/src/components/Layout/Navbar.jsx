import React from 'react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/customers': 'Customers',
  '/orders': 'Orders',
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const title = titles[location.pathname] || 'Inventory Manager';

  return (
    <header className="flex h-16 items-center border-b bg-white px-4 shadow-sm md:px-6">
      <button className="mr-4 text-gray-600 md:hidden" onClick={onMenuClick}>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </header>
  );
}
