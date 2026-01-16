const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteToAdmin(email) {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log(`✅ User ${email} promoted to ADMIN.`);
    } catch (e) {
        console.error(`❌ Failed to promote ${email}:`, e.message);
    } finally {
        await prisma.$disconnect();
    }
}

// Promote admin@example.com
promoteToAdmin('admin@example.com');
