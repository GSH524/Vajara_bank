import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAuth(); 

  // 1. Wait for session restoration during refresh
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#080f25] flex flex-col items-center justify-center z-50">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-blue-500/10 animate-pulse"></div>
        </div>
        <h2 className="mt-6 text-slate-400 font-medium tracking-widest text-xs uppercase animate-pulse">
          Verifying Admin Session
        </h2>
      </div>
    );
  }

  // 2. Only redirect if loading is finished AND no admin session exists
  if (!admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}