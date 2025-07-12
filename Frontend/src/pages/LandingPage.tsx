import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-green-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sustainable Fashion Exchange
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
              Swap unused clothing, reduce waste, and discover unique pieces
              through our sustainable fashion platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Browse Items
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                Join ReWear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ReWear Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community of fashion-conscious individuals making a
              positive impact on the environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                List Your Items
              </h3>
              <p className="text-gray-600">
                Upload photos and details of clothing items you no longer wear.
                Our team reviews each listing for quality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Swap or Redeem
              </h3>
              <p className="text-gray-600">
                Exchange items directly with other users or use points to redeem
                items you love.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Earn Points
              </h3>
              <p className="text-gray-600">
                Get points for successful swaps and use them to discover new
                fashion treasures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600">Items Swapped</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">
                50kg
              </div>
              <div className="text-gray-600">Waste Reduced</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                95%
              </div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who are making fashion more sustainable, one
            swap at a time.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-primary-600 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-primary-700 hover:to-green-700 transition-all duration-200 inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
