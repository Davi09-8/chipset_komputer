'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

interface Category {
    id: string;
    name: string;
}

export default function NewCategoryPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        parentId: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    parentId: formData.parentId || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Kategori berhasil ditambahkan!', 'success');
                router.push('/admin/categories');
            } else {
                showToast(data.error || 'Gagal menambahkan kategori', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="mb-6">
                <Link href="/admin/categories" className="text-indigo-600 hover:text-indigo-800">
                    ← Kembali ke Daftar Kategori
                </Link>
                <h1 className="text-2xl font-bold mt-2">Tambah Kategori Baru</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Kategori *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Processors"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="processors"
                    />
                    <p className="text-sm text-gray-500 mt-1">URL-friendly version (otomatis dibuat dari nama)</p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Deskripsi kategori..."
                    />
                </div>

                {/* Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Kategori (URL)
                    </label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://example.com/category-image.jpg"
                    />
                    {formData.image && (
                        <div className="mt-3">
                            <img
                                src={formData.image}
                                alt="Category preview"
                                className="w-32 h-32 object-cover rounded-lg border"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Parent Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Kategori (Opsional)
                    </label>
                    <select
                        name="parentId"
                        value={formData.parentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Tidak ada (Root Category)</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                        Kategori Aktif
                    </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                    </button>
                    <Link
                        href="/admin/categories"
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
