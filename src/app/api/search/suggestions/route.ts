import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Search suggestions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        if (query.length < 2) {
            return NextResponse.json({ suggestions: [] });
        }

        // Search products
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                ],
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
            },
            take: 5,
        });

        // Search categories
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
                name: { contains: query },
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
            take: 3,
        });

        return NextResponse.json({
            suggestions: {
                products,
                categories,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
