'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

interface Category {
    id: string;
    name: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        categoryId: '',
        name: '',
        slug: '',
        description: '',
        price: '',
        discountPrice: '',
        discountPercentage: '',
        stock: '',
        sku: '',
        isActive: true,
    });
    const [images, setImages] = useState<string[]>([]);
    const [imageInput, setImageInput] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchProduct();
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

    async function fetchProduct() {
        try {
            const res = await fetch(`/api/admin/products/${params.id}`);
            const data = await res.json();

            if (res.ok) {
                const product = data.product;
                setFormData({
                    categoryId: product.categoryId,
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    price: product.price.toString(),
                    discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
                    discountPercentage: product.discountPercentage ? product.discountPercentage.toString() : '',
                    stock: product.stock.toString(),
                    sku: product.sku,
                    isActive: product.isActive,
                });
                // Parse and set images
                try {
                    const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                    setImages(Array.isArray(parsedImages) ? parsedImages : []);
                } catch {
                    setImages([]);
                }
            } else {
                showToast('Produk tidak ditemukan', 'error');
                router.push('/admin/products');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));

        // Auto-calculate discount
        if (name === 'price' || name === 'discountPercentage') {
            const price = name === 'price' ? parseFloat(value) : parseFloat(formData.price);
            const percent = name === 'discountPercentage' ? parseFloat(value) : parseFloat(formData.discountPercentage);

            if (price && percent) {
                const discount = price - (price * (percent / 100));
                setFormData(prev => ({ ...prev, discountPrice: Math.round(discount).toString() }));
            }
        }
    }

    function addImage() {
        if (imageInput.trim()) {
            setImages([...images, imageInput.trim()]);
            setImageInput('');
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setImages([...images, data.url]);
            } else {
                showToast('Gagal mengupload gambar', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast('Terjadi kesalahan saat upload', 'error');
        } finally {
            setUploading(false);
            // Reset input value to allow selecting same file again
            e.target.value = '';
        }
    }

    function removeImage(index: number) {
        setImages(images.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                    discountPercentage: formData.discountPercentage ? parseInt(formData.discountPercentage) : null,
                    stock: parseInt(formData.stock),
                    images: images,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Produk berhasil diupdate!', 'success');
                router.push('/admin/products');
            } else {
                showToast(data.error || 'Gagal mengupdate produk', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="mb-6">
                <Link href="/admin/products" className="text-indigo-600 hover:text-indigo-800">
                    ← Kembali ke Daftar Produk
                </Link>
                <h1 className="text-2xl font-bold mt-2">Edit Produk</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                    </label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Produk *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Produk
                    </label>
                    <div className="space-y-4">
                        {/* Upload Button */}
                        <div className="flex items-center gap-4">
                            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-xs text-gray-500 text-center px-1">{uploading ? 'Uploading...' : 'Upload dari Device'}</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>

                            {/* Manual URL Input (Optional Backup) */}
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-2">Atau masukkan URL eksternal:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImage}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        + URL
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Preview Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {images.map((img, index) => (
                                    <div key={index} className="relative group bg-gray-100 rounded-lg overflow-hidden border aspect-video">
                                        <img
                                            src={img}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                                title="Hapus Gambar"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {images.length === 0 && (
                            <p className="text-sm text-gray-500 italic">Belum ada gambar yang dipilih.</p>
                        )}
                    </div>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Harga (Rp) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="1000"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Diskon (%)
                        </label>
                        <input
                            type="number"
                            name="discountPercentage"
                            value={formData.discountPercentage}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Harga Diskon (Opsional)
                        </label>
                        <input
                            type="number"
                            name="discountPrice"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            min="0"
                            step="1000"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Optional"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stok *
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* SKU */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU *
                    </label>
                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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
                        Produk Aktif
                    </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {saving ? 'Menyimpan...' : 'Update Produk'}
                    </button>
                    <Link
                        href="/admin/products"
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
