import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get related products
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        // Get current product
        const product = await prisma.product.findUnique({
            where: { slug: params.slug },
            include: { category: true },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Get related products (same category, different product, active, in stock)
        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                isActive: true,
                stock: { gt: 0 },
            },
            include: {
                category: true,
            },
            take: 4,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ relatedProducts });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch related products' }, { status: 500 });
    }
}
