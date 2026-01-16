'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { useToast } from '@/context/ToastContext';
import { User, Pencil, Lock, Package } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch('/api/profile');
            if (res.status === 401) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setUser(data.user);
            setFormData({
                name: data.user.name,
                email: data.user.email,
                image: data.user.image || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showToast('Profile updated successfully!', 'success');
                setEditing(false);
                fetchProfile();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to update profile', 'error');
            }
        } catch (error) {
            showToast('Error updating profile', 'error');
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            if (res.ok) {
                showToast('Password changed successfully!', 'success');
                setChangingPassword(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to change password', 'error');
            }
        } catch (error) {
            showToast('Error changing password', 'error');
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BackButton fallbackUrl="/" />
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-8 h-8 text-indigo-600 mr-3" />
                    Profil Saya
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center mb-6">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-indigo-100"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <h3 className="font-bold text-gray-900">{user?.name}</h3>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user?.role}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    setEditing(true);
                                    setChangingPassword(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${editing ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <Pencil className={`w-5 h-5 mr-3 ${editing ? 'text-indigo-600' : 'text-gray-400'}`} />
                                Edit Profil
                            </button>
                            <button
                                onClick={() => {
                                    setChangingPassword(true);
                                    setEditing(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${changingPassword ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <Lock className={`w-5 h-5 mr-3 ${changingPassword ? 'text-indigo-600' : 'text-gray-400'}`} />
                                Ubah Password
                            </button>
                            <Link
                                href="/orders"
                                className="block w-full text-left px-4 py-3 rounded-lg flex items-center hover:bg-gray-50 text-gray-700 transition-colors"
                            >
                                <Package className="w-5 h-5 mr-3 text-gray-400" />
                                Pesanan Saya
                            </Link>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2">
                        {!editing && !changingPassword && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Profil</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                        <p className="text-gray-900">{user?.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <p className="text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <p className="text-gray-900">{user?.role}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                                        <p className="text-gray-900">{new Date(user?.createdAt).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {editing && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Profil</h2>
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil (URL)</label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                        {formData.image && (
                                            <div className="mt-2">
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    className="w-16 h-16 rounded-full object-cover border"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {changingPassword && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Ubah Password</h2>
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                                        >
                                            Ubah Password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setChangingPassword(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
