'use client';

import { useEffect, useState } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    if (!isOpen && !visible) return null;

    return (
        <div className={`fixed inset-0 z-[110] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>

            {/* Modal Card */}
            <div className={`bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'} max-w-sm w-full mx-4 relative overflow-hidden`}>

                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-red-600"></div>

                {/* Animated Icon Circle */}
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 relative">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Hapus</h3>
                <p className="text-gray-600 text-center text-sm font-medium leading-relaxed px-4 mb-8">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
