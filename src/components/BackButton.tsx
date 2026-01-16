'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({
    fallbackUrl = '/',
    label = '← Kembali'
}: {
    fallbackUrl?: string;
    label?: string;
}) {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackUrl);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-4"
        >
            {label}
        </button>
    );
}
