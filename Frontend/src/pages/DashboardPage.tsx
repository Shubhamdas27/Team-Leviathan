import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowRightIcon,
  UsersIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalItems: number;
  activeSwaps: number;
  completedSwaps: number;
  points: number;
}

interface RecentActivity {
  id: string;
  type: "item_added" | "swap_requested" | "swap_completed" | "item_liked";
  description: string;
  timestamp: Date;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    activeSwaps: 0,
    completedSwaps: 0,
    points: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalItems: 12,
          activeSwaps: 3,
          completedSwaps: 8,
          points: 150,
        });

        setRecentActivity([
          {
            id: "1",
            type: "item_added",
            description: "Added new item: Vintage Denim Jacket",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
          {
            id: "2",
            type: "swap_completed",
            description: "Completed swap with Sarah M.",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          },
          {
            id: "3",
            type: "swap_requested",
            description: "New swap request for your Floral Dress",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          },
          {
            id: "4",
            type: "item_liked",
            description: "Someone liked your Leather Boots",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "item_added":
        return <PlusIcon className="h-5 w-5 text-green-500" />;
      case "swap_requested":
        return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
      case "swap_completed":
        return <SparklesIcon className="h-5 w-5 text-purple-500" />;
      case "item_liked":
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      default:
        return <PlusIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your sustainable fashion journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalItems}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Swaps
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeSwaps}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Swaps
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completedSwaps}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Points Earned
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.points}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/add-item")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <PlusIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Add New Item</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>

                <button
                  onClick={() => navigate("/browse")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <ShoppingBagIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Browse Items</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>

                <button
                  onClick={() => navigate("/swaps")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">View Swaps</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">My Profile</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
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
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No recent activity yet. Start by adding an item!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sustainability Impact */}
        <div className="mt-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Your Sustainability Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold">
                  {stats.completedSwaps * 2.5}kg
                </p>
                <p className="text-sm opacity-90">CO₂ Saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {stats.completedSwaps * 150}L
                </p>
                <p className="text-sm opacity-90">Water Saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.totalItems}</p>
                <p className="text-sm opacity-90">Items Reused</p>
              </div>
            </div>
            <p className="mt-4 text-sm opacity-90">
              Keep up the great work! Every swap helps build a more sustainable
              future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
