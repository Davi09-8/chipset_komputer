import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cartItems = await prisma.cart.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: { category: true },
                },
            },
        });

        return NextResponse.json({ cartItems });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await request.json();

        // Check if product exists and has stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || product.stock < quantity) {
            return NextResponse.json({ error: 'Product not available' }, { status: 400 });
        }

        // Check if item already in cart
        const existingCart = await prisma.cart.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        if (existingCart) {
            // Update quantity
            const updatedCart = await prisma.cart.update({
                where: { id: existingCart.id },
                data: { quantity: existingCart.quantity + quantity },
            });
            return NextResponse.json({ cart: updatedCart });
        } else {
            // Create new cart item
            const cart = await prisma.cart.create({
                data: {
                    userId: session.user.id,
                    productId,
                    quantity,
                },
            });
            return NextResponse.json({ cart });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    }
}
