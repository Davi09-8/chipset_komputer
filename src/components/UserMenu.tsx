'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, User, Package, LogOut } from 'lucide-react';


export default function UserMenu({ user }: { user: { name?: string | null; email?: string | null; image?: string | null; role?: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative ml-3" ref={menuRef}>
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 items-center gap-2 bg-white border border-gray-200 p-1 pr-3 shadow-sm hover:bg-gray-50 transition"
                    id="user-menu-button"
                >
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                        {user.image ? (
                            <img className="h-8 w-8 rounded-full object-cover" src={user.image} alt="" />
                        ) : (
                            <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>
                    <span className="hidden md:block font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in"
                    role="menu"
                >
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.role === 'ADMIN' && (
                            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Admin
                            </span>
                        )}
                    </div>

                    {user.role === 'ADMIN' && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition w-full"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard Admin
                        </Link>
                    )}

                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition w-full"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <User className="w-4 h-4" />
                        Profil Saya
                    </Link>
                    <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition w-full"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                    >
                        <Package className="w-4 h-4" />
                        Pesanan Saya
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/?loggedOut=true' }));
                            }}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                            role="menuitem"
                        >
                            <LogOut className="w-4 h-4" />
                            Keluar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
