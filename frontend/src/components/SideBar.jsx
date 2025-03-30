import React from 'react';
import image from '../assets/man.png'

export const SideBar = () => {
  return (
    <div className="sidebar-container fixed left-0 top-20 h-full w-20 md:w-24 bg-white border-r border-gray-200 flex flex-col">
      {/* User Profile */}
      <div className="user-profile flex flex-col items-center justify-center py-4 border-b border-gray-200">
        <div className="avatar bg-orange-400 rounded-md p-1 w-16 h-16 flex items-center justify-center mb-2">
          <img src={image} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium">Krishna Shrestha</h3>
          <p className="text-xs text-gray-600">I'm a Cashier 😀</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-items flex-1 flex flex-col">
        <div className="menu-item flex flex-col items-center justify-center py-4 text-gray-500">
          <div className="icon-container w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2" />
            </svg>
          </div>
          <span className="text-xs mt-1">Home</span>
        </div>
        
        <div className="menu-item flex flex-col items-center justify-center py-4 bg-green-500 text-white">
          <div className="icon-container w-10 h-10 flex items-center justify-center relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
          <span className="text-xs mt-1">Order</span>
        </div>
        
        <div className="menu-item flex flex-col items-center justify-center py-4 text-gray-500">
          <div className="icon-container w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span className="text-xs mt-1">Menu</span>
        </div>
        
        <div className="menu-item flex flex-col items-center justify-center py-4 text-gray-500">
          <div className="icon-container w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Wallet</span>
        </div>
        
        <div className="menu-item flex flex-col items-center justify-center py-4 text-gray-500">
          <div className="icon-container w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-xs mt-1">History</span>
        </div>
        
        <div className="menu-item flex flex-col items-center justify-center py-4 text-gray-500">
          <div className="icon-container w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <span className="text-xs mt-1">Promos</span>
        </div>
        
        <div className="menu-item flex flex-col items-center justify-center py-4 text-gray-500">
          <div className="icon-container w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Bills</span>
        </div>
        
        <div className="menu-item flex flex-col items-center justify-center py-4 text-gray-500">
          <div className="icon-container w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Setting</span>
        </div>
      </div>

      {/* Chef Image */}
      <div className="chef-image py-4 px-2 flex justify-center">
        <div className="bg-green-500 rounded-md p-2">
          <img src="/api/placeholder/80/80" alt="Chef" className="w-16 h-16" />
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle p-4 border-t border-gray-200">
        <div className="bg-gray-300 rounded-full p-1 flex">
          <button className="flex-1 rounded-full p-1 flex items-center justify-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span className="ml-1 text-xs">Dark</span>
          </button>
          <button className="flex-1 bg-white rounded-full p-1 flex items-center justify-center shadow-sm text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-xs">Light</span>
          </button>
        </div>
      </div>
    </div>
  );
};