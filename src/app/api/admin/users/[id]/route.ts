import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/users/[id]
 * Mendapatkan detail user
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const userData = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                orders: {
                    select: {
                        id: true,
                        orderNumber: true,
                        totalAmount: true,
                        status: true,
                        paymentStatus: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        isApproved: true,
                        createdAt: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!userData) {
            return errorResponse('User tidak ditemukan', 404);
        }

        return successResponse({ user: userData });
    } catch (err) {
        console.error('Error fetching user:', err);
        return errorResponse('Gagal mengambil data user');
    }
}

/**
 * PUT /api/admin/users/[id]
 * Update role user
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const body = await request.json();
        const { role } = body;

        // Cek apakah user ada
        const existingUser = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!existingUser) {
            return errorResponse('User tidak ditemukan', 404);
        }

        // Validasi role
        const validRoles = ['CUSTOMER', 'ADMIN'];
        if (role && !validRoles.includes(role)) {
            return errorResponse('Role tidak valid', 400);
        }

        // Cegah admin mengubah role dirinya sendiri
        if (params.id === user.id) {
            return errorResponse('Anda tidak dapat mengubah role Anda sendiri', 400);
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return successResponse({ user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        return errorResponse('Gagal mengupdate user');
    }
}
