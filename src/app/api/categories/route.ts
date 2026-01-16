import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/categories
 * Mendapatkan semua kategori aktif dengan hierarki (public)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeProducts = searchParams.get('includeProducts') === 'true';

        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                children: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        products: {
                            where: { isActive: true },
                        },
                    },
                },
                ...(includeProducts && {
                    products: {
                        where: { isActive: true },
                        take: 4,
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            price: true,
                            images: true,
                        },
                    },
                }),
            },
            orderBy: { name: 'asc' },
        });

        return successResponse({ categories });
    } catch (err) {
        console.error('Error fetching categories:', err);
        return errorResponse('Gagal mengambil data kategori');
    }
}
