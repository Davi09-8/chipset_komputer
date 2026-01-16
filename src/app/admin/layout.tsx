import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Package, Layers, ShoppingCart, Users, Star, Home, LogOut, TicketPercent } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-sm text-gray-400 mt-1">{session.user.name}</p>
                </div>
                <nav className="mt-6">
                    <Link href="/admin" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Package className="w-5 h-5" />
                        <span>Produk</span>
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Layers className="w-5 h-5" />
                        <span>Kategori</span>
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Pesanan</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                        <span>Pengguna</span>
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Star className="w-5 h-5" />
                        <span>Reviews</span>
                    </Link>
                    <Link href="/admin/coupons" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <TicketPercent className="w-5 h-5" />
                        <span>Kupon</span>
                    </Link>
                    <div className="border-t border-gray-700 mt-6 pt-6">
                        <Link href="/" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            <Home className="w-5 h-5" />
                            <span>Ke Website</span>
                        </Link>
                        <form
                            action={async () => {
                                'use server';
                                await signOut();
                            }}
                        >
                            <button type="submit" className="flex w-full items-center gap-3 px-6 py-3 text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors">
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </form>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}
