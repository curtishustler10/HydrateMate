import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    weight: '',
    unit: 'kg',
    dailyGoal: '',
    reminderStart: '08:00',
    reminderEnd: '22:00',
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateRecommendedIntake = () => {
    const weightInKg = data.unit === 'kg' ? data.weight : data.weight * 0.453592;
    return Math.round(weightInKg * 35); // 35ml per kg body weight
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      if (step === 1) {
        setData(prev => ({ ...prev, dailyGoal: calculateRecommendedIntake() }));
      }
    } else {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage/API
      localStorage.setItem('hydrateMateUser', JSON.stringify(data));
      setIsLoading(false);
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Step {step} of 3</span>
          <span className="text-sm text-gray-600">{Math.round((step/3) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step/3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Weight */}
      {step === 1 && (
        <div className="text-center">
          <div className="text-6xl mb-6">⚖️</div>
          <h2 className="text-2xl font-bold mb-4">What's your weight?</h2>
          <p className="text-gray-600 mb-8">
            We'll use this to recommend your daily hydration goal
          </p>
          <div className="flex gap-2 mb-6">
            <input
              type="number"
              placeholder="70"
              className="flex-1 p-3 border border-gray-300 rounded-lg text-center text-lg"
              value={data.weight}
              onChange={(e) => setData(prev => ({ ...prev, weight: e.target.value }))}
            />
            <select
              className="p-3 border border-gray-300 rounded-lg"
              value={data.unit}
              onChange={(e) => setData(prev => ({ ...prev, unit: e.target.value }))}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Daily Goal */}
      {step === 2 && (
        <div className="text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-2xl font-bold mb-4">Daily Hydration Goal</h2>
          <p className="text-gray-600 mb-8">
            Based on your weight, we recommend {calculateRecommendedIntake()}ml per day
          </p>
          <div className="mb-6">
            <input
              type="number"
              placeholder="2000"
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
              value={data.dailyGoal}
              onChange={(e) => setData(prev => ({ ...prev, dailyGoal: e.target.value }))}
            />
            <div className="text-sm text-gray-500 mt-2">ml per day</div>
          </div>
        </div>
      )}

      {/* Step 3: Reminder Times */}
      {step === 3 && (
        <div className="text-center">
          <div className="text-6xl mb-6">⏰</div>
          <h2 className="text-2xl font-bold mb-4">Reminder Window</h2>
          <p className="text-gray-600 mb-8">
            When should we remind you to drink water?
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start time
              </label>
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg text-center"
                value={data.reminderStart}
                onChange={(e) => setData(prev => ({ ...prev, reminderStart: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End time
              </label>
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg text-center"
                value={data.reminderEnd}
                onChange={(e) => setData(prev => ({ ...prev, reminderEnd: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 btn-secondary"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={
            isLoading ||
            (step === 1 && !data.weight) ||
            (step === 2 && !data.dailyGoal) ||
            (step === 3 && (!data.reminderStart || !data.reminderEnd))
          }
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="white" />
              Setting up...
            </>
          ) : (
            step === 3 ? 'Get Started' : 'Next'
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
