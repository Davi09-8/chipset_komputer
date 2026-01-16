import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';

export default async function TopSellingPage() {
    // Fetch all top-selling products
    const topSellingStats = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
            price: true
        },
        orderBy: {
            _sum: { quantity: 'desc' }
        },
        take: 50 // Show top 50
    });

    const productIds = topSellingStats.map(stat => stat.productId);

    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
            id: true,
            name: true,
            price: true,
            images: true,
            category: { select: { name: true } }
        }
    });

    const topProducts = topSellingStats.map((stat, index) => {
        const product = products.find(p => p.id === stat.productId);
        return {
            rank: index + 1,
            ...product,
            totalSold: stat._sum.quantity || 0,
            totalRevenue: (stat._sum.quantity || 0) * (product?.price || 0)
        };
    }).filter(p => p.id);

    return (
        <div>
            <div className="bg-white shadow-sm p-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold">Produk Terlaris</h2>
                        <p className="text-sm text-gray-500">Ranking produk berdasarkan total penjualan</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ranking
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produk
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Harga
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Terjual
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Pendapatan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${product.rank === 1 ? 'bg-yellow-500' :
                                                    product.rank === 2 ? 'bg-gray-400' :
                                                        product.rank === 3 ? 'bg-amber-600' :
                                                            'bg-gray-300 text-gray-700'
                                                }`}>
                                                {product.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                                    {product.images && JSON.parse(product.images)[0] && (
                                                        <img
                                                            src={JSON.parse(product.images)[0]}
                                                            alt={product.name || ''}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                                {product.category && product.category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Rp {product.price && product.price.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                {product.totalSold} unit
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            Rp {product.totalRevenue.toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {topProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Belum ada data penjualan produk.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
