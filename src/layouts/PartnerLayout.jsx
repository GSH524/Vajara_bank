import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PartnerLayout() {
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
