import React from 'react';
import { ShieldCheck, ShieldX, Mail, User } from 'lucide-react';

export default function UsersTable() {
  const users = [
    { id: 1, name: 'Mahesh', email: 'mahesh@nexagen.com', status: 'Active' },
    { id: 2, name: 'Ravi', email: 'ravi@nexagen.com', status: 'Blocked' },
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-950/20">
        <div className="flex items-center gap-2">
          <User size={16} className="text-indigo-500" />
          <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">User Directory</h4>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
          Total Auth: {users.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identify</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Communication Channel</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Auth Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.02]">
            {users.map((user) => (
              <tr key={user.id} className="group hover:bg-indigo-500/[0.03] transition-colors">
                {/* NAME & AVATAR */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-slate-300 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
                      {user.name.substring(0, 1)}
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">{user.name}</span>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-600" />
                    <span className="text-xs font-medium text-slate-400 font-mono tracking-tight">{user.email}</span>
                  </div>
                </td>

                {/* STATUS BADGE */}
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      user.status === 'Active' 
                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] group-hover:bg-emerald-500/10' 
                        : 'bg-red-500/5 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] group-hover:bg-red-500/10'
                    }`}>
                      {user.status === 'Active' ? (
                        <ShieldCheck size={12} className="animate-pulse" />
                      ) : (
                        <ShieldX size={12} />
                      )}
                      {user.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTION FOOTER */}
      <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex justify-end">
        <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-2 transition-all">
          Manage Permissions <ShieldCheck size={14} />
        </button>
      </div>
    </div>
  );
}