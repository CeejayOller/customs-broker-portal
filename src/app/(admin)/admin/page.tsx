// src/app/(admin)/admin/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Package, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowDownToLine,
  DollarSign
} from "lucide-react";

// You might want to move these to a separate file later
interface Activity {
  text: string;
  time: string;
}

interface Alert {
  text: string;
  severity: 'high' | 'medium' | 'low';
}

const RECENT_ACTIVITIES: Activity[] = [
  { text: "New import clearance request from Client A", time: "2 hours ago" },
  { text: "Documents verified for shipment XYZ", time: "4 hours ago" },
  { text: "Duty payment completed for ABC Corp", time: "5 hours ago" },
  { text: "Shipment cleared at customs for JKL Trading", time: "1 day ago" },
];

const ALERTS: Alert[] = [
  { text: "Urgent: Documents needed for shipment DEF", severity: "high" },
  { text: "Payment deadline approaching for XYZ Corp", severity: "medium" },
  { text: "BOC inspection scheduled for tomorrow", severity: "high" },
  { text: "New regulation update from customs", severity: "low" },
];

const STATS_CARDS = [
  {
    title: "Active Shipments",
    value: "12",
    icon: <Package className="w-6 h-6 text-blue-600" />,
    bgColor: "bg-blue-100"
  },
  {
    title: "Pending Clearance",
    value: "5",
    icon: <Clock className="w-6 h-6 text-yellow-600" />,
    bgColor: "bg-yellow-100"
  },
  {
    title: "Completed This Month",
    value: "28",
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    bgColor: "bg-green-100"
  },
  {
    title: "Revenue This Month",
    value: "₱156,800",
    icon: <DollarSign className="w-6 h-6 text-purple-600" />,
    bgColor: "bg-purple-100"
  }
];

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {STATS_CARDS.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity, index) => (
                <div key={index} className="flex items-start justify-between pb-4 border-b last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Notifications */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Alerts & Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ALERTS.map((alert, index) => (
                <div key={index} className="flex items-start justify-between pb-4 border-b last:border-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="text-sm text-gray-700">{alert.text}</p>
                      <p className="text-xs text-gray-500">{alert.severity.toUpperCase()} Priority</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}