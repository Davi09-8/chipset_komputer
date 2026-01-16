import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/coupons
 * List all coupons
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return successResponse({ coupons });
    } catch (err) {
        console.error('Error fetching coupons:', err);
        return errorResponse('Gagal mengambil data kupon');
    }
}

/**
 * POST /api/admin/coupons
 * Create new coupon
 */
export async function POST(request: NextRequest) {
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

        // Validation
        if (!code || !type || !value || !startDate || !endDate) {
            return errorResponse('Data tidak lengkap', 400);
        }

        // Check duplicate code
        const existing = await prisma.coupon.findUnique({
            where: { code },
        });

        if (existing) {
            return errorResponse('Kode kupon sudah ada', 400);
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                type,
                value: parseFloat(value),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                minPurchase: minPurchase ? parseFloat(minPurchase) : null,
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return successResponse({ coupon }, 201);
    } catch (err) {
        console.error('Error creating coupon:', err);
        return errorResponse('Gagal membuat kupon');
    }
}
