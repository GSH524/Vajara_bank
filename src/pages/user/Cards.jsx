import React, { useState, useEffect, useMemo } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import {
  CreditCard as CardIcon,
  Wallet2,
  ShieldCheck,
  Lock,
  ClockHistory,
  PieChartFill,
  CheckCircleFill,
  HourglassSplit,
  Check2Circle,
  ChevronDown
} from 'react-bootstrap-icons';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import CardVisual from '../../components/user/CardVisual';
import CardApplicationForm from '../../components/user/CardApplicationForm';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Cards() {
  const { currentUser } = useCurrentUser();
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  const hasCard = !!currentUser?.cardId;

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(
      collection(userDB, 'creditCardApplications'),
      where('userId', '==', currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.toDate?.() || new Date(0)) - (a.createdAt?.toDate?.() || new Date(0)));
      setApplications(apps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const analytics = useMemo(() => {
    if (!currentUser?.cardTransactions) return null;
    const categories = {};
    currentUser.cardTransactions.forEach(tx => {
      const cat = mapTransactionCategory(tx.reason);
      categories[cat] = (categories[cat] || 0) + tx.amount;
    });
    return {
      pieData: Object.entries(categories).map(([name, value]) => ({ name, value }))
    };
  }, [currentUser]);

  const handleApply = async (data) => {
    try {
      await addDoc(collection(userDB, 'creditCardApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.fullName,
        ...data,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Application failed. Please try again.");
    }
  };

  const mapTransactionCategory = (reason) => {
    const r = reason.toLowerCase();
    if (r.includes('amazon') || r.includes('flipkart') || r.includes('shopping')) return 'Shopping';
    if (r.includes('swiggy') || r.includes('zomato') || r.includes('restaurant') || r.includes('food')) return 'Food';
    if (r.includes('uber') || r.includes('ola') || r.includes('fuel') || r.includes('travel')) return 'Travel';
    if (r.includes('netflix') || r.includes('prime') || r.includes('movies')) return 'Entertainment';
    if (r.includes('bill') || r.includes('recharge') || r.includes('electricity')) return 'Bills';
    return 'Others';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-slate-200">
          <p className="font-bold text-slate-800">{`${payload[0].name}: ₹${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse font-medium">Syncing with secure vault...</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <CardIcon className="text-blue-500" /> Credit Portfolios
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Analyze, manage and apply for your credit products.</p>
      </div>

      {!hasCard ? (
        showForm ? (
          <CardApplicationForm
            user={currentUser}
            onSubmit={handleApply}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            {applications.length > 0 && applications[0].status === 'pending' ? (
              <PendingState app={applications[0]} />
            ) : (
              <EmptyState onApply={() => setShowForm(true)} />
            )}
          </>
        )
      ) : (
        <div className="space-y-6 animate-in fade-in duration-700">
          {/* WELCOME BANNER */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-blue-900/10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">🎊 Welcome to VajraBank Credit Cards</h2>
              <p className="text-blue-200 text-sm md:text-base">Spend Smart, Pay Smart! Your {currentUser.cardType} is now active.</p>
            </div>
            <div className="text-4xl hidden sm:block drop-shadow-lg">🚀</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: VISUAL & QUICK ACTIONS */}
            <section className="lg:col-span-5 space-y-6">
              <CardVisual
                type={currentUser.cardType || 'Vajra Classic'}
                number={currentUser.cardId}
                holder={currentUser.fullName}
                expiry="12/28"
                blocked={isBlocked}
              />

              {/* UTIL RING CARD */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 shadow-xl">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke={currentUser.creditUtilization > 0.7 ? "#ef4444" : "#3b82f6"}
                      strokeWidth="8"
                      strokeDasharray={`${(currentUser.creditUtilization || 0) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{Math.round((currentUser.creditUtilization || 0) * 100)}%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Credit Utilization</h4>
                  <div className="text-2xl font-bold text-white mb-2">₹{(currentUser.creditBalance || 0).toLocaleString()}</div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <CheckCircleFill className="text-emerald-500" /> Limit Available: ₹{((currentUser.creditLimit || 0) - (currentUser.creditBalance || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* INFORMATION HUB */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Card Hub</h3>
                <CardAccordion
                  title="Card Benefits & Rewards"
                  icon={<Check2Circle className="text-emerald-400" />}
                  content={
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><strong className="text-slate-200">Cashback:</strong> Up to 5% on online spends.</li>
                      <li><strong className="text-slate-200">Lounge:</strong> {currentUser.cardType === 'Vajra Platinum' ? 'Unlimited International.' : '2 Domestic visits / quarter.'}</li>
                      <li><strong className="text-slate-200">Rewards:</strong> 4X points per ₹100 spent.</li>
                    </ul>
                  }
                />
                <CardAccordion
                  title="Usage Rules & Safety"
                  icon={<ShieldCheck className="text-blue-400" />}
                  content={
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li><strong className="text-slate-200">Billing:</strong> Statement generates on 15th.</li>
                      <li><strong className="text-slate-200">Utilization:</strong> Keep under 30% for score health.</li>
                    </ul>
                  }
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  onClick={() => setIsBlocked(!isBlocked)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg ${
                    isBlocked ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-rose-600 shadow-rose-900/20'
                  }`}
                >
                  {isBlocked ? <ShieldCheck size={20}/> : <Lock size={20}/>} {isBlocked ? 'Unblock Card' : 'Block Card'}
                </button>
              </div>

              {/* BILLING INFO */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                  <ClockHistory className="text-blue-400" /> Upcoming Statement
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Minimum Due</span>
                    <span className="text-white font-bold">₹{currentUser.minPaymentDue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Due Date</span>
                    <span className="text-rose-400 font-bold px-2 py-1 bg-rose-400/10 rounded-lg">{currentUser.paymentDueDate || '25th Oct'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN: ANALYTICS & HISTORY */}
            <section className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-full flex flex-col">
                <h4 className="text-white font-bold flex items-center gap-2 mb-8">
                  <PieChartFill className="text-blue-500" /> Spending Distribution
                </h4>
                <div className="h-64 md:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.pieData}
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {analytics?.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-bold">Recent Card Swipes</h4>
                    <button className="text-blue-400 text-sm hover:underline font-medium transition">See All</button>
                  </div>
                  <div className="space-y-3">
                    {(currentUser.cardTransactions || []).length === 0 ? (
                      <div className="bg-slate-800/20 border border-slate-800/50 rounded-2xl py-12 text-center text-slate-500 text-sm italic">
                        No transactions recorded yet.
                      </div>
                    ) : (
                      currentUser.cardTransactions?.slice(0, 5).map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl hover:bg-slate-800/50 transition border border-transparent hover:border-slate-700">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 border border-slate-700">
                              <Wallet2 size={18} />
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">{tx.reason}</div>
                              <div className="text-slate-500 text-xs">{tx.date}</div>
                            </div>
                          </div>
                          <div className="text-white font-bold text-sm">- ₹{tx.amount.toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}

const EmptyState = ({ onApply }) => (
  <div className="max-w-xl mx-auto mt-16 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center shadow-2xl">
    <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
      <CardIcon size={40} />
    </div>
    <h2 className="text-2xl font-black text-white mb-3">Unlock Premium Benefits</h2>
    <p className="text-slate-400 mb-10 leading-relaxed">Elevate your lifestyle with Vajra Credit Cards. Exclusive rewards, lounge access, and smart analytics await.</p>
    <button 
      onClick={onApply} 
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
    >
      Start Application
    </button>
  </div>
);

const PendingState = ({ app }) => (
  <div className="max-w-xl mx-auto mt-16 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center shadow-2xl">
    <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20 animate-pulse">
      <HourglassSplit size={40} className="animate-[spin_4s_linear_infinite]" />
    </div>
    <h2 className="text-2xl font-black text-white mb-3">Review in Progress</h2>
    <p className="text-slate-400 leading-relaxed">Your application for <span className="text-amber-500 font-bold">{app.cardType}</span> is being vetted by our secure verification systems.</p>
  </div>
);

const CardAccordion = ({ title, icon, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition text-left"
      >
        <div className="flex items-center gap-3 font-semibold text-slate-200 text-sm">
          {icon} <span>{title}</span>
        </div>
        <ChevronDown 
          className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
        />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 p-4 border-t border-slate-800' : 'max-h-0'}`}>
        {content}
      </div>
    </div>
  );
};