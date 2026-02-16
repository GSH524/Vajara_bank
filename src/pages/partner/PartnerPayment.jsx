import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { userDB } from "../../firebaseUser";
import toast, { Toaster } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const planPrices = {
        "Starter": 2900, 
        "Growth": 9900,
        "Enterprise": 29900
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
                    "Authorization": `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    amount: amount.toString(),
                    currency: "usd",
                    "payment_method_types[]": "card"
                })
            });

            const data = await response.json();
            if (data.error) {
                toast.error(data.error.message);
            } else {
                setClientSecret(data.client_secret);
            }
        } catch (err) {
            toast.error("Failed to initialize payment.");
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
                    name: user.displayName || user.email,
                    email: user.email
                },
            },
        });

        if (result.error) {
            toast.error(result.error.message);
            setLoading(false);
        } else if (result.paymentIntent.status === 'succeeded') {
            await handleSuccess(result.paymentIntent);
        }
    };

    const handleSuccess = async (paymentIntent) => {
        try {
            await setDoc(doc(collection(userDB, "payments")), {
                partnerId: user.uid,
                plan: user.plan,
                amount: amount / 100,
                stripePaymentIntentId: paymentIntent.id,
                status: "success",
                createdAt: serverTimestamp()
            });

            await updateDoc(doc(userDB, "partners", user.uid), {
                isActive: true,
                subscriptionStart: serverTimestamp()
            });

            toast.success("Payment successful! Redirecting...");
            setTimeout(() => navigate("/partner/dashboard"), 2000);
        } catch (err) {
            toast.error("Profile update failed. Contact support.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Plan</p>
                    <h3 className="text-lg font-bold text-slate-900">{user?.plan} Plan</h3>
                </div>
                <div className="text-2xl font-black text-blue-600">
                    ${(amount / 100).toFixed(2)}
                </div>
            </div>

            <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Details</label>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 transition-all">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#1e293b',
                                fontFamily: 'Inter, sans-serif',
                                '::placeholder': { color: '#94a3b8' },
                            },
                            invalid: { color: '#ef4444' },
                        },
                    }} />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={!stripe || loading || !clientSecret} 
                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                    </span>
                ) : "Complete Subscription"}
            </button>

            <p className="text-center text-xs text-slate-400 font-medium">
                🛡️ Secure 256-bit SSL Encrypted Payment
            </p>
        </form>
    );
};

export default function PartnerPayment() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Toaster position="top-right" />
            
            <div className="w-full max-w-md">
                {/* Branding / Back Link */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 mb-4 text-2xl font-bold">
                        V
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Checkout</h2>
                    <p className="text-slate-500">Upgrade to start publishing campaigns</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200 border border-white">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
                
                <p className="mt-8 text-center text-slate-400 text-sm italic">
                    Publish your first ad for free after subscription
                </p>
            </div>
        </div>
    );
}