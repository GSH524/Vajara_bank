import React, { useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ChatLeftQuote, Send, CheckCircle } from 'react-bootstrap-icons';
import { collection, addDoc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function Feedback() {
  const { currentUser } = useCurrentUser();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('General');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;

    setLoading(true);

    try {
      // 1. Create the feedback ticket
      await addDoc(collection(userDB, "feedbacks"), {
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || currentUser?.firstName || 'Guest User',
        userEmail: currentUser?.email || 'N/A',
        subject,
        message,
        category,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      // 2. Notify the Admin
      await addDoc(collection(userDB, "notifications"), {
        role: "admin", // Target admin dashboard
        type: "NEW_FEEDBACK",
        title: "New Client Request",
        message: `${currentUser?.displayName || 'A user'} submitted a ${category} request regarding: ${subject}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      setSubmitted(true);
      setSubject('');
      setMessage('');
      setCategory('General');
    } catch (error) {
      console.error("Feedback error: ", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Request Submitted!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thank you for your feedback. Our support team has received your request
            and will review it shortly. You can submit another request if needed.
          </p>
          <button
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
            onClick={() => setSubmitted(false)}
          >
            Submit New Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ChatLeftQuote className="text-blue-500" /> Help & Support
        </h1>
        <p className="text-slate-400 mt-2">Have a question or issue? We are here to help you 24/7.</p>
      </div>

      <div className="max-w-3xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Issue Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer appearance-none"
            >
              <option value="General">General Inquiry</option>
              <option value="Technical">Technical Issue</option>
              <option value="Billing">Billing & Payments</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Briefly describe the issue..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
            <textarea
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about what you're experiencing..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
              required
            ></textarea>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
            <p className="text-sm text-slate-400">
              Submitting as: <span className="text-blue-400 font-bold">{currentUser?.displayName || currentUser?.email || 'Guest'}</span>
            </p>
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98] flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Sending..." : <><Send size={18} /> Submit Request</>}
          </button>
        </form>
      </div>
    </div>
  );
}