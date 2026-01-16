import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/stats
 * Mendapatkan statistik dashboard admin
 */
export async function GET(request: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    try {
        // Get counts
        const [
            totalUsers,
            totalProducts,
            totalCategories,
            totalOrders,
            pendingOrders,
            totalRevenue,
            pendingReviews,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.category.count(),
            prisma.order.count(),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { totalAmount: true },
            }),
            prisma.review.count({ where: { isApproved: false } }),
        ]);

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        orderItems: true,
                    },
                },
            },
        });

        // Get low stock products
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: { lte: 10 },
                isActive: true,
            },
            take: 10,
            orderBy: { stock: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                stock: true,
                price: true,
                images: true,
            },
        });

        // Get top selling products (berdasarkan jumlah order items)
        const topSellingProducts = await prisma.product.findMany({
            take: 5,
            orderBy: {
                orderItems: {
                    _count: 'desc',
                },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                _count: {
                    select: {
                        orderItems: true,
                    },
                },
            },
        });

        // Get chart data based on range
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range');
        const dateParam = searchParams.get('date');

        let startDate = new Date();
        let queryEndDate: Date | undefined;
        let dateFormat: Intl.DateTimeFormatOptions;
        let step: 'day' | 'month';

        // Reset time to start of day
        startDate.setHours(0, 0, 0, 0);

        if (range === '7d') {
            startDate.setDate(startDate.getDate() - 6); // Last 7 days inclusive
            dateFormat = { day: 'numeric', month: 'short' };
            step = 'day';
        } else if (range === '30d') {
            startDate.setDate(startDate.getDate() - 29); // Last 30 days inclusive
            dateFormat = { day: 'numeric', month: 'short' };
            step = 'day';
        } else if (range === 'specific_month' && dateParam) {
            startDate = new Date(dateParam);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);

            // End of that month
            queryEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            queryEndDate.setHours(23, 59, 59, 999);

            dateFormat = { day: 'numeric', month: 'short' };
            step = 'day';
        } else {
            // Default: Last 12 months
            startDate.setMonth(startDate.getMonth() - 11);
            startDate.setDate(1);
            dateFormat = { month: 'short', year: 'numeric' };
            step = 'month';
        }

        const whereClause: any = {
            createdAt: { gte: startDate },
            paymentStatus: 'PAID',
        };

        if (queryEndDate) {
            whereClause.createdAt.lte = queryEndDate;
        }

        const ordersHistory = await prisma.order.findMany({
            where: whereClause,
            select: {
                createdAt: true,
                totalAmount: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        // Initialize aggregation map
        const statsMap = new Map<string, { sales: number; revenue: number; date: Date }>();

        if (step === 'day') {
            // Determine number of days to loop
            let daysCount = 30;
            if (range === '7d') daysCount = 7;
            else if (range === 'specific_month' && queryEndDate) {
                daysCount = queryEndDate.getDate();
            }

            for (let i = 0; i < daysCount; i++) {
                const d = new Date(startDate);
                d.setDate(d.getDate() + i);
                const key = d.toLocaleDateString('id-ID', dateFormat);
                statsMap.set(key, { sales: 0, revenue: 0, date: d });
            }
        } else {
            // Monthly step
            for (let i = 0; i < 12; i++) {
                const d = new Date(startDate);
                d.setMonth(d.getMonth() + i);
                const key = d.toLocaleDateString('id-ID', dateFormat);
                statsMap.set(key, { sales: 0, revenue: 0, date: d });
            }
        }

        // Aggregate data
        ordersHistory.forEach(order => {
            const key = new Date(order.createdAt).toLocaleDateString('id-ID', dateFormat);
            if (statsMap.has(key)) {
                const stat = statsMap.get(key)!;
                stat.sales += 1;
                stat.revenue += order.totalAmount;
            }
        });

        // Convert to array
        const monthlyStats = Array.from(statsMap.entries()).map(([name, stats]) => ({
            name,
            sales: stats.sales,
            revenue: stats.revenue,
        }));

        return successResponse({
            stats: {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                pendingOrders,
                totalRevenue: totalRevenue._sum.totalAmount || 0,
                pendingReviews,
            },
            recentOrders,
            lowStockProducts,
            topSellingProducts,
            monthlyStats, // New field for charts
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        return errorResponse('Gagal mengambil statistik');
    }
}
