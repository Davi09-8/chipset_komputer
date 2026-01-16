import Link from 'next/link';
import PageBackButton from '@/components/PageBackButton';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">


            {/* Hero Section */}
            <div className="gradient-bg text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
                        <p className="text-xl">Toko Komputer dan Chipset Terpercaya</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <PageBackButton />
                {/* Company Story */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Sejarah Kami</h2>
                    <p className="text-gray-700 mb-4">
                        Chipset Computer & CCTV berlokasi di Jl. Raya Padang - Solok Simpang By Pass, Kabupaten Solok, Sumatera Barat.
                        Kami adalah toko komputer dan CCTV terpercaya yang melayani kebutuhan teknologi Anda dengan produk berkualitas tinggi.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Dengan rating 4.6 dari 23 ulasan pelanggan, kami berkomitmen untuk terus memberikan pelayanan terbaik
                        dan produk original dengan harga yang kompetitif. Kepercayaan pelanggan adalah aset terbesar kami.
                    </p>
                    <p className="text-gray-700">
                        Kami buka setiap hari mulai pukul 08.30 untuk melayani Anda. Kunjungi toko kami atau hubungi kami
                        di 0852-7164-4447 untuk konsultasi produk yang sesuai dengan kebutuhan Anda.
                    </p>
                </div>

                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
                        <p className="text-gray-700">
                            Menjadi toko komputer dan chipset terdepan di Indonesia yang dikenal dengan produk berkualitas,
                            harga kompetitif, dan pelayanan terbaik.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>✓ Menyediakan produk original dengan garansi resmi</li>
                            <li>✓ Memberikan harga terbaik dan kompetitif</li>
                            <li>✓ Pelayanan cepat dan responsif</li>
                            <li>✓ Pengiriman aman dan tepat waktu</li>
                        </ul>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Mengapa Memilih Kami?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <div className="text-3xl mr-4">✅</div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Produk Original</h4>
                                <p className="text-gray-700">Semua produk dijamin 100% original dengan garansi resmi dari distributor.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="text-3xl mr-4">💰</div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Harga Kompetitif</h4>
                                <p className="text-gray-700">Kami menawarkan harga terbaik dengan kualitas yang tidak diragukan.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="text-3xl mr-4">🚚</div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Pengiriman Cepat</h4>
                                <p className="text-gray-700">Pengiriman ke seluruh Indonesia dengan packaging aman dan rapi.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="text-3xl mr-4">💬</div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Customer Service</h4>
                                <p className="text-gray-700">Tim customer service kami siap membantu Anda 24/7.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Tim Kami</h2>
                    <p className="text-gray-700 mb-6">
                        Kami memiliki tim yang berpengalaman dan profesional di bidang teknologi komputer.
                        Setiap anggota tim kami siap membantu Anda menemukan produk yang sesuai dengan kebutuhan.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                                👨‍💼
                            </div>
                            <h4 className="font-bold text-gray-900">Sales Team</h4>
                            <p className="text-gray-600 text-sm">Membantu Anda memilih produk</p>
                        </div>
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                                🛠️
                            </div>
                            <h4 className="font-bold text-gray-900">Technical Support</h4>
                            <p className="text-gray-600 text-sm">Dukungan teknis profesional</p>
                        </div>
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                                📦
                            </div>
                            <h4 className="font-bold text-gray-900">Logistics</h4>
                            <p className="text-gray-600 text-sm">Pengiriman cepat dan aman</p>
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
                            <h3 className="text-lg font-bold mb-4">Link Cepat</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/" className="hover:text-white">Beranda</Link></li>
                                <li><Link href="/products" className="hover:text-white">Produk</Link></li>
                                <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Kontak</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Informasi</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/terms" className="hover:text-white">Syarat & Ketentuan</Link></li>
                                <li><Link href="/privacy" className="hover:text-white">Kebijakan Privasi</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Email: info@chipsetcomputer.com</li>
                                <li>Telepon: 0852-7164-4447</li>
                                <li>WhatsApp: 0852-7164-4447</li>
                                <li>Solok, Sumatera Barat</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Chipset Computer. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
