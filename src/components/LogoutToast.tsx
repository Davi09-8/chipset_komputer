'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

function LogoutToastContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        if (searchParams.get('loggedOut') === 'true') {
            showToast('Anda berhasil keluar', 'success');

            // Remove the query param without refreshing the page
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [searchParams, showToast, router]);

    return null;
}

export default function LogoutToast() {
    return (
        <Suspense fallback={null}>
            <LogoutToastContent />
        </Suspense>
    );
}
