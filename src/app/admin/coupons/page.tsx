'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useConfirmation } from '@/context/ConfirmationContext';
import { useToast } from '@/context/ToastContext';

interface Coupon {
    id: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    usageLimit: number | null;
    usedCount: number;
}

export default function CouponsPage() {
    const { confirm } = useConfirmation();
    const { showToast } = useToast();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    async function fetchCoupons() {
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            setCoupons(data.coupons || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus kupon ini?');
        if (!isConfirmed) return;

        try {
            const res = await fetch(`/api/admin/coupons/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Kupon berhasil dihapus', 'success');
                setCoupons(coupons.filter(c => c.id !== id));
            } else {
                showToast('Gagal menghapus kupon', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        }
    }

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen Kupon</h1>
                <Link
                    href="/admin/coupons/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    + Buat Kupon
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Kode</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Tipe</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Nilai</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Periode</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Penggunaan</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{coupon.code}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {coupon.type === 'PERCENTAGE' ? 'Persentase' : 'Potongan Tetap'}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                                    {coupon.type === 'PERCENTAGE'
                                        ? `${coupon.value}%`
                                        : `Rp ${coupon.value.toLocaleString('id-ID')}`}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex flex-col">
                                        <span>{format(new Date(coupon.startDate), 'dd MMM yyyy', { locale: id })}</span>
                                        <span className="text-xs text-gray-400">s/d</span>
                                        <span>{format(new Date(coupon.endDate), 'dd MMM yyyy', { locale: id })}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {coupon.usedCount} / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {coupon.isActive ? 'Aktif' : 'Non-aktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada kupon yang dibuat.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
