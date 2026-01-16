'use client';

import { useEffect, useState } from 'react';
import { useConfirmation } from '@/context/ConfirmationContext';
import { useToast } from '@/context/ToastContext';

interface Review {
    id: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    product: {
        name: string;
        slug: string;
    };
}

export default function ReviewsListPage() {
    const { confirm } = useConfirmation();
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('pending'); // pending, approved, all

    useEffect(() => {
        fetchReviews();
    }, [page, filter]);

    async function fetchReviews() {
        setLoading(true);
        try {
            const isApproved = filter === 'approved' ? 'true' : filter === 'pending' ? 'false' : '';
            const res = await fetch(`/api/admin/reviews?page=${page}&limit=10&isApproved=${isApproved}`);
            const data = await res.json();
            setReviews(data.reviews);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(id: string) {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: true }),
            });

            if (res.ok) {
                showToast('Review berhasil diapprove', 'success');
                fetchReviews();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal approve review', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        }
    }

    async function handleReject(id: string) {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: false }),
            });

            if (res.ok) {
                showToast('Review berhasil direject', 'success');
                fetchReviews();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal reject review', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        }
    }

    async function handleDelete(id: string) {
        const isConfirmed = await confirm('Yakin ingin menghapus review ini?');
        if (!isConfirmed) return;

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Review berhasil dihapus', 'success');
                fetchReviews();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal menghapus review', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kelola Reviews</h1>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={() => {
                        setFilter('pending');
                        setPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => {
                        setFilter('approved');
                        setPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Approved
                </button>
                <button
                    onClick={() => {
                        setFilter('all');
                        setPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Semua
                </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">Loading...</div>
                ) : reviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        Tidak ada review
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg">{review.product.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {review.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <span className="text-yellow-500 text-lg">{'⭐'.repeat(review.rating)}</span>
                                        <span className="text-gray-300 text-lg ml-1">{'⭐'.repeat(5 - review.rating)}</span>
                                    </div>
                                    <p className="text-gray-700 mb-3">{review.comment}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>👤 {review.user.name}</span>
                                        <span>📧 {review.user.email}</span>
                                        <span>📅 {new Date(review.createdAt).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                {!review.isApproved && (
                                    <button
                                        onClick={() => handleApprove(review.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        ✓ Approve
                                    </button>
                                )}
                                {review.isApproved && (
                                    <button
                                        onClick={() => handleReject(review.id)}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                    >
                                        ✗ Reject
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    🗑 Hapus
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
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
