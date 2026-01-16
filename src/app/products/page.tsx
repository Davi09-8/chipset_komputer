import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductSorter } from '@/components/products/ProductSorter';
import ProductCard from '@/components/ProductCard';


export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string; search?: string; sort?: string };
}) {
    const { category, search, sort } = searchParams;

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            ...(category && {
                category: { slug: category },
            }),
            ...(search && {
                OR: [
                    { name: { contains: search } },
                    { description: { contains: search } },
                ],
            }),
        },
        include: { category: true },
        orderBy:
            sort === 'price_low'
                ? { price: 'asc' }
                : sort === 'price_high'
                    ? { price: 'desc' }
                    : sort === 'name'
                        ? { name: 'asc' }
                        : { createdAt: 'desc' },
    });

    const categories = await prisma.category.findMany({
        where: { isActive: true },
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Sticky Desktop */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-8">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Filter Produk
                            </h3>

                            {/* Search */}
                            <form method="GET" className="mb-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="search"
                                        defaultValue={search}
                                        placeholder="Cari produk..."
                                        className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-emerald-600 transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Kategori</h4>
                                <div className="space-y-1">
                                    <Link
                                        href="/products"
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${!category
                                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span>Semua Kategori</span>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{products.length}</span>
                                    </Link>
                                    {categories
                                        .sort((a, b) => {
                                            const order = ['laptop', 'komputer', 'cctv', 'camera', 'motherboard', 'ram', 'graphics-card', 'processor', 'storage', 'power-supply'];
                                            const indexA = order.indexOf(a.slug);
                                            const indexB = order.indexOf(b.slug);
                                            // If both are found in the order array, sort by index
                                            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                            // If only A is found, put A first
                                            if (indexA !== -1) return -1;
                                            // If only B is found, put B first
                                            if (indexB !== -1) return 1;
                                            // Otherwise sort alphabetically
                                            return a.name.localeCompare(b.name);
                                        })
                                        .map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/products?category=${cat.slug}`}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${category === cat.slug
                                                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <span>{cat.name}</span>
                                            </Link>
                                        ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Urutkan</h4>
                                <ProductSorter />
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {category
                                        ? categories.find((c) => c.slug === category)?.name || 'Produk'
                                        : search
                                            ? `Hasil Pencarian: "${search}"`
                                            : 'Semua Produk'}
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">Menampilkan {products.length} produk terbaik</p>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Produk tidak ditemukan</h3>
                                <p className="text-gray-500">Kami tidak dapat menemukan apa yang Anda cari.</p>
                                <Link
                                    href="/products"
                                    className="inline-block mt-4 text-emerald-600 font-medium hover:text-emerald-700"
                                >
                                    Lihat Semua Produk &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

