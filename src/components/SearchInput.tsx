'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('search') || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/products');
        }
    }

    return (
        <form onSubmit={handleSearch} className="relative group w-full">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari di Chipset Computer..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            <button type="submit" className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Search className="w-5 h-5" />
            </button>
        </form>
    );
}
