import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/admin/reviews/[id]
 * Approve atau reject review
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const body = await request.json();
        const { isApproved } = body;

        // Cek apakah review ada
        const existingReview = await prisma.review.findUnique({
            where: { id: params.id },
        });

        if (!existingReview) {
            return errorResponse('Review tidak ditemukan', 404);
        }

        if (isApproved === undefined) {
            return errorResponse('Status approval harus diisi', 400);
        }

        const review = await prisma.review.update({
            where: { id: params.id },
            data: { isApproved },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        return successResponse({ review });
    } catch (err) {
        console.error('Error updating review:', err);
        return errorResponse('Gagal mengupdate review');
    }
}

/**
 * DELETE /api/admin/reviews/[id]
 * Hapus review
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        // Cek apakah review ada
        const review = await prisma.review.findUnique({
            where: { id: params.id },
        });

        if (!review) {
            return errorResponse('Review tidak ditemukan', 404);
        }

        // Hapus review
        await prisma.review.delete({
            where: { id: params.id },
        });

        return successResponse({ message: 'Review berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting review:', err);
        return errorResponse('Gagal menghapus review');
    }
}
