'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

interface OrderDetail {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    shippingAddress: string;
    notes: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    orderItems: Array<{
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            slug: string;
        };
    }>;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, []);

    async function fetchOrder() {
        try {
            const res = await fetch(`/api/admin/orders/${params.id}`);
            const data = await res.json();

            if (res.ok) {
                setOrder(data.order);
            } else {
                showToast('Order tidak ditemukan', 'error');
                router.push('/admin/orders');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(status: string) {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                showToast('Status berhasil diupdate', 'success');
                fetchOrder();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal update status', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setUpdating(false);
        }
    }

    async function updatePaymentStatus(paymentStatus: string) {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus }),
            });

            if (res.ok) {
                showToast('Status pembayaran berhasil diupdate', 'success');
                fetchOrder();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal update status pembayaran', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!order) {
        return <div className="p-6">Order tidak ditemukan</div>;
    }

    const shippingAddr = JSON.parse(order.shippingAddress);

    return (
        <div className="p-6 max-w-6xl">
            <div className="mb-6">
                <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-800">
                    ← Kembali ke Daftar Pesanan
                </Link>
                <h1 className="text-2xl font-bold mt-2">Detail Pesanan</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Item Pesanan</h2>
                        <div className="space-y-3">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">
                                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Alamat Pengiriman</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Nama:</strong> {shippingAddr.name}</p>
                            <p><strong>Telepon:</strong> {shippingAddr.phone}</p>
                            <p><strong>Alamat:</strong> {shippingAddr.address}</p>
                            <p><strong>Kota:</strong> {shippingAddr.city}</p>
                            <p><strong>Kode Pos:</strong> {shippingAddr.postalCode}</p>
                        </div>
                        {order.notes && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-600"><strong>Catatan:</strong> {order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Informasi Pesanan</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500">Order Number</p>
                                <p className="font-semibold">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Customer</p>
                                <p className="font-semibold">{order.user.name}</p>
                                <p className="text-xs text-gray-500">{order.user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Tanggal</p>
                                <p className="font-semibold">
                                    {new Date(order.createdAt).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Metode Pembayaran</p>
                                <p className="font-semibold">{order.paymentMethod}</p>
                            </div>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Update Status</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status Pesanan
                                </label>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                    disabled={updating}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status Pembayaran
                                </label>
                                <select
                                    value={order.paymentStatus}
                                    onChange={(e) => updatePaymentStatus(e.target.value)}
                                    disabled={updating}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="UNPAID">Unpaid</option>
                                    <option value="PAID">Paid</option>
                                    <option value="REFUNDED">Refunded</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
