import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/products/[id]
 * Mendapatkan detail produk
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        orderItems: true,
                    },
                },
            },
        });

        if (!product) {
            return errorResponse('Produk tidak ditemukan', 404);
        }

        return successResponse({ product });
    } catch (err) {
        console.error('Error fetching product:', err);
        return errorResponse('Gagal mengambil data produk');
    }
}

/**
 * PUT /api/admin/products/[id]
 * Update produk
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Cek apakah produk ada
        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!existingProduct) {
            return errorResponse('Produk tidak ditemukan', 404);
        }

        // Cek apakah slug atau sku sudah digunakan oleh produk lain
        if (slug || sku) {
            const duplicate = await prisma.product.findFirst({
                where: {
                    AND: [
                        { id: { not: params.id } },
                        {
                            OR: [
                                slug ? { slug } : {},
                                sku ? { sku } : {},
                            ].filter(obj => Object.keys(obj).length > 0),
                        },
                    ],
                },
            });

            if (duplicate) {
                return errorResponse('Slug atau SKU sudah digunakan', 400);
            }
        }

        // Build update data
        const updateData: any = {};
        if (categoryId) updateData.categoryId = categoryId;
        if (name) updateData.name = name;
        if (slug) updateData.slug = slug;
        if (description) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (discountPrice !== undefined) updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
        if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage ? parseInt(discountPercentage) : null;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (sku) updateData.sku = sku;
        if (images) updateData.images = JSON.stringify(images);
        if (specifications) updateData.specifications = JSON.stringify(specifications);
        if (isActive !== undefined) updateData.isActive = isActive;

        const product = await prisma.product.update({
            where: { id: params.id },
            data: updateData,
            include: {
                category: true,
            },
        });

        return successResponse({ product });
    } catch (err) {
        console.error('Error updating product:', err);
        return errorResponse('Gagal mengupdate produk');
    }
}

/**
 * DELETE /api/admin/products/[id]
 * Hapus produk
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        // Cek apakah produk ada
        const product = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!product) {
            return errorResponse('Produk tidak ditemukan', 404);
        }

        // Hapus produk (akan cascade delete cart items, order items, dan reviews)
        await prisma.product.delete({
            where: { id: params.id },
        });

        return successResponse({ message: 'Produk berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting product:', err);
        return errorResponse('Gagal menghapus produk');
    }
}
