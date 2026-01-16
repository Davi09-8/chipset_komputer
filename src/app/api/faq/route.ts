import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all active FAQs
export async function GET() {
    try {
        const faqs = await prisma.fAQ.findMany({
            where: { isActive: true },
            orderBy: [{ category: 'asc' }, { order: 'asc' }],
        });

        // Group by category
        const grouped = faqs.reduce((acc: any, faq) => {
            if (!acc[faq.category]) {
                acc[faq.category] = [];
            }
            acc[faq.category].push(faq);
            return acc;
        }, {});

        return NextResponse.json({ faqs: grouped });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}
