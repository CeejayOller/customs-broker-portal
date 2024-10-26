// src/components/admin/sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Package, 
  Users, 
  TrendingUp,
  Settings,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-6 px-2">Broker Dashboard</h2>
        <nav>
          <ul className="space-y-1">
            {/* Overview */}
            <li>
              <Link 
                href="/admin/admin"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin') && !isActive('/admin/admin/import') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Overview
              </Link>
            </li>

            {/* Import Clearance */}
            <li>
              <Link 
                href="/admin/admin/import/clearance"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin/import') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <ArrowDownToLine className="w-5 h-5 mr-3" />
                Import Clearance
              </Link>
            </li>

            {/* Export Clearance */}
            <li>
              <Link 
                href="/admin/admin/export"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin/export') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <ArrowUpFromLine className="w-5 h-5 mr-3" />
                Export Clearance
              </Link>
            </li>

            {/* Shipments */}
            <li>
              <Link 
                href="/admin/admin/shipments"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin/shipments') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                Shipments
              </Link>
            </li>

            {/* Documents */}
            <li>
              <Link 
                href="/admin/admin/documents"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin/documents') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <FileText className="w-5 h-5 mr-3" />
                Documents
              </Link>
            </li>

            {/* Importers/Clients */}
            <li>
              <Link 
                href="/admin/admin/clients"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin/clients') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Importers
              </Link>
            </li>

            {/* Reports */}
            <li>
              <Link 
                href="/admin/admin/reports"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin/reports') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <ClipboardList className="w-5 h-5 mr-3" />
                Reports
              </Link>
            </li>

            {/* Settings */}
            <li>
              <Link 
                href="/admin/admin/settings"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/admin/admin/settings') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}