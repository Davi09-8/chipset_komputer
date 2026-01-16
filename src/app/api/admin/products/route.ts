import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/products
 * Mendapatkan semua produk dengan pagination dan filter
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const categoryId = searchParams.get('categoryId') || '';
        const isActive = searchParams.get('isActive');

        const skip = (page - 1) * limit;

        // Build filter
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { sku: { contains: search } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (isActive !== null && isActive !== undefined && isActive !== '') {
            where.isActive = isActive === 'true';
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    _count: {
                        select: {
                            reviews: true,
                            orderItems: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return successResponse({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        return errorResponse('Gagal mengambil data produk');
    }
}

/**
 * POST /api/admin/products
 * Membuat produk baru
 */
export async function POST(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const body = await request.json();
        const {
            categoryId,
            name,
            slug,
            description,
            price,
            discountPrice,
            discountPercentage,
            stock,
            sku,
            images,
            specifications,
            isActive,
        } = body;

        // Validasi
        if (!categoryId || !name || !slug || !description || !price || !sku) {
            return errorResponse('Data tidak lengkap', 400);
        }

        // Cek apakah slug atau sku sudah ada
        const existing = await prisma.product.findFirst({
            where: {
                OR: [{ slug }, { sku }],
            },
        });

        if (existing) {
            return errorResponse('Slug atau SKU sudah digunakan', 400);
        }

        // Cek apakah kategori ada
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return errorResponse('Kategori tidak ditemukan', 404);
        }

        const product = await prisma.product.create({
            data: {
                categoryId,
                name,
                slug,
                description,
                price: parseFloat(price),
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                discountPercentage: discountPercentage ? parseInt(discountPercentage) : null,
                stock: parseInt(stock) || 0,
                sku,
                images: JSON.stringify(images || []),
                specifications: JSON.stringify(specifications || {}),
                isActive: isActive !== undefined ? isActive : true,
            },
            include: {
                category: true,
            },
        });

        return successResponse({ product }, 201);
    } catch (err) {
        console.error('Error creating product:', err);
        return errorResponse('Gagal membuat produk');
    }
}
