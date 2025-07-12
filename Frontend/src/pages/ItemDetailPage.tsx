import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Item } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/items/${id}`);
      setItem(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch item details");
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async (type: "points" | "item") => {
    if (!user) {
      toast.error("Please login to make swap requests");
      navigate("/login");
      return;
    }

    // For now, just show success message
    toast.success("Swap request sent successfully! 🎉");
    setShowSwapModal(false);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800 border-green-200";
      case "like-new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "good":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "fair":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Item not found
          </h2>
          <Link to="/browse" className="text-green-600 hover:text-green-500">
            ← Back to browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/browse" className="text-green-600 hover:text-green-500">
              Browse
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{item.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">
              {item.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      currentImageIndex === index
                        ? "ring-2 ring-green-500"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {item.title}
                </h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {item.pointValue} points
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(
                      item.condition
                    )}`}
                  >
                    {item.condition}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Item Details Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Item Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Category
                  </span>
                  <p className="text-gray-900 capitalize">{item.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Size
                  </span>
                  <p className="text-gray-900">{item.size}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Brand
                  </span>
                  <p className="text-gray-900">
                    {item.brand || "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Color
                  </span>
                  <p className="text-gray-900">{item.color}</p>
                </div>
                {item.type && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-500">
                      Type
                    </span>
                    <p className="text-gray-900">{item.type}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Owner Information
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {item.owner?.fullName?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {item.owner?.fullName || "Anonymous User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.owner?.points || 0} points • Member since 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {user && item.owner?.id !== user.id ? (
                <>
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🔄 Request Swap
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                      💕 Add to Wishlist
                    </button>
                    <button className="py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                      📤 Share Item
                    </button>
                  </div>
                </>
              ) : user && item.owner?.id === user.id ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 font-medium">This is your item</p>
                  <div className="mt-3 space-y-2">
                    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Edit Item
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-gray-600 mb-3">Sign in to request swaps</p>
                  <Link
                    to="/login"
                    className="inline-block bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Request Swap
            </h3>
            <p className="text-gray-600 mb-6">
              How would you like to swap for "{item.title}"?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleSwapRequest("points")}
                className="w-full p-4 border border-gray-300 rounded-xl hover:bg-gray-50 text-left transition-colors"
              >
                <div className="font-medium text-gray-900">💰 Use Points</div>
                <div className="text-sm text-gray-500">
                  Pay {item.pointValue} points
                </div>
              </button>

              <button
                onClick={() => handleSwapRequest("item")}
                className="w-full p-4 border border-gray-300 rounded-xl hover:bg-gray-50 text-left transition-colors"
              >
                <div className="font-medium text-gray-900">👗 Offer Item</div>
                <div className="text-sm text-gray-500">
                  Exchange with one of your items
                </div>
              </button>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
