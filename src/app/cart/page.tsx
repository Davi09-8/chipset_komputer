import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CartItemComponent from '@/components/cart/CartItem';

export default async function CartPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const cartItems = await prisma.cart.findMany({
        where: { userId: session.user.id },
        include: {
            product: {
                include: { category: true },
            },
        },
    });

    const total = cartItems.reduce((sum, item) => {
        const price = item.product.discountPrice ?? item.product.price;
        return sum + price * item.quantity;
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-700">Daftar Produk</h2>
                                    <span className="text-sm text-gray-500">{cartItems.length} Item</span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <CartItemComponent item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total Harga ({cartItems.length} barang)</span>
                                        <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total Diskon Barang</span>
                                        <span className="font-medium text-green-600">-Rp 0</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ongkos Kirim</span>
                                        <span className="text-green-600 font-medium">Gratis</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-lg text-gray-900">Total Belanja</span>
                                            <span className="font-bold text-2xl text-primary-600">Rp {total.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="block w-full btn btn-primary text-center py-4 rounded-xl text-lg hover:shadow-xl hover:shadow-primary-500/20"
                                >
                                    Lanjut ke Pembayaran
                                </Link>
                                <div className="text-center mt-4">
                                    <Link
                                        href="/products"
                                        className="text-primary-600 font-medium hover:underline text-sm"
                                    >
                                        Atau Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-8xl mb-6 animate-bounce">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Belanja Kosong</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Wah, keranjangmu masih kosong nih! Yuk isi dengan produk-produk impianmu sekarang.
                        </p>
                        <Link
                            href="/products"
                            className="btn btn-primary px-8 py-3 text-lg"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
