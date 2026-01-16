'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <div className="bg-gray-100 p-4 rounded mb-4 max-w-lg overflow-auto">
                <p className="font-mono text-sm text-red-500">{error.message}</p>
                {error.digest && <p className="text-xs text-gray-500 mt-2">Digest: {error.digest}</p>}
            </div>
            <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    );
}
