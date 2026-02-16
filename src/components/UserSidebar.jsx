import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { X, Grid1x2, PersonCircle, ArrowLeftRight, Bank, CreditCard, ChatLeftText } from "react-bootstrap-icons";

export default function UserSidebar({ isOpen, onClose }) {
  const { currentUser } = useCurrentUser();

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <Grid1x2 /> },
    { name: "Profile", path: "/user/profile", icon: <PersonCircle /> },
    { name: "Transactions", path: "/user/transactions", icon: <ArrowLeftRight /> },
    { name: "Loans", path: "/user/loans", icon: <Bank /> },
    { name: "Credit Cards", path: "/user/cards", icon: <CreditCard /> },
    { name: "Feedback", path: "/user/feedback", icon: <ChatLeftText /> },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside className={`
        h-full w-full flex flex-col
      `}>
        <div className="flex flex-col h-full p-6">
          
          {/* HEADER / BRAND */}
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-white tracking-tighter">
                SECURE<span className="text-blue-500">BANK</span>
              </h2>
              <button 
                className="lg:hidden p-1 text-slate-400 hover:text-white"
                onClick={onClose}
              >
                <X size={28} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Welcome, <span className="text-slate-300">{currentUser ? currentUser.firstName : "User"}</span>
            </p>
          </div>

          {/* MENU */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* FOOTER */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Account Tier</p>
              <p className="text-sm font-bold text-blue-400">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}