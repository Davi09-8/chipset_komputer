const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Need bcryptjs
const prisma = new PrismaClient();

async function resetAdminPassword() {
    const email = 'admin@example.com';
    const newPassword = 'admin'; // Sesuai dengan page.tsx info

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'ADMIN'
            },
        });
        console.log(`✅ Password user ${email} di-reset menjadi '${newPassword}' dan role set ke ADMIN.`);
    } catch (e) {
        console.error(`❌ Failed to reset ${email}:`, e.message);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
