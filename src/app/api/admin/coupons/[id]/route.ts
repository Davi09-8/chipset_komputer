import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/admin/coupons/[id]
 * Update coupon
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
            code,
            type,
            value,
            startDate,
            endDate,
            minPurchase,
            maxDiscount,
            usageLimit,
            isActive
        } = body;

        const coupon = await prisma.coupon.update({
            where: { id: params.id },
            data: {
                code: code ? code.toUpperCase() : undefined,
                type,
                value: value ? parseFloat(value) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                minPurchase: minPurchase !== undefined ? (minPurchase ? parseFloat(minPurchase) : null) : undefined,
                maxDiscount: maxDiscount !== undefined ? (maxDiscount ? parseFloat(maxDiscount) : null) : undefined,
                usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit) : null) : undefined,
                isActive: isActive !== undefined ? isActive : undefined,
            },
        });

        return successResponse({ coupon });
    } catch (err) {
        console.error('Error updating coupon:', err);
        return errorResponse('Gagal mengupdate kupon');
    }
}

/**
 * DELETE /api/admin/coupons/[id]
 * Delete coupon
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        await prisma.coupon.delete({
            where: { id: params.id },
        });

        return successResponse({ message: 'Kupon berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting coupon:', err);
        return errorResponse('Gagal menghapus kupon');
    }
}
