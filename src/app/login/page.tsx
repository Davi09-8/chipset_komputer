'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                showToast('Email atau password salah', 'error');
            } else {
                showToast('Login berhasil!', 'success');
                // Fetch session untuk mendapatkan role user
                const response = await fetch('/api/auth/session');
                const session = await response.json();

                // Redirect berdasarkan role
                if (session?.user?.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            showToast('Terjadi kesalahan sistem', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <span className="text-4xl font-extrabold gradient-text">🖥️ Toko Komputer</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Selamat Datang Kembali</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Masuk untuk mengakses akun Anda
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
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

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                                        Lupa password?
                                    </Link>
                                </div>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
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
                                'Masuk Sekarang'
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Belum punya akun?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/register"
                                className="w-full btn btn-outline flex justify-center py-3"
                            >
                                Daftar Akun Baru
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>© 2025 Toko Komputer. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
