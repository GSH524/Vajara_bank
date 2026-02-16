import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FeaturesShowcase() {
    const cardsRef = useRef([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleFeatureClick = (path) => {
        if (user) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                    }
                });
            },
            { threshold: 0.1 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            emoji: '🔐',
            title: 'Secure Banking',
            description: 'RBI compliant with 256-bit encryption. Your money is safe with industry-leading security.',
            color: 'from-emerald-500',
            shadow: 'hover:shadow-emerald-500/20',
            border: 'hover:border-emerald-500',
            path: '/user/dashboard'
        },
        {
            emoji: '💸',
            title: 'Easy Payments',
            description: 'Easy payments with one tap. UPI, transfers, and request money flow made simple.',
            color: 'from-blue-500',
            shadow: 'hover:shadow-blue-500/20',
            border: 'hover:border-blue-500',
            path: '/user/payments'
        },
        {
            emoji: '🎁',
            title: 'Cashback & Rewards',
            description: 'Get cashback and rewards. Earn points on every spend and redeem for exciting offers.',
            color: 'from-violet-500',
            shadow: 'hover:shadow-violet-500/20',
            border: 'hover:border-violet-500',
            path: '/user/rewards'
        },
        {
            emoji: '🌎',
            title: 'Global Transfers',
            description: 'Send & receive from abroad. Competitive rates and instant international transfers.',
            color: 'from-amber-500',
            shadow: 'hover:shadow-amber-500/20',
            border: 'hover:border-amber-500',
            path: '/user/international'
        },
        {
            emoji: '🤖',
            title: 'AI Risk Monitoring',
            description: 'Advanced fraud detection and real-time alerts to protect your account 24/7.',
            color: 'from-red-500',
            shadow: 'hover:shadow-red-500/20',
            border: 'hover:border-red-500',
            path: '/user/dashboard'
        }
    ];

    return (
        <section id="features" className="relative bg-[#080f25] py-20 px-6 overflow-hidden">
            {/* Header */}
            <div className="relative z-10 text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                    Why Choose VajraBank?
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Experience banking that's secure, smart, and designed for your financial success
                </p>
            </div>

            {/* Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        ref={(el) => (cardsRef.current[index] = el)}
                        onClick={(e) => {
                            createRipple(e);
                            setTimeout(() => handleFeatureClick(feature.path), 200);
                        }}
                        className={`group relative p-8 rounded-[20px] bg-slate-900/60 backdrop-blur-xl border border-blue-500/10 
                                   shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden
                                   opacity-0 translate-y-10 hover:-translate-y-3 ${feature.shadow} ${feature.border}`}
                    >
                        {/* Icon Container */}
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.color} bg-opacity-10`}>
                            <span className="text-4xl animate-bounce group-hover:animate-pulse">
                                {feature.emoji}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                            {feature.title}
                        </h3>
                        
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            {feature.description}
                        </p>

                        {/* Bottom Color Bar */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />
                    </div>
                ))}
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

            <style>{`
                .ripple {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-effect 0.6s linear;
                    pointer-events: none;
                }
                @keyframes ripple-effect {
                    to { transform: scale(4); opacity: 0; }
                }
            `}</style>
        </section>
    );
}

// Separate logic for cleaner JSX
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
}