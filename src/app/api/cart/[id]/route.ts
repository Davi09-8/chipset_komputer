import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quantity } = await request.json();

        const cart = await prisma.cart.findUnique({
            where: { id: params.id },
            include: { product: true },
        });

        if (!cart || cart.userId !== session.user.id) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
        }

        if (cart.product.stock < quantity) {
            return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }

        const updatedCart = await prisma.cart.update({
            where: { id: params.id },
            data: { quantity },
        });

        return NextResponse.json({ cart: updatedCart });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cart = await prisma.cart.findUnique({
            where: { id: params.id },
        });

        if (!cart || cart.userId !== session.user.id) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
        }

        await prisma.cart.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
    }
}
