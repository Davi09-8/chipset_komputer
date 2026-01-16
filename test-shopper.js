const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Gunakan native fetch (Node 18+)

async function testShopperFlow() {
    const email = `shopper_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test Shopper';

    console.log(`1. Mendaftar user baru: ${email}`);

    try {
        // 1. Register
        const regRes = await fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        console.log('Register Status:', regRes.status);
        if (!regRes.ok) throw new Error('Registrasi gagal');

        console.log('✅ Registrasi berhasil.');

        // 2. Login (Simulasi request ke NextAuth - sulit via fetch raw karena CSRF dll)
        // Sebagai gantinya, kita verifikasi data di DB apakah password ter-hash dengan benar.

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User tidak ditemukan di DB');

        // Cek apakah password tidak plain text
        if (user.password === password) {
            console.error('❌ BAHAYA: Password tersimpan sebagai plain text!');
        } else if (user.password.startsWith('$2')) {
            console.log('✅ Password tersimpan aman (hashed).');
            console.log('   User Role:', user.role); // Harusnya CUSTOMER
        }

    } catch (err) {
        console.error('❌ Error flow:', err);
    } finally {
        await prisma.$disconnect();
    }
}

testShopperFlow();
