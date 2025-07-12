import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  status: "active" | "suspended" | "banned";
  itemsCount: number;
  swapsCount: number;
  rating: number;
  lastActive: string;
  reports: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended" | "banned"
  >("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: "1",
            name: "Emma Wilson",
            email: "emma.wilson@example.com",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            joinDate: "2024-01-15",
            status: "active",
            itemsCount: 12,
            swapsCount: 8,
            rating: 4.8,
            lastActive: "2024-01-20T10:30:00Z",
            reports: 0,
          },
          {
            id: "2",
            name: "Sarah Chen",
            email: "sarah.chen@example.com",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            joinDate: "2024-01-10",
            status: "active",
            itemsCount: 18,
            swapsCount: 15,
            rating: 4.9,
            lastActive: "2024-01-20T08:15:00Z",
            reports: 0,
          },
          {
            id: "3",
            name: "Maya Patel",
            email: "maya.patel@example.com",
            joinDate: "2024-01-05",
            status: "suspended",
            itemsCount: 5,
            swapsCount: 2,
            rating: 3.2,
            lastActive: "2024-01-18T14:20:00Z",
            reports: 3,
          },
          {
            id: "4",
            name: "John Doe",
            email: "john.doe@example.com",
            joinDate: "2023-12-20",
            status: "banned",
            itemsCount: 0,
            swapsCount: 0,
            rating: 1.5,
            lastActive: "2024-01-10T12:00:00Z",
            reports: 8,
          },
        ];

        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: User["status"]
  ) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "suspended":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case "banned":
        return <NoSymbolIcon className="h-4 w-4 text-red-500" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage user accounts and monitor platform activity
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                title="Filter users by status"
                aria-label="Filter users by status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredUsers.length} of {users.length} users
              </span>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2">
                <UserPlusIcon className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UsersIcon className="w-full h-full text-gray-400 p-2" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>{user.itemsCount} items</div>
                        <div>{user.swapsCount} swaps</div>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{user.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastActive(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          user.reports > 0 ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {user.reports}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="View user details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>

                        {user.status === "active" && (
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "suspended")
                            }
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Suspend user"
                          >
                            <ExclamationTriangleIcon className="h-4 w-4" />
                          </button>
                        )}

                        {user.status === "suspended" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, "active")
                              }
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Activate user"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, "banned")
                              }
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Ban user"
                            >
                              <NoSymbolIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {user.status === "banned" && (
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "active")
                            }
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Unban user"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No users match the selected filters"}
              </p>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    User Details
                  </h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Close user details"
                    aria-label="Close user details modal"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {selectedUser.avatar ? (
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UsersIcon className="w-full h-full text-gray-400 p-3" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedUser.name}
                      </h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(selectedUser.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            selectedUser.status
                          )}`}
                        >
                          {selectedUser.status.charAt(0).toUpperCase() +
                            selectedUser.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Join Date
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedUser.joinDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Active
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatLastActive(selectedUser.lastActive)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Items Listed
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.itemsCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Swaps Completed
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.swapsCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Rating
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.rating} ★
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Reports
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          selectedUser.reports > 0
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {selectedUser.reports}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
