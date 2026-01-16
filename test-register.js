// Menggunakan native fetch (Node 18+)

async function testRegister() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    console.log(`Mencoba registrasi user baru: ${email}`);

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        console.log('Status Code:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ Registrasi berhasil!');
        } else {
            console.log('❌ Registrasi gagal.');
        }
    } catch (err) {
        console.error('❌ Error testing register:', err);
    }
}

testRegister();
