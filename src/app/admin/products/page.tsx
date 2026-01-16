'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { useConfirmation } from '@/context/ConfirmationContext';
import { useToast } from '@/context/ToastContext';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    isActive: boolean;
    category: {
        name: string;
    };
    _count: {
        reviews: number;
        orderItems: number;
    };
}

export default function ProductsListPage() {
    const router = useRouter();
    const { confirm } = useConfirmation();
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products?page=${page}&limit=10&search=${search}`);
            const data = await res.json();
            setProducts(data.products);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, name: string) {
        const isConfirmed = await confirm(`Yakin ingin menghapus produk "${name}"?`);
        if (!isConfirmed) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Produk berhasil dihapus', 'success');
                fetchProducts();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal menghapus produk', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kelola Produk</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    + Tambah Produk
                </Link>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Tidak ada produk</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.category.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm ${product.stock <= 10 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit Produk"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus Produk"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
