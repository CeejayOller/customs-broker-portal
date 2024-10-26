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

  const routes = [
    {
      href: '/admin',  // Changed from '/admin/admin'
      icon: <TrendingUp className="w-5 h-5 mr-3" />,
      label: 'Overview',
      exact: true
    },
    {
      href: '/admin/import', // Changed from '/admin/admin/import'
      icon: <ArrowDownToLine className="w-5 h-5 mr-3" />,
      label: 'Import Clearance'
    },
    {
      href: '/admin/export', // Changed from '/admin/admin/export'
      icon: <ArrowUpFromLine className="w-5 h-5 mr-3" />,
      label: 'Export Clearance'
    },
    {
      href: '/admin/shipments', // Changed from '/admin/admin/shipments'
      icon: <Package className="w-5 h-5 mr-3" />,
      label: 'Shipments'
    },
    {
      href: '/admin/documents', // Changed from '/admin/admin/documents'
      icon: <FileText className="w-5 h-5 mr-3" />,
      label: 'Documents'
    },
    {
      href: '/admin/clients', // Changed from '/admin/admin/clients'
      icon: <Users className="w-5 h-5 mr-3" />,
      label: 'Importers'
    },
    {
      href: '/admin/reports', // Changed from '/admin/admin/reports'
      icon: <ClipboardList className="w-5 h-5 mr-3" />,
      label: 'Reports'
    },
    {
      href: '/admin/settings', // Changed from '/admin/admin/settings'
      icon: <Settings className="w-5 h-5 mr-3" />,
      label: 'Settings'
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-6 px-2">Broker Dashboard</h2>
        <nav>
          <ul className="space-y-1">
            {routes.map((route) => (
              <li key={route.href}>
                <Link 
                  href={route.href}
                  className={`flex items-center p-2 rounded-lg ${
                    isActive(route.href) && (!route.exact || pathname === route.href)
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {route.icon}
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}