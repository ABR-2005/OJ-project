import React, { useEffect, useState } from 'react';
import { Code, User, LogOut, CheckCircle, Award, Target, TrendingUp, ChevronRight, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth provides user and logout
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [statsData, setStatsData] = useState({ solved: 0, submissions: 0, successRate: 0 });

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

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:5000/api/submissions/${user._id}`)
      .then(res => {
        const submissions = res.data;
        const total = submissions.length;
        const accepted = submissions.filter(s => s.verdict === 'Accepted');
        // Use _id if problemId is populated, else use problemId directly
        const solvedSet = new Set(
          accepted.map(s => typeof s.problemId === 'object' ? s.problemId._id : s.problemId)
        );
        const solved = solvedSet.size;
        const successRate = total > 0 ? ((accepted.length / total) * 100).toFixed(1) : 0;
        setStatsData({ solved, submissions: total, successRate });
      })
      .catch(() => setStatsData({ solved: 0, submissions: 0, successRate: 0 }));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dummy data for stats to demonstrate dynamic content
  const stats = [
    { label: 'Problems Solved', value: statsData.solved, icon: Award, color: 'text-amber-400' },
    { label: 'Total Submissions', value: statsData.submissions, icon: Target, color: 'text-emerald-400' },
    { label: 'Success Rate', value: `${statsData.successRate}%`, icon: TrendingUp, color: 'text-cyan-400' },
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
                <LogOut className="h-5 w-5 group-hover:animate-shake" />
                <span>Logout</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        {/* User Info Card - Sleek and modern */}
        <div className="bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-700 p-10 flex flex-col items-center mb-12">
          <div className="p-5 rounded-full bg-gradient-to-br from-blue-700 to-purple-700 shadow-xl border-4 border-gray-900 mb-6">
            <User className="h-24 w-24 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">{user?.name || "User Name"}</h2>
          <p className="text-gray-300 text-lg mb-2 opacity-80 break-all">{user?.email || "user@example.com"}</p>
          <span className="inline-flex items-center px-5 py-2 rounded-full text-md font-bold bg-purple-700 bg-opacity-70 text-purple-200 uppercase tracking-widest shadow-md mb-4">
            {user?.role?.toUpperCase() || "USER"}
          </span>
        </div>

        {/* Quick Stats - Modern grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/80 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border border-gray-700"
            >
              {React.createElement(stat.icon, { className: `h-14 w-14 ${stat.color} mb-4` })}
              <div className={`text-4xl font-extrabold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-lg text-gray-300 font-semibold tracking-wide text-center">{stat.label}</div>
            </div>
          ))}
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
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
          20%, 40%, 60%, 80% { transform: rotate(5deg); }
        }
        .group:hover .group-hover\:animate-shake {
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
      `}</style>
    </div>
  );
};

export default Dashboard;