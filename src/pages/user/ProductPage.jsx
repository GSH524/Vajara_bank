import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircleFill, ShieldLock } from 'react-bootstrap-icons';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Fallback if accessed directly without state
  const risk = state?.riskLevel || "Medium";
  const product = state?.selectedProduct || "Standard Plan";
  const user = state?.userData;

  const handleFinalSubmit = async () => {
    const loading = toast.loading("Processing your request...");
    try {
      await addDoc(collection(userDB, "applications"), {
        applicantEmail: user.email,
        customerId: user.customerId,
        appliedFor: product,
        riskLevel: risk,
        status: "PENDING",
        timestamp: serverTimestamp()
      });
      toast.success("Application successful!", { id: loading });
      navigate('/user/dashboard');
    } catch (e) {
      toast.error("Error submitting application", { id: loading });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Design Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft /> Back to Vault
        </button>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${risk === 'High' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {risk} Risk Profile
             </span>
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Confirm <span className="text-indigo-500">Application</span></h1>
          <p className="text-slate-400">You are applying for the <span className="text-white font-bold">{product}</span> based on your AI-driven risk assessment.</p>
        </header>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Account Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Applicant</p>
                <p className="font-bold">{user?.fullName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase">CIBIL Score</p>
                <p className="font-bold text-indigo-400">{user?.cibil}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
            <ShieldLock className="text-indigo-500 mt-1" size={20} />
            <div>
              <h4 className="text-sm font-bold text-white">Vajra AI Verification</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Our neural engine has verified your {risk} risk eligibility. This product is optimized for your current financial velocity and repayment history.
              </p>
            </div>
          </div>

          <button 
            onClick={handleFinalSubmit}
            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95 mt-4">
            Authorize & Complete
          </button>
        </div>
      </div>
    </div>
  );
}