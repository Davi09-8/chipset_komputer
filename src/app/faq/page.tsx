'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface FAQGroup {
    [category: string]: FAQ[];
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQGroup>({});
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        fetchFAQs();
    }, []);

    async function fetchFAQs() {
        try {
            const res = await fetch('/api/faq');
            const data = await res.json();
            setFaqs(data.faqs);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    }

    const categoryIcons: Record<string, string> = {
        'Pembayaran': '💳',
        'Pengiriman': '🚚',
        'Garansi': '✅',
        'Return': '↩️',
        'Umum': '❓',
    };

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Hero */}
            <div className="gradient-bg text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl">Temukan jawaban untuk pertanyaan Anda</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <BackButton fallbackUrl="/" />
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : Object.keys(faqs).length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-600">Belum ada FAQ tersedia</p>
                    </div>
                ) : (
                    Object.entries(faqs).map(([category, items]) => (
                        <div key={category} className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="text-3xl mr-3">{categoryIcons[category] || '❓'}</span>
                                {category}
                            </h2>
                            <div className="space-y-3">
                                {items.map((faq) => (
                                    <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <button
                                            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                                        >
                                            <span className="font-semibold text-gray-900">{faq.question}</span>
                                            <span className="text-2xl text-indigo-600">
                                                {openId === faq.id ? '−' : '+'}
                                            </span>
                                        </button>
                                        {openId === faq.id && (
                                            <div className="px-6 py-4 bg-gray-50 border-t">
                                                <p className="text-gray-700">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                {/* Contact CTA */}
                <div className="mt-12 bg-indigo-50 rounded-lg p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak menemukan jawaban?</h3>
                    <p className="text-gray-600 mb-4">Hubungi customer service kami untuk bantuan lebih lanjut</p>
                    <Link
                        href="/contact"
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                    >
                        Hubungi Kami
                    </Link>
                </div>
            </div>
        </div>
    );
}
