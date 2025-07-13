import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, weekly, monthly

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/leaderboard")
      .then(res => {
        setLeaders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRatingColor = (acceptedCount) => {
    if (acceptedCount >= 100) return 'text-purple-600';
    if (acceptedCount >= 50) return 'text-red-600';
    if (acceptedCount >= 25) return 'text-orange-600';
    if (acceptedCount >= 10) return 'text-blue-600';
    return 'text-green-600';
  };

  const getRatingTitle = (acceptedCount) => {
    if (acceptedCount >= 100) return 'Grandmaster';
    if (acceptedCount >= 50) return 'Master';
    if (acceptedCount >= 25) return 'Expert';
    if (acceptedCount >= 10) return 'Specialist';
    return 'Pupil';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
              <p className="text-gray-600 mt-1">Top problem solvers this week</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Top 3 Podium */}
          {leaders.length >= 3 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">🏆 Top Performers</h2>
              <div className="flex justify-center items-end space-x-4">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl mb-2">
                    🥈
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{leaders[1]?.username || 'User'}</p>
                    <p className="text-sm text-gray-600">{leaders[1]?.acceptedCount || 0} solved</p>
                  </div>
                </div>
                
                {/* 1st Place */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center text-3xl mb-2">
                    👑
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-lg">{leaders[0]?.username || 'User'}</p>
                    <p className="text-sm text-gray-600">{leaders[0]?.acceptedCount || 0} solved</p>
                  </div>
                </div>
                
                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center text-2xl mb-2">
                    🥉
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{leaders[2]?.username || 'User'}</p>
                    <p className="text-sm text-gray-600">{leaders[2]?.acceptedCount || 0} solved</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">User</div>
                <div className="col-span-2">Rating</div>
                <div className="col-span-2">Solved</div>
                {/* Removed Success Rate and Streak headers */}
              </div>
            </div>

            {/* Leaderboard Rows */}
            <div className="divide-y divide-gray-200">
              {leaders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">Be the first to solve problems and appear on the leaderboard!</p>
                </div>
              ) : (
                leaders.map((user, index) => {
                  const rank = index + 1;
                  const successRate = Math.random() * 100;
                  const streak = Math.floor(Math.random() * 10) + 1;
                  
                  return (
                    <div key={user.userId || index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Rank */}
                        <div className="col-span-1">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border ${getRankBadge(rank)}`}>
                            {getRankIcon(rank)}
                          </span>
                        </div>
                        
                        {/* User */}
                        <div className="col-span-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.username || 'Anonymous'}</p>
                              {/* Removed 'Joined recently' */}
                            </div>
                          </div>
                        </div>
                        {/* Rating */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${getRatingColor(user.acceptedCount)}`}>
                              {getRatingTitle(user.acceptedCount)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({user.acceptedCount * 10})
                            </span>
                          </div>
                        </div>
                        {/* Solved */}
                        <div className="col-span-2">
                          <span className="font-semibold text-gray-900">{user.uniqueProblemsSolved || user.acceptedCount || 0}</span>
                          <span className="text-sm text-gray-500 ml-1">problems</span>
                        </div>
                        {/* Removed Success Rate and Streak */}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}