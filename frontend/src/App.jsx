import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import ChatWidget from './components/ChatWidget';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import KnowledgeBase from './pages/KnowledgeBase';
import Login from './pages/Login';

// Helper component for the navbar logout button
const NavUser = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="flex items-center space-x-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{user.full_name}</p>
        <p className="text-xs text-slate-500 capitalize leading-none mt-1">{user.role}</p>
      </div>
      <button
        onClick={logout}
        className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

import VerifyNews from './pages/VerifyNews';
import VerificationHistory from './pages/VerificationHistory';

function AppContent() {
  const { token, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navigation - Only show if logged in */}
      {token && (
        <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  VeriNews AI
                </Link>
                <div className="hidden md:flex sm:space-x-6">
                  <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-1 pt-1 text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/verify" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-1 pt-1 text-sm font-medium transition-colors">
                    Verify News
                  </Link>
                  <Link to="/history" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-1 pt-1 text-sm font-medium transition-colors">
                    History
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <NavUser />
                <button
                  className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors">
                  Dashboard
                </Link>
                <Link to="/verify" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors">
                  Verify News
                </Link>
                <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors">
                  History
                </Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                  <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Combat Misinformation with <span className="text-blue-700">VeriNews AI</span>
                  </h1>
                  <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                    A powerful, AI-driven platform designed to verify news authenticity in real-time. 
                    Stay informed, stay accurate.
                  </p>
                  <div className="mt-10">
                    <Link to="/verify" className="bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20">
                      Start Verifying Now
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Content Analysis</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Analyze news text, headlines, or full articles using state-of-the-art machine learning models.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.242a4 4 0 115.656 5.656l-1.101 1.101m-.758-4.826L11.758 13.828a4 4 0 01-5.656 0" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">URL Verification</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Simply paste a news link and our system will scrape the content and verify its credibility.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Personal History</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Keep track of all your verified news queries and revisit analysis results anytime.
                    </p>
                  </div>
                </div>
              </main>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/verify" element={
            <ProtectedRoute>
              <VerifyNews />
            </ProtectedRoute>
          } />

          <Route path="/history" element={
            <ProtectedRoute>
              <VerificationHistory />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* AI Chatbot Widget - Available to everyone logged in */}
      {token && <ChatWidget />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="619163443690-2580vdebf23ghlduus4a6ggcesn6uua7.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
