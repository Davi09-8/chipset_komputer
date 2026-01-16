'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import BackButton from '@/components/BackButton';

interface TimelineItem {
    status: string;
    label: string;
    completed: boolean;
    date: string | null;
}

export default function OrderTrackingPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [estimatedDelivery, setEstimatedDelivery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchTracking();
        }
    }, [params.id]);

    async function fetchTracking() {
        try {
            const res = await fetch(`/api/orders/${params.id}/track`);
            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            setOrder(data.order);
            setTimeline(data.timeline);
            setTrackingNumber(data.trackingNumber);
            setEstimatedDelivery(data.estimatedDelivery);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!order) {
        return <div className="min-h-screen flex items-center justify-center">Order not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold gradient-text">
                                🖥️ Chipset Computer
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BackButton fallbackUrl="/orders" label="← Kembali ke Pesanan" />

                <h1 className="text-3xl font-bold text-gray-900 mb-6">📦 Lacak Pesanan</h1>

                {/* Order Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Order Number</p>
                            <p className="font-semibold">{order.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tracking Number</p>
                            <p className="font-semibold">{trackingNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Estimated Delivery</p>
                            <p className="font-semibold">{new Date(estimatedDelivery).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Status Pengiriman</h2>

                    <div className="relative">
                        {timeline.map((item, index) => (
                            <div key={item.status} className="flex items-start mb-8 last:mb-0">
                                {/* Line */}
                                {index < timeline.length - 1 && (
                                    <div className={`absolute left-4 top-10 w-0.5 h-16 ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                )}

                                {/* Icon */}
                                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    {item.completed ? (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <div className="w-3 h-3 bg-white rounded-full" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="ml-4 flex-1">
                                    <h3 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {item.label}
                                    </h3>
                                    {item.date && (
                                        <p className="text-sm text-gray-600">
                                            {new Date(item.date).toLocaleString('id-ID')}
                                        </p>
                                    )}
                                    {!item.completed && index === timeline.findIndex(t => !t.completed) && (
                                        <p className="text-sm text-gray-500 mt-1">Sedang diproses...</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Item Pesanan</h2>
                    <div className="space-y-3">
                        {order.orderItems.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div>
                                    <p className="font-semibold">{item.product.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
