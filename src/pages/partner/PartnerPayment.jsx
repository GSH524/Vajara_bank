import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { userDB } from "../../firebaseUser";
import toast, { Toaster } from "react-hot-toast";
import { ShieldCheck, CreditCard } from "react-bootstrap-icons";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user, loginUser } = useAuth(); // Added loginUser to refresh local state
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const planPrices = {
    Starter: 2900,
    Growth: 9900,
    Enterprise: 29900,
  };

  const amount = planPrices[user?.plan] || 2900;

  useEffect(() => {
    if (user && !clientSecret) {
      createPaymentIntent();
    }
  }, [user]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: amount.toString(),
          currency: "usd",
          "payment_method_types[]": "card",
        }),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.error.message);
      } else {
        setClientSecret(data.client_secret);
      }
    } catch (err) {
      toast.error("Failed to connect to payment gateway.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName || user.fullName || user.email,
          email: user.email,
        },
      },
    });

    if (result.error) {
      toast.error(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent.status === "succeeded") {
      handleSuccess(result.paymentIntent);
    }
  };

  const handleSuccess = async (paymentIntent) => {
    try {
      // 1. Log the transaction in Firestore
      await setDoc(doc(collection(userDB, "payments")), {
        partnerId: user.uid,
        plan: user.plan,
        amount: amount / 100,
        stripePaymentIntentId: paymentIntent.id,
        status: "success",
        createdAt: serverTimestamp(),
      });

      // 2. Update the Partner's active status
      const partnerRef = doc(userDB, "partners", user.uid);
      await updateDoc(partnerRef, {
        isActive: true,
        subscriptionStart: serverTimestamp(),
      });

      // 3. IMPORTANT: Update the local Auth Context so the ProtectedRoute sees isActive = true
      if (loginUser) {
        await loginUser({ ...user, isActive: true });
      }

      // 4. Show Toast and Navigate
      toast.success("Your payment is successful!", {
        duration: 4000,
        icon: "🚀",
        style: {
          background: "#0f172a",
          color: "#fff",
          border: "1px solid #334155",
        },
      });

      // Use replace: true to prevent user from going back to the payment page
      setTimeout(() => {
        navigate("/partner/dashboard", { replace: true });
      }, 1500);

    } catch (err) {
      console.error("Post-payment error:", err);
      toast.error("Activation error. Please refresh the page.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
        <div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Plan Total</p>
          <h3 className="text-xl font-black text-white">{user?.plan || "Starter"}</h3>
        </div>
        <div className="text-3xl font-black text-white">
          ${(amount / 100).toFixed(2)}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Secure Card Entry</label>
        <div className="p-5 bg-white rounded-2xl shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#020617",
                  "::placeholder": { color: "#94a3b8" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.95] disabled:opacity-50 shadow-xl shadow-blue-900/20"
      >
        {loading ? "Verifying..." : "Confirm & Activate"}
      </button>

      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
        <ShieldCheck className="text-emerald-500" size={14} />
        Encrypted by Vajra Vault
      </div>
    </form>
  );
};

export default function PartnerPayment() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl mb-6 text-3xl font-black">
            V
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Checkout</h2>
          <p className="text-slate-500 mt-2 text-sm">Activate your partner dashboard</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl p-8 sm:p-12 rounded-[3rem] border border-white/5 shadow-2xl">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>

        <p className="mt-10 text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.4em]">
          Secure Gateway Protocol
        </p>
      </div>
    </div>
  );
}