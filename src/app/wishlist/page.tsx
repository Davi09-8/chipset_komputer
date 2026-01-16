'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

interface WishlistItem {
    id: string;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        stock: number;
        images: string;
        category: {
            name: string;
        };
    };
}

export default function WishlistPage() {
    const router = useRouter();
    const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    async function fetchWishlist() {
        try {
            const res = await fetch('/api/wishlist');
            if (res.status === 401) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setWishlists(data.wishlists);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }

    async function removeFromWishlist(productId: string) {
        try {
            const res = await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setWishlists(wishlists.filter(item => item.product.id !== productId));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BackButton fallbackUrl="/" />
                <h1 className="text-3xl font-bold text-gray-900 mb-6">❤️ Wishlist Saya</h1>

                {wishlists.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">💔</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Wishlist Kosong</h3>
                        <p className="text-gray-600 mb-6">Belum ada produk di wishlist Anda</p>
                        <Link
                            href="/products"
                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                        >
                            Lihat Produk
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlists.map((item) => {
                            const images = JSON.parse(item.product.images || '[]');
                            const imageUrl = images[0] || 'https://via.placeholder.com/300';

                            return (
                                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={imageUrl}
                                            alt={item.product.name}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Product';
                                            }}
                                        />
                                        <button
                                            onClick={() => removeFromWishlist(item.product.id)}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                            title="Remove from wishlist"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <span className="text-xs text-indigo-600 font-semibold">
                                            {item.product.category.name}
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
                                            {item.product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xl font-bold text-indigo-600">
                                                Rp {item.product.price.toLocaleString('id-ID')}
                                            </span>
                                            <span className={`text-sm ${item.product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {item.product.stock > 0 ? `Stok: ${item.product.stock}` : 'Habis'}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
