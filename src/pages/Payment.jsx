// src/pages/Payment.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { userDB } from '../firebaseUser'; 
import { ShieldCheck, Lock, ArrowLeft } from 'react-bootstrap-icons';
import toast, { Toaster } from 'react-hot-toast';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ transactionData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    // 1. Create Payment Method (Client Side Demo)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
    } else {
      // 2. SUCCESS: Store in Firebase
      try {
        await addDoc(collection(userDB, "transactions"), {
          senderUid: transactionData.senderInfo.uid,
          senderName: transactionData.senderInfo.firstName,
          recipientName: transactionData.recipientName,
          recipientAccount: transactionData.recipientAccount,
          amount: transactionData.amount,
          date: serverTimestamp(),
          type: "Debit",
          status: "Success",
          stripePaymentId: paymentMethod.id
        });

        toast.success("Transfer Successful!");
        setTimeout(() => navigate('/user/transactions'), 1500);
      } catch (e) {
        console.error("Firebase Error:", e);
        toast.error("Transaction recorded locally only (DB Error)");
        navigate('/user/dashboard');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#fff',
              '::placeholder': { color: '#64748b' },
              iconColor: '#60a5fa'
            },
            invalid: { color: '#f43f5e' },
          },
        }}/>
      </div>
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
      >
        {processing ? "Processing Securely..." : `Pay ₹${transactionData.amount.toLocaleString()}`}
        <Lock size={16} />
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        Invalid Transaction Session. <button onClick={() => navigate(-1)} className="ml-2 underline text-blue-400">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-slate-500 hover:text-white transition">
           <ArrowLeft size={24} />
        </button>
        
        <div className="text-center mb-8 mt-2">
          <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Secure Gateway</h2>
          <p className="text-slate-400 text-sm mt-1">Completing transfer to <span className="text-white font-medium">{data.recipientName}</span></p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between mb-3 border-b border-slate-700 pb-3">
            <span className="text-slate-400 text-sm">Beneficiary Account</span>
            <span className="text-white font-mono">{data.recipientAccount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Total Amount</span>
            <span className="text-emerald-400 font-black text-xl">₹{data.amount.toLocaleString()}</span>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm transactionData={data} />
        </Elements>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
            <Lock size={10} /> 256-Bit SSL Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;