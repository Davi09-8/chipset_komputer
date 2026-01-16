import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get order tracking info
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check ownership
        if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Create timeline based on status
        const timeline = [
            {
                status: 'PENDING',
                label: 'Order Placed',
                completed: true,
                date: order.createdAt,
            },
            {
                status: 'PROCESSING',
                label: 'Processing',
                completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status),
                date: order.status === 'PROCESSING' ? order.updatedAt : null,
            },
            {
                status: 'SHIPPED',
                label: 'Shipped',
                completed: ['SHIPPED', 'DELIVERED'].includes(order.status),
                date: order.status === 'SHIPPED' ? order.updatedAt : null,
            },
            {
                status: 'DELIVERED',
                label: 'Delivered',
                completed: order.status === 'DELIVERED',
                date: order.status === 'DELIVERED' ? order.updatedAt : null,
            },
        ];

        // Estimate delivery (3-5 days from order)
        const estimatedDelivery = new Date(order.createdAt);
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

        return NextResponse.json({
            order,
            timeline,
            estimatedDelivery,
            trackingNumber: `TRK${order.orderNumber}`,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tracking info' }, { status: 500 });
    }
}
