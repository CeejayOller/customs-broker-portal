// src/components/admin/header.tsx
"use client";

import { Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">CLEX Customs Brokerage</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-800 rounded-full relative text-gray-300 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Profile */}
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white">
            <User className="w-5 h-5" />
            <span>Broker</span>
          </button>
        </div>
      </div>
    </header>
  );
}