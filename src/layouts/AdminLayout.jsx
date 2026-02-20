import { Outlet, useNavigate, Navigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer"
import toast from "react-hot-toast"; // Added toast import

export default function AdminLayout() {
  const { admin, logoutAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Added Toast & Redirect to Home
  const handleLogout = async () => {
    await logoutAdmin();
    toast.success("Logout successfully");
    navigate("/"); 
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <AdminNavbar admin={admin} onLogout={handleLogout} />
      <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
        <div className="max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer/>
    </div>
  );
}