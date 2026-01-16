import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default async function ProductReviewsPage({
    params,
}: {
    params: { slug: string };
}) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            reviews: {
                where: { isApproved: true },
                include: { user: true },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!product) {
        notFound();
    }

    // Calculate rating statistics
    const totalReviews = product.reviews.length;
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0';

    // Rating distribution
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews.forEach(review => {
        if (review.rating in ratingCounts) {
            ratingCounts[review.rating as keyof typeof ratingCounts]++;
        }
    });

    const renderStars = (rating: number, filled = true) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>Kembali ke Produk</span>
                    </Link>

                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images && JSON.parse(product.images)[0] && (
                                <img
                                    src={JSON.parse(product.images)[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
                            <p className="text-gray-500 text-sm">Ulasan Produk</p>
                        </div>
                    </div>
                </div>

                {/* Rating Summary */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Overall Rating */}
                        <div className="md:col-span-2 text-center md:border-r border-gray-100">
                            <div className="text-6xl font-bold text-gray-900 mb-2">{avgRating}</div>
                            <div className="flex items-center justify-center gap-1 text-yellow-400 text-2xl mb-2">
                                {renderStars(Math.round(parseFloat(avgRating)))}
                            </div>
                            <p className="text-gray-500">{totalReviews} ulasan</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="md:col-span-3 space-y-3">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = ratingCounts[star as keyof typeof ratingCounts];
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-yellow-400 text-sm w-16">
                                            <span>{star}</span>
                                            <span>★</span>
                                        </div>
                                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-yellow-400 h-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Semua Ulasan</h2>

                    {product.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {product.reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
                                                <span className="text-gray-400 text-sm">
                                                    {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400 mb-3">
                                                {renderStars(review.rating)}
                                            </div>
                                            {review.comment && (
                                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-gray-500 text-lg">Belum ada ulasan untuk produk ini</p>
                            <p className="text-gray-400 text-sm mt-2">Jadilah yang pertama memberikan ulasan!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
