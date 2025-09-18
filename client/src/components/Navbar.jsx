import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// This component expects two props:
// 1. user: An object containing user data if logged in, otherwise null.
// 2. handleLogout: A function to call when the logout button is clicked.

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth(); // Replace with actual user state management

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const handleLogout = () => {
    logout();
    // Optional: Close mobile menu on logout
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-[#1E3A8A]">
              <div className="flex items-center gap-2">
                <span>
                  <img
                    className="w-15 h-15 border rounded-full"
                    src="/logo.png"
                    alt=""
                  />
                </span>{" "}
                <span>
                  Vigilant<span className="text-blue-400">Shores</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/about"
              className="text-slate-600 hover:text-blue-600 font-medium"
            >
              About
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-600 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-600 hover:text-blue-600 font-medium"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-500">
                  Welcome, {user.email}
                </span>
                <button
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <Link
                  to="/report/submit"
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors"
                >
                  Submit Report
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-white hover:bg-blue-500 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                // Close Icon
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger Icon
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200">
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-white hover:bg-blue-500"
          >
            Dashboard
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-white hover:bg-blue-500"
          >
            About
          </Link>
          {user && (
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-white hover:bg-blue-500"
            >
              Profile
            </Link>
          )}

          <div className="border-t border-slate-200 mt-4 pt-4">
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <button
                    className="w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-white hover:bg-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-white hover:bg-blue-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-white hover:bg-blue-500"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/report/submit"
              className="block mt-2 mx-3 bg-green-500 text-white text-center font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors"
            >
              Submit Report
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
