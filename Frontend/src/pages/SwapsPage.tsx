import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowsRightLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface SwapRequest {
  id: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  type: "incoming" | "outgoing";
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  yourItem: {
    id: string;
    title: string;
    image: string;
  };
  theirItem: {
    id: string;
    title: string;
    image: string;
  };
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

const SwapsPage: React.FC = () => {
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    "all"
  );
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockSwaps: SwapRequest[] = [
          {
            id: "1",
            status: "pending",
            type: "incoming",
            otherUser: {
              id: "user1",
              name: "Emma Wilson",
              avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              rating: 4.8,
            },
            yourItem: {
              id: "item1",
              title: "Vintage Denim Jacket",
              image:
                "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            },
            theirItem: {
              id: "item2",
              title: "Floral Summer Dress",
              image:
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            },
            message:
              "Hi! I love your denim jacket. Would you be interested in swapping for my dress?",
            createdAt: "2024-01-20T10:30:00Z",
          },
          {
            id: "2",
            status: "accepted",
            type: "outgoing",
            otherUser: {
              id: "user2",
              name: "Sarah Chen",
              avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              rating: 4.9,
            },
            yourItem: {
              id: "item3",
              title: "Leather Ankle Boots",
              image:
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            },
            theirItem: {
              id: "item4",
              title: "Cozy Knit Sweater",
              image:
                "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            },
            message: "Your boots look amazing! Perfect for the season.",
            createdAt: "2024-01-18T14:20:00Z",
            updatedAt: "2024-01-18T16:45:00Z",
          },
          {
            id: "3",
            status: "completed",
            type: "incoming",
            otherUser: {
              id: "user3",
              name: "Maya Patel",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              rating: 4.7,
            },
            yourItem: {
              id: "item5",
              title: "Silk Blouse",
              image:
                "https://images.unsplash.com/photo-1564584217132-2271339c9c7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            },
            theirItem: {
              id: "item6",
              title: "High-waisted Jeans",
              image:
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            },
            createdAt: "2024-01-15T09:15:00Z",
            updatedAt: "2024-01-16T11:30:00Z",
          },
        ];

        setSwaps(mockSwaps);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching swaps:", error);
      toast.error("Failed to load swap requests");
      setLoading(false);
    }
  };

  const handleSwapAction = async (
    swapId: string,
    action: "accept" | "reject"
  ) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSwaps((prevSwaps) =>
        prevSwaps.map((swap) =>
          swap.id === swapId
            ? {
                ...swap,
                status: action === "accept" ? "accepted" : "rejected",
                updatedAt: new Date().toISOString(),
              }
            : swap
        )
      );

      toast.success(`Swap request ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing swap:`, error);
      toast.error(`Failed to ${action} swap request`);
    }
  };

  const getStatusIcon = (status: SwapRequest["status"]) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "accepted":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SwapRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: SwapRequest["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const filteredSwaps = swaps.filter((swap) => {
    switch (activeTab) {
      case "pending":
        return swap.status === "pending";
      case "completed":
        return swap.status === "completed";
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-gray-600">
            Manage your swap requests and track exchanges
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "all"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All Swaps ({swaps.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "pending"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending ({swaps.filter((s) => s.status === "pending").length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "completed"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Completed (
                {swaps.filter((s) => s.status === "completed").length})
              </button>
            </nav>
          </div>

          {/* Swap List */}
          <div className="p-6">
            {filteredSwaps.length > 0 ? (
              <div className="space-y-6">
                {filteredSwaps.map((swap) => (
                  <div
                    key={swap.id}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                  >
                    {/* Swap Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          {swap.otherUser.avatar ? (
                            <img
                              src={swap.otherUser.avatar}
                              alt={swap.otherUser.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-full h-full text-gray-400 p-2" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {swap.otherUser.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {swap.type === "incoming"
                                ? "Wants to swap with you"
                                : "You requested to swap"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                swap.status
                              )}`}
                            >
                              {getStatusText(swap.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(swap.status)}
                        <button
                          onClick={() => {
                            setSelectedSwap(swap);
                            setShowDetails(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Items Swap */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex-1 max-w-xs">
                        <div className="text-center">
                          <img
                            src={swap.yourItem.image}
                            alt={swap.yourItem.title}
                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                          />
                          <p className="text-sm font-medium text-gray-900">
                            {swap.yourItem.title}
                          </p>
                          <p className="text-xs text-gray-500">Your item</p>
                        </div>
                      </div>

                      <div className="px-4">
                        <ArrowsRightLeftIcon className="h-8 w-8 text-green-500" />
                      </div>

                      <div className="flex-1 max-w-xs">
                        <div className="text-center">
                          <img
                            src={swap.theirItem.image}
                            alt={swap.theirItem.title}
                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                          />
                          <p className="text-sm font-medium text-gray-900">
                            {swap.theirItem.title}
                          </p>
                          <p className="text-xs text-gray-500">Their item</p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {swap.message && (
                      <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-start space-x-2">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            {swap.message}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions and Timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(swap.createdAt)}</span>
                        {swap.updatedAt &&
                          swap.updatedAt !== swap.createdAt && (
                            <span>• Updated {formatDate(swap.updatedAt)}</span>
                          )}
                      </div>

                      {swap.status === "pending" &&
                        swap.type === "incoming" && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() =>
                                handleSwapAction(swap.id, "reject")
                              }
                              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() =>
                                handleSwapAction(swap.id, "accept")
                              }
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Accept
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ArrowsRightLeftIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No swaps found
                </h3>
                <p className="text-gray-600">
                  {activeTab === "pending" &&
                    "No pending swap requests at the moment."}
                  {activeTab === "completed" && "No completed swaps yet."}
                  {activeTab === "all" &&
                    "Start browsing items to make your first swap!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap Details Modal */}
      {showDetails && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Swap Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close details"
                  aria-label="Close swap details modal"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Detailed view content here - similar to the list item but with more details */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    Swap with {selectedSwap.otherUser.name}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedSwap.status
                    )}`}
                  >
                    {getStatusText(selectedSwap.status)}
                  </span>
                </div>

                <div className="text-center text-gray-600">
                  <p>Created: {formatDate(selectedSwap.createdAt)}</p>
                  {selectedSwap.updatedAt && (
                    <p>Updated: {formatDate(selectedSwap.updatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapsPage;
