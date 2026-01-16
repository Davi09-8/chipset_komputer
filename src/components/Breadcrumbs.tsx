'use client';

import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-indigo-600">
                🏠 Home
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <span>/</span>
                    {item.href ? (
                        <Link href={item.href} className="hover:text-indigo-600">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
