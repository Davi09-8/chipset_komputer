import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        // Check if already subscribed
        const existing = await prisma.newsletter.findUnique({
            where: { email },
        });

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
            } else {
                // Reactivate subscription
                await prisma.newsletter.update({
                    where: { email },
                    data: { isActive: true, subscribedAt: new Date() },
                });
                return NextResponse.json({ message: 'Subscription reactivated!' });
            }
        }

        // Create new subscription
        await prisma.newsletter.create({
            data: { email },
        });

        return NextResponse.json({ message: 'Successfully subscribed to newsletter!' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
