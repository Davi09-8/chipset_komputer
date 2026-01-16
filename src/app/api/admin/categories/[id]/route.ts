import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/categories/[id]
 * Mendapatkan detail kategori
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                parent: true,
                children: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        stock: true,
                        isActive: true,
                    },
                },
            },
        });

        if (!category) {
            return errorResponse('Kategori tidak ditemukan', 404);
        }

        return successResponse({ category });
    } catch (err) {
        console.error('Error fetching category:', err);
        return errorResponse('Gagal mengambil data kategori');
    }
}

/**
 * PUT /api/admin/categories/[id]
 * Update kategori
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const body = await request.json();
        const { name, slug, description, image, parentId, isActive } = body;

        // Cek apakah kategori ada
        const existingCategory = await prisma.category.findUnique({
            where: { id: params.id },
        });

        if (!existingCategory) {
            return errorResponse('Kategori tidak ditemukan', 404);
        }

        // Cek apakah slug sudah digunakan oleh kategori lain
        if (slug) {
            const duplicate = await prisma.category.findFirst({
                where: {
                    AND: [
                        { id: { not: params.id } },
                        { slug },
                    ],
                },
            });

            if (duplicate) {
                return errorResponse('Slug sudah digunakan', 400);
            }
        }

        // Jika parentId diubah, cek apakah parent ada dan tidak circular
        if (parentId !== undefined) {
            if (parentId === params.id) {
                return errorResponse('Kategori tidak bisa menjadi parent dari dirinya sendiri', 400);
            }

            if (parentId) {
                const parent = await prisma.category.findUnique({
                    where: { id: parentId },
                });

                if (!parent) {
                    return errorResponse('Kategori parent tidak ditemukan', 404);
                }

                // Cek apakah parent adalah child dari kategori ini (circular reference)
                if (parent.parentId === params.id) {
                    return errorResponse('Tidak dapat membuat circular reference', 400);
                }
            }
        }

        // Build update data
        const updateData: any = {};
        if (name) updateData.name = name;
        if (slug) updateData.slug = slug;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (parentId !== undefined) updateData.parentId = parentId;
        if (isActive !== undefined) updateData.isActive = isActive;

        const category = await prisma.category.update({
            where: { id: params.id },
            data: updateData,
            include: {
                parent: true,
                children: true,
            },
        });

        return successResponse({ category });
    } catch (err) {
        console.error('Error updating category:', err);
        return errorResponse('Gagal mengupdate kategori');
    }
}

/**
 * DELETE /api/admin/categories/[id]
 * Hapus kategori
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        // Cek apakah kategori ada
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                children: true,
                products: true,
            },
        });

        if (!category) {
            return errorResponse('Kategori tidak ditemukan', 404);
        }

        // Cek apakah kategori memiliki child
        if (category.children.length > 0) {
            return errorResponse('Tidak dapat menghapus kategori yang memiliki sub-kategori', 400);
        }

        // Cek apakah kategori memiliki produk
        if (category.products.length > 0) {
            return errorResponse('Tidak dapat menghapus kategori yang memiliki produk', 400);
        }

        // Hapus kategori
        await prisma.category.delete({
            where: { id: params.id },
        });

        return successResponse({ message: 'Kategori berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting category:', err);
        return errorResponse('Gagal menghapus kategori');
    }
}
