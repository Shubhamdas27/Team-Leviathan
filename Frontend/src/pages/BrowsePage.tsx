import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Item } from "../types";
import toast from "react-hot-toast";

const BrowsePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    size: "",
    condition: "",
    search: "",
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/items", { params: filters });
      setItems(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "", label: "All Categories" },
    { value: "dresses", label: "👗 Dresses" },
    { value: "tops", label: "👚 Tops" },
    { value: "bottoms", label: "👖 Bottoms" },
    { value: "accessories", label: "👜 Accessories" },
    { value: "shoes", label: "👠 Shoes" },
    { value: "outerwear", label: "🧥 Outerwear" },
  ];

  const sizes = ["", "XS", "S", "M", "L", "XL", "XXL"];
  const conditions = ["", "new", "like-new", "good", "fair"];

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "like-new":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-yellow-100 text-yellow-800";
      case "fair":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ItemCard: React.FC<{ item: Item }> = ({ item }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={item.images?.[0] || "/placeholder-image.jpg"}
          alt={item.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(
              item.condition
            )}`}
          >
            {item.condition}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-bold text-green-600">
              {item.pointValue} pts
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">Size:</span>
            <span className="text-sm font-semibold text-gray-900">
              {item.size}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">Brand:</span>
            <span className="text-sm font-semibold text-gray-900">
              {item.brand || "N/A"}
            </span>
          </div>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <Link
          to={`/item/${item._id}`}
          className="block w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-center py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Fashion
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              Browse thousands of sustainable clothing items from our community
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              title="Filter by category"
              aria-label="Filter items by category"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Size Filter */}
            <select
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
              className="py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              title="Filter by size"
              aria-label="Filter items by size"
            >
              <option value="">All Sizes</option>
              {sizes.slice(1).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              value={filters.condition}
              onChange={(e) =>
                setFilters({ ...filters, condition: e.target.value })
              }
              className="py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              title="Filter by condition"
              aria-label="Filter items by condition"
            >
              <option value="">All Conditions</option>
              {conditions.slice(1).map((condition) => (
                <option key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() +
                    condition.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? "Loading..." : `${items.length} items found`}
            </h2>
            <p className="text-gray-600 mt-1">
              Discover sustainable fashion from our community
            </p>
          </div>
          <Link
            to="/add-item"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            + Add Item
          </Link>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <Link
              to="/add-item"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              + Add the first item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
