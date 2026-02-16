import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { userDB } from "../../firebaseUser";
import {
  Bell,
  Check2All,
  InfoCircle,
  CreditCard,
  ShieldExclamation,
} from "react-bootstrap-icons";

export default function Notifications() {
  const { currentUser } = useCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(userDB, "notifications"),
      where("userId", "==", currentUser.uid),
      where("role", "==", "user"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(data);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const markAsRead = async (id) => {
    await updateDoc(doc(userDB, "notifications", id), { read: true });
  };

  const markAllRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map((n) =>
          updateDoc(doc(userDB, "notifications", n.id), { read: true })
        )
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "creditCard":
        return <CreditCard className="text-blue-400" />;
      case "security":
        return <ShieldExclamation className="text-rose-400" />;
      default:
        return <InfoCircle className="text-slate-400" />;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400 font-medium animate-pulse">
        Loading account activity…
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="text-blue-500" /> Notifications
          </h1>
          <p className="text-slate-400 mt-1">
            Stay updated with your account activity and security alerts.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-blue-500 text-blue-400 rounded-xl transition-all text-sm font-semibold active:scale-95 shadow-lg"
            onClick={markAllRead}
          >
            <Check2All size={18} /> Mark all as read
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="max-w-4xl space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-16 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600">
              <Bell size={40} />
            </div>
            <p className="text-slate-500 font-medium text-lg italic">You're all caught up 🎉</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`group relative flex gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                n.read
                  ? "bg-slate-900/40 border-slate-800/60 opacity-70"
                  : "bg-slate-900 border-slate-700 shadow-xl shadow-blue-900/5 ring-1 ring-blue-500/10"
              }`}
            >
              {/* STATUS INDICATOR DOT */}
              {!n.read && (
                <span className="absolute top-5 right-5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              )}

              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${
                n.read ? "bg-slate-800 border-slate-700" : "bg-blue-500/10 border-blue-500/20"
              }`}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    n.read ? "bg-slate-800 text-slate-500" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {n.type || "system"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {n.createdAt?.toDate().toLocaleString([], { 
                      dateStyle: 'medium', 
                      timeStyle: 'short' 
                    })}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed ${n.read ? "text-slate-400" : "text-slate-200 font-medium"}`}>
                  {n.message}
                </p>

                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}