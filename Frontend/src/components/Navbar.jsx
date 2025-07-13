import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
   console.log("Navbar: I am rendering! Current Path =", location.pathname);
  // Crucial: Don't render Navbar on /login or /register
  

  return (
    <nav className="bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl py-5 px-8 flex justify-between items-center relative z-50 animate-fade-in-down backdrop-blur-sm bg-opacity-80">
      {/* Site Title/Logo - More sleek and modern */}
      <div className="flex items-center">
        <Link 
          to="/" 
          className="text-4xl font-extralight tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-400 hover:via-pink-400 hover:to-red-400 transition-all duration-700 ease-in-out transform hover:scale-105"
        >
          &lt;CodeFlow&gt;
        </Link>
      </div>

      {/* Desktop Navigation Links - Refined and animated */}
      <div className="hidden md:flex items-center space-x-10">
        {[
          { path: "/dashboard", name: "Dashboard" },
          { path: "/problems", name: "Problems" },
          { path: "/submissions", name: "Submissions" },
          { path: "/leaderboard", name: "Leaderboard" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              relative text-xl font-light tracking-wide transition-all duration-400 ease-in-out
              ${location.pathname === item.path
                ? 'text-purple-400 transform -translate-y-1 scale-105' // Active link styling: subtle lift, scale, and distinct color
                : 'text-gray-400 hover:text-purple-300' // Inactive link styling
              }
              group
            `}
          >
            {item.name}
            {/* Underline/Highlight effect - Thicker, more pronounced, and gradient */}
            <span className={`
              absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500
              transform -translate-x-1/2 transition-all duration-400 ease-in-out
              ${location.pathname === item.path
                ? 'w-full scale-x-105' // Active link full width and slightly wider
                : 'group-hover:w-full group-hover:scale-x-100' // Hover expands from center
              }
            `}></span>
          </Link>
        ))}
        {user && user.role === "admin" && (
          <Link
            to="/add-problem"
            className="
              relative text-xl font-light tracking-wide transition-all duration-400 ease-in-out
              text-green-600 hover:underline font-semibold
              group
            "
          >
            Add Problem
          </Link>
        )}
      </div>

      {/* Logout Button (Desktop) - More dramatic and sleek */}
      <button
        onClick={handleLogout}
        className="hidden md:block bg-gradient-to-br from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-full shadow-xl transition-all duration-400 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-60"
      >
        Logout
      </button>

      {/* Mobile Menu Button - Larger and more prominent */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded p-2 transition duration-300"
        >
          {isMobileMenuOpen ? (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay - Smooth and captivating */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 bg-opacity-90 shadow-2xl py-8 animate-slide-down backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-8">
            {[
              { path: "/dashboard", name: "Dashboard" },
              { path: "/problems", name: "Problems" },
              { path: "/submissions", name: "Submissions" },
              { path: "/leaderboard", name: "Leaderboard" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  text-2xl font-light px-6 py-3 rounded-xl transition-colors duration-400 ease-in-out
                  ${location.pathname === item.path
                    ? 'text-purple-400 bg-gray-800 bg-opacity-70 shadow-lg' // Active mobile link: background, shadow
                    : 'text-gray-300 hover:text-purple-300 hover:bg-gray-800 hover:bg-opacity-70' // Inactive mobile link
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
            {user && user.role === "admin" && (
              <Link
                to="/add-problem"
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  text-2xl font-light px-6 py-3 rounded-xl transition-colors duration-400 ease-in-out
                  text-green-600 hover:underline font-semibold
                "
              >
                Add Problem
              </Link>
            )}
            <button
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="bg-gradient-to-br from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-full shadow-xl transition-all duration-400 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-60 mt-6"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;