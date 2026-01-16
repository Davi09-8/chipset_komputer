import Link from 'next/link';
import PageBackButton from '@/components/PageBackButton';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50">


            {/* Hero Section */}
            <div className="gradient-bg text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Syarat & Ketentuan</h1>
                        <p className="text-xl">Terakhir diperbarui: Desember 2024</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <PageBackButton />
                <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
                    {/* Introduction */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Pendahuluan</h2>
                        <p className="text-gray-700">
                            Selamat datang di Chipset Computer. Dengan mengakses dan menggunakan website ini,
                            Anda setuju untuk terikat dengan syarat dan ketentuan berikut. Jika Anda tidak setuju
                            dengan syarat dan ketentuan ini, mohon untuk tidak menggunakan website kami.
                        </p>
                    </div>

                    {/* Account */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Akun Pengguna</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda</li>
                            <li>Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda</li>
                            <li>Anda harus segera memberitahu kami jika terjadi penggunaan tidak sah atas akun Anda</li>
                            <li>Kami berhak menonaktifkan akun yang melanggar ketentuan</li>
                        </ul>
                    </div>

                    {/* Orders */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Pemesanan dan Pembayaran</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Semua harga yang tercantum dalam Rupiah (IDR) dan sudah termasuk PPN</li>
                            <li>Kami berhak menolak atau membatalkan pesanan karena alasan tertentu</li>
                            <li>Pembayaran harus dilakukan sesuai metode yang tersedia</li>
                            <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                            <li>Kami tidak bertanggung jawab atas keterlambatan pembayaran dari pihak ketiga</li>
                        </ul>
                    </div>

                    {/* Shipping */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pengiriman</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Pengiriman dilakukan ke seluruh Indonesia</li>
                            <li>Estimasi waktu pengiriman tergantung lokasi dan jasa pengiriman</li>
                            <li>Risiko kerusakan atau kehilangan selama pengiriman ditanggung oleh jasa pengiriman</li>
                            <li>Pastikan alamat pengiriman yang Anda berikan benar dan lengkap</li>
                            <li>Biaya pengiriman ditanggung oleh pembeli kecuali ada promo gratis ongkir</li>
                        </ul>
                    </div>

                    {/* Returns */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pengembalian dan Penukaran</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Produk dapat dikembalikan dalam 7 hari jika ada cacat produksi</li>
                            <li>Produk harus dalam kondisi asli dengan kemasan lengkap</li>
                            <li>Biaya pengiriman pengembalian ditanggung oleh pembeli (kecuali kesalahan kami)</li>
                            <li>Pengembalian dana akan diproses dalam 7-14 hari kerja</li>
                            <li>Produk yang sudah dibuka atau digunakan tidak dapat dikembalikan</li>
                        </ul>
                    </div>

                    {/* Warranty */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Garansi</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Semua produk memiliki garansi resmi dari distributor</li>
                            <li>Masa garansi bervariasi tergantung produk (tercantum di deskripsi)</li>
                            <li>Garansi tidak berlaku untuk kerusakan akibat kesalahan pengguna</li>
                            <li>Klaim garansi harus disertai dengan bukti pembelian</li>
                            <li>Proses klaim garansi mengikuti ketentuan dari distributor</li>
                        </ul>
                    </div>

                    {/* Privacy */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privasi</h2>
                        <p className="text-gray-700">
                            Kami menghormati privasi Anda. Informasi pribadi yang Anda berikan akan dijaga
                            kerahasiaannya dan hanya digunakan untuk keperluan transaksi. Kami tidak akan
                            membagikan informasi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali
                            diwajibkan oleh hukum.
                        </p>
                    </div>

                    {/* Intellectual Property */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Hak Kekayaan Intelektual</h2>
                        <p className="text-gray-700">
                            Semua konten di website ini, termasuk teks, gambar, logo, dan desain adalah
                            milik Chipset Computer dan dilindungi oleh hukum hak cipta. Anda tidak diperbolehkan
                            untuk menyalin, memodifikasi, atau mendistribusikan konten tanpa izin tertulis dari kami.
                        </p>
                    </div>

                    {/* Limitation */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Batasan Tanggung Jawab</h2>
                        <p className="text-gray-700 mb-2">
                            Chipset Computer tidak bertanggung jawab atas:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Kerugian tidak langsung, insidental, atau konsekuensial</li>
                            <li>Kehilangan data atau kerusakan sistem</li>
                            <li>Gangguan layanan atau akses website</li>
                            <li>Kesalahan informasi produk dari pihak ketiga</li>
                        </ul>
                    </div>

                    {/* Changes */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Perubahan Syarat & Ketentuan</h2>
                        <p className="text-gray-700">
                            Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan
                            sebelumnya. Perubahan akan berlaku segera setelah dipublikasikan di website.
                            Penggunaan website setelah perubahan berarti Anda menyetujui syarat dan ketentuan yang baru.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Hubungi Kami</h2>
                        <p className="text-gray-700 mb-2">
                            Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami:
                        </p>
                        <ul className="space-y-1 text-gray-700">
                            <li>Email: info@chipsetcomputer.com</li>
                            <li>Telepon: 0852-7164-4447</li>
                            <li>WhatsApp: 0852-7164-4447</li>
                            <li>Alamat: Jl. Raya Padang - Solok, Kabupaten Solok, Sumatera Barat</li>
                        </ul>
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
