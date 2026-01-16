import Link from 'next/link';
import { ShoppingCart, DollarSign, Users, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import DashboardCharts from './DashboardCharts';

export default async function AdminDashboard() {
    const stats = await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.order.count({ where: { status: 'PENDING' } }),
    ]);

    const recentOrders = await prisma.order.findMany({
        take: 5,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });

    const lowStockProducts = await prisma.product.findMany({
        where: { stock: { lte: 10 } },
        include: { category: true },
        take: 5,
    });

    // Get monthly stats for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const ordersHistory = await prisma.order.findMany({
        where: {
            createdAt: { gte: twelveMonthsAgo },
            paymentStatus: 'PAID',
        },
        select: {
            createdAt: true,
            totalAmount: true,
        },
        orderBy: { createdAt: 'asc' },
    });

    const monthlyStatsMap = new Map<string, { sales: number; revenue: number }>();

    for (let i = 0; i < 12; i++) {
        const d = new Date(twelveMonthsAgo);
        d.setMonth(d.getMonth() + i);
        const key = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        monthlyStatsMap.set(key, { sales: 0, revenue: 0 });
    }

    ordersHistory.forEach(order => {
        const key = new Date(order.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        if (monthlyStatsMap.has(key)) {
            const stat = monthlyStatsMap.get(key)!;
            stat.sales += 1;
            stat.revenue += order.totalAmount;
        }
    });

    const monthlyStats = Array.from(monthlyStatsMap.entries()).map(([name, stats]) => ({
        name,
        sales: stats.sales,
        revenue: stats.revenue,
    }));

    // Get top selling products by quantity
    const topSellingItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _count: { quantity: 'desc' } }, // Note: groupBy orderBy _sum support varies, using simplified approach or _sum if supported. 
        // Prisma standard for groupBy orderBy is: orderBy: { _sum: { quantity: 'desc' } }
        // If that fails, I might need to fetch and sort in js, but try standard first.
        // Wait, standard prisma often requires preview features or specific syntax.
        // Safer: Fetch counts via findMany logic or just stick to the requested "quantity" sum manually?
        // Let's use the safer `findMany` on OrderItem if groupBy is risky without verifying version.
        // Actually, the user asked for "barang mana aja yg udah dibeli".
        // Let's try the groupBy, if it fails I'll fix.
        // Use standard syntax:
        // orderBy: { _sum: { quantity: 'desc' } }
        take: 5,
    });

    // Fallback if groupBy isn't ideal: use the query from route.ts which uses _count on relation (Frequency).
    // The user asked "Total Pembelian". Quantity is better.
    // Let's try to emulate route.ts but map to quantity sum? No, route.ts is frequency.

    // Alternative: Get all orderItems, aggregate in JS. (DataSet is small? probably).
    // Safer for "Total Pembelian" (quantity) without risking prisma version issues:
    // Fetch top products by order frequency first (like route.ts), then sum their quantities?
    // No, frequent small orders vs one big order.

    // Let's trust Prisma groupBy.

    // actually, let's use the code block below.

    const topSellingStats = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: {
            _sum: { quantity: 'desc' }
        },
        take: 5
    });

    const topProductIds = topSellingStats.map(stat => stat.productId);

    const topProductsDetails = await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: {
            id: true,
            name: true,
            price: true,
            images: true,
            category: { select: { name: true } }
        }
    });

    const topProducts = topSellingStats.map(stat => {
        const product = topProductsDetails.find(p => p.id === stat.productId);
        return {
            ...product,
            totalSold: stat._sum.quantity || 0
        };
    }).filter(p => p.id); // Filter if product not found

    return (
        <div>
            <div className="bg-white shadow-sm p-4 mb-6">
                <h2 className="text-xl font-semibold">Dashboard</h2>
            </div>

            <div className="px-6 pb-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 mr-3">
                                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Total Pesanan</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats[0]}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg flex-shrink-0">
                                <ShoppingCart className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 mr-3">
                                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Total Pendapatan</p>
                                <p className="text-lg font-extrabold text-green-600 mt-1 leading-tight">Rp {(stats[1]._sum.totalAmount || 0).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg flex-shrink-0">
                                <DollarSign className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 mr-3">
                                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Total Pelanggan</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats[2]}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg flex-shrink-0">
                                <Users className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 mr-3">
                                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Pesanan Pending</p>
                                <p className="text-3xl font-extrabold text-yellow-600 mt-1">{stats[3]}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg flex-shrink-0">
                                <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="mb-8">
                    <DashboardCharts initialData={monthlyStats} />
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Selling Products - New Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Produk Terlaris</h3>
                            <Link href="/admin/analytics/top-selling" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {topProducts.map((product) => (
                                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                            {product.images && JSON.parse(product.images)[0] && (
                                                <img
                                                    src={JSON.parse(product.images)[0]}
                                                    alt={product.name || ''}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm line-clamp-1" title={product.name}>{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.category && product.category.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="font-bold text-green-600 text-sm">{product.totalSold} Terjual</p>
                                        <p className="text-xs text-gray-400">Rp {product.price && product.price.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                            {topProducts.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">Belum ada data penjualan.</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h3>
                            <Link href="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-semibold">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">{order.user.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{order.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Products */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Stok Rendah</h3>
                            <Link href="/admin/products" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {lowStockProducts.map((product) => (
                                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-semibold line-clamp-1" title={product.name}>{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.category.name}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex-shrink-0 ml-2">
                                        Stok: {product.stock}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
