import React, { useEffect, useState } from 'react';
import { Code, User, LogOut, CheckCircle, Award, Target, TrendingUp, ChevronRight, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth provides user and logout
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dummy data for stats to demonstrate dynamic content
  const stats = [
    { label: 'Problems Solved', value: user?.problemsSolved || '0', icon: Award, color: 'text-amber-400' },
    { label: 'Total Submissions', value: user?.totalSubmissions || '0', icon: Target, color: 'text-emerald-400' },
    { label: 'Success Rate', value: user?.successRate ? `${user.successRate}%` : '0%', icon: TrendingUp, color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-inter antialiased relative overflow-hidden">
      {/* Background Gradients/Effects - More complex, subtle movements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header - Glassmorphic & Sticky */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${headerScrolled ? 'py-2 bg-gray-900 bg-opacity-70 backdrop-blur-lg shadow-xl border-b border-gray-700' : 'py-4 bg-transparent'}`}>
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <Code className="h-10 w-10 text-purple-400 mr-3 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="text-4xl font-extrabold tracking-tighter text-white drop-shadow-md transition-colors duration-300 group-hover:text-purple-300">CodeFlow</span>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-6">
              {user && (
                <div className="flex items-center space-x-3 px-5 py-2 rounded-full border border-gray-700 bg-gray-800 bg-opacity-50 text-gray-200 shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-opacity-70 cursor-pointer">
                  <User className="h-6 w-6 text-blue-300" />
                  <span className="text-lg font-semibold">{user.name || "Guest"}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-700 bg-opacity-60 text-purple-100 uppercase tracking-wide">
                    {user.role?.toUpperCase() || "USER"}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg relative overflow-hidden group"
              >
                <LogOut className="h-5 w-5 group-hover:animate-shake" /> {/* Custom shake animation */}
                <span>Logout</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 pt-12 pb-16 rounded-3xl shadow-3xl border border-gray-700 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-800 to-blue-800 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-8 drop-shadow-lg leading-tight animate-fade-in-up">
              Welcome to CodeFlow, <br className="md:hidden" />
              <span className="text-white text-opacity-90">{user?.name || 'Grand Coder'}</span>!
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10 opacity-0 animate-fade-in delay-500">
              Your epic coding journey begins here. Prepare to conquer challenges, learn new skills, and climb the global ranks!
            </p>
            <button className="inline-flex items-center px-10 py-4 border border-transparent text-xl font-bold rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 group">
              Start Coding Now
              <ChevronRight className="ml-3 h-6 w-6 transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Dynamic Grid for User Info & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* User Info Card - Glassmorphic, interactive */}
          <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-xl p-10 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl border border-gray-700 hover:border-blue-500 relative overflow-hidden group">
            <div className="absolute top-4 right-4 p-2 bg-gray-700/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Settings className="h-6 w-6 text-gray-300 hover:text-white" />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="p-5 rounded-full bg-gradient-to-br from-blue-700 to-purple-700 shadow-xl border-4 border-gray-900 group-hover:border-purple-500 transition-colors duration-300">
                  <User className="h-24 w-24 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 p-3 bg-green-500 rounded-full border-4 border-gray-900 shadow-lg animate-pulse-once">
                  <CheckCircle className="h-8 w-8 text-white" />
                </span>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-3">{user?.name || "User Name"}</h2>
              <p className="text-gray-300 text-lg mb-4 opacity-80 break-all">{user?.email || "user@example.com"}</p>
              <span className="inline-flex items-center px-5 py-2 rounded-full text-md font-bold bg-purple-700 bg-opacity-70 text-purple-200 uppercase tracking-widest shadow-md">
                {user?.role?.toUpperCase() || "USER"}
              </span>

              <div className="mt-10 pt-10 border-t border-gray-700 w-full text-center">
                <p className="text-md text-gray-400 leading-relaxed">
                  Authentication successful! You are now logged in and ready to code.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats - Grid of interactive cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-purple-500 cursor-pointer group"
              >
                {React.createElement(stat.icon, { className: `h-14 w-14 ${stat.color} mb-6 transform transition-transform duration-300 group-hover:-translate-y-1` })}
                <div className={`text-5xl font-extrabold ${stat.color} mb-3 transition-colors duration-300 group-hover:text-white`}>
                  {stat.value}
                </div>
                <div className="text-lg text-gray-300 font-semibold mt-2 tracking-wide text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Sections Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-gray-700 flex items-center justify-center text-gray-400 text-xl font-semibold transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer">
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">Recent Activity & Leaderboard</span>
            <ChevronRight className="ml-3 h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-gray-700 flex items-center justify-center text-gray-400 text-xl font-semibold transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer">
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">Recommended Problems & Tutorials</span>
            <ChevronRight className="ml-3 h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
          </div>
        </div>


        {/* Footer */}
        <div className="mt-20 text-center text-gray-600 text-sm">
          <p>Handcrafted with ❤️ for the future of competitive programming.</p>
          <p className="mt-1">© 2025 CodeFlow. All rights reserved.</p>
        </div>
      </div>

      {/* Custom CSS for animations (Add this to your src/index.css or a dedicated CSS file) */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, 0.2, 0.4, 1.0);
        }

        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes fadeInOut {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-pulse-once {
          animation: fadeInOut 1.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
          20%, 40%, 60%, 80% { transform: rotate(5deg); }
        }
        .group:hover .group-hover\\:animate-shake {
            animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            perspective: 1000px;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translate3d(0, 40px, 0);
            }
            to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }
        .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
        }
        .delay-500 { animation-delay: 0.5s; } /* For Tailwind's utilities */

        /* Custom shadow for a more "lifted" feel */
        .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;