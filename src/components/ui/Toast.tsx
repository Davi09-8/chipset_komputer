'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-amber-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 animate-fade-in`}>
            <div className={`${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`}>
                <span className="text-xl font-bold">{icons[type]}</span>
                <p className="font-medium text-sm flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
