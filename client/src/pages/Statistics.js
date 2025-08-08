import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Droplets, Target, Award, Download, Share } from 'lucide-react';

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Mock data
  const weeklyData = [
    { day: 'Mon', intake: 2100, goal: 2000 },
    { day: 'Tue', intake: 1850, goal: 2000 },
    { day: 'Wed', intake: 2300, goal: 2000 },
    { day: 'Thu', intake: 1950, goal: 2000 },
    { day: 'Fri', intake: 2200, goal: 2000 },
    { day: 'Sat', intake: 1700, goal: 2000 },
    { day: 'Sun', intake: 2400, goal: 2000 }
  ];

  const monthlyStats = {
    totalIntake: 58750,
    avgDaily: 1896,
    bestDay: 2850,
    perfectDays: 18,
    currentStreak: 5,
    longestStreak: 12
  };

  const achievements = [
    { id: 1, title: 'Hydration Hero', earned: true, date: '2024-01-15', icon: '🦸', rarity: 'rare' },
    { id: 2, title: 'Week Warrior', earned: true, date: '2024-01-10', icon: '⚔️', rarity: 'common' },
    { id: 3, title: 'Streak Master', earned: true, date: '2024-01-08', icon: '🔥', rarity: 'epic' },
    { id: 4, title: 'Morning Glory', earned: false, progress: 75, icon: '🌅', rarity: 'common' },
    { id: 5, title: 'Night Owl', earned: false, progress: 30, icon: '🦉', rarity: 'rare' },
    { id: 6, title: 'Perfect Month', earned: false, progress: 60, icon: '💎', rarity: 'legendary' }
  ];

  const maxIntake = Math.max(...weeklyData.map(d => Math.max(d.intake, d.goal)));

  const renderChart = () => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Weekly Progress</h3>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {['week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          {weeklyData.map((data, index) => {
            const intakePercentage = (data.intake / maxIntake) * 100;
            const goalPercentage = (data.goal / maxIntake) * 100;
            const isGoalMet = data.intake >= data.goal;

            return (
              <div key={data.day} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{data.day}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isGoalMet ? 'text-green-600' : 'text-gray-600'}`}>
                      {data.intake}ml
                    </span>
                    {isGoalMet && <span className="text-green-500">✓</span>}
                  </div>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  {/* Goal line */}
                  <div 
                    className="absolute top-0 h-full bg-blue-200 rounded-full"
                    style={{ width: `${goalPercentage}%` }}
                  />
                  {/* Actual intake */}
                  <div 
                    className={`absolute top-0 h-full rounded-full transition-all duration-1000 ${
                      isGoalMet ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${intakePercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-600">Intake</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 rounded-full" />
            <span className="text-gray-600">Goal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-600">Goal Met</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Stats</h1>
          <p className="text-gray-600 text-sm">Track your hydration journey</p>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-water-500 text-white rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold">{(monthlyStats.totalIntake / 1000).toFixed(1)}L</div>
            <div className="text-blue-100 text-xs">Total intake</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Perfect Days</span>
            </div>
            <div className="text-2xl font-bold">{monthlyStats.perfectDays}</div>
            <div className="text-green-100 text-xs">Goal achieved</div>
          </div>
        </div>

        {/* Chart */}
        {renderChart()}

        {/* Monthly Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-gray-900">{monthlyStats.avgDaily}</div>
              <div className="text-xs text-gray-600">Daily Average</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-gray-900">{monthlyStats.bestDay}</div>
              <div className="text-xs text-gray-600">Best Day</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-orange-600">{monthlyStats.currentStreak}</div>
              <div className="text-xs text-gray-600">Current Streak</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-purple-600">{monthlyStats.longestStreak}</div>
              <div className="text-xs text-gray-600">Best Streak</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
            <span className="text-sm text-gray-600">
              {achievements.filter(a => a.earned).length}/{achievements.length}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="text-center p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                <div className={`text-2xl mb-1 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="text-xs font-medium text-gray-800 mb-1">
                  {achievement.title}
                </div>
                {achievement.earned ? (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    achievement.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                    achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                    achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {achievement.rarity}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    {achievement.progress}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors">
            <Download className="w-5 h-5" />
            Export Data (CSV)
          </button>
          <button className="w-full bg-green-50 hover:bg-green-100 text-green-600 p-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors">
            <Share className="w-5 h-5" />
            Share Progress
          </button>
        </div>

        {/* Insights */}
        <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Insight</h4>
              <p className="text-sm text-gray-700">
                You're most consistent on weekdays! Try setting weekend reminders to maintain your streak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;