import React, { useState } from 'react';
import { Bell, Moon, Globe, User, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState('ml');

  const SettingItem = ({ icon: Icon, title, subtitle, action, onClick, danger = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all ${
        danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          danger ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <Icon className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
        <div className="text-left">
          <div className={`font-medium ${danger ? 'text-red-900' : 'text-gray-900'}`}>
            {title}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-600">{subtitle}</div>
          )}
        </div>
      </div>
      {action || <ChevronRight className="w-5 h-5 text-gray-400" />}
    </button>
  );

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">⚙️</div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>
          <div className="space-y-3">
            <SettingItem
              icon={User}
              title="Personal Info"
              subtitle="Weight: 70kg • Goal: 2000ml"
            />
            <SettingItem
              icon={Target}
              title="Daily Goal"
              subtitle="Customize your hydration target"
            />
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>
          <div className="space-y-3">
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle={notifications ? "Reminders enabled" : "Reminders disabled"}
              action={
                <Toggle 
                  checked={notifications}
                  onChange={setNotifications}
                />
              }
            />
            <SettingItem
              icon={Moon}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              action={
                <Toggle 
                  checked={darkMode}
                  onChange={setDarkMode}
                />
              }
            />
            <SettingItem
              icon={Globe}
              title="Units"
              subtitle={units === 'ml' ? 'Milliliters (ml)' : 'Fluid Ounces (fl oz)'}
            />
          </div>
        </div>

        {/* Data & Privacy */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Data & Privacy</h2>
          <div className="space-y-3">
            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="How we protect your data"
            />
            <SettingItem
              icon={User}
              title="Export Data"
              subtitle="Download your hydration history"
            />
          </div>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Support</h2>
          <div className="space-y-3">
            <SettingItem
              icon={HelpCircle}
              title="Help & FAQ"
              subtitle="Get answers to common questions"
            />
            <SettingItem
              icon={Bell}
              title="Contact Support"
              subtitle="Need help? We're here for you"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <SettingItem
              icon={LogOut}
              title="Reset All Data"
              subtitle="This cannot be undone"
              danger={true}
            />
          </div>
        </div>

        {/* App Info */}
        <div className="pt-6 text-center">
          <div className="text-sm text-gray-500">
            HydrateMate v1.0.0
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Made with 💧 for better hydration
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;