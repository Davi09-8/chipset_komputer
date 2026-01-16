# Panduan Login dan Akses Backend

## Cara Login

1. **Buka halaman login**: `http://localhost:3001/login`

2. **Gunakan akun demo**:
   - **Admin**: 
     - Email: `admin@example.com`
     - Password: `password`
   - **Customer**: 
     - Email: `customer@example.com`
     - Password: `password`

3. **Setelah login**:
   - Jika login sebagai **ADMIN** → otomatis redirect ke `/admin` (Admin Dashboard)
   - Jika login sebagai **CUSTOMER** → redirect ke `/` (Homepage)

---

## Admin Dashboard

Setelah login sebagai admin, Anda akan masuk ke **Admin Dashboard** dengan menu:

### Menu Navigasi
- **📊 Dashboard** - Statistik dan overview
  - Total pesanan
  - Total pendapatan
  - Total pelanggan
  - Pesanan pending
  - Pesanan terbaru
  - Produk stok rendah

- **📦 Produk** - Kelola produk
  - Lihat semua produk
  - Tambah produk baru
  - Edit produk
  - Hapus produk

- **📁 Kategori** - Kelola kategori
  - Lihat semua kategori
  - Tambah kategori
  - Edit kategori
  - Hapus kategori

- **🛒 Pesanan** - Kelola pesanan
  - Lihat semua pesanan
  - Update status pesanan
  - Update status pembayaran

- **👥 Users** - Kelola user
  - Lihat semua user
  - Ubah role user (ADMIN/CUSTOMER)

- **⭐ Reviews** - Kelola review
  - Lihat semua review
  - Approve/reject review
  - Hapus review

- **🏠 Ke Website** - Kembali ke homepage
- **🚪 Logout** - Keluar dari akun

---

## User/Customer Dashboard

Setelah login sebagai customer, Anda bisa:

1. **Browse Produk** - Lihat dan cari produk
2. **Filter & Sort** - Filter berdasarkan kategori, harga, dll
3. **Tambah ke Cart** - Masukkan produk ke keranjang
4. **Checkout** - Buat pesanan
5. **Lihat Pesanan** - Cek status pesanan Anda
6. **Beri Review** - Review produk yang sudah dibeli
7. **Update Profile** - Edit profil Anda

---

## API Endpoints

### Public (Tidak perlu login)
- `GET /api/products` - List produk
- `GET /api/products/[slug]` - Detail produk
- `GET /api/categories` - List kategori
- `GET /api/reviews?productSlug=xxx` - Review produk

### User (Perlu login)
- `GET /api/profile` - Profil user
- `PUT /api/profile` - Update profil
- `GET /api/orders` - List pesanan user
- `POST /api/orders` - Buat pesanan
- `POST /api/reviews` - Buat review
- `GET /api/cart` - Lihat cart
- `POST /api/cart` - Tambah ke cart

### Admin (Perlu login sebagai ADMIN)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/products` - List semua produk
- `POST /api/admin/products` - Buat produk
- `PUT /api/admin/products/[id]` - Update produk
- `DELETE /api/admin/products/[id]` - Hapus produk
- Dan semua endpoint admin lainnya...

---

## Troubleshooting

### Tidak bisa login
- Pastikan database sudah di-seed dengan akun demo
- Cek apakah email dan password benar
- Lihat console browser untuk error

### Tidak redirect ke admin setelah login
- Clear browser cache
- Logout dan login lagi
- Pastikan role user adalah "ADMIN" di database

### API error 401 (Unauthorized)
- Pastikan sudah login
- Session mungkin expired, login lagi

### API error 403 (Forbidden)
- Endpoint memerlukan role ADMIN
- Pastikan login dengan akun admin

---

## Database Seeding

Jika akun demo belum ada, jalankan:

```bash
npx prisma db seed
```

Atau buat manual di database dengan password yang sudah di-hash menggunakan bcrypt.

---

## Development Server

Pastikan development server berjalan:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001` (atau port lain jika 3001 sudah dipakai).
