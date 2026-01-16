import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/categories
 * Mendapatkan semua kategori dengan hierarki
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const where: any = {};
        if (!includeInactive) {
            where.isActive = true;
        }

        const categories = await prisma.category.findMany({
            where,
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return successResponse({ categories });
    } catch (err) {
        console.error('Error fetching categories:', err);
        return errorResponse('Gagal mengambil data kategori');
    }
}

/**
 * POST /api/admin/categories
 * Membuat kategori baru
 */
export async function POST(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        const body = await request.json();
        const { name, slug, description, image, parentId, isActive } = body;

        // Validasi
        if (!name || !slug) {
            return errorResponse('Nama dan slug harus diisi', 400);
        }

        // Cek apakah slug sudah ada
        const existing = await prisma.category.findUnique({
            where: { slug },
        });

        if (existing) {
            return errorResponse('Slug sudah digunakan', 400);
        }

        // Jika ada parentId, cek apakah parent ada
        if (parentId) {
            const parent = await prisma.category.findUnique({
                where: { id: parentId },
            });

            if (!parent) {
                return errorResponse('Kategori parent tidak ditemukan', 404);
            }
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description: description || null,
                image: image || null,
                parentId: parentId || null,
                isActive: isActive !== undefined ? isActive : true,
            },
            include: {
                parent: true,
                children: true,
            },
        });

        return successResponse({ category }, 201);
    } catch (err) {
        console.error('Error creating category:', err);
        return errorResponse('Gagal membuat kategori');
    }
}
