import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products
 * Mendapatkan daftar produk dengan filter dan pagination (public)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const search = searchParams.get('search') || '';
        const categoryId = searchParams.get('categoryId') || '';
        const categorySlug = searchParams.get('categorySlug') || '';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sort = searchParams.get('sort') || 'newest';

        const skip = (page - 1) * limit;

        // Build filter - hanya produk aktif
        const where: any = { isActive: true };

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        } else if (categorySlug) {
            // Cari kategori berdasarkan slug
            const category = await prisma.category.findUnique({
                where: { slug: categorySlug },
            });

            if (category) {
                where.categoryId = category.id;
            }
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        // Determine sort order
        let orderBy: any = { createdAt: 'desc' }; // default: newest

        switch (sort) {
            case 'price_asc':
                orderBy = { price: 'asc' };
                break;
            case 'price_desc':
                orderBy = { price: 'desc' };
                break;
            case 'name_asc':
                orderBy = { name: 'asc' };
                break;
            case 'name_desc':
                orderBy = { name: 'desc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
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
                        select: {
                            rating: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        // Calculate average rating for each product
        const productsWithRating = products.map(product => {
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 0;

            return {
                ...product,
                averageRating: Math.round(avgRating * 10) / 10,
                reviewCount: product.reviews.length,
                reviews: undefined, // Remove reviews array from response
            };
        });

        return successResponse({
            products: productsWithRating,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        return errorResponse('Gagal mengambil data produk');
    }
}
