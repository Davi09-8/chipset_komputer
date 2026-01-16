import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/reviews
 * Mendapatkan semua review dengan filter
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const isApproved = searchParams.get('isApproved');
        const productId = searchParams.get('productId') || '';

        const skip = (page - 1) * limit;

        // Build filter
        const where: any = {};

        if (isApproved !== null && isApproved !== undefined && isApproved !== '') {
            where.isApproved = isApproved === 'true';
        }

        if (productId) {
            where.productId = productId;
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            images: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.review.count({ where }),
        ]);

        return successResponse({
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        return errorResponse('Gagal mengambil data review');
    }
}
