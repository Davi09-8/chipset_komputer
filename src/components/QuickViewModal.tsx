'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images: string;
    description: string;
    category: {
        name: string;
    };
}

export default function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const images = JSON.parse(product.images || '[]');

    async function handleAddToCart() {
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    quantity,
                }),
            });

            if (res.ok) {
                showToast('Added to cart!', 'success');
                onClose();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to add to cart', 'error');
            }
        } catch (error) {
            showToast('Please login first', 'error');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image */}
                        <div>
                            <img
                                src={images[0] || 'https://via.placeholder.com/400'}
                                alt={product.name}
                                className="w-full h-80 object-cover rounded-lg"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div>
                            <span className="text-sm text-indigo-600 font-semibold">{product.category.name}</span>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h3>

                            <div className="mb-4">
                                <span className="text-3xl font-bold text-indigo-600">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                            </div>

                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-6 line-clamp-3">{product.description}</p>

                            {/* Quantity */}
                            {product.stock > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border rounded-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                {product.stock > 0 && (
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                                    >
                                        🛒 Add to Cart
                                    </button>
                                )}
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="block w-full bg-gray-200 text-gray-900 text-center py-3 rounded-lg hover:bg-gray-300"
                                >
                                    View Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
