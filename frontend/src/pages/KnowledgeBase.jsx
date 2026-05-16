import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

const KnowledgeBase = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat/ingest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus({ type: 'success', message: response.data.message });
      setFile(null);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || "An error occurred during upload.";
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Train the AI</h1>
        <p className="text-sm text-slate-500">Upload your company manuals, FAQs, and guides. The AI chatbot will instantly learn from these documents to help your customers.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-8">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 bg-slate-50 dark:bg-slate-900/50">
          <UploadCloud className="text-slate-400 mb-4" size={48} />
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">Drag and drop a PDF or Text file here</p>
          <p className="text-xs text-slate-400 mb-6">Supported formats: PDF, TXT (up to 10MB)</p>
          
          <label className="cursor-pointer bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
            Browse Files
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.txt"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {file && (
          <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-500" size={24} />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {uploading ? 'Training AI...' : 'Upload & Train AI'}
            </button>
          </div>
        )}

        {status && (
          <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'}`}>
            {status.type === 'success' ? <CheckCircle size={20} className="mt-0.5" /> : null}
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
