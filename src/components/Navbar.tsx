import Link from 'next/link';
import { auth } from '@/lib/auth';
import { ShoppingCart } from 'lucide-react';
import UserMenu from './UserMenu';
import SearchInput from './SearchInput';

export default async function Navbar() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 backdrop-blur-md bg-white/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group mr-8">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary-500/30">
                            C
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-teal-500 hidden sm:block">
                            Chipset
                        </span>
                    </Link>

                    {/* Search Bar - Wide on Desktop */}
                    <div className="flex-1 max-w-2xl hidden md:block mx-4">
                        <SearchInput />
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <Link href="/" className="hover:text-primary-600 transition-colors">Beranda</Link>
                            <Link href="/products" className="hover:text-primary-600 transition-colors">Produk</Link>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md font-bold hover:bg-primary-200 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>

                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                        {!isAdmin && (
                            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition group">
                                <ShoppingCart className="w-6 h-6" />
                                {/* <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">2</span> */}
                            </Link>
                        )}

                        {session?.user ? (
                            <UserMenu user={session.user} />
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="px-4 py-2 text-sm font-bold text-primary-600 hover:bg-primary-50 rounded-lg transition border border-gray-200 hover:border-primary-200">
                                    Masuk
                                </Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition shadow-md shadow-primary-500/30 hover:shadow-lg hover:-translate-y-0.5 transform">
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
