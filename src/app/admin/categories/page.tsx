'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { useConfirmation } from '@/context/ConfirmationContext';
import { useToast } from '@/context/ToastContext';

interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    parent: {
        name: string;
    } | null;
    _count: {
        products: number;
    };
}

export default function CategoriesListPage() {
    const { confirm } = useConfirmation();
    const { showToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/categories?includeInactive=true');
            const data = await res.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, name: string) {
        const isConfirmed = await confirm(`Yakin ingin menghapus kategori "${name}"?`);
        if (!isConfirmed) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Kategori berhasil dihapus', 'success');
                fetchCategories();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal menghapus kategori', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kelola Kategori</h1>
                <Link
                    href="/admin/categories/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    + Tambah Kategori
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Tidak ada kategori</td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {category.parent ? category.parent.name : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {category._count.products}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {category.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-3 flex items-center">
                                        <Link
                                            href={`/admin/categories/${category.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                                            title="Edit Kategori"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                                            title="Hapus Kategori"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
