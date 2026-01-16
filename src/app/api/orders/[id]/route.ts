import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/orders/[id]
 * Mendapatkan detail order
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return errorResponse('Order tidak ditemukan', 404);
        }

        // Pastikan order milik user yang sedang login
        if (order.userId !== user.id) {
            return errorResponse('Anda tidak memiliki akses ke order ini', 403);
        }

        // Parse shipping address
        const orderData = {
            ...order,
            shippingAddress: JSON.parse(order.shippingAddress),
        };

        return successResponse({ order: orderData });
    } catch (err) {
        console.error('Error fetching order:', err);
        return errorResponse('Gagal mengambil data order');
    }
}


/**
 * PUT /api/orders/[id]
 * Mengupdate status order (Cancel by User)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const body = await request.json();
        const { status } = body;

        // Validasi
        if (status !== 'CANCELLED') {
            return errorResponse('Invalid status update', 400);
        }

        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: { orderItems: true }
        });

        if (!order) {
            return errorResponse('Order tidak ditemukan', 404);
        }

        if (order.userId !== user.id) {
            return errorResponse('Akses ditolak', 403);
        }

        if (order.status !== 'PENDING') {
            return errorResponse('Hanya pesanan pending yang dapat dibatalkan', 400);
        }

        // Update status and restore stock
        await prisma.$transaction(async (tx) => {
            // Update order status
            await tx.order.update({
                where: { id: params.id },
                data: { status: 'CANCELLED' }
            });

            // Restore stock
            for (const item of order.orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                });
            }
        });

        return successResponse({ message: 'Order berhasil dibatalkan' });
    } catch (err) {
        console.error('Error updating order:', err);
        return errorResponse('Gagal mengupdate order');
    }
}
