import React, { useState } from 'react';
import { Trophy, Clock, Users, Target, Star, Zap, Award, CheckCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [joinedChallenges, setJoinedChallenges] = useState(['hydration-hero', 'weekly-warrior']);

  const dailyChallenges = [
    {
      id: 'morning-boost',
      title: 'Morning Boost',
      description: 'Drink 500ml before 10 AM',
      progress: 500,
      target: 500,
      reward: '25 XP + Morning Badge',
      timeLeft: '2h 15m',
      status: 'completed',
      icon: '🌅',
      difficulty: 'Easy'
    },
    {
      id: 'steady-sipper',
      title: 'Steady Sipper',
      description: 'Log water every 2 hours',
      progress: 4,
      target: 6,
      reward: '35 XP + Consistency Badge',
      timeLeft: '6h 45m',
      status: 'active',
      icon: '⏰',
      difficulty: 'Medium'
    },
    {
      id: 'hydration-hero',
      title: 'Hydration Hero',
      description: 'Exceed daily goal by 20%',
      progress: 1800,
      target: 2400,
      reward: '50 XP + Hero Badge',
      timeLeft: '8h 30m',
      status: 'active',
      icon: '🦸',
      difficulty: 'Hard'
    }
  ];

  const weeklyChallenges = [
    {
      id: 'seven-day-streak',
      title: '7-Day Perfect Streak',
      description: 'Meet your daily goal 7 days in a row',
      progress: 5,
      target: 7,
      reward: '200 XP + Streak Master Badge',
      timeLeft: '3 days',
      status: 'active',
      icon: '🔥',
      difficulty: 'Medium',
      participants: 1247
    },
    {
      id: 'weekly-warrior',
      title: 'Weekly Warrior',
      description: 'Drink 15L total this week',
      progress: 10.5,
      target: 15,
      reward: '150 XP + Warrior Badge',
      timeLeft: '2 days',
      status: 'active',
      icon: '⚔️',
      difficulty: 'Medium',
      participants: 856
    },
    {
      id: 'social-hydrator',
      title: 'Social Hydrator',
      description: 'Complete 5 group challenges',
      progress: 2,
      target: 5,
      reward: '100 XP + Social Badge',
      timeLeft: '5 days',
      status: 'locked',
      icon: '👥',
      difficulty: 'Easy',
      participants: 432,
      requirement: 'Complete "Steady Sipper" 3 times'
    }
  ];

  const communityEvents = [
    {
      id: 'hydration-marathon',
      title: 'Global Hydration Marathon',
      description: 'Join thousands worldwide in a 24-hour hydration event',
      participants: 15420,
      startTime: 'Tomorrow 9:00 AM',
      duration: '24 hours',
      reward: 'Limited Edition Marathon Badge',
      icon: '🌍',
      status: 'upcoming'
    },
    {
      id: 'team-challenge',
      title: 'Office Warriors',
      description: 'Compete with other workplaces',
      participants: 2341,
      timeLeft: '3 days',
      reward: 'Team Champion Badge + 500 XP',
      icon: '🏢',
      status: 'active'
    }
  ];

  const handleJoinChallenge = (challengeId) => {
    if (!joinedChallenges.includes(challengeId)) {
      setJoinedChallenges([...joinedChallenges, challengeId]);
      toast.success('Challenge joined! Good luck! 🎯');
    }
  };

  const renderChallengeCard = (challenge, type = 'daily') => {
    const isJoined = joinedChallenges.includes(challenge.id);
    const progressPercentage = (challenge.progress / challenge.target) * 100;

    return (
      <div key={challenge.id} className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{challenge.icon}</div>
            <div>
              <h3 className="font-bold text-gray-900">{challenge.title}</h3>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
          </div>
          {challenge.status === 'completed' ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : challenge.status === 'locked' ? (
            <Lock className="w-6 h-6 text-gray-400" />
          ) : (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {challenge.difficulty}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {challenge.status !== 'locked' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">
                {type === 'weekly' && challenge.target > 10 ? 
                  `${challenge.progress}L / ${challenge.target}L` :
                  `${challenge.progress} / ${challenge.target}`
                }
              </span>
              <span className="font-medium text-blue-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  challenge.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Challenge Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              {challenge.timeLeft}
            </div>
            {challenge.participants && (
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                {challenge.participants.toLocaleString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700">{challenge.reward}</span>
          </div>
          {challenge.requirement && (
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
              🔒 {challenge.requirement}
            </div>
          )}
        </div>

        {/* Action Button */}
        {challenge.status === 'completed' ? (
          <button className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-xl font-medium cursor-default">
            ✅ Completed
          </button>
        ) : challenge.status === 'locked' ? (
          <button className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-xl font-medium cursor-not-allowed">
            🔒 Locked
          </button>
        ) : isJoined ? (
          <button className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-xl font-medium">
            📊 View Progress
          </button>
        ) : (
          <button 
            onClick={() => handleJoinChallenge(challenge.id)}
            className="w-full bg-gradient-to-r from-blue-500 to-water-500 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🎯 Join Challenge
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Challenges</h1>
          <p className="text-gray-600 text-sm">Push your limits and earn rewards!</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {[
            { id: 'daily', label: 'Daily', icon: Zap },
            { id: 'weekly', label: 'Weekly', icon: Trophy },
            { id: 'community', label: 'Events', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        {activeTab === 'daily' && (
          <>
            <div className="text-center mb-4">
              <h2 className="font-semibold text-gray-800 mb-1">Today's Challenges</h2>
              <p className="text-xs text-gray-600">Reset in 8h 30m</p>
            </div>
            {dailyChallenges.map(challenge => renderChallengeCard(challenge, 'daily'))}
          </>
        )}

        {activeTab === 'weekly' && (
          <>
            <div className="text-center mb-4">
              <h2 className="font-semibold text-gray-800 mb-1">This Week's Challenges</h2>
              <p className="text-xs text-gray-600">Reset every Monday</p>
            </div>
            {weeklyChallenges.map(challenge => renderChallengeCard(challenge, 'weekly'))}
          </>
        )}

        {activeTab === 'community' && (
          <>
            <div className="text-center mb-4">
              <h2 className="font-semibold text-gray-800 mb-1">Community Events</h2>
              <p className="text-xs text-gray-600">Join the global hydration movement</p>
            </div>
            {communityEvents.map(event => (
              <div key={event.id} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{event.icon}</div>
                    <div>
                      <h3 className="font-bold">{event.title}</h3>
                      <p className="text-purple-100 text-sm">{event.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.participants.toLocaleString()} participants
                    </div>
                    {event.startTime ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {event.startTime}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {event.timeLeft} left
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4" />
                    {event.reward}
                  </div>
                </div>

                <button className="w-full bg-white text-purple-600 py-2 px-4 rounded-xl font-medium hover:bg-purple-50 transition-colors">
                  {event.status === 'upcoming' ? '📅 Set Reminder' : '🚀 Join Event'}
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Challenges;
