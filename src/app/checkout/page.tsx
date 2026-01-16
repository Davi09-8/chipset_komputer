'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { Truck, Store, MapPin } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
    const [regencies, setRegencies] = useState<{ id: string; name: string }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedRegency, setSelectedRegency] = useState('');
    const [shippingService, setShippingService] = useState('JNE_REG');

    // Payment States
    const [paymentCategory, setPaymentCategory] = useState('TRANSFER');
    const [selectedBank, setSelectedBank] = useState('BCA');
    const [selectedEWallet, setSelectedEWallet] = useState('GOPAY');

    const [isPickup, setIsPickup] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    // Mock shipping cost calculation
    const getShippingCost = (service: string) => {
        switch (service) {
            case 'JNE_REG': return 20000;
            case 'JNE_YES': return 35000;
            case 'JNT': return 18000;
            default: return 0;
        }
    };

    const shippingCost = isPickup ? 0 : getShippingCost(shippingService);

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            showToast('Mohon masukkan kode diskon', 'error');
            return;
        }

        try {
            // NOTE: In a real app, cartTotal should be calculated from actual cart items.
            // Using the hardcoded value found in the render method for consistency with current implementation.
            const cartTotal = 2025000;

            const res = await fetch('/api/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: discountCode,
                    cartTotal: cartTotal
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setAppliedDiscount(data.discountAmount);
                showToast(`Kode diskon berhasil digunakan! Hemat Rp ${data.discountAmount.toLocaleString('id-ID')}`, 'success');
            } else {
                setAppliedDiscount(0);
                showToast(data.error || 'Kode diskon tidak valid', 'error');
            }
        } catch (error) {
            console.error('Error applying discount:', error);
            setAppliedDiscount(0);
            showToast('Terjadi kesalahan saat memproses diskon', 'error');
        }
    };

    useEffect(() => {
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error('Error fetching provinces:', err));
    }, []);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedRegency('');

        if (provinceId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`)
                .then(res => res.json())
                .then(data => setRegencies(data))
                .catch(err => console.error('Error fetching regencies:', err));
        } else {
            setRegencies([]);
        }
    };

    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    // Function to handle Reverse Geocoding (Reusable)
    const handleReverseGeocode = async (lat: number, lng: number) => {
        const btn = document.querySelector('button[data-id="btn-location"]') as HTMLButtonElement | null;
        if (btn) btn.innerText = 'Mendeteksi...';

        try {
            const link = `https://www.google.com/maps?q=${lat},${lng}`;
            const input = document.getElementById('mapsUrl') as HTMLInputElement;
            if (input) input.value = link;

            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();

            if (data.address) {
                const state = data.address.state?.toUpperCase();
                const city = (data.address.city || data.address.town || data.address.county || '').toUpperCase();

                const foundProvince = provinces.find(p => state?.includes(p.name) || p.name.includes(state || ''));
                if (foundProvince) {
                    setSelectedProvince(foundProvince.id);

                    // Force fetch regencies right now
                    const resRegencies = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${foundProvince.id}.json`);
                    const regenciesData = await resRegencies.json();
                    setRegencies(regenciesData);

                    // Improve city matching logic
                    const cleanCity = city
                        .replace(/KOTA /i, '')
                        .replace(/KABUPATEN /i, '')
                        .replace(/ADM. /i, '')
                        .trim();

                    const foundRegency = regenciesData.find((r: any) =>
                        r.name.toUpperCase().includes(cleanCity) ||
                        cleanCity.includes(r.name.toUpperCase())
                    );

                    if (foundRegency) {
                        setSelectedRegency(foundRegency.id);
                        showToast(`Lokasi: ${foundProvince.name}, ${foundRegency.name}`, 'success');
                    } else {
                        // Fallback: Try fuzzy match or just warn
                        console.log('Regency not found for:', city);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            if (btn) btn.innerText = 'Ambil Lokasi';
        }
    };

    // Initialize Map and Leaflet
    useEffect(() => {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!document.querySelector('script[src*="leaflet"]')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // Update Map when coordinates change
    useEffect(() => {
        // Poll for Leaflet availability
        const checkLeaflet = setInterval(() => {
            if ((window as any).L && coordinates) {
                clearInterval(checkLeaflet);

                const L = (window as any).L;

                if (!mapRef.current) {
                    // Fix styling issue for map container if needed
                    const mapContainer = document.getElementById('map');
                    if (mapContainer) {
                        mapRef.current = L.map('map').setView([coordinates.lat, coordinates.lng], 16);

                        // Use Google Maps Tiles (Roadmap)
                        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                            attribution: '© Google Maps'
                        }).addTo(mapRef.current);

                        // Add click event to map to move marker
                        mapRef.current.on('click', (e: any) => {
                            const { lat, lng } = e.latlng;
                            if (markerRef.current) {
                                markerRef.current.setLatLng([lat, lng]);
                                setCoordinates({ lat, lng });
                                handleReverseGeocode(lat, lng);
                            }
                        });
                    }
                } else {
                    mapRef.current.setView([coordinates.lat, coordinates.lng]);
                    // Fix resize issues
                    mapRef.current.invalidateSize();
                }

                if (markerRef.current) {
                    markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
                } else {
                    // Use Red Icon to match UI text
                    const icon = L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    markerRef.current = L.marker([coordinates.lat, coordinates.lng], {
                        draggable: true,
                        icon: icon
                    }).addTo(mapRef.current);

                    markerRef.current.on('dragend', async (e: any) => {
                        const { lat, lng } = e.target.getLatLng();
                        setCoordinates({ lat, lng });
                        await handleReverseGeocode(lat, lng);
                    });
                }
            }
        }, 500); // Check every 500ms

        return () => clearInterval(checkLeaflet);
    }, [coordinates]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Get selected names
        const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
        const regencyName = regencies.find(r => r.id === selectedRegency)?.name || '';

        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: isPickup ? 'AMBIL DI TOKO' : formData.get('address'),
            city: isPickup ? 'KAB. SOLOK' : `${regencyName}, ${provinceName}`,
            postalCode: isPickup ? '27315' : formData.get('postalCode'),
            paymentMethod: formData.get('paymentMethod'),
            notes: `${formData.get('notes') || ''}\n${isPickup ? '[AMBIL SENDIRI DI TOKO]' : `\nGoogle Maps: ${formData.get('mapsUrl') || '-'}`}`,
            shippingService: isPickup ? 'PICKUP' : shippingService,
            discountCode: appliedDiscount > 0 ? 'CHIPSET' : null,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Pesanan berhasil dibuat!', 'success');
                router.push(`/orders/${result.order.id}`);
            } else {
                showToast(result.error || 'Gagal membuat pesanan', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Terjadi kesalahan sistem', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <Link href="/cart" className="hover:text-primary-600">Keranjang</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-900">Checkout</span>
                </div>


                <h1 className="text-3xl font-bold text-gray-900 mb-8">Informasi Pengiriman</h1>

                {/* Delivery Method Toggle */}
                <div className="flex p-1 bg-gray-200 rounded-xl mb-8">
                    <button
                        type="button"
                        onClick={() => setIsPickup(false)}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${!isPickup ? 'bg-white text-emerald-600 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        <Truck className="w-5 h-5" />
                        Dikirim Kurir
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPickup(true)}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isPickup ? 'bg-white text-emerald-600 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        <Store className="w-5 h-5" />
                        Ambil di Toko
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (Address and Shipping sections remain unchanged) ... */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                            Informasi Penerima
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap {isPickup ? 'Pengambil' : 'Penerima'}</label>
                                <input type="text" name="name" required className="input-field" placeholder="Contoh: Budi Santoso" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon / WhatsApp</label>
                                <input type="tel" name="phone" required className="input-field" placeholder="08xxxxxxxxxx" />
                            </div>

                            {/* Only show address fields if NOT pickup */}
                            {!isPickup && (
                                <div className="contents animate-fade-in">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap (Jalan, No Rumah, RT/RW)</label>
                                        <textarea name="address" rows={2} required={!isPickup} className="input-field" placeholder="Nama Jalan, No Rumah, RT/RW" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Pengiriman (Pinpoint)</label>

                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="mapsUrl"
                                                        id="mapsUrl"
                                                        readOnly
                                                        className="input-field pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                        placeholder="Klik tombol 'Ambil Lokasi' disamping"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    data-id="btn-location"
                                                    onClick={() => {
                                                        if (navigator.geolocation) {
                                                            const btn = document.querySelector('button[data-id="btn-location"]');
                                                            if (btn) btn.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>Mencari...';

                                                            navigator.geolocation.getCurrentPosition(
                                                                async (position) => {
                                                                    const { latitude, longitude } = position.coords;
                                                                    // Update state which triggers map effect
                                                                    setCoordinates({ lat: latitude, lng: longitude });
                                                                    // Trigger address detection
                                                                    await handleReverseGeocode(latitude, longitude);
                                                                    if (btn) btn.innerHTML = 'Ambil Lokasi';
                                                                },
                                                                (error) => {
                                                                    console.error(error);
                                                                    showToast('Gagal mengambil lokasi. Pastikan GPS aktif.', 'error');
                                                                    if (btn) btn.innerHTML = 'Ambil Lokasi';
                                                                }
                                                            );
                                                        } else {
                                                            showToast('Browser tidak mendukung Geolocation', 'error');
                                                        }
                                                    }}
                                                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition font-bold text-sm flex items-center shadow-lg shadow-emerald-500/30"
                                                >
                                                    Ambil Lokasi
                                                </button>
                                            </div>

                                            {/* Map Container */}
                                            <div className={`rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md animate-fade-in relative ${!coordinates ? 'hidden' : 'block'}`}>
                                                <div className="bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 flex justify-between items-center">
                                                    <span>✓ Klik Peta / Geser Pin Merah Untuk Ubah Lokasi</span>
                                                    <span className="text-emerald-600/70">{coordinates?.lat.toFixed(6)}, {coordinates?.lng.toFixed(6)}</span>
                                                </div>
                                                <div id="map" className="w-full h-[300px] z-0"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                                        <select
                                            className="input-field"
                                            value={selectedProvince}
                                            onChange={handleProvinceChange}
                                            required={!isPickup}
                                        >
                                            <option value="">Pilih Provinsi</option>
                                            {provinces.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kota / Kabupaten</label>
                                        <select
                                            className="input-field"
                                            name="city_select"
                                            value={selectedRegency}
                                            onChange={(e) => setSelectedRegency(e.target.value)}
                                            required={!isPickup}
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">Pilih Kota/Kabupaten</option>
                                            {regencies.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                                        <input type="text" name="postalCode" required={!isPickup} className="input-field" />
                                    </div>
                                </div>
                            )}

                            {/* Store Location Info for Pickup */}
                            {isPickup && (
                                <div className="md:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-6 animate-fade-in">
                                    <h3 className="font-bold text-emerald-800 mb-2 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Lokasi Toko Chipset Computer
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        Jl. Raya Padang - Solok Simpang By Pass No.KM 2, Selayo, Kec. Kubung, Kabupaten Solok, Sumatera Barat 27315
                                    </p>
                                    <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15957.519962325374!2d100.64332835!3d-0.8072421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2b33bedf388915%3A0x673c6838a3d3c8c6!2sChipset%20Computer%20%26%20CCTV!5e0!3m2!1sid!2sid!4v1703000000000!5m2!1sid!2sid"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                    <div className="mt-4 flex gap-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Buka: 08:00 - 21:00 WIB
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isPickup && (
                        <div className="card p-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                Layanan Pengiriman
                            </h2>
                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${shippingService === 'JNE_REG' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center">
                                        <input type="radio" name="shippingService" value="JNE_REG" checked={shippingService === 'JNE_REG'} onChange={(e) => setShippingService(e.target.value)} className="text-primary-600 focus:ring-primary-500 w-4 h-4 mr-3" />
                                        <div>
                                            <div className="font-semibold text-gray-900">JNE Reguler</div>
                                            <div className="text-sm text-gray-500">Estimasi 2-3 Hari</div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">Rp 20.000</span>
                                </label>
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${shippingService === 'JNE_YES' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center">
                                        <input type="radio" name="shippingService" value="JNE_YES" checked={shippingService === 'JNE_YES'} onChange={(e) => setShippingService(e.target.value)} className="text-primary-600 focus:ring-primary-500 w-4 h-4 mr-3" />
                                        <div>
                                            <div className="font-semibold text-gray-900">JNE YES (Yakin Esok Sampai)</div>
                                            <div className="text-sm text-gray-500">Estimasi 1 Hari</div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">Rp 35.000</span>
                                </label>
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${shippingService === 'JNT' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center">
                                        <input type="radio" name="shippingService" value="JNT" checked={shippingService === 'JNT'} onChange={(e) => setShippingService(e.target.value)} className="text-primary-600 focus:ring-primary-500 w-4 h-4 mr-3" />
                                        <div>
                                            <div className="font-semibold text-gray-900">J&T Express</div>
                                            <div className="text-sm text-gray-500">Estimasi 2-3 Hari</div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">Rp 18.000</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                            Metode Pembayaran
                        </h2>

                        {/* Hidden Input for Form Submission */}
                        <input
                            type="hidden"
                            name="paymentMethod"
                            value={
                                paymentCategory === 'COD' ? 'COD' :
                                    paymentCategory === 'TRANSFER' ? `BANK_${selectedBank}` :
                                        paymentCategory === 'EWALLET' ? `EWALLET_${selectedEWallet}` :
                                            'TRANSFER'
                            }
                        />

                        <div className="space-y-4">
                            {/* Bank Transfer Option */}
                            <div className={`border rounded-xl overflow-hidden transition-all ${paymentCategory === 'TRANSFER' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <label className="flex items-center p-4 cursor-pointer w-full">
                                    <input
                                        type="radio"
                                        name="paymentCategory"
                                        value="TRANSFER"
                                        checked={paymentCategory === 'TRANSFER'}
                                        onChange={() => setPaymentCategory('TRANSFER')}
                                        className="text-primary-600 focus:ring-primary-500 w-4 h-4 mr-3"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Transfer Bank (Verifikasi Manual)</div>
                                        <div className="text-sm text-gray-500">Cek Otomatis</div>
                                    </div>
                                </label>

                                {/* Specific Banks Grid */}
                                {paymentCategory === 'TRANSFER' && (
                                    <div className="px-4 pb-4 pl-11 animate-fade-in">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { id: 'BCA', name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png' },
                                                { id: 'MANDIRI', name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png' },
                                                { id: 'BRI', name: 'BRI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/2560px-BANK_BRI_logo.svg.png' },
                                                { id: 'BNI', name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png' }
                                            ].map((bank) => (
                                                <div
                                                    key={bank.id}
                                                    onClick={() => setSelectedBank(bank.id)}
                                                    className={`cursor-pointer rounded-lg border p-2 flex flex-col items-center justify-center gap-2 h-20 transition-all ${selectedBank === bank.id ? 'bg-white border-primary-500 shadow-sm ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                                                >
                                                    <img src={bank.logo} alt={bank.name} className="h-8 w-auto object-contain" />
                                                    {selectedBank === bank.id && (
                                                        <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center absolute top-2 right-2">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* E-Wallet Option */}
                            <div className={`border rounded-xl overflow-hidden transition-all ${paymentCategory === 'EWALLET' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <label className="flex items-center p-4 cursor-pointer w-full">
                                    <input
                                        type="radio"
                                        name="paymentCategory"
                                        value="EWALLET"
                                        checked={paymentCategory === 'EWALLET'}
                                        onChange={() => setPaymentCategory('EWALLET')}
                                        className="text-primary-600 focus:ring-primary-500 w-4 h-4 mr-3"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">E-Wallet / QRIS</div>
                                        <div className="text-sm text-gray-500">Scan & Pay</div>
                                    </div>
                                </label>

                                {/* E-Wallets Grid */}
                                {paymentCategory === 'EWALLET' && (
                                    <div className="px-4 pb-4 pl-11 animate-fade-in">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { id: 'GOPAY', name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png' },
                                                { id: 'DANA', name: 'Dana', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png' },
                                                { id: 'OVO', name: 'OVO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png' },
                                                { id: 'SHOPEEPAY', name: 'ShopeePay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/2560px-Shopee.svg.png' }
                                            ].map((wallet) => (
                                                <div
                                                    key={wallet.id}
                                                    onClick={() => setSelectedEWallet(wallet.id)}
                                                    className={`cursor-pointer rounded-lg border p-2 flex flex-col items-center justify-center gap-2 h-20 transition-all ${selectedEWallet === wallet.id ? 'bg-white border-primary-500 shadow-sm ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                                                >
                                                    <img src={wallet.logo} alt={wallet.name} className="h-8 w-auto object-contain" />
                                                    {selectedEWallet === wallet.id && (
                                                        <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center absolute top-2 right-2">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* COD Option */}
                            <div className={`border rounded-xl overflow-hidden transition-all ${paymentCategory === 'COD' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <label className="flex items-center p-4 cursor-pointer w-full">
                                    <input
                                        type="radio"
                                        name="paymentCategory"
                                        value="COD"
                                        checked={paymentCategory === 'COD'}
                                        onChange={() => setPaymentCategory('COD')}
                                        className="text-primary-600 focus:ring-primary-500 w-4 h-4 mr-3"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">COD (Bayar di Tempat)</div>
                                        <div className="text-sm text-gray-500">Bayar tunai saat kurir sampai</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Diskon</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className="input-field flex-1 uppercase"
                                    placeholder="Masukan kode diskon"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyDiscount}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                                >
                                    Gunakan
                                </button>
                            </div>
                            {appliedDiscount > 0 && (
                                <p className="text-sm text-green-600 mt-2">
                                    Diskon {appliedDiscount.toLocaleString('id-ID')} berhasil diterapkan!
                                </p>
                            )}
                        </div>
                        {!isPickup && (
                            <div className="mt-4 animate-fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                                <textarea name="notes" rows={2} className="input-field" placeholder="Pesan khusus untuk penjual atau kurir" />
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-lg -mx-4 sm:mx-0 sm:rounded-xl">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Ongkos Kirim:</span>
                                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                            </div>
                            {appliedDiscount > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span>Diskon:</span>
                                    <span>-Rp {appliedDiscount.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t font-semibold text-lg">
                                <span>Total Pembayaran:</span>
                                <span>Rp {((shippingCost - appliedDiscount) > 0 ? (shippingCost - appliedDiscount) + 2025000 : 2025000).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-4 text-lg shadow-xl hover:shadow-primary-500/30"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    Memproses Pesanan...
                                </span>
                            ) : (
                                'Buat Pesanan Sekarang'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
