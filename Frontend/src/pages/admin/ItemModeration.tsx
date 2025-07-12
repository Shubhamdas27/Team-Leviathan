import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  brand: string;
  images: string[];
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: "pending" | "approved" | "rejected" | "flagged";
  submittedAt: string;
  moderatedAt?: string;
  reports: number;
  flagReason?: string;
}

const ItemModeration: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "flagged"
  >("all");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockItems: Item[] = [
          {
            id: "1",
            title: "Vintage Denim Jacket",
            description:
              "Classic 90s denim jacket in excellent condition. Barely worn, no stains or tears.",
            category: "Outerwear",
            size: "M",
            condition: "Excellent",
            brand: "Levi's",
            images: [
              "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            ],
            owner: {
              id: "user1",
              name: "Emma Wilson",
              email: "emma.wilson@example.com",
              avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            status: "pending",
            submittedAt: "2024-01-20T10:30:00Z",
            reports: 0,
          },
          {
            id: "2",
            title: "Floral Summer Dress",
            description:
              "Beautiful floral dress perfect for summer. Light and comfortable material.",
            category: "Dresses",
            size: "S",
            condition: "Like New",
            brand: "Zara",
            images: [
              "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            ],
            owner: {
              id: "user2",
              name: "Sarah Chen",
              email: "sarah.chen@example.com",
              avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            status: "approved",
            submittedAt: "2024-01-19T14:20:00Z",
            moderatedAt: "2024-01-19T15:30:00Z",
            reports: 0,
          },
          {
            id: "3",
            title: "Designer Handbag",
            description:
              "Luxury handbag in pristine condition. Authentic with certificate.",
            category: "Bags",
            size: "One Size",
            condition: "Like New",
            brand: "Gucci",
            images: [
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            ],
            owner: {
              id: "user3",
              name: "Maya Patel",
              email: "maya.patel@example.com",
            },
            status: "flagged",
            submittedAt: "2024-01-18T09:15:00Z",
            reports: 3,
            flagReason: "Suspected counterfeit item",
          },
          {
            id: "4",
            title: "Inappropriate Content Item",
            description:
              "This item contains inappropriate content that violates community guidelines.",
            category: "Other",
            size: "M",
            condition: "Good",
            brand: "Unknown",
            images: [
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            ],
            owner: {
              id: "user4",
              name: "John Doe",
              email: "john.doe@example.com",
            },
            status: "rejected",
            submittedAt: "2024-01-17T16:45:00Z",
            moderatedAt: "2024-01-17T17:00:00Z",
            reports: 5,
            flagReason: "Inappropriate content",
          },
        ];

        setItems(mockItems);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
      setLoading(false);
    }
  };

  const handleItemAction = async (
    itemId: string,
    action: "approve" | "reject" | "flag",
    reason?: string
  ) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                status:
                  action === "flag"
                    ? "flagged"
                    : action === "approve"
                    ? "approved"
                    : "rejected",
                moderatedAt: new Date().toISOString(),
                flagReason: action === "flag" ? reason : item.flagReason,
              }
            : item
        )
      );

      toast.success(
        `Item ${action}${
          action === "approve" ? "d" : action === "reject" ? "ed" : "ged"
        } successfully!`
      );
    } catch (error) {
      console.error(`Error ${action}ing item:`, error);
      toast.error(`Failed to ${action} item`);
    }
  };

  const getStatusColor = (status: Item["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "flagged":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Item["status"]) => {
    switch (status) {
      case "pending":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case "flagged":
        return <FlagIcon className="h-4 w-4 text-orange-500" />;
      default:
        return <ShoppingBagIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

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
            Item Moderation
          </h1>
          <p className="text-gray-600">
            Review and moderate user-submitted items
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
                  placeholder="Search items..."
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
                title="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredItems.length} of {items.length} items
              </span>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Item Image */}
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                </div>
                {item.reports > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.reports} reports
                    </span>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Brand:</span>
                    <span className="text-gray-900">{item.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-900">{item.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Condition:</span>
                    <span className="text-gray-900">{item.condition}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size:</span>
                    <span className="text-gray-900">{item.size}</span>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    {item.owner.avatar ? (
                      <img
                        src={item.owner.avatar}
                        alt={item.owner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.owner.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.submittedAt)}
                    </p>
                  </div>
                </div>

                {/* Flag Reason */}
                {item.flagReason && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Flag Reason:</strong> {item.flagReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowItemModal(true);
                    }}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>

                  {item.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleItemAction(item.id, "reject")}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleItemAction(item.id, "approve")}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  )}

                  {item.status === "approved" && item.reports === 0 && (
                    <button
                      onClick={() =>
                        handleItemAction(item.id, "flag", "Flagged for review")
                      }
                      className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Flag
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No items match the selected filters"}
            </p>
          </div>
        )}

        {/* Item Details Modal */}
        {showItemModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Item Details
                  </h2>
                  <button
                    onClick={() => setShowItemModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Close modal"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Item Image */}
                  <div>
                    <img
                      src={selectedItem.images[0]}
                      alt={selectedItem.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>

                  {/* Item Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedItem.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(selectedItem.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            selectedItem.status
                          )}`}
                        >
                          {selectedItem.status.charAt(0).toUpperCase() +
                            selectedItem.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600">{selectedItem.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Brand
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedItem.brand}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Category
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedItem.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Size
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedItem.size}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Condition
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedItem.condition}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Submitted
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedItem.submittedAt)}
                        </p>
                      </div>
                      {selectedItem.moderatedAt && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Moderated
                          </p>
                          <p className="text-sm text-gray-900">
                            {formatDate(selectedItem.moderatedAt)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Owner
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {selectedItem.owner.avatar ? (
                            <img
                              src={selectedItem.owner.avatar}
                              alt={selectedItem.owner.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300"></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedItem.owner.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedItem.owner.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedItem.flagReason && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          <strong>Flag Reason:</strong>{" "}
                          {selectedItem.flagReason}
                        </p>
                      </div>
                    )}
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

export default ItemModeration;
