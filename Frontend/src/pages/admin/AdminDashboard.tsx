import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  ShoppingBagIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface AdminStats {
  totalUsers: number;
  totalItems: number;
  totalSwaps: number;
  pendingReports: number;
  activeUsers: number;
  newUsersToday: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: "user_joined" | "item_listed" | "swap_completed" | "report_filed";
  description: string;
  timestamp: Date;
  user?: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockStats: AdminStats = {
          totalUsers: 1247,
          totalItems: 3456,
          totalSwaps: 892,
          pendingReports: 12,
          activeUsers: 234,
          newUsersToday: 15,
          recentActivity: [
            {
              id: "1",
              type: "user_joined",
              description: "New user Emma Wilson joined",
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              user: "Emma Wilson",
            },
            {
              id: "2",
              type: "item_listed",
              description: "New item listed: Vintage Leather Jacket",
              timestamp: new Date(Date.now() - 45 * 60 * 1000),
              user: "Sarah Chen",
            },
            {
              id: "3",
              type: "swap_completed",
              description: "Swap completed between Maya P. and John D.",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
              id: "4",
              type: "report_filed",
              description: "Report filed for inappropriate content",
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            },
          ],
        };

        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setLoading(false);
    }
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "user_joined":
        return <UsersIcon className="h-5 w-5 text-green-500" />;
      case "item_listed":
        return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
      case "swap_completed":
        return <ArrowsRightLeftIcon className="h-5 w-5 text-purple-500" />;
      case "report_filed":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <EyeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load dashboard
          </h1>
          <p className="text-gray-600">Unable to fetch admin statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage the ReWear platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{stats.newUsersToday} today
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalItems.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {stats.activeUsers} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalSwaps.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600 mt-1">This month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ArrowsRightLeftIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Reports
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.pendingReports}
                </p>
                <p className="text-sm text-red-600 mt-1">Needs attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                        {activity.user && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <p className="text-xs text-gray-500">
                              {activity.user}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Manage Users</span>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105">
                  <div className="flex items-center">
                    <ShoppingBagIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Review Items</span>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Handle Reports</span>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">View Analytics</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Platform Health */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Platform Health
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User Engagement</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-20"></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      84%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Swap Success Rate
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-20"></div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      92%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full w-24"></div>
                    </div>
                    <span className="text-sm font-medium text-purple-600">
                      99.9%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Content Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-18"></div>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      87%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="mt-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Platform Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <ChartBarIcon className="h-6 w-6 mr-2" />
                  <p className="text-2xl font-bold">15%</p>
                </div>
                <p className="text-sm opacity-90">User Growth (Monthly)</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <ChartBarIcon className="h-6 w-6 mr-2" />
                  <p className="text-2xl font-bold">28%</p>
                </div>
                <p className="text-sm opacity-90">Item Listings (Monthly)</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <ArrowsRightLeftIcon className="h-6 w-6 mr-2" />
                  <p className="text-2xl font-bold">35%</p>
                </div>
                <p className="text-sm opacity-90">Swap Activity (Monthly)</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <UsersIcon className="h-6 w-6 mr-2" />
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <p className="text-sm opacity-90">User Retention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
