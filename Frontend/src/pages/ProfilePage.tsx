import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ShoppingBagIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar?: string;
  joinDate: string;
  stats: {
    itemsListed: number;
    swapsCompleted: number;
    rating: number;
    points: number;
  };
}

interface UserItem {
  id: string;
  title: string;
  category: string;
  image: string;
  status: "available" | "swapped" | "reserved";
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "items" | "favorites" | "settings"
  >("items");

  useEffect(() => {
    fetchProfile();
    fetchUserItems();
  }, []);

  const fetchProfile = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockProfile: UserProfile = {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          phone: "+1 (555) 123-4567",
          location: "New York, NY",
          bio: "Passionate about sustainable fashion and reducing waste. Love finding unique pieces and sharing them with the community!",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          joinDate: "2024-01-15",
          stats: {
            itemsListed: 24,
            swapsCompleted: 18,
            rating: 4.8,
            points: 280,
          },
        };

        setProfile(mockProfile);
        setEditForm({
          name: mockProfile.name,
          phone: mockProfile.phone,
          location: mockProfile.location,
          bio: mockProfile.bio,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockItems: UserItem[] = [
          {
            id: "1",
            title: "Vintage Denim Jacket",
            category: "Outerwear",
            image:
              "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            status: "available",
          },
          {
            id: "2",
            title: "Floral Summer Dress",
            category: "Dresses",
            image:
              "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            status: "swapped",
          },
          {
            id: "3",
            title: "Leather Ankle Boots",
            category: "Shoes",
            image:
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            status: "reserved",
          },
        ];

        setUserItems(mockItems);
      }, 500);
    } catch (error) {
      console.error("Error fetching user items:", error);
      toast.error("Failed to load items");
    }
  };

  const handleEditToggle = () => {
    if (isEditing && profile) {
      // Reset form to current profile data
      setEditForm({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (profile) {
        setProfile({
          ...profile,
          name: editForm.name,
          phone: editForm.phone,
          location: editForm.location,
          bio: editForm.bio,
        });
      }

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const getStatusColor = (status: UserItem["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "swapped":
        return "bg-gray-100 text-gray-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: UserItem["status"]) => {
    switch (status) {
      case "available":
        return "Available";
      case "swapped":
        return "Swapped";
      case "reserved":
        return "Reserved";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile not found
          </h1>
          <p className="text-gray-600">Unable to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-32"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4 sm:mb-0">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-full h-full text-gray-400 p-6" />
                  )}
                </div>
                <button
                  className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 shadow-lg hover:bg-green-600 transition-colors"
                  title="Change profile picture"
                  aria-label="Change profile picture"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.name}
                    </h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {profile.location}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(profile.stats.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {profile.stats.rating} ({profile.stats.swapsCompleted}{" "}
                        swaps)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleEditToggle}
                    className="mt-4 sm:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {profile.stats.itemsListed}
                </p>
                <p className="text-sm text-gray-600">Items Listed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {profile.stats.swapsCompleted}
                </p>
                <p className="text-sm text-gray-600">Swaps Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {profile.stats.rating}
                </p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {profile.stats.points}
                </p>
                <p className="text-sm text-gray-600">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("items")}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "items"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingBagIcon className="h-4 w-4" />
                      <span>My Items</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "favorites"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="h-4 w-4" />
                      <span>Favorites</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "items" && (
                  <div>
                    {userItems.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {userItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="aspect-w-16 aspect-h-9 mb-4">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {item.category}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  item.status
                                )}`}
                              >
                                {getStatusText(item.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No items listed yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "favorites" && (
                  <div className="text-center py-8">
                    <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No favorite items yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Details */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Details
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full name"
                      title="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your phone number"
                      title="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your location"
                      title="Location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                      placeholder="Tell us about yourself"
                      title="Bio"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="flex-1 bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{profile.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{profile.location}</span>
                  </div>
                  {profile.bio && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Join Date */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Member Since
              </h3>
              <p className="text-gray-600">
                {new Date(profile.joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
