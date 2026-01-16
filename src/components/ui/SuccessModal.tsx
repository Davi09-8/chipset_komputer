'use client';

import { useEffect, useState } from 'react';

interface SuccessModalProps {
    message: string;
    onClose: () => void;
}

export default function SuccessModal({ message, onClose }: SuccessModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        setTimeout(() => setVisible(true), 10);

        // Auto close after 2 seconds
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Card */}
            <div className={`bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl transform transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'} max-w-sm w-full mx-4 relative overflow-hidden`}>

                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

                {/* Animated Icon Circle */}
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-ping opacity-20"></div>
                    <svg className="w-12 h-12 text-emerald-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                <p className="text-gray-600 text-center text-sm font-medium leading-relaxed px-4">
                    {message}
                </p>

                {/* Close/Action Button (Optional, since auto-close) */}
                {/* <button onClick={onClose} className="mt-8 text-gray-400 text-sm hover:text-gray-600">Tutup</button> */}
            </div>
        </div>
    );
}
