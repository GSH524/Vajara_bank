import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedUserRoute({ children }) {
    const { user, loading } = useAuth();

    // 1. Wait for session restoration (Crucial for Refresh Persistence)
    if (loading) {
        return (
            <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50">
                <div className="h-16 w-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
                    Restoring Session...
                </p>
            </div>
        );
    }

    // 2. Only redirect AFTER loading is false and user is still null
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Render children (UserLayout) if the user is authenticated
    return children;
}