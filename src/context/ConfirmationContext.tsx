'use client';

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface ConfirmationContextType {
    confirm: (message: string) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const resolveRef = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback((msg: string) => {
        setMessage(msg);
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        if (resolveRef.current) {
            resolveRef.current(true);
            resolveRef.current = null;
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (resolveRef.current) {
            resolveRef.current(false);
            resolveRef.current = null;
        }
    };

    return (
        <ConfirmationContext.Provider value={{ confirm }}>
            {children}
            <ConfirmationModal
                isOpen={isOpen}
                message={message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmationContext.Provider>
    );
}

export function useConfirmation() {
    const context = useContext(ConfirmationContext);
    if (context === undefined) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider');
    }
    return context;
}
