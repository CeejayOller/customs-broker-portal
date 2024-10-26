// src/app/(admin)/layout.tsx
import React from 'react';
import Sidebar from '@/components/admin/sidebar';
import Header from '@/components/admin/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}