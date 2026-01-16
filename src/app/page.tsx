import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import NewsletterForm from '@/components/NewsletterForm';
import BackToTop from '@/components/BackToTop';
import ProductCard from '@/components/ProductCard';
import { Rocket, ShoppingCart, Truck, ShieldCheck, CreditCard } from 'lucide-react';

export default async function HomePage() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });

    const featuredProducts = await prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0 } },
        include: { category: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80')] opacity-20 bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center md:text-left md:max-w-3xl animate-fade-in">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-sm mb-6 border border-emerald-500/30 backdrop-blur-sm">
                            <Rocket className="w-4 h-4 mr-2" /> Official Store Terpercaya
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-emerald-400">Chipset</span> & Komputer
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            Destinasi utama untuk upgrade performa digitalmu. Temukan koleksi terlengkap chipset, prosesor kelas dunia, hingga laptop terbaru dengan jaminan kualitas terbaik dan harga kompetitif.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link href="/products" className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30 text-center flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 mr-2" /> Lihat Katalog
                            </Link>
                            <Link href="/about" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition border border-white/20 text-center">
                                Tentang Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Kategori Pilihan</h2>
                    <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">Lihat Semua →</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories
                        .sort((a, b) => {
                            const order = ['laptop', 'komputer', 'cctv', 'camera', 'motherboard', 'ram', 'graphics-card', 'processor', 'storage', 'power-supply'];
                            const indexA = order.indexOf(a.slug);
                            const indexB = order.indexOf(b.slug);
                            // If both are found in the order array, sort by index
                            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                            // If only A is found, put A first
                            if (indexA !== -1) return -1;
                            // If only B is found, put B first
                            if (indexB !== -1) return 1;
                            // Otherwise sort alphabetically
                            return a.name.localeCompare(b.name);
                        })
                        .map((category) => {
                            let imageUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80'; // Default (Laptop-ish)

                            if (category.slug === 'laptop') imageUrl = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80';
                            if (category.slug === 'komputer') imageUrl = 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80';
                            if (category.slug === 'cctv') imageUrl = 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&q=80';
                            if (category.slug === 'camera') imageUrl = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80';
                            if (category.slug === 'processor') imageUrl = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80';
                            if (category.slug === 'motherboard') imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80';
                            if (category.slug === 'ram') imageUrl = 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80';
                            if (category.slug === 'graphics-card') imageUrl = 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80';
                            if (category.slug === 'storage') imageUrl = 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&q=80';
                            if (category.slug === 'power-supply') imageUrl = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80';

                            return (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 text-center"
                                >
                                    <div className="h-20 w-full mb-3 rounded-lg overflow-hidden relative bg-gray-50">
                                        <img src={imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{category._count.products} Produk</p>
                                </Link>
                            );
                        })}
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
                            <p className="text-gray-500 text-sm mt-1">Dapatkan gadget terbaru dengan penawaran terbaik</p>
                        </div>
                        <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">Lihat Semua →</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-3xl font-bold mb-2">Butuh Konsultasi Produk?</h3>
                        <p className="text-emerald-100 max-w-xl">Bingung memilih laptop atau komponen yang tepat? Tim kami siap membantu memberikan rekomendasi terbaik sesuai kebutuhan Anda.</p>
                    </div>
                    <Link href="/contact" className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition shadow-lg shrink-0">
                        Hubungi Kami
                    </Link>
                </div>
            </div>

            {/* Service Highlights */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-emerald-100 transition-colors">
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                            <Truck className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Gratis Ongkir</h3>
                            <p className="text-gray-500 text-sm">Klaim voucher gratis ongkir ke seluruh Indonesia tanpa minimum belanja.</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-emerald-100 transition-colors">
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Garansi Resmi</h3>
                            <p className="text-gray-500 text-sm">Jaminan produk 100% original dengan garansi resmi distributor.</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-emerald-100 transition-colors">
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Pembayaran Aman</h3>
                            <p className="text-gray-500 text-sm">Transaksi aman dengan berbagai metode pembayaran (Transfer, E-Wallet).</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">Chipset Computer</h3>
                            <p className="text-gray-400">Toko komputer dan chipset terlengkap dengan harga terbaik.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Kategori</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/products?category=processor" className="hover:text-white">Processor</Link></li>
                                <li><Link href="/products?category=motherboard" className="hover:text-white">Motherboard</Link></li>
                                <li><Link href="/products?category=graphics-card" className="hover:text-white">Graphics Card</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Informasi</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Kontak</Link></li>
                                <li><Link href="/terms" className="hover:text-white">Syarat & Ketentuan</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Email: info@chipsetcomputer.com</li>
                                <li>Telepon: (021) 1234-5678</li>
                                <li>WhatsApp: 0812-3456-7890</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Chipset Computer. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <BackToTop />
        </div>
    );
}
