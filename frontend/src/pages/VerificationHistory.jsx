import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const VerificationHistory = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/news/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(response.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Verification History</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Browse your past news authenticity checks.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-800">
          <span className="text-blue-700 font-bold text-xl">{history.length}</span>
          <span className="text-slate-500 dark:text-slate-400 ml-2 font-medium">Total Checks</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No history yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start verifying news to build your history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {history.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.prediction === 'Real' ? 'bg-emerald-100 text-emerald-700' : 
                      item.prediction === 'Fake' ? 'bg-rose-100 text-rose-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.prediction}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {format(new Date(item.created_at), 'PPP p')}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {item.input_data}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 italic">
                    "{item.explanation}"
                  </p>
                </div>
                <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sensational</p>
                    <p className={`text-xl font-black ${
                      item.sensationalism_score > 70 ? 'text-red-500' :
                      item.sensationalism_score > 40 ? 'text-orange-400' :
                      'text-blue-500'
                    }`}>{item.sensationalism_score}</p>
                  </div>
                  <div className="text-center border-l border-slate-100 dark:border-slate-800 pl-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bias</p>
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">{item.bias_indicator || 'N/A'}</p>
                  </div>
                  <div className="text-center border-l border-slate-100 dark:border-slate-800 pl-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
                    <p className="text-2xl font-black text-blue-700">{item.confidence_score}%</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-700 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationHistory;
