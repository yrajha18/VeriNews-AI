import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VerifyNews = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('text');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/news/verify`,
        { content, type: activeTab },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (err) {
      setError('Failed to verify news. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Verify News Content</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Enter news text, a headline, or a URL to check its authenticity.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {['text', 'headline', 'url'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setContent(''); setResult(null); }}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              activeTab === 'text' ? 'Paste news article content here...' :
              activeTab === 'headline' ? 'Enter news headline here...' :
              'Paste news URL here...'
            }
            className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-900 dark:text-white"
          />

          <button
            onClick={handleVerify}
            disabled={loading || !content.trim()}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center space-x-2 ${
              loading || !content.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-500/20'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Verify Content</span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-8 ${
            result.prediction === 'Real' ? 'bg-emerald-50 dark:bg-emerald-900/10' : 
            result.prediction === 'Fake' ? 'bg-rose-50 dark:bg-rose-900/10' : 
            'bg-amber-50 dark:bg-amber-900/10'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  result.prediction === 'Real' ? 'bg-emerald-100 text-emerald-700' : 
                  result.prediction === 'Fake' ? 'bg-rose-100 text-rose-700' : 
                  'bg-amber-100 text-amber-700'
                }`}>
                  {result.prediction === 'Real' ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : result.prediction === 'Fake' ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Prediction</p>
                  <h3 className="text-3xl font-black uppercase">{result.prediction}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Confidence</p>
                <h3 className="text-3xl font-black text-blue-700">{result.confidence_score}%</h3>
              </div>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full transition-all duration-1000 ${
                  result.prediction === 'Real' ? 'bg-emerald-500' : 
                  result.prediction === 'Fake' ? 'bg-rose-500' : 
                  'bg-amber-500'
                }`}
                style={{ width: `${result.confidence_score}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <div>
                <p className="text-sm font-semibold opacity-70 uppercase tracking-wider mb-2">Sensationalism Score</p>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold">{result.sensationalism_score}/100</span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        result.sensationalism_score > 70 ? 'bg-red-500' : 
                        result.sensationalism_score > 40 ? 'bg-orange-400' : 
                        'bg-blue-500'
                      }`}
                      style={{ width: `${result.sensationalism_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-70 uppercase tracking-wider mb-2">Bias Indicator</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase ${
                  result.bias_indicator?.includes('Left') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  result.bias_indicator?.includes('Right') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                }`}>
                  {result.bias_indicator || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Detailed Explanation</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
              "{result.explanation}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyNews;
