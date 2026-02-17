import { Outlet, useNavigate, Navigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function UserLayout() {
  // Destructure loading from context to ensure the component waits for restoration
  const { user, logoutUser, loading } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  // FIX 1: Prevent the component from rendering any content or redirects while loading
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Synchronizing Vault Session...
        </p>
      </div>
    );
  }

  // FIX 2: Only redirect if loading has finished AND user is definitely null
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <UserNavbar user={user} onLogout={handleLogout} />
      <main className="user-content p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer/>
    </div>
  );
}