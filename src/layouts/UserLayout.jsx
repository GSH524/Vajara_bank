import { Outlet, useNavigate, Navigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import toast from "react-hot-toast"; // Added toast import

export default function UserLayout() {
  const { user, logoutUser, loading } = useAuth(); 
  const navigate = useNavigate();

  // Added Toast to the user logout flow
  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logout successfully");
    navigate("/");
  };

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