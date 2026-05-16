import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MoreHorizontal, Plus, Inbox } from 'lucide-react';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tickets/');
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createSampleTicket = async () => {
    const samples = [
      { title: "Can't log into my account", description: "I've tried resetting my password but I'm still getting an error.", email: "user@example.com" },
      { title: "Billing question", description: "Why was I charged twice this month?", email: "angry@example.com" },
      { title: "Great service!", description: "Just wanted to say thanks for the quick help yesterday.", email: "happy@example.com" }
    ];
    const sample = samples[Math.floor(Math.random() * samples.length)];
    
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/tickets/', {
        title: sample.title,
        description: sample.description,
        customer_email: sample.email
      });
      await fetchTickets();
    } catch (error) {
      console.error("Error creating sample ticket", error);
      alert("Failed to create sample ticket. Check server console.");
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading tickets...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="text-sm text-slate-500">Manage and respond to customer inquiries. AI automatically analyzes sentiment and priority.</p>
        </div>
        <button 
          onClick={createSampleTicket}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
        >
          <Plus size={16} />
          <span>Create Sample Ticket</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status & Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sentiment</th>
              <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{ticket.title}</span>
                    <span className="text-xs text-slate-500">#{ticket.id} • {new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-500 dark:text-slate-300">{ticket.customer_email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 text-red-200' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-500 capitalize dark:text-slate-300">{ticket.sentiment || 'Unknown'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary/80"><MoreHorizontal size={18} /></button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox size={48} className="text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No tickets found</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">Click the "Create Sample Ticket" button above to generate a test ticket and see the AI analysis in action.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tickets;
