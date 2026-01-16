'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        // Simulasi request API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Untuk demo, selalu sukses
        showToast(`Email reset password dikirim ke ${email}`, 'success');
        setSubmitted(true);
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <span className="text-4xl font-extrabold gradient-text">🖥️ Toko Komputer</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Lupa Password?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {submitted
                            ? "Silakan cek email Anda untuk instruksi selanjutnya."
                            : "Masukkan email Anda untuk mereset password."}
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
                    {!submitted ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="nama@email.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary flex justify-center py-3"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    'Kirim Link Reset'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <span className="text-2xl">✉️</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Email Terkirim!</h3>
                            <p className="text-sm text-gray-500">
                                Cek kotak masuk atau spam email Anda.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-sm font-medium text-primary-600 hover:text-primary-500"
                            >
                                Kirim ulang?
                            </button>
                        </div>
                    )}

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <Link
                            href="/login"
                            className="w-full flex justify-center text-sm font-medium text-gray-600 hover:text-gray-500"
                        >
                            ← Kembali ke Halaman Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
