import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/orders
 * Mendapatkan semua order dengan filter
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || '';
        const paymentStatus = searchParams.get('paymentStatus') || '';
        const userId = searchParams.get('userId') || '';
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        // Build filter
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (paymentStatus) {
            where.paymentStatus = paymentStatus;
        }

        if (userId) {
            where.userId = userId;
        }

        if (search) {
            where.OR = [
                { orderNumber: { contains: search } },
                { user: { name: { contains: search } } },
                { user: { email: { contains: search } } },
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    images: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        return successResponse({
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        return errorResponse('Gagal mengambil data order');
    }
}
