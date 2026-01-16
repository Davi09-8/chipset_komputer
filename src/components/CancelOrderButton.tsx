'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useConfirmation } from '@/context/ConfirmationContext';
import { useToast } from '@/context/ToastContext';

interface CancelOrderButtonProps {
    orderId: string;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
    const router = useRouter();
    const { confirm } = useConfirmation();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleCancel() {
        const isConfirmed = await confirm('Apakah Anda yakin ingin membatalkan pesanan ini?');
        if (!isConfirmed) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });

            if (res.ok) {
                showToast('Pesanan berhasil dibatalkan', 'success');
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal membatalkan pesanan', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-semibold"
        >
            {loading ? 'Memproses...' : 'Batalkan Pesanan'}
        </button>
    );
}
