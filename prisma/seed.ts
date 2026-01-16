import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'ADMIN',
        },
    });

    // Create customer user
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            name: 'Customer Test',
            email: 'customer@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'CUSTOMER',
        },
    });

    console.log('✅ Users created');

    // Create categories
    const categories = [
        {
            name: 'Laptop',
            slug: 'laptop',
            description: 'Laptop untuk berbagai kebutuhan',
        },
        {
            name: 'Komputer',
            slug: 'komputer',
            description: 'PC Desktop rakitan dan branded',
        },
        {
            name: 'CCTV',
            slug: 'cctv',
            description: 'Kamera pengawas keamanan',
        },
        {
            name: 'Camera',
            slug: 'camera',
            description: 'Kamera digital dan aksesoris',
        },
        {
            name: 'Processor',
            slug: 'processor',
            description: 'CPU dan Processor untuk komputer',
        },
        {
            name: 'Motherboard',
            slug: 'motherboard',
            description: 'Motherboard berbagai chipset',
        },
        {
            name: 'RAM',
            slug: 'ram',
            description: 'Memory RAM DDR3, DDR4, DDR5',
        },
        {
            name: 'Graphics Card',
            slug: 'graphics-card',
            description: 'VGA Card NVIDIA dan AMD',
        },
        {
            name: 'Storage',
            slug: 'storage',
            description: 'SSD, HDD, dan NVMe',
        },
        {
            name: 'Power Supply',
            slug: 'power-supply',
            description: 'PSU untuk komputer',
        },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }

    console.log('✅ Categories created');

    // Get category IDs
    const laptop = await prisma.category.findUnique({ where: { slug: 'laptop' } });
    const komputer = await prisma.category.findUnique({ where: { slug: 'komputer' } });
    const cctv = await prisma.category.findUnique({ where: { slug: 'cctv' } });
    const camera = await prisma.category.findUnique({ where: { slug: 'camera' } });
    const processor = await prisma.category.findUnique({ where: { slug: 'processor' } });
    const motherboard = await prisma.category.findUnique({ where: { slug: 'motherboard' } });
    const ram = await prisma.category.findUnique({ where: { slug: 'ram' } });
    const gpu = await prisma.category.findUnique({ where: { slug: 'graphics-card' } });
    const storage = await prisma.category.findUnique({ where: { slug: 'storage' } });
    const psu = await prisma.category.findUnique({ where: { slug: 'power-supply' } });

    // Create products
    const products = [
        {
            categoryId: laptop!.id,
            name: 'ASUS ROG Zephyrus G14',
            slug: 'asus-rog-zephyrus-g14',
            description: 'Laptop gaming ultra-portable dengan AMD Ryzen 9 dan RTX 4060.',
            price: 24500000,
            stock: 5,
            sku: 'NB-ASUS-G14',
            specifications: JSON.stringify({
                Processor: 'AMD Ryzen 9 7940HS',
                RAM: '16GB DDR5',
                Storage: '1TB NVMe SSD',
                GPU: 'RTX 4060 8GB',
                Display: '14" 165Hz IPS Level'
            }),
        },
        {
            categoryId: komputer!.id,
            name: 'PC Rakitan Gaming Mid-Range',
            slug: 'pc-rakitan-gaming-mid',
            description: 'PC Gaming siap pakai untuk game AAA di 1080p rata kanan.',
            price: 12500000,
            stock: 3,
            sku: 'PC-MID-INTEL',
            specifications: JSON.stringify({
                Processor: 'Intel Core i5-13400F',
                RAM: '16GB DDR4 3200MHz',
                Storage: '512GB NVMe SSD',
                GPU: 'RTX 3060 12GB',
                PSU: '650W 80+ Bronze'
            }),
        },
        {
            categoryId: cctv!.id,
            name: 'Hikvision IP Camera 4MP',
            slug: 'hikvision-ip-cam-4mp',
            description: 'Kamera pengawas outdoor dengan fitur night vision dan motion detection.',
            price: 850000,
            stock: 20,
            sku: 'CCTV-HIK-4MP',
            specifications: JSON.stringify({
                Resolution: '4MP (2560x1440)',
                Lens: '2.8mm',
                IR: 'Up to 30m',
                Weatherproof: 'IP67',
                Power: 'PoE / 12V DC'
            }),
        },
        {
            categoryId: camera!.id,
            name: 'Sony Alpha a7 IV Mirrorless',
            slug: 'sony-a7-iv-body',
            description: 'Kamera hybrid full-frame terbaik untuk foto dan video profesional.',
            price: 36999000,
            stock: 2,
            sku: 'CAM-SONY-A7M4',
            specifications: JSON.stringify({
                Sensor: '33MP Full-Frame Exmor R CMOS',
                Video: '4K 60p 10-bit 4:2:2',
                ISO: '100-51200',
                AF: 'Real-time Eye AF',
                Stabilization: '5-axis In-body'
            }),
        },
        {
            categoryId: processor!.id,
            name: 'Intel Core i9-13900K',
            slug: 'intel-core-i9-13900k',
            description: 'Processor Intel Core i9 Generasi ke-13 dengan 24 core dan 32 thread. Kecepatan hingga 5.8 GHz.',
            price: 8500000,
            stock: 15,
            sku: 'CPU-INTEL-I9-13900K',
            specifications: JSON.stringify({
                Cores: '24 (8P+16E)',
                Threads: '32',
                'Base Clock': '3.0 GHz',
                'Boost Clock': '5.8 GHz',
                Socket: 'LGA 1700',
                TDP: '125W',
            }),
        },
        {
            categoryId: processor!.id,
            name: 'AMD Ryzen 9 7950X',
            slug: 'amd-ryzen-9-7950x',
            description: 'Processor AMD Ryzen 9 dengan 16 core dan 32 thread. Arsitektur Zen 4 terbaru.',
            price: 9200000,
            stock: 12,
            sku: 'CPU-AMD-R9-7950X',
            specifications: JSON.stringify({
                Cores: '16',
                Threads: '32',
                'Base Clock': '4.5 GHz',
                'Boost Clock': '5.7 GHz',
                Socket: 'AM5',
                TDP: '170W',
            }),
        },
        {
            categoryId: motherboard!.id,
            name: 'ASUS ROG STRIX Z790-E',
            slug: 'asus-rog-strix-z790-e',
            description: 'Motherboard gaming premium dengan chipset Intel Z790. Mendukung DDR5 dan PCIe 5.0.',
            price: 7500000,
            stock: 8,
            sku: 'MB-ASUS-Z790-E',
            specifications: JSON.stringify({
                Chipset: 'Intel Z790',
                Socket: 'LGA 1700',
                Memory: 'DDR5 up to 7200MHz',
                PCIe: '5.0',
                'Form Factor': 'ATX',
            }),
        },
        {
            categoryId: ram!.id,
            name: 'Corsair Vengeance DDR5 32GB',
            slug: 'corsair-vengeance-ddr5-32gb',
            description: 'RAM DDR5 32GB (2x16GB) dengan kecepatan 6000MHz. RGB lighting.',
            price: 3200000,
            stock: 25,
            sku: 'RAM-CORS-DDR5-32',
            specifications: JSON.stringify({
                Capacity: '32GB (2x16GB)',
                Type: 'DDR5',
                Speed: '6000MHz',
                'CAS Latency': 'CL36',
                RGB: 'Yes',
            }),
        },
        {
            categoryId: gpu!.id,
            name: 'NVIDIA RTX 4090',
            slug: 'nvidia-rtx-4090',
            description: 'Graphics card flagship NVIDIA dengan 24GB GDDR6X. Performa gaming dan rendering terbaik.',
            price: 32000000,
            stock: 5,
            sku: 'GPU-NV-RTX4090',
            specifications: JSON.stringify({
                GPU: 'NVIDIA GeForce RTX 4090',
                Memory: '24GB GDDR6X',
                'CUDA Cores': '16384',
                'Boost Clock': '2.52 GHz',
                Power: '450W',
            }),
        },
        {
            categoryId: storage!.id,
            name: 'Samsung 990 PRO 2TB',
            slug: 'samsung-990-pro-2tb',
            description: 'SSD NVMe PCIe 4.0 dengan kapasitas 2TB. Kecepatan baca hingga 7450 MB/s.',
            price: 4500000,
            stock: 20,
            sku: 'SSD-SAM-990P-2TB',
            specifications: JSON.stringify({
                Capacity: '2TB',
                Interface: 'PCIe 4.0 x4 NVMe',
                'Read Speed': '7450 MB/s',
                'Write Speed': '6900 MB/s',
                'Form Factor': 'M.2 2280',
            }),
        },
        {
            categoryId: psu!.id,
            name: 'Corsair RM1000x 1000W',
            slug: 'corsair-rm1000x-1000w',
            description: 'Power supply modular 1000W dengan sertifikasi 80+ Gold. Sangat efisien dan senyap.',
            price: 3800000,
            stock: 10,
            sku: 'PSU-CORS-RM1000X',
            specifications: JSON.stringify({
                Wattage: '1000W',
                Efficiency: '80+ Gold',
                Modular: 'Fully Modular',
                'Fan Size': '135mm',
                Warranty: '10 Years',
            }),
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }

    console.log('✅ Products created');
    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
