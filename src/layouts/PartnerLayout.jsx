import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function PartnerLayout() {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Define public paths within the partner flow
    const isRegisterPage = location.pathname === "/partner/register";

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4"></div>
                <p className="text-slate-500 font-bold animate-pulse text-xs uppercase tracking-widest">Restoring Session</p>
            </div>
        );
    }

    // Redirect to login only if NOT on the register page and NOT logged in
    if (!user && !isRegisterPage) {
        return <Navigate to="/partner/login" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#020617] selection:bg-blue-500/30">
            <Navbar />
            {/* Added responsive padding and max-width container */}
            <main className="flex-grow pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}