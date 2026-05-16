import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, BarChart3, Zap, Globe, Type, Link2, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/analytics/metrics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMetrics(response.data);
      } catch (error) {
        console.error("Error fetching metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [token]);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
          <p className="text-slate-500">Real-time misinformation tracking metrics</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <MetricCard 
          title="Total Verifications" 
          value={metrics?.total_checks || 0} 
          icon={<Globe className="text-blue-500" />} 
          trend="All-time queries" 
        />
        <MetricCard 
          title="Real News Detected" 
          value={metrics?.real_count || 0} 
          icon={<ShieldCheck className="text-emerald-500" />} 
          trend={`${metrics?.real_ratio || 0}% Accuracy`} 
        />
        <MetricCard 
          title="Fake News Exposed" 
          value={metrics?.fake_count || 0} 
          icon={<ShieldAlert className="text-rose-500" />} 
          trend={`${metrics?.fake_ratio || 0}% of queries`} 
        />
        <MetricCard 
          title="Avg. Confidence" 
          value={`${metrics?.avg_confidence || 0}%`} 
          icon={<Zap className="text-amber-500" />} 
          trend="AI Certainty score" 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="text-blue-600" />
            <span>Content Type Distribution</span>
          </h2>
          <div className="space-y-6">
            <TypeProgressBar label="Text Articles" count={metrics?.type_stats?.text || 0} total={metrics?.total_checks} color="bg-blue-500" icon={<Type size={18} />} />
            <TypeProgressBar label="Headlines" count={metrics?.type_stats?.headline || 0} total={metrics?.total_checks} color="bg-indigo-500" icon={<Zap size={18} />} />
            <TypeProgressBar label="External URLs" count={metrics?.type_stats?.url || 0} total={metrics?.total_checks} color="bg-violet-500" icon={<Link2 size={18} />} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl p-8 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Info />
            <span>AI Verification Tip</span>
          </h2>
          <p className="text-blue-100 leading-relaxed text-lg italic">
            "VeriNews AI uses advanced linguistic pattern recognition and cross-reference verification to ensure the highest accuracy. For URL analysis, we scrape the primary content to bypass paywalls and irrelevant ads."
          </p>
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Active Model</p>
                <p className="font-bold">Gemini 2.0 Flash</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-70">System Status</p>
                <p className="font-bold flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  Operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{title}</h3>
      <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{value}</div>
      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{trend}</p>
    </div>
  </motion.div>
);

const TypeProgressBar = ({ label, count, total, color, icon }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-bold">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-500">{count}</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

export default Dashboard;
