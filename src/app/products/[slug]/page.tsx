import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductBackButton from '@/components/ProductBackButton';
import { auth } from '@/lib/auth';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

export default async function ProductDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
            reviews: {
                where: { isApproved: true },
                include: { user: true },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    const session = await auth();

    if (!product) {
        notFound();
    }

    const relatedProducts = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            id: { not: product.id },
            isActive: true,
            stock: { gt: 0 },
        },
        include: { category: true },
        take: 4,
    });

    const specifications = product.specifications ? JSON.parse(product.specifications) : {};

    // Calculate average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    const avgRating = product.reviews.length > 0 ? (totalRating / product.reviews.length).toFixed(1) : '0';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProductBackButton />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Images */}
                    <div className="md:col-span-5 lg:col-span-5">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80"
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="md:col-span-7 lg:col-span-7">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                <Link href="/" className="hover:text-primary-600 transition">Beranda</Link>
                                <span>/</span>
                                <Link href="/products" className="hover:text-primary-600 transition">Produk</Link>
                                <span>/</span>
                                <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600 transition font-medium text-gray-900">
                                    {product.category.name}
                                </Link>
                            </nav>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <Link
                                    href={`/products/${product.slug}/reviews`}
                                    className="flex items-center gap-1 text-yellow-400 hover:opacity-75 transition-opacity cursor-pointer"
                                >
                                    <span className="text-lg">★</span>
                                    <span className="font-bold text-gray-900">{avgRating}</span>
                                    <span className="text-gray-400 text-sm">({product.reviews.length} ulasan)</span>
                                </Link>
                                <span className="text-gray-300">|</span>
                                <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-end gap-3 mb-2">
                                    {product.discountPrice && product.discountPrice < product.price ? (
                                        <>
                                            <span className="text-4xl font-bold text-primary-600">
                                                Rp {product.discountPrice.toLocaleString('id-ID')}
                                            </span>
                                            <div className="flex flex-col mb-1">
                                                <span className="text-gray-400 line-through text-lg">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                                <span className="text-xs text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-full w-fit">
                                                    Hemat {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-bold text-primary-600">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </span>
                                    )}
                                </div>

                                {product.stock > 0 ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Stok Tersedia: {product.stock}
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 font-medium text-sm">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        Stok Habis
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-b border-gray-100 py-6 mb-8">
                                <h3 className="font-bold text-lg mb-3">Deskripsi Produk</h3>
                                <div className="prose prose-sm text-gray-600 leading-relaxed max-w-none">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            {/* Specifications */}
                            {Object.keys(specifications).length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-bold text-lg mb-3">Spesifikasi</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {Object.entries(specifications).map(([key, value]) => (
                                                    <tr key={key} className="border-b border-gray-200 last:border-0">
                                                        <td className="py-3 text-gray-500 w-1/3 font-medium">{key}</td>
                                                        <td className="py-3 text-gray-900 font-semibold">{value as string}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 md:static md:border-0 md:p-0">
                                {product.stock > 0 ? (
                                    session?.user ? (
                                        session.user.role === 'ADMIN' ? (
                                            <div className="w-full bg-gray-100 text-gray-500 text-center py-4 rounded-xl font-medium border border-gray-200">
                                                Mode Admin (Pembelian Nonaktif)
                                            </div>
                                        ) : (
                                            <AddToCartButton productId={product.id} />
                                        )
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="block w-full bg-primary-600 text-white text-center py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/30"
                                        >
                                            Login untuk Membeli
                                        </Link>
                                    )
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold cursor-not-allowed border border-gray-200"
                                    >
                                        Stok Habis
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Produk Terkait</h2>
                            <Link href="/products" className="text-primary-600 font-medium hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
