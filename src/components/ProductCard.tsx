import Link from 'next/link';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        discountPrice?: number | null;
        stock: number;
        category: {
            name: string;
        };
        images: string; // JSON string
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    let imageUrl = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80"; // Fallback

    try {
        const parsedImages = JSON.parse(product.images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            imageUrl = parsedImages[0];
        }
    } catch (e) {
        // Keep fallback
    }

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
        >
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.stock > 0 ? (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        Tersedia
                    </span>
                ) : (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        Habis
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-2">
                    <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded">
                        {product.category.name}
                    </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm leading-snug flex-1">
                    {product.name}
                </h3>
                <div className="mt-auto pt-2">
                    {product.discountPrice && product.discountPrice < product.price ? (
                        <>
                            <div className="text-lg font-bold text-primary-600">
                                Rp {product.discountPrice.toLocaleString('id-ID')}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-gray-400 line-through">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                                <span className="text-xs text-red-500 font-bold bg-red-50 px-1 rounded">
                                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="text-lg font-bold text-primary-600">
                            Rp {product.price.toLocaleString('id-ID')}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
