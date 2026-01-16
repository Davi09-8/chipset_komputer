import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Request stock notification
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Check if product exists and is out of stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.stock > 0) {
            return NextResponse.json({ error: 'Product is in stock' }, { status: 400 });
        }

        // Check if already requested
        const existing = await prisma.stockNotification.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ error: 'Notification already requested' }, { status: 400 });
        }

        // Create notification request
        await prisma.stockNotification.create({
            data: {
                userId: session.user.id,
                productId,
                email: session.user.email!,
            },
        });

        return NextResponse.json({ message: 'You will be notified when product is back in stock' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
}
