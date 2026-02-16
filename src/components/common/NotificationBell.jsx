import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell,
  CheckCircle,
  XCircle,
  InfoCircle,
  Megaphone,
  Trash3,
  Check2All
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import { adService } from '../../services/adService';
import toast from 'react-hot-toast';

export default function NotificationBell({ user: propUser }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const currentUser = propUser || authService.getUser();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* -------------------- FETCH NOTIFICATIONS -------------------- */
  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const uid = currentUser.uid || currentUser.id;
      const role = currentUser.role;
      const data = await notificationService.getNotifications(uid, role);
      const currentNotifications = Array.isArray(data) ? data : (data?.data || []);

      setNotifications(currentNotifications);
      const newUnreadCount = currentNotifications.filter(n => !n.isRead).length;
      setUnreadCount(newUnreadCount);

      if (newUnreadCount > 0 && isOpen) {
        const latestUnread = currentNotifications.find(n => !n.isRead);
        if (latestUnread) {
          toast.success(`New: ${latestUnread.title}`, { icon: '🔔' });
        }
      }
    } catch (err) {
      console.error('❌ [NOTIF BELL] Error:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    fetchNotifications();
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('notifications-updated', handleUpdate);
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      window.removeEventListener('notifications-updated', handleUpdate);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  /* -------------------- CLICK OUTSIDE -------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* -------------------- STYLE HELPERS -------------------- */
  const getIcon = (type) => {
    switch (type) {
      case 'AD_SUBMITTED': return <Megaphone className="text-indigo-400" />;
      case 'AD_APPROVED': return <CheckCircle className="text-emerald-400" />;
      case 'AD_REJECTED': return <XCircle className="text-red-400" />;
      default: return <InfoCircle className="text-blue-400" />;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'AD_SUBMITTED': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'AD_APPROVED': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'AD_REJECTED': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  /* -------------------- ACTION HANDLERS -------------------- */
  const markAsRead = async (notifId) => {
    try {
      await notificationService.markAsRead(notifId);
      setNotifications(prev => prev.map(n => (n._id === notifId || n.id === notifId) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleNotificationClick = async (notif) => {
    const notifId = notif._id || notif.id;
    if (!notif.isRead) await markAsRead(notifId);
    setIsOpen(false);
    if (notif.type === 'AD_SUBMITTED' && currentUser?.role === 'admin') {
      navigate('/admin/ads', { state: { openAdId: notif.adId } });
    } else if (['AD_APPROVED', 'AD_REJECTED'].includes(notif.type) && currentUser?.role === 'partner') {
      navigate('/partner/dashboard');
    }
  };

  const handleDelete = async (e, notifId) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notifId);
      setNotifications(prev => prev.filter(n => n._id !== notifId && n.id !== notifId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleAdminAction = async (e, notif, action) => {
    e.stopPropagation();
    try {
      const adId = notif.adId;
      if (action === 'approve') {
        await adService.approveAd(adId);
        toast.success('Authorized');
      } else {
        const reason = window.prompt('Reason:');
        if (reason === null) return;
        await adService.rejectAd(adId, reason || 'Rejected');
        toast.success('Terminated');
      }
      await markAsRead(notif._id || notif.id);
      fetchNotifications();
    } catch (err) { toast.error(err.message); }
  };

  const handleMarkAllRead = async () => {
    try {
      const uid = currentUser.uid || currentUser.id;
      await notificationService.markAllAsRead(uid, currentUser.role);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Registry Cleared');
    } catch (err) { console.error(err); }
  };

  if (!currentUser) return null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* TRIGGER ICON */}
      <button
        className="relative p-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-4 ring-[#020617] animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 md:w-96 origin-top-right rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* HEADER */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5 rounded-t-3xl">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Signal Intelligence</h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-tighter transition-colors"
              >
                <Check2All size={14} /> Mark All Read
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {loading && notifications.length === 0 ? (
              <div className="p-10 text-center text-xs font-bold text-slate-600 uppercase tracking-widest animate-pulse">Scanning frequency...</div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-slate-900 border border-white/5">
                  <Bell size={24} className="text-slate-700" />
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[.2em]">All sectors clear</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.03]">
                {notifications.map(notif => {
                  const notifId = notif._id || notif.id;
                  return (
                    <div
                      key={notifId}
                      className={`relative group p-4 transition-all hover:bg-white/[0.03] cursor-pointer ${!notif.isRead ? 'bg-indigo-500/[0.02]' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      {/* UNREAD INDICATOR */}
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                      )}

                      <div className="flex gap-4">
                        <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${getBgClass(notif.type)}`}>
                          {getIcon(notif.type)}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h5 className={`text-xs font-bold leading-tight truncate ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>
                              {notif.title}
                            </h5>
                            <button
                              onClick={(e) => handleDelete(e, notifId)}
                              className="shrink-0 p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash3 size={12} />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal mb-3 line-clamp-2 italic">
                            {notif.message}
                          </p>

                          {/* ADMIN QUICK ACTIONS */}
                          {notif.type === 'AD_SUBMITTED' && currentUser.role === 'admin' && !notif.isRead && (
                            <div className="flex gap-2 mb-2">
                              <button
                                onClick={(e) => handleAdminAction(e, notif, 'approve')}
                                className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                              >
                                Authorize
                              </button>
                              <button
                                onClick={(e) => handleAdminAction(e, notif, 'reject')}
                                className="flex-1 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                              >
                                Terminate
                              </button>
                            </div>
                          )}

                          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : 'Realtime'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-3 bg-black/20 text-center rounded-b-3xl">
             <div className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.5em]">System-Log-End</div>
          </div>
        </div>
      )}
    </div>
  );
}