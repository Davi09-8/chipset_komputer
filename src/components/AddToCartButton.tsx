'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function AddToCartButton({ productId }: { productId: string }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [buyNowLoading, setBuyNowLoading] = useState(false);

    async function handleAddToCart(redirect = false) {
        if (redirect) {
            setBuyNowLoading(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: 1 }),
            });

            if (response.ok) {
                if (!redirect) {
                    showToast('Produk berhasil ditambahkan ke keranjang!', 'success');
                    router.refresh();
                }
                return true;
            } else {
                if (response.status === 401) {
                    router.push('/login');
                    return false;
                }
                showToast('Gagal menambah ke keranjang', 'error');
                return false;
            }
        } catch (error) {
            console.error(error);
            showToast('Terjadi kesalahan saat menghubungi server', 'error');
            return false;
        } finally {
            setLoading(false);
            if (!redirect) setBuyNowLoading(false);
        }
    }

    const handleBuyNow = async () => {
        const success = await handleAddToCart(true);
        if (success) {
            router.push('/cart');
        } else {
            setBuyNowLoading(false);
        }
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={() => handleAddToCart(false)}
                disabled={loading || buyNowLoading}
                className="flex-1 bg-white text-emerald-600 border-2 border-emerald-600 text-center py-3.5 rounded-xl font-bold hover:bg-emerald-50 transition flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : (
                    <span className="mr-2 text-xl group-hover:scale-110 transition-transform">+</span>
                )}
                {loading ? 'Menambahkan...' : 'Keranjang'}
            </button>
            <button
                onClick={handleBuyNow}
                disabled={loading || buyNowLoading}
                className="flex-1 bg-emerald-600 text-white text-center py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {buyNowLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {buyNowLoading ? 'Memproses...' : 'Beli Langsung'}
            </button>
        </div>
    );
}
