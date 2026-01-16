'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useConfirmation } from '@/context/ConfirmationContext';

interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string | null;
    createdAt: string;
    orders: Array<{
        id: string;
        orderNumber: string;
        totalAmount: number;
        status: string;
        createdAt: string;
    }>;
    reviews: Array<{
        id: string;
        rating: number;
        comment: string;
        isApproved: boolean;
        product: {
            name: string;
        };
        createdAt: string;
    }>;
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirmation();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const res = await fetch(`/api/admin/users/${params.id}`);
            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
            } else {
                showToast('User tidak ditemukan', 'error');
                router.push('/admin/users');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateRole(newRole: string) {
        const isConfirmed = await confirm(`Yakin ingin mengubah role user menjadi ${newRole}?`);
        if (!isConfirmed) return;

        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/users/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                showToast('Role berhasil diupdate', 'success');
                fetchUser();
            } else {
                const data = await res.json();
                showToast(data.error || 'Gagal update role', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!user) {
        return <div className="p-6">User tidak ditemukan</div>;
    }

    return (
        <div className="p-6 max-w-6xl">
            <div className="mb-6">
                <Link href="/admin/users" className="text-indigo-600 hover:text-indigo-800">
                    ← Kembali ke Daftar Users
                </Link>
                <h1 className="text-2xl font-bold mt-2">Detail User</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Orders */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Riwayat Pesanan ({user.orders.length})</h2>
                        {user.orders.length === 0 ? (
                            <p className="text-gray-500">Belum ada pesanan</p>
                        ) : (
                            <div className="space-y-3">
                                {user.orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium">{order.orderNumber}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                Rp {order.totalAmount.toLocaleString('id-ID')}
                                            </p>
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Reviews ({user.reviews.length})</h2>
                        {user.reviews.length === 0 ? (
                            <p className="text-gray-500">Belum ada review</p>
                        ) : (
                            <div className="space-y-3">
                                {user.reviews.slice(0, 5).map((review) => (
                                    <div key={review.id} className="p-3 bg-gray-50 rounded">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-medium">{review.product.name}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {review.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                                            <span className="text-gray-400 ml-1">{'⭐'.repeat(5 - review.rating)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{review.comment}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(review.createdAt).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* User Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Informasi User</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500">Nama</p>
                                <p className="font-semibold">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-semibold">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Bergabung</p>
                                <p className="font-semibold">
                                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Change Role */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Role Management</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Current Role</p>
                                <span className={`px-3 py-1 text-sm rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ubah Role
                                </label>
                                <select
                                    value={user.role}
                                    onChange={(e) => updateRole(e.target.value)}
                                    disabled={updating}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Statistik</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Orders</span>
                                <span className="font-semibold">{user.orders.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Reviews</span>
                                <span className="font-semibold">{user.reviews.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Spent</span>
                                <span className="font-semibold">
                                    Rp {user.orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
