import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/users
 * Mendapatkan semua user dengan pagination
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || '';

        const skip = (page - 1) * limit;

        // Build filter
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
            ];
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            orders: true,
                            reviews: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return successResponse({
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        return errorResponse('Gagal mengambil data user');
    }
}
