'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CancelOrderButton from '@/components/CancelOrderButton';
import ReviewModal from '@/components/ReviewModal';
import { Monitor, Laptop, Star } from 'lucide-react';

interface OrderDetail {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    shippingAddress: any; // Already parsed by API
    shippingCost: number;
    shippingService: string;
    userId: string;
    orderItems: Array<{
        id: string;
        price: number;
        quantity: number;
        productId: string;
        product: {
            id: string;
            name: string;
            category: { name: string };
        };
    }>;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    async function fetchOrder() {
        try {
            const res = await fetch(`/api/orders/${params.id}`);
            const data = await res.json();
            if (res.ok) {
                setOrder(data.order);
            } else {
                router.push('/orders');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!order) return null;

    const shippingAddress = order.shippingAddress;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <Link href="/" className="flex items-center text-2xl font-bold gradient-text">
                            <Monitor className="w-8 h-8 mr-2 text-primary-600" />
                            Toko Komputer
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link href="/orders" className="text-indigo-600 hover:text-indigo-800">
                        ← Kembali ke Daftar Pesanan
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
                            <p className="text-gray-500">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold 
                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        'bg-green-100 text-green-800'}`}>
                                {order.status}
                            </span>
                            {order.status === 'PENDING' && (
                                <CancelOrderButton orderId={order.id} />
                            )}
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            {order.shippingService === 'PICKUP' ? (
                                <>
                                    <h3 className="font-semibold text-gray-900 mb-2">Lokasi Pengambilan (Toko)</h3>
                                    <p className="text-gray-700 font-bold">Chipset Computer</p>
                                    <p className="text-gray-600">Jl. H.R. Soebrantas, Simpang Baru</p>
                                    <p className="text-gray-600">Kec. Tampan, Kota Pekanbaru, Riau 28292</p>
                                    <p className="text-gray-500 text-sm mt-1">Buka: 08:00 - 21:00 WIB</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-semibold text-gray-900 mb-2">Alamat Pengiriman</h3>
                                    <p className="text-gray-700 font-medium">{shippingAddress.name}</p>
                                    <p className="text-gray-600">{shippingAddress.phone}</p>
                                    <p className="text-gray-600">{shippingAddress.address}</p>
                                    <p className="text-gray-600">
                                        {shippingAddress.city}, {shippingAddress.postalCode}
                                    </p>
                                </>
                            )}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-2">Metode Pengiriman</h3>
                                <p className="text-gray-700 font-medium">
                                    {order.shippingService === 'PICKUP' ? 'Ambil Sendiri di Toko' : (order.shippingService?.replace('_', ' ') || 'Courier')}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Biaya: {order.shippingCost === 0 ? <span className="text-green-600 font-bold">Gratis</span> : `Rp ${order.shippingCost?.toLocaleString('id-ID')}`}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Informasi Pembayaran</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-700 mb-1">Metode: <span className="font-bold">{order.paymentMethod}</span></p>
                                <p className="text-gray-700 mb-4">Status: <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>{order.paymentStatus}</span></p>

                                {order.paymentMethod === 'TRANSFER' && order.paymentStatus === 'UNPAID' && (
                                    <div className="space-y-2 border-t border-gray-200 pt-3">
                                        <p className="text-sm text-gray-600">Silakan transfer ke salah satu rekening berikut:</p>
                                        <div className="space-y-1 text-sm font-medium text-gray-800">
                                            <div className="flex justify-between">
                                                <span>BCA</span>
                                                <span className="font-mono">123-456-7890</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Mandiri</span>
                                                <span className="font-mono">123-000-456-789</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>A.N</span>
                                                <span>Chipset Computer</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-xs text-center text-gray-500">
                                            *Mohon simpan bukti transfer Anda
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Produk</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item) => (
                            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-primary-600">
                                    <Laptop className="w-10 h-10" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500">{item.product.category.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="font-bold text-indigo-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                    {order.status === 'DELIVERED' && (
                                        <button
                                            onClick={() => setReviewProduct({ id: item.product.id, name: item.product.name })}
                                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                                        >
                                            <Star className="w-4 h-4 mr-1" /> Beri Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-6 pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal Produk</span>
                                <span>Rp {(order.totalAmount - (order.shippingCost || 0)).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ongkos Kirim ({order.shippingService?.replace('_', ' ') || 'Courier'})</span>
                                <span>Rp {(order.shippingCost || 0).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-dashed">
                                <span>Total Pembayaran</span>
                                <span className="text-primary-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewProduct && (
                <ReviewModal
                    productId={reviewProduct.id}
                    productName={reviewProduct.name}
                    onClose={() => setReviewProduct(null)}
                />
            )}
        </div>
    );
}
