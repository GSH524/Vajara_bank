import React from 'react';
import { Wifi } from 'react-bootstrap-icons';

const CardVisual = ({ userData }) => {
    // Map Firestore fields: 'Card Type', 'Account_Number', 'First Name', 'PAN_Card'
    const cardNumber = userData?.Account_Number || "00000000000";
    const holder = `${userData?.["First Name"]} ${userData?.["Last Name"]}`;
    const type = userData?.["Card Type"] || "Visa";

    return (
        <div className="relative w-full max-w-[380px] aspect-[1.58] mx-auto group perspective-1000">
            <div className="relative w-full h-full p-8 rounded-[20px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-900 border border-white/20 shadow-2xl text-white flex flex-col justify-between overflow-hidden">
                {/* Hologram Blur */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                
                <div className="flex justify-between items-start z-10">
                    <span className="text-xl font-black italic tracking-tighter uppercase">Vajra<span className="text-indigo-300">Bank</span></span>
                    <Wifi size={24} className="text-indigo-200" />
                </div>

                <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-md shadow-inner mb-2" />

                <div className="text-xl md:text-2xl font-mono tracking-[4px] z-10 filter drop-shadow-md">
                    XXXX XXXX XXXX {String(cardNumber).slice(-4)}
                </div>

                <div className="flex justify-between items-end z-10">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Card Holder</p>
                        <p className="text-sm font-bold uppercase tracking-tight">{holder}</p>
                    </div>
                    <div className="text-right">
                         <span className="text-lg font-black italic">{type}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardVisual;