'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
}

export default function RecentlyViewed() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (viewed.length > 0) {
            fetchProducts(viewed.slice(0, 4)); // Show max 4
        }
    }, []);

    async function fetchProducts(ids: string[]) {
        try {
            const promises = ids.map(id =>
                fetch(`/api/products/${id}`).then(res => res.json())
            );
            const results = await Promise.all(promises);
            setProducts(results.filter(r => r.product).map(r => r.product));
        } catch (error) {
            console.error('Error fetching recently viewed:', error);
        }
    }

    if (products.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">👁️ Baru Dilihat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map(product => {
                    const images = JSON.parse(product.images || '[]');
                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src={images[0] || 'https://via.placeholder.com/200'}
                                alt={product.name}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200';
                                }}
                            />
                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-indigo-600 font-bold">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

// Helper function to add product to recently viewed
export function addToRecentlyViewed(productId: string) {
    if (typeof window === 'undefined') return;

    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = viewed.filter((id: string) => id !== productId);
    const updated = [productId, ...filtered].slice(0, 10); // Keep max 10
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
}
