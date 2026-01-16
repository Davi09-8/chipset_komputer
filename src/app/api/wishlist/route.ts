import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get user's wishlist
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wishlists = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ wishlists });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

// POST - Add to wishlist
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

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Check if already in wishlist
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ error: 'Product already in wishlist' }, { status: 400 });
        }

        // Add to wishlist
        const wishlist = await prisma.wishlist.create({
            data: {
                userId: session.user.id,
                productId,
            },
            include: {
                product: true,
            },
        });

        return NextResponse.json({ wishlist, message: 'Added to wishlist' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

// DELETE - Remove from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ message: 'Removed from wishlist' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}
