import React, { useState } from 'react';
import { Wifi } from 'react-bootstrap-icons';
import { maskCardNumber } from '../../utils/cardUtils';

const CardVisual = ({ type, number, holder, expiry, blocked }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isFlipped, setIsFlipped] = useState(false);

    const handleMouseMove = (e) => {
        if (isFlipped) {
            setTilt({ x: 0, y: 0 });
            return;
        }
        const card = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - card.left) / card.width;
        const y = (e.clientY - card.top) / card.height;
        const rotateX = (y - 0.5) * 20;
        const rotateY = (x - 0.5) * -20;
        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    const getCardTheme = (cardType) => {
        switch (cardType) {
            case 'Vajra Platinum':
                return {
                    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950',
                    text: 'text-slate-100',
                    accent: 'text-indigo-400',
                    hologram: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
                };
            case 'Vajra Gold':
                return {
                    bg: 'bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700',
                    text: 'text-white',
                    accent: 'text-amber-200',
                    hologram: 'bg-gradient-to-br from-white/20 to-transparent'
                };
            default: // Classic
                return {
                    bg: 'bg-gradient-to-br from-blue-800 via-blue-600 to-indigo-900',
                    text: 'text-white',
                    accent: 'text-blue-200',
                    hologram: 'bg-gradient-to-br from-white/10 to-transparent'
                };
        }
    };

    const theme = getCardTheme(type);

    return (
        <div 
            className="group relative w-full max-w-[400px] aspect-[1.58] mx-auto cursor-pointer perspective-1000 animate-in fade-in slide-in-from-bottom-8 duration-700"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                    transform: isFlipped ? 'rotateY(180deg)' : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transformStyle: 'preserve-3d'
                }}
                className="relative w-full h-full transition-transform duration-700 ease-out shadow-2xl rounded-[20px]"
            >
                {/* FRONT SIDE */}
                <div 
                    className={`absolute inset-0 w-full h-full p-8 rounded-[20px] backface-hidden overflow-hidden border border-white/10 flex flex-col justify-between shadow-black/50 ${theme.bg} ${theme.text} ${blocked ? 'grayscale contrast-75 opacity-80' : ''}`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Visual patterns / Hologram sphere */}
                    <div className={`absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl ${theme.hologram}`} />

                    <div className="flex justify-between items-start z-10">
                        <div>
                            <span className="text-xl font-black tracking-tighter italic uppercase">VajraBank</span>
                            <span className="text-[8px] font-black tracking-[0.3em] opacity-60 block uppercase mt-0.5">Tactical Wealth</span>
                        </div>
                        <Wifi size={24} className={`${theme.accent} animate-pulse`} />
                    </div>

                    <div className="flex justify-between items-center z-10">
                        {/* EMV Chip */}
                        <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 via-yellow-500 to-amber-600 rounded-lg shadow-inner overflow-hidden flex flex-col gap-1 p-1">
                             <div className="h-full w-full border border-black/10 rounded-sm" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 italic">{type}</span>
                    </div>

                    <div className="text-2xl font-mono tracking-[4px] z-10 drop-shadow-lg filter brightness-125">
                        {maskCardNumber(number)}
                    </div>

                    <div className="flex justify-between items-end z-10">
                        <div className="flex-1">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 m-0">Card Operator</p>
                            <p className="text-sm font-bold uppercase tracking-tight">{holder}</p>
                        </div>
                        <div className="mx-4 text-center">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 m-0">Expiry</p>
                            <p className="text-sm font-bold font-mono">{expiry}</p>
                        </div>
                        <div className="shrink-0 grayscale brightness-200">
                            <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
                        </div>
                    </div>
                </div>

                {/* BACK SIDE */}
                <div 
                    className={`absolute inset-0 w-full h-full rounded-[20px] backface-hidden flex flex-col justify-between py-8 border border-white/10 ${theme.bg} ${theme.text}`}
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: 'rotateY(180deg)' 
                    }}
                >
                    <div className="h-12 bg-black/80 w-full mt-4" />
                    
                    <div className="px-8">
                        <div className="flex items-center gap-4">
                            <div className="h-10 bg-white/90 flex-grow flex items-center px-4 rounded-sm">
                                <span className="text-[8px] text-slate-400 font-black italic uppercase tracking-widest">Authorized Signature</span>
                            </div>
                            <div className="bg-white text-black font-mono font-black italic px-4 py-2 rounded-sm shadow-inner">
                                123
                            </div>
                        </div>

                        <p className="text-[7px] font-bold mt-8 opacity-50 leading-relaxed uppercase tracking-tighter">
                            This asset remains the property of VajraBank. Unauthorized use of this terminal interface or the associated credit line will trigger immediate security protocols. If discovered, please transmit to the nearest secure drop point.
                        </p>
                        
                        <div className="text-center mt-6">
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-70">vajrabank.os</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardVisual;