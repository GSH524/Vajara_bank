import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AIBotWidget = () => {
  const [displayText, setDisplayText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const navigate = useNavigate();

  const messages = [
    'Try our AI Loan Prediction',
    'Get instant loan eligibility',
    'Smart EMI calculations',
    'Real-time predictions',
    'Secure & fast approval',
  ];

  const currentMessage = messages[textIndex];

  // Typing effect for the current message
  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= currentMessage.length) {
        setDisplayText(currentMessage.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Keep the message visible for 5 seconds before switching
        const switchTimer = setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % messages.length);
          setDisplayText('');
        }, 5000);
        return () => clearTimeout(switchTimer);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [textIndex, currentMessage]);

  const handleBotClick = () => {
    setShowModal(true);
  };

  const handleNavigate = () => {
    setShowModal(false);
    navigate('/load-predict');
  };

  return (
    <>
      {/* Floating AI Bot Widget */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="flex flex-col items-end gap-3">
          {/* Typing Text Box */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl px-4 py-3 shadow-lg max-w-xs">
            <p className="text-sm font-medium h-6 flex items-center">
              {displayText}
              {displayText.length < currentMessage.length && (
                <span className="animate-pulse ml-1">|</span>
              )}
            </p>
          </div>

          {/* Robot Icon Button */}
          <button
            onClick={handleBotClick}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center text-2xl focus:outline-none"
            title="AI Loan Prediction"
          >
            🤖
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 max-w-md w-full animate-in fade-in zoom-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                AI Loan Prediction
              </h2>
              <p className="text-slate-300 text-sm">
                Get instant loan eligibility assessment with our advanced AI engine
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-600">
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> Instant eligibility check
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> EMI calculations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> Real-time predictions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> Secure & fast
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleNavigate}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25"
              >
                Try Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIBotWidget;
