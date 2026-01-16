'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfirmation } from '@/context/ConfirmationContext';

interface CartItemProps {
    item: {
        id: string;
        quantity: number;
        product: {
            id: string;
            name: string;
            price: number;
            stock: number;
            category: {
                name: string;
            };
        };
    };
}

export default function CartItem({ item }: CartItemProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { confirm } = useConfirmation();

    async function updateQuantity(newQuantity: number) {
        if (newQuantity < 1 || newQuantity > item.product.stock) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/cart/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update quantity');
        } finally {
            setLoading(false);
        }
    }

    async function removeItem() {
        const isConfirmed = await confirm('Hapus produk ini dari keranjang?');
        if (!isConfirmed) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/cart/${item.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to remove item');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 border-b last:border-0">
            <div className="flex gap-4">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">💻</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.product.category.name}</p>
                    <p className="text-lg font-bold text-indigo-600">Rp {item.product.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={removeItem}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            disabled={loading || item.quantity >= item.product.stock}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
