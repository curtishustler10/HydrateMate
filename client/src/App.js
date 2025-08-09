import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Statistics from './pages/Statistics';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';

function App() {
  const isOnboarding = window.location.pathname === '/onboarding';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-50">
      {!isOnboarding && <Navigation />}
      <main className={isOnboarding ? '' : 'pb-20'}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
