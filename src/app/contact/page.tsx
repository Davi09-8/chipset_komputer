'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // In real app, send to API
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        }, 3000);
    }

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Hero Section */}
            <div className="gradient-bg text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
                        <p className="text-xl">Kami siap membantu Anda</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <BackButton fallbackUrl="/" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="text-3xl mr-4">📍</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Alamat</h3>
                                    <p className="text-gray-700">
                                        Jl. Raya Padang - Solok Simpang By Pass No.KM 2<br />
                                        Selayo, Kec. Kubung<br />
                                        Kabupaten Solok, Sumatera Barat 27315
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="text-3xl mr-4">📧</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                                    <p className="text-gray-700">info@chipsetcomputer.com</p>
                                    <p className="text-gray-700">support@chipsetcomputer.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="text-3xl mr-4">📞</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Telepon</h3>
                                    <p className="text-gray-700">0852-7164-4447</p>
                                    <p className="text-gray-700">0852-7164-4447 (WhatsApp)</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="text-3xl mr-4">🕐</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Jam Operasional</h3>
                                    <p className="text-gray-700">Buka pukul 08.30</p>
                                    <p className="text-gray-700">Senin - Minggu</p>
                                </div>
                            </div>
                        </div>



                        {/* Social Media */}
                        <div className="mt-8">
                            <h3 className="font-bold text-gray-900 mb-4">Ikuti Kami</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700">
                                    📘
                                </a>
                                <a href="#" className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700">
                                    📷
                                </a>
                                <a href="#" className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700">
                                    🐦
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

                        {submitted && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                                Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="0812-3456-7890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subjek *
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Pilih Subjek</option>
                                    <option value="product">Pertanyaan Produk</option>
                                    <option value="order">Status Pesanan</option>
                                    <option value="complaint">Keluhan</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pesan *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Tulis pesan Anda di sini..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                            >
                                Kirim Pesan
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Full Width Map Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Lokasi Toko</h2>
                <div className="rounded-xl overflow-hidden shadow-lg h-96">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1893100641295!2d100.64129511475615!3d-0.8091893994197158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2b3e2b33bed1c6%3A0x7a1f6c61e4b83m5!2sChipset%20Computer%20%26%20CCTV!5e0!3m2!1sid!2sid!4v1703000000000!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">Chipset Computer</h3>
                            <p className="text-gray-400">Toko komputer dan chipset terlengkap dengan harga terbaik.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Link Cepat</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/" className="hover:text-white">Beranda</Link></li>
                                <li><Link href="/products" className="hover:text-white">Produk</Link></li>
                                <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Kontak</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Informasi</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/terms" className="hover:text-white">Syarat & Ketentuan</Link></li>
                                <li><Link href="/privacy" className="hover:text-white">Kebijakan Privasi</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Email: info@chipsetcomputer.com</li>
                                <li>Telepon: 0852-7164-4447</li>
                                <li>WhatsApp: 0852-7164-4447</li>
                                <li>Solok, Sumatera Barat</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Chipset Computer. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
