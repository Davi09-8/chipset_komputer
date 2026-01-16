import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/orders/[id]
 * Mendapatkan detail order
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return errorResponse('Order tidak ditemukan', 404);
        }

        return successResponse({ order });
    } catch (err) {
        console.error('Error fetching order:', err);
        return errorResponse('Gagal mengambil data order');
    }
}

/**
 * PUT /api/admin/orders/[id]
 * Update status order
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const body = await request.json();
        const { status, paymentStatus, notes } = body;

        // Cek apakah order ada
        const existingOrder = await prisma.order.findUnique({
            where: { id: params.id },
        });

        if (!existingOrder) {
            return errorResponse('Order tidak ditemukan', 404);
        }

        // Validasi status
        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        const validPaymentStatuses = ['UNPAID', 'PAID', 'REFUNDED'];

        if (status && !validStatuses.includes(status)) {
            return errorResponse('Status order tidak valid', 400);
        }

        if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
            return errorResponse('Status pembayaran tidak valid', 400);
        }

        // Build update data
        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (notes !== undefined) updateData.notes = notes;

        const order = await prisma.order.update({
            where: { id: params.id },
            data: updateData,
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
                        product: true,
                    },
                },
            },
        });

        return successResponse({ order });
    } catch (err) {
        console.error('Error updating order:', err);
        return errorResponse('Gagal mengupdate order');
    }
}
