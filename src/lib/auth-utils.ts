import { NextResponse } from 'next/server';
import { auth } from './auth';

/**
 * Memastikan user sudah login
 * @returns User session atau null
 */
export async function requireAuth() {
    const session = await auth();

    if (!session?.user) {
        return {
            user: null,
            error: NextResponse.json(
                { error: 'Tidak terautentikasi. Silakan login terlebih dahulu.' },
                { status: 401 }
            ),
        };
    }

    return { user: session.user, error: null };
}

/**
 * Memastikan user adalah admin
 * @returns User session atau null
 */
export async function requireAdmin() {
    const session = await auth();

    if (!session?.user) {
        return {
            user: null,
            error: NextResponse.json(
                { error: 'Tidak terautentikasi. Silakan login terlebih dahulu.' },
                { status: 401 }
            ),
        };
    }

    if (session.user.role !== 'ADMIN') {
        return {
            user: null,
            error: NextResponse.json(
                { error: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini.' },
                { status: 403 }
            ),
        };
    }

    return { user: session.user, error: null };
}

/**
 * Helper untuk response error
 */
export function errorResponse(message: string, status: number = 500) {
    return NextResponse.json({ error: message }, { status });
}

/**
 * Helper untuk response sukses
 */
export function successResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
}
