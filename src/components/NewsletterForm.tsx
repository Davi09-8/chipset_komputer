'use client';

import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setEmail('');
            } else {
                setMessage(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            setMessage('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">
                Dapatkan update produk terbaru dan promo menarik
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Anda"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Subscribe'}
                </button>
            </form>
            {message && (
                <p className={`mt-3 text-sm ${message.includes('success') || message.includes('berhasil') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
