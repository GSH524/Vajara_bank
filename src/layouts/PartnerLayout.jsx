import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function PartnerLayout() {
    const { user, loading } = useAuth();

    // Wait for the AuthProvider to restore the session
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0b1220]">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    // If no user is found after loading, redirect to login
    if (!user) {
        return <Navigate to="/partner/login" replace />;
    }

    return (
        <div className="partner-layout" style={{ backgroundColor: "#0b1220", minHeight: "100vh" }}>
            <Navbar />
            <div className="partner-content" style={{ marginTop: "20px" }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}