'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            showToast('Password tidak cocok', 'error');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                showToast(data.error || 'Registrasi gagal', 'error');
            } else {
                showToast('Registrasi berhasil! Silakan login.', 'success');
                router.push('/login?registered=true');
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
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Bergabung untuk mulai berbelanja
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="input-field"
                                placeholder="Nama lengkap Anda"
                            />
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="input-field"
                                placeholder="Minimal 6 karakter"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Konfirmasi Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="input-field"
                                placeholder="Ulangi password"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary flex justify-center py-3"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    'Daftar Sekarang'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Sudah punya akun?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/login"
                                className="w-full btn btn-outline flex justify-center py-3"
                            >
                                Login ke Akun
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
