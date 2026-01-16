'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ProductSorter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'latest';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        // Update sort parameter
        params.set('sort', newSort);

        // Keep existing params (category, search)
        // URLSearchParams constructor already includes them if specific logic isn't needed to clear them

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div>
            <h4 className="font-semibold mb-2">Urutkan</h4>
            <select
                value={currentSort}
                onChange={handleSortChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="latest">Terbaru</option>
                <option value="price_low">Harga Terendah</option>
                <option value="price_high">Harga Tertinggi</option>
                <option value="name">Nama A-Z</option>
            </select>
        </div>
    );
}
