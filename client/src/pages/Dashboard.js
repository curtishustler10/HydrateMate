import React, { useState, useEffect } from 'react';
import { Droplets, Target, TrendingUp, Plus, Zap, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [currentIntake, setCurrentIntake] = useState(1200);
  const [streak, setStreak] = useState(7);
  const [todaySips, setTodaySips] = useState(12);
  const [weeklyAvg, setWeeklyAvg] = useState(85);
  const [isLoading, setIsLoading] = useState(false);

  const progress = (currentIntake / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - currentIntake);

  const handleWaterLog = async (amount) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCurrentIntake(prev => Math.min(prev + amount, dailyGoal + 500));
      setTodaySips(prev => prev + 1);
      setIsLoading(false);
      
      // Celebration effects
      if (currentIntake + amount >= dailyGoal && currentIntake < dailyGoal) {
        toast('🎉 Daily goal achieved! Great job!', { duration: 4000 });
      } else {
        toast.success(`+${amount}ml logged! 💧`, { duration: 2000 });
      }
    }, 500);
  };

  const getMotivationalMessage = () => {
    const percentage = progress;
    if (percentage >= 100) return "🎉 Goal crushed! You're a hydration hero!";
    if (percentage >= 75) return "💪 Almost there! Keep going strong!";
    if (percentage >= 50) return "🚀 Halfway there! You're doing great!";
    if (percentage >= 25) return "⭐ Good start! Let's keep the momentum!";
    return "🌅 Ready to hydrate? Your body will thank you!";
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Hero Section */}
      <div className="relative p-6 pb-8">
        <div className="text-center mb-6">
          <div className="floating">
            <div className="text-4xl mb-2">💧</div>
          </div>
          <p className="text-gray-600 text-sm">{getMotivationalMessage()}</p>
        </div>

        {/* Progress Circle */}
        <div className="relative mb-8">
          <div className="w-56 h-56 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${Math.min(progress, 100) * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* Overflow circle (when over 100%) */}
              {progress > 100 && (
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#overflowGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${(progress - 100) * 2.83} 283`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out pulse-subtle"
                />
              )}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="overflowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-bold text-gray-900 block">
                  {Math.round(Math.min(progress, 100))}%
                </span>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{currentIntake}ml</span> / {dailyGoal}ml
                </div>
                {remaining > 0 ? (
                  <div className="text-xs text-blue-600 mt-1">
                    {remaining}ml to go
                  </div>
                ) : (
                  <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                    <Award className="w-3 h-3" />
                    Goal achieved!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 text-center mb-4">Quick Log</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { amount: 250, emoji: '🥤', label: 'Cup' },
              { amount: 500, emoji: '💧', label: 'Bottle' },
              { amount: 750, emoji: '🍶', label: 'Large' }
            ].map(({ amount, emoji, label }) => (
              <button
                key={amount}
                onClick={() => handleWaterLog(amount)}
                disabled={isLoading}
                className="water-ripple bg-white hover:bg-blue-50 p-4 rounded-2xl text-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-100 disabled:opacity-50"
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-sm font-semibold text-gray-800">{amount}ml</div>
                <div className="text-xs text-gray-500">{label}</div>
              </button>
            ))}
          </div>
          
          {/* Custom amount button */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-water-500 text-white p-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Plus className="w-5 h-5" />
            Custom Amount
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg slide-up">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{streak}</div>
            <div className="text-xs text-gray-600 font-medium">Day Streak</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg slide-up">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{todaySips}</div>
            <div className="text-xs text-gray-600 font-medium">Today's Sips</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg slide-up">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{weeklyAvg}%</div>
            <div className="text-xs text-gray-600 font-medium">Weekly Avg</div>
          </div>
        </div>

        {/* Next Reminder Card */}
        <div className="bg-gradient-to-r from-blue-500 to-water-500 text-white rounded-2xl p-5 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Next Reminder</span>
          </div>
          <div className="text-3xl font-bold mb-1">23:45</div>
          <div className="text-blue-100 text-sm">Stay hydrated! 💪</div>
        </div>

        {/* Achievement Preview */}
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Almost there!</div>
                <div className="text-sm text-gray-600">3 more days for "Two Weeks Strong"</div>
              </div>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
