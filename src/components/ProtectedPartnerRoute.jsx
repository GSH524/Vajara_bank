import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedPartnerRoute({ requirePayment = true }) {
    const { user, loading } = useAuth();

    // UPGRADED: Full-screen branded loading state
    if (loading) {
        return (
            <div className="fixed inset-0 bg-[#080f25] flex flex-col items-center justify-center z-50">
                <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    {/* Inner pulsing core */}
                    <div className="absolute inset-2 bg-blue-500/10 rounded-full animate-pulse flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                </div>
                <p className="mt-4 text-slate-400 text-sm font-medium tracking-widest uppercase animate-pulse">
                    Securing Connection
                </p>
            </div>
        );
    }

    // Role check
    if (!user || user.role !== "partner") {
        return <Navigate to="/partner/login" replace />;
    }

    // Payment/Activation check
    if (requirePayment && !user.isActive) {
        return <Navigate to="/partner/payment" replace />;
    }

    return <Outlet />;
}