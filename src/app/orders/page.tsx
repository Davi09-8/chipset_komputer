import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            orderItems: {
                include: { product: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        PROCESSING: 'bg-blue-100 text-blue-800',
        SHIPPED: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };

    return (
        <div className="min-h-screen bg-gray-50">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Saya</h1>

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Produk:</p>
                                        <div className="space-y-1">
                                            {order.orderItems.map((item, idx) => (
                                                <p key={idx} className="text-sm text-gray-600 truncate">
                                                    {item.quantity}x {item.product.name}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Total: <span className="font-bold text-lg text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">Pembayaran: {order.paymentMethod}</p>
                                        </div>
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-8xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h2>
                        <p className="text-gray-600 mb-6">Anda belum memiliki riwayat pesanan</p>
                        <Link
                            href="/products"
                            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
