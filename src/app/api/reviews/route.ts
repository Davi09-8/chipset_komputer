import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reviews
 * Mendapatkan review untuk produk tertentu (public)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const productSlug = searchParams.get('productSlug');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!productId && !productSlug) {
            return errorResponse('productId atau productSlug harus diisi', 400);
        }

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = { isApproved: true };

        if (productId) {
            where.productId = productId;
        } else if (productSlug) {
            const product = await prisma.product.findUnique({
                where: { slug: productSlug },
                select: { id: true },
            });

            if (!product) {
                return errorResponse('Produk tidak ditemukan', 404);
            }

            where.productId = product.id;
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.review.count({ where }),
        ]);

        // Calculate rating distribution
        const allReviews = await prisma.review.findMany({
            where,
            select: { rating: true },
        });

        const ratingDistribution = {
            5: allReviews.filter(r => r.rating === 5).length,
            4: allReviews.filter(r => r.rating === 4).length,
            3: allReviews.filter(r => r.rating === 3).length,
            2: allReviews.filter(r => r.rating === 2).length,
            1: allReviews.filter(r => r.rating === 1).length,
        };

        const avgRating = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0;

        return successResponse({
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            stats: {
                averageRating: Math.round(avgRating * 10) / 10,
                totalReviews: allReviews.length,
                ratingDistribution,
            },
        });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        return errorResponse('Gagal mengambil data review');
    }
}

/**
 * POST /api/reviews
 * Membuat review baru (requires authentication)
 */
export async function POST(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const body = await request.json();
        const { productId, rating, comment } = body;

        // Validasi
        if (!productId || !rating) {
            return errorResponse('productId dan rating harus diisi', 400);
        }

        if (rating < 1 || rating > 5) {
            return errorResponse('Rating harus antara 1-5', 400);
        }

        // Cek apakah produk ada
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return errorResponse('Produk tidak ditemukan', 404);
        }

        // Cek apakah user sudah pernah review produk ini
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        if (existingReview) {
            return errorResponse('Anda sudah memberikan review untuk produk ini', 400);
        }

        // Cek apakah user pernah membeli produk ini
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId: user.id,
                    paymentStatus: 'PAID',
                },
            },
        });

        if (!hasPurchased) {
            return errorResponse('Anda harus membeli produk ini terlebih dahulu untuk memberikan review', 400);
        }

        // Buat review
        const review = await prisma.review.create({
            data: {
                userId: user.id,
                productId,
                rating: parseInt(rating),
                comment: comment || null,
                isApproved: false, // Review perlu disetujui admin
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        return successResponse({
            review,
            message: 'Review berhasil dibuat dan menunggu persetujuan admin',
        }, 201);
    } catch (err) {
        console.error('Error creating review:', err);
        return errorResponse('Gagal membuat review');
    }
}
