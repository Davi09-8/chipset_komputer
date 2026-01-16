import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { code, cartTotal } = await request.json();

        if (!code) {
            return NextResponse.json(
                { error: 'Kode kupon wajib diisi' },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!coupon) {
            return NextResponse.json(
                { error: 'Kode kupon tidak valid' },
                { status: 404 }
            );
        }

        if (!coupon.isActive) {
            return NextResponse.json(
                { error: 'Kupon ini sudah tidak aktif' },
                { status: 400 }
            );
        }

        const now = new Date();
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);

        if (now < startDate) {
            return NextResponse.json(
                { error: 'Promo kupon ini belum dimulai' },
                { status: 400 }
            );
        }

        if (now > endDate) {
            return NextResponse.json(
                { error: 'Kupon ini sudah kadaluarsa' },
                { status: 400 }
            );
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json(
                { error: 'Kuota penggunaan kupon ini sudah habis' },
                { status: 400 }
            );
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.type === 'PERCENTAGE') {
            discountAmount = (cartTotal * coupon.value) / 100;
        } else {
            discountAmount = coupon.value;
        }

        // Ensure discount doesn't exceed cart total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return NextResponse.json({
            success: true,
            discountAmount,
            couponCode: coupon.code,
            type: coupon.type,
            value: coupon.value
        });

    } catch (error) {
        console.error('Coupon verification error:', error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan saat memproses kupon' },
            { status: 500 }
        );
    }
}
