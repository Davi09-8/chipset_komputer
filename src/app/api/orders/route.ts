import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/orders
 * Membuat order baru dari cart
 */
export async function POST(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const { name, phone, address, city, postalCode, paymentMethod, notes, shippingService, discountCode } = await request.json();

        // Validasi input
        if (!name || !phone || !address || !city || !postalCode || !shippingService) {
            return errorResponse('Data pengiriman tidak lengkap', 400);
        }

        // Calculate Discount
        let discountAmount = 0;
        if (discountCode === 'CHIPSET') {
            discountAmount = 10000;
        }

        // Hitung shipping cost (Mock)
        let shippingCost = 0;
        switch (shippingService) {
            case 'JNE_REG': shippingCost = 20000; break;
            case 'JNE_YES': shippingCost = 35000; break;
            case 'JNT': shippingCost = 18000; break;
            case 'PICKUP': shippingCost = 0; break;
            default: shippingCost = 0;
        }

        // Get cart items
        const cartItems = await prisma.cart.findMany({
            where: { userId: user.id },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            return errorResponse('Keranjang belanja kosong', 400);
        }

        // Validasi stok produk
        for (const item of cartItems) {
            if (item.product.stock < item.quantity) {
                return errorResponse(
                    `Stok ${item.product.name} tidak mencukupi. Tersedia: ${item.product.stock}`,
                    400
                );
            }

            if (!item.product.isActive) {
                return errorResponse(
                    `Produk ${item.product.name} tidak tersedia`,
                    400
                );
            }
        }

        // Calculate total (Items + Shipping)
        const itemsTotal = cartItems.reduce((sum, item) => {
            const priceToUse = item.product.discountPrice ?? item.product.price;
            return sum + priceToUse * item.quantity;
        }, 0);
        const totalAmount = Math.max(0, itemsTotal + shippingCost - discountAmount);

        // Create order dengan transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    userId: user.id,
                    orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    totalAmount,
                    paymentMethod: paymentMethod || 'TRANSFER',
                    shippingAddress: JSON.stringify({ name, phone, address, city, postalCode }),
                    shippingCost,
                    shippingService,
                    discountCode: discountAmount > 0 ? discountCode : null,
                    discountAmount,
                    notes: notes || null,
                    orderItems: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.discountPrice ?? item.product.price,
                        })),
                    },
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Update product stock
            for (const item of cartItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Clear cart
            await tx.cart.deleteMany({
                where: { userId: user.id },
            });

            return newOrder;
        });

        return successResponse({
            order,
            message: 'Order berhasil dibuat',
        }, 201);
    } catch (err) {
        console.error('Order creation error:', err);
        return errorResponse('Gagal membuat order');
    }
}

/**
 * GET /api/orders
 * Mendapatkan daftar order user
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || '';

        const skip = (page - 1) * limit;

        // Build filter
        const where: any = { userId: user.id };
        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    images: true,
                                    price: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        return successResponse({
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        return errorResponse('Gagal mengambil data order');
    }
}
