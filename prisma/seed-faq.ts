import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing data
    await prisma.fAQ.deleteMany();

    // Seed FAQs
    const faqs = [
        // Pembayaran
        {
            question: 'Metode pembayaran apa saja yang tersedia?',
            answer: 'Kami menerima pembayaran melalui Transfer Bank (BCA, Mandiri, BNI), E-wallet (GoPay, OVO, Dana), dan Credit Card.',
            category: 'Pembayaran',
            order: 1,
        },
        {
            question: 'Berapa lama konfirmasi pembayaran?',
            answer: 'Pembayaran akan dikonfirmasi otomatis dalam 1-2 jam setelah transfer. Untuk pembayaran di luar jam kerja, akan dikonfirmasi pada hari kerja berikutnya.',
            category: 'Pembayaran',
            order: 2,
        },
        {
            question: 'Apakah bisa bayar di tempat (COD)?',
            answer: 'Saat ini kami belum melayani COD. Semua pembayaran dilakukan secara online untuk keamanan bersama.',
            category: 'Pembayaran',
            order: 3,
        },

        // Pengiriman
        {
            question: 'Berapa lama estimasi pengiriman?',
            answer: 'Estimasi pengiriman tergantung lokasi: Jabodetabek 1-2 hari, Jawa 2-3 hari, Luar Jawa 3-5 hari kerja.',
            category: 'Pengiriman',
            order: 1,
        },
        {
            question: 'Apakah ada gratis ongkir?',
            answer: 'Ya, kami memberikan gratis ongkir untuk pembelian minimal Rp 500.000 ke seluruh Indonesia.',
            category: 'Pengiriman',
            order: 2,
        },
        {
            question: 'Bagaimana cara tracking pesanan?',
            answer: 'Setelah pesanan dikirim, Anda akan menerima nomor resi melalui email dan bisa tracking di halaman order history.',
            category: 'Pengiriman',
            order: 3,
        },

        // Garansi
        {
            question: 'Berapa lama masa garansi produk?',
            answer: 'Masa garansi bervariasi tergantung produk, umumnya 1-3 tahun garansi resmi distributor. Detail garansi tercantum di deskripsi produk.',
            category: 'Garansi',
            order: 1,
        },
        {
            question: 'Bagaimana cara klaim garansi?',
            answer: 'Hubungi customer service kami dengan menyertakan bukti pembelian dan foto produk. Kami akan bantu proses klaim ke distributor.',
            category: 'Garansi',
            order: 2,
        },
        {
            question: 'Apakah garansi berlaku untuk kerusakan fisik?',
            answer: 'Garansi tidak berlaku untuk kerusakan akibat kesalahan pengguna, jatuh, terkena air, atau modifikasi tidak resmi.',
            category: 'Garansi',
            order: 3,
        },

        // Return
        {
            question: 'Apakah bisa return/tukar barang?',
            answer: 'Ya, kami menerima return/tukar barang dalam 7 hari jika ada cacat produksi atau kesalahan pengiriman.',
            category: 'Return',
            order: 1,
        },
        {
            question: 'Bagaimana prosedur return barang?',
            answer: 'Hubungi customer service, kirim foto produk dan bukti pembelian. Setelah disetujui, kirim barang kembali dengan packaging lengkap.',
            category: 'Return',
            order: 2,
        },
        {
            question: 'Berapa lama proses refund?',
            answer: 'Setelah barang kami terima dan dicek, refund akan diproses dalam 7-14 hari kerja ke rekening Anda.',
            category: 'Return',
            order: 3,
        },

        // Umum
        {
            question: 'Apakah produk yang dijual original?',
            answer: 'Ya, 100% produk kami original dengan garansi resmi distributor Indonesia.',
            category: 'Umum',
            order: 1,
        },
        {
            question: 'Bagaimana cara menghubungi customer service?',
            answer: 'Anda bisa menghubungi kami melalui WhatsApp, Email, atau form kontak di website. Jam operasional Senin-Jumat 09:00-18:00.',
            category: 'Umum',
            order: 2,
        },
        {
            question: 'Apakah ada toko offline?',
            answer: 'Saat ini kami hanya melayani penjualan online. Namun Anda bisa konsultasi dan bertanya melalui customer service kami.',
            category: 'Umum',
            order: 3,
        },
    ];

    for (const faq of faqs) {
        await prisma.fAQ.create({ data: faq });
    }

    console.log('Seeding completed!');
    console.log(`Created ${faqs.length} FAQs`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
