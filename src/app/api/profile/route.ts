import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * GET /api/profile
 * Mendapatkan profil user yang sedang login
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const userData = await prisma.user.findUnique({
            where: { id: user.id },
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
        });

        if (!userData) {
            return errorResponse('User tidak ditemukan', 404);
        }

        return successResponse({ user: userData });
    } catch (err) {
        console.error('Error fetching profile:', err);
        return errorResponse('Gagal mengambil data profil');
    }
}

/**
 * PUT /api/profile
 * Update profil user
 */
export async function PUT(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const body = await request.json();
        const { name, email, currentPassword, newPassword, image } = body;

        // Cek apakah user ada
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
        });

        if (!existingUser) {
            return errorResponse('User tidak ditemukan', 404);
        }

        // Build update data
        const updateData: any = {};

        // Update name
        if (name && name !== existingUser.name) {
            updateData.name = name;
        }

        // Update email
        if (email && email !== existingUser.email) {
            // Cek apakah email sudah digunakan
            const emailExists = await prisma.user.findUnique({
                where: { email },
            });

            if (emailExists) {
                return errorResponse('Email sudah digunakan', 400);
            }

            updateData.email = email;
            updateData.emailVerified = null; // Reset email verification
        }

        // Update password
        if (newPassword) {
            if (!currentPassword) {
                return errorResponse('Password saat ini harus diisi', 400);
            }

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, existingUser.password);
            if (!isValid) {
                return errorResponse('Password saat ini salah', 400);
            }

            // Validate new password
            if (newPassword.length < 6) {
                return errorResponse('Password baru minimal 6 karakter', 400);
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        // Update image
        if (image !== undefined) {
            updateData.image = image;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return errorResponse('Tidak ada perubahan data', 400);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                emailVerified: true,
                updatedAt: true,
            },
        });

        return successResponse({
            user: updatedUser,
            message: 'Profil berhasil diupdate',
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        return errorResponse('Gagal mengupdate profil');
    }
}
