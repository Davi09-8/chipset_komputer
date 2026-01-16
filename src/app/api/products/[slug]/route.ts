import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products/[slug]
 * Mendapatkan detail produk berdasarkan slug (public)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug: params.slug,
                isActive: true,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                reviews: {
                    where: { isApproved: true },
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
                },
            },
        });

        if (!product) {
            return errorResponse('Produk tidak ditemukan', 404);
        }

        // Calculate average rating
        const avgRating = product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            : 0;

        // Get related products (same category, exclude current product)
        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                isActive: true,
            },
            take: 4,
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
            },
        });

        // Parse JSON fields
        const productData = {
            ...product,
            images: JSON.parse(product.images),
            specifications: JSON.parse(product.specifications),
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: product.reviews.length,
            relatedProducts,
        };

        return successResponse({ product: productData });
    } catch (err) {
        console.error('Error fetching product:', err);
        return errorResponse('Gagal mengambil data produk');
    }
}
