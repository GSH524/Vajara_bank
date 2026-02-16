import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
    Bell, BellFill, List, X, ChevronDown, Grid1x2, 
    PersonCircle, ArrowLeftRight, Bank, CreditCard, 
    ChatLeftText, House, InfoCircle, Envelope, BoxArrowRight,
    ArrowDownLeft, Trash 
} from "react-bootstrap-icons";
import { collection, query, where, onSnapshot, doc, writeBatch } from "firebase/firestore";
import { userDB } from "../firebaseUser";

export default function UserNavbar({ user, onLogout }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [liveProfile, setLiveProfile] = useState(null); 
    
    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    const navLinks = [
        { name: "Dashboard", path: "/user/dashboard", icon: <Grid1x2 /> },
        { name: "Transactions", path: "/user/transactions", icon: <ArrowLeftRight /> },
    ];

    const servicesLinks = [
        { name: "Loans", path: "/user/loans", icon: <Bank /> },
        { name: "Credit Cards", path: "/user/cards", icon: <CreditCard /> },
        { name: "Feedback", path: "/user/feedback", icon: <ChatLeftText /> },
    ];

    // 1. LIVE PROFILE SYNC
    useEffect(() => {
        if (!user?.email) return;
        const q = query(collection(userDB, "users1"), where("Email", "==", user.email));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setLiveProfile({
                    firstName: data["First Name"] || "",
                    lastName: data["Last Name"] || "",
                    balance: data["Account Balance"] || 0,
                    accountNumber: data["Account_Number"] || "N/A",
                    ...data
                });
            }
        });
        return () => unsubscribe();
    }, [user]);

    // 2. NOTIFICATION LISTENER (Incoming Money)
    useEffect(() => {
        if (!user?.email) return;
        const q = query(
            collection(userDB, "transfer"), 
            where("senderEmail", "==", user.email.toLowerCase()), 
            where("type", "==", "Deposit")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(notifs);
        });
        return () => unsubscribe();
    }, [user]);

    const handleClearNotifications = async () => {
        if (notifications.length === 0) return;
        try {
            const batch = writeBatch(userDB);
            notifications.forEach((n) => batch.delete(doc(userDB, "transfer", n.id)));
            await batch.commit();
        } catch (err) { console.error("Clear failed:", err); }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const desktopLinkStyle = ({ isActive }) => 
        `px-3 py-2 text-sm font-bold transition-all ${isActive ? "text-blue-400" : "text-slate-400 hover:text-white"}`;

    return (
        <>
            <nav className="sticky top-0 z-[100] bg-slate-900/90 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8">
                <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
                    
                    {/* LEFT: BRAND & NAV */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-xl font-black text-white tracking-tighter italic shrink-0">
                            VAJRA<span className="text-blue-500">BANK</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-1">
                            {/* Static Public Links */}
                            <NavLink to="/" className={desktopLinkStyle}>Home</NavLink>
                            <NavLink to="/about" className={desktopLinkStyle}>About</NavLink>
                            <NavLink to="/contact" className={desktopLinkStyle}>Contact</NavLink>
                            
                            <div className="h-4 w-[1px] bg-white/10 mx-2" />

                            {/* Dynamic User Links */}
                            {navLinks.map((link) => (
                                <NavLink key={link.path} to={link.path} className={desktopLinkStyle}>
                                    {link.name}
                                </NavLink>
                            ))}

                            {/* SERVICES DROPDOWN */}
                            <div className="relative group px-1">
                                <button className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-400 group-hover:text-white transition-all">
                                    Services <ChevronDown size={10} className="group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-full left-0 mt-1 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                                    <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2 mt-2">
                                        {servicesLinks.map((s) => (
                                            <NavLink key={s.path} to={s.path} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                {s.icon} {s.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: NOTIFS & PROFILE */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-400 hover:text-white relative">
                                {notifications.length > 0 ? (
                                    <>
                                        <BellFill className="text-blue-500" size={20} />
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                                    </>
                                ) : <Bell size={20} />}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110]">
                                    <div className="p-4 border-b border-white/5 font-bold text-sm text-white flex justify-between items-center bg-white/5">
                                        <span>Alerts</span>
                                        <button onClick={handleClearNotifications} className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 uppercase tracking-widest">
                                            <Trash size={12}/> Clear All
                                        </button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto p-2">
                                        {notifications.length === 0 ? (
                                            <p className="text-xs text-slate-500 p-6 text-center italic">No new activity</p>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className="p-3 hover:bg-white/5 rounded-lg border-b border-white/5 last:border-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <ArrowDownLeft className="text-emerald-500" size={12}/>
                                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Credit Received</span>
                                                    </div>
                                                    <p className="text-xs text-slate-300">You received ₹{n.amount?.toLocaleString()} for {n.reason}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-1 pr-2 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10 transition-all">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                    {liveProfile?.firstName?.[0] || "U"}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-[10px] text-white font-bold leading-none uppercase">{liveProfile?.firstName} {liveProfile?.lastName}</p>
                                    <p className="text-[9px] text-emerald-500 font-mono mt-0.5">₹{liveProfile?.balance?.toLocaleString()}</p>
                                </div>
                                <ChevronDown size={10} className="text-slate-500" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-60 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110] animate-in fade-in zoom-in-95">
                                    <div className="p-4 border-b border-white/5 bg-white/5 text-center">
                                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Vault ID</p>
                                        <p className="text-xs font-mono text-white mt-1 select-all">{liveProfile?.accountNumber}</p>
                                    </div>
                                    <div className="p-2">
                                        <NavLink to="/user/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                            <PersonCircle size={18} /> Update Profile
                                        </NavLink>
                                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1">
                                            <BoxArrowRight size={18} /> Secure Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button className="lg:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-white/5 py-4 bg-slate-900">
                        <div className="flex flex-col gap-2 px-6">
                            <Link to="/" className="text-slate-400 font-bold text-sm py-2">Home</Link>
                            <Link to="/about" className="text-slate-400 font-bold text-sm py-2">About</Link>
                            <Link to="/contact" className="text-slate-400 font-bold text-sm py-2">Contact</Link>
                            <div className="h-[1px] bg-white/5 my-2" />
                            {[...navLinks, ...servicesLinks].map((link) => (
                                <NavLink key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-slate-300 font-medium mb-1">
                                    {link.icon} {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}