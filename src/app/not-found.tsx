import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                    <div className="text-6xl mb-4">🔍</div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h2>
                <p className="text-xl text-white mb-8 max-w-md mx-auto">
                    Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>
                <div className="space-x-4">
                    <Link
                        href="/"
                        className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Kembali ke Beranda
                    </Link>
                    <Link
                        href="/products"
                        className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
                    >
                        Lihat Produk
                    </Link>
                </div>
                <div className="mt-12">
                    <p className="text-white text-sm">
                        Butuh bantuan? <Link href="/contact" className="underline hover:text-gray-200">Hubungi kami</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
