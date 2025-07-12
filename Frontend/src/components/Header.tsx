import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navigation = [{ name: "Browse", href: "/browse", icon: SwatchIcon }];

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Items", href: "/profile?tab=items" },
    { name: "Swaps", href: "/swaps" },
    { name: "Profile", href: "/profile" },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin" },
    { name: "User Management", href: "/admin/users" },
    { name: "Item Moderation", href: "/admin/items" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RW</span>
              </div>
              <span className="text-xl font-bold text-gradient">ReWear</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Points display */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-yellow-50 rounded-full">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-800">★</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-800">
                    {user?.points || 0} points
                  </span>
                </div>

                {/* Add Item Button */}
                <Link
                  to="/add-item"
                  className="btn-primary flex items-center space-x-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Item</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.fullName?.split(" ")[0] || "User"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.name}
                          </Link>
                        ))}

                        {user?.role === "admin" && (
                          <>
                            <hr className="my-1" />
                            {adminNavigation.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </>
                        )}

                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <div className="flex items-center space-x-2">
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md ${
                    isActive(item.href)
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-md">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-yellow-800">
                          ★
                        </span>
                      </div>
                      <span className="text-sm font-medium text-yellow-800">
                        {user?.points || 0} points
                      </span>
                    </div>
                  </div>

                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                    >
                      {item.name}
                    </Link>
                  ))}

                  {user?.role === "admin" &&
                    adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      >
                        {item.name}
                      </Link>
                    ))}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
