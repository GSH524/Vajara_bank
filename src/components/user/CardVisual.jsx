import React, { useState } from 'react';
import { Wifi, ShieldLock } from 'react-bootstrap-icons';

const CardVisual = ({ userData }) => {
    const [showCvv, setShowCvv] = useState(false);

    // RESOLVED: Robust naming logic to prevent "undefined undefined"
    const fName = userData?.["First Name"] || userData?.firstName || "";
    const lName = userData?.["Last Name"] || userData?.lastName || "";
    const holder = userData?.fullName || `${fName} ${lName}`.trim() || "Valued Member";

    // Map other Firestore fields
    const cardNumber = userData?.Account_Number || userData?.accountNumber || "00000000000";
    const type = userData?.["Card Type"] || userData?.cardType || "Vajra Infinite";
    const expiry = userData?.cardExpiry || "12/28";
    const cvv = userData?.cvv || "777";

    return (
        <div className="relative w-full max-w-[380px] aspect-[1.58] mx-auto group perspective-1000 animate-in fade-in zoom-in duration-500">
            <div className={`relative w-full h-full p-8 rounded-[24px] border border-white/20 shadow-2xl text-white flex flex-col justify-between overflow-hidden transition-all duration-700 ${
                type.includes('Infinite') ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-900'
            }`}>
                
                {/* Holographic Reflection Effect */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000 group-hover:-translate-x-10 group-hover:translate-y-10" />
                
                {/* Top Section: Branding */}
                <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col">
                        <span className="text-xl font-black italic tracking-tighter uppercase">Vajra<span className="text-indigo-400">Bank</span></span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-50">Nexus Network</span>
                    </div>
                    <Wifi size={24} className="text-indigo-200" />
                </div>

                {/* EMV Chip */}
                <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 rounded-lg shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:4px_4px]" />
                </div>

                {/* Card Number Section */}
                <div className="text-xl md:text-2xl font-mono tracking-[4px] z-10 filter drop-shadow-lg py-2">
                    XXXX XXXX XXXX {String(cardNumber).slice(-4)}
                </div>

                {/* Bottom Section: Details & Security */}
                <div className="flex justify-between items-end z-10">
                    <div className="flex-1">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Card Holder</p>
                        <p className="text-sm font-black uppercase tracking-wider truncate mr-4">{holder}</p>
                    </div>

                    <div className="flex gap-4 text-right">
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Expires</p>
                            <p className="text-xs font-bold font-mono">{expiry}</p>
                        </div>
                        <div className="cursor-pointer group/cvv" onClick={() => setShowCvv(!showCvv)}>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1 flex items-center justify-end gap-1">
                                CVV <ShieldLock size={8}/>
                            </p>
                            <p className="text-xs font-bold font-mono bg-white/10 px-2 rounded transition-colors group-hover/cvv:bg-white/20">
                                {showCvv ? cvv : '***'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subtle Brand Tier Label */}
                <div className="absolute bottom-4 right-8 opacity-20">
                    <span className="text-4xl font-black italic tracking-tighter uppercase select-none">{type.split(' ')[1]}</span>
                </div>
            </div>
        </div>
    );
};

export default CardVisual;