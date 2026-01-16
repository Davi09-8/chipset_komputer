'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images: string;
    specifications: string;
    category: {
        name: string;
    };
}

export default function ComparePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get product IDs from localStorage
        const compareIds = JSON.parse(localStorage.getItem('compareProducts') || '[]');
        if (compareIds.length > 0) {
            fetchProducts(compareIds);
        } else {
            setLoading(false);
        }
    }, []);

    async function fetchProducts(ids: string[]) {
        try {
            const promises = ids.map(id =>
                fetch(`/api/products/${id}`).then(res => res.json())
            );
            const results = await Promise.all(promises);
            setProducts(results.filter(p => p.product).map(r => r.product));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    function removeProduct(id: string) {
        const compareIds = JSON.parse(localStorage.getItem('compareProducts') || '[]');
        const updated = compareIds.filter((pid: string) => pid !== id);
        localStorage.setItem('compareProducts', JSON.stringify(updated));
        setProducts(products.filter(p => p.id !== id));
    }

    function clearAll() {
        localStorage.removeItem('compareProducts');
        setProducts([]);
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BackButton fallbackUrl="/products" />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">📊 Bandingkan Produk</h1>
                    {products.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Hapus Semua
                        </button>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Produk untuk Dibandingkan</h3>
                        <p className="text-gray-600 mb-6">Tambahkan produk dari halaman produk untuk membandingkan</p>
                        <Link
                            href="/products"
                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                        >
                            Lihat Produk
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50">
                                        Fitur
                                    </th>
                                    {products.map(product => (
                                        <th key={product.id} className="px-6 py-4 text-center min-w-[250px]">
                                            <div className="relative">
                                                <button
                                                    onClick={() => removeProduct(product.id)}
                                                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                                                >
                                                    ✕
                                                </button>
                                                <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{product.category.name}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* Images */}
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">Gambar</td>
                                    {products.map(product => {
                                        const images = JSON.parse(product.images || '[]');
                                        return (
                                            <td key={product.id} className="px-6 py-4 text-center">
                                                <img
                                                    src={images[0] || 'https://via.placeholder.com/150'}
                                                    alt={product.name}
                                                    className="w-32 h-32 object-cover mx-auto rounded"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                                    }}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Price */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-gray-50">Harga</td>
                                    {products.map(product => (
                                        <td key={product.id} className="px-6 py-4 text-center">
                                            <span className="text-xl font-bold text-indigo-600">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Stock */}
                                <tr>
                                    <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white">Stok</td>
                                    {products.map(product => (
                                        <td key={product.id} className="px-6 py-4 text-center">
                                            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {product.stock > 0 ? `${product.stock} unit` : 'Habis'}
                                            </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Specifications */}
                                {products.length > 0 && (() => {
                                    const allSpecs = new Set<string>();
                                    products.forEach(p => {
                                        try {
                                            const specs = JSON.parse(p.specifications || '{}');
                                            Object.keys(specs).forEach(key => allSpecs.add(key));
                                        } catch (e) { }
                                    });

                                    return Array.from(allSpecs).map((specKey, idx) => (
                                        <tr key={specKey} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                                            <td className={`px-6 py-4 font-medium text-gray-900 sticky left-0 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                {specKey}
                                            </td>
                                            {products.map(product => {
                                                try {
                                                    const specs = JSON.parse(product.specifications || '{}');
                                                    return (
                                                        <td key={product.id} className="px-6 py-4 text-center text-gray-700">
                                                            {specs[specKey] || '-'}
                                                        </td>
                                                    );
                                                } catch (e) {
                                                    return <td key={product.id} className="px-6 py-4 text-center">-</td>;
                                                }
                                            })}
                                        </tr>
                                    ));
                                })()}

                                {/* Actions */}
                                <tr className="bg-gray-100">
                                    <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-gray-100">Aksi</td>
                                    {products.map(product => (
                                        <td key={product.id} className="px-6 py-4 text-center">
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
