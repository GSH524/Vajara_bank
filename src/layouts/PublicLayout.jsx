import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
 


export default function PublicLayout() {
    return (
        <div className="public-layout public-page">
            <Navbar />
            <main className="public-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
