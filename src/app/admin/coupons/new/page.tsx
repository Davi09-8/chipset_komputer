'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function NewCouponPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'PERCENTAGE', // PERCENTAGE | FIXED
        value: '',
        startDate: '',
        endDate: '',
        minPurchase: '',
        maxDiscount: '',
        usageLimit: '',
        isActive: true,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Kupon berhasil dibuat!', 'success');
                router.push('/admin/coupons');
            } else {
                showToast(data.error || 'Gagal membuat kupon', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-2xl">
            <div className="mb-6">
                <Link href="/admin/coupons" className="text-indigo-600 hover:text-indigo-800">
                    ← Kembali ke Daftar Kupon
                </Link>
                <h1 className="text-2xl font-bold mt-2">Buat Kupon Baru</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Code */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kode Kupon *
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                        placeholder="SUMMER2024"
                    />
                </div>

                {/* Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipe Potongan *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="PERCENTAGE">Persentase (%)</option>
                            <option value="FIXED">Nominal Tetap (Rp)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nilai Potongan *
                        </label>
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={formData.type === 'PERCENTAGE' ? '10' : '50000'}
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Mulai *
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Berakhir *
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Limits */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium text-gray-900">Batasan (Opsional)</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min. Pembelian (Rp)
                            </label>
                            <input
                                type="number"
                                name="minPurchase"
                                value={formData.minPurchase}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        {formData.type === 'PERCENTAGE' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maks. Diskon (Rp)
                                </label>
                                <input
                                    type="number"
                                    name="maxDiscount"
                                    value={formData.maxDiscount}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Batas Penggunaan (Kali)
                        </label>
                        <input
                            type="number"
                            name="usageLimit"
                            value={formData.usageLimit}
                            onChange={handleChange}
                            min="1"
                            placeholder="Kosongkan jika tidak terbatas"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center pt-4 border-t">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                        Kupon Aktif
                    </label>
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Buat Kupon'}
                    </button>
                    <Link
                        href="/admin/coupons"
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
