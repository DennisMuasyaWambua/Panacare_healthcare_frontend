import React from 'react';
import { X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, message = "Successful submitted" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative flex flex-col items-center">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                {/* Success Icon/Graphic - Using SVG for confetti effect */}
                <div className="mb-8 mt-4 relative w-full flex justify-center">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Center Circle */}
                        <circle cx="60" cy="60" r="4" fill="#29AAE1" />

                        {/* Confetti shapes */}
                        <path d="M60 40V50" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" />
                        <path d="M60 70V80" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" />
                        <path d="M40 60H50" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
                        <path d="M70 60H80" stroke="#29AAE1" strokeWidth="2" strokeLinecap="round" />

                        <path d="M46 46L53 53" stroke="#29AAE1" strokeWidth="2" strokeLinecap="round" />
                        <path d="M74 46L67 53" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" />
                        <path d="M46 74L53 67" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" />
                        <path d="M74 74L67 67" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />

                        {/* Outer particles */}
                        <circle cx="30" cy="30" r="2" fill="#FFD93D" />
                        <circle cx="90" cy="30" r="2" fill="#29AAE1" />
                        <circle cx="90" cy="90" r="2" fill="#FF6B6B" />
                        <circle cx="30" cy="90" r="2" fill="#4ECDC4" />

                        <rect x="20" y="58" width="4" height="4" rx="1" fill="#FF6B6B" transform="rotate(45 20 60)" />
                        <rect x="96" y="58" width="4" height="4" rx="1" fill="#4ECDC4" transform="rotate(45 100 60)" />
                        <rect x="58" y="20" width="4" height="4" rx="1" fill="#29AAE1" transform="rotate(45 60 20)" />
                        <rect x="58" y="96" width="4" height="4" rx="1" fill="#FFD93D" transform="rotate(45 60 100)" />
                    </svg>
                </div>

                {/* Success Message */}
                <h2 className="text-xl text-gray-600 font-normal mb-8">{message}</h2>

                {/* OK Button */}
                <button
                    onClick={onClose}
                    className="px-16 py-3 bg-[#29AAE1] text-white rounded-full hover:bg-blue-600 font-medium text-lg transition-colors"
                >
                    Ok
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
