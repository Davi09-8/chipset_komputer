# 📚 Manual Book - Chipset Computer E-Commerce

**Versi:** 1.0  
**Tanggal:** Januari 2026  
**Sistem:** E-Commerce Penjualan Chipset & Komputer

---

## 📖 Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Spesifikasi Sistem](#2-spesifikasi-sistem)
3. [Instalasi & Konfigurasi](#3-instalasi--konfigurasi)
4. [Panduan Pengguna (Customer)](#4-panduan-pengguna-customer)
5. [Panduan Administrator](#5-panduan-administrator)
6. [Dokumentasi Teknis](#6-dokumentasi-teknis)
7. [API Reference](#7-api-reference)
8. [Troubleshooting](#8-troubleshooting)
9. [FAQ](#9-faq)

---

## 1. Pendahuluan

### 1.1 Tentang Sistem

**Chipset Computer E-Commerce** adalah platform jual-beli online yang dirancang khusus untuk penjualan chipset, processor, dan komponen komputer. Sistem ini dibangun menggunakan teknologi modern dengan Next.js 14, TypeScript, dan Prisma ORM.

### 1.2 Fitur Utama

#### Untuk Pengunjung
- 🔍 Pencarian dan filter produk canggih
- 📱 Tampilan responsif (mobile & desktop)
- 💳 Browse katalog produk tanpa registrasi
- ⭐ Lihat rating dan review produk

#### Untuk Customer (Pengguna Terdaftar)
- 👤 Registrasi dan login dengan autentikasi aman
- 🛒 Keranjang belanja dengan manajemen item
- 💰 Checkout dengan berbagai metode pembayaran
- 📦 Pelacakan status pesanan real-time
- ⭐ Memberikan review dan rating produk
- 💝 Wishlist produk favorit
- 🔔 Notifikasi stok produk
- 🎟️ Penggunaan kupon diskon
- 👥 Perbandingan produk

#### Untuk Admin
- 📊 Dashboard dengan statistik real-time
- 📦 Manajemen produk (Create, Read, Update, Delete)
- 📁 Manajemen kategori
- 🛍️ Manajemen pesanan dan status
- 👥 Manajemen pengguna
- ⭐ Moderasi review produk
- 🎟️ Manajemen kupon diskon
- 📈 Analytics dan laporan penjualan

### 1.3 Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Bahasa** | TypeScript |
| **Database** | MySQL / PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js v5 |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Deployment** | Vercel (recommended) |

---

## 2. Spesifikasi Sistem

### 2.1 Persyaratan Server

#### Minimum Requirements
- **CPU:** 2 cores
- **RAM:** 2 GB
- **Storage:** 10 GB
- **OS:** Windows/Linux/macOS

#### Recommended Requirements
- **CPU:** 4 cores atau lebih
- **RAM:** 4 GB atau lebih
- **Storage:** 20 GB SSD
- **OS:** Ubuntu 20.04 LTS / Windows Server 2019

### 2.2 Persyaratan Software

| Software | Versi Minimum |
|----------|---------------|
| Node.js | 18.x atau lebih baru |
| npm | 9.x atau lebih baru |
| MySQL | 8.0+ / PostgreSQL 13+ |
| Browser | Chrome 90+, Firefox 88+, Safari 14+ |

---

## 3. Instalasi & Konfigurasi

### 3.1 Persiapan Environment

#### Step 1: Clone atau Download Project
```bash
# Jika menggunakan Git
git clone <repository-url>
cd chipset_computer

# Atau extract file ZIP ke folder yang diinginkan
```

#### Step 2: Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3.2 Konfigurasi Database

#### Opsi 1: MySQL (Production)

1. **Buat Database Baru**
   ```sql
   CREATE DATABASE chipset_computer;
   CREATE USER 'chipset_user'@'localhost' IDENTIFIED BY 'password_anda';
   GRANT ALL PRIVILEGES ON chipset_computer.* TO 'chipset_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Buat File `.env`**
   ```env
   DATABASE_URL="mysql://chipset_user:password_anda@localhost:3306/chipset_computer"
   NEXTAUTH_SECRET="generate-random-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

#### Opsi 2: SQLite (Development)

1. **Buat File `.env`**
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### 3.3 Setup Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Opsional) Seed data awal
npx prisma db seed
```

### 3.4 Menjalankan Development Server

```bash
npm run dev
```

Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

### 3.5 Build untuk Production

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

### 3.6 Membuat Admin Account

Gunakan script yang tersedia:

```bash
# Menggunakan Node.js
node promote-admin.js

# Atau menggunakan reset-admin.js untuk membuat admin baru
node reset-admin.js
```

**Default Admin Credentials:**
- Email: `admin@chipset.com`
- Password: `admin123`

> ⚠️ **PENTING:** Segera ubah password default setelah login pertama kali!

---

## 4. Panduan Pengguna (Customer)

### 4.1 Registrasi Akun

1. Klik tombol **"Daftar"** di halaman utama
2. Isi form registrasi:
   - Nama lengkap
   - Email (akan digunakan untuk login)
   - Password (minimal 6 karakter)
   - Konfirmasi password
3. Klik **"Daftar"**
4. Anda akan diarahkan ke halaman login

### 4.2 Login

1. Klik tombol **"Masuk"** di halaman utama
2. Masukkan:
   - Email
   - Password
3. Klik **"Masuk"**
4. Anda akan diarahkan ke halaman utama (sudah login)

### 4.3 Browsing & Pencarian Produk

#### Melihat Katalog Produk
- Akses halaman utama untuk melihat produk terbaru
- Klik pada kategori di menu untuk filter berdasarkan kategori
- Scroll untuk melihat lebih banyak produk

#### Pencarian Produk
1. Ketik nama produk di search bar
2. Hasil pencarian akan muncul otomatis
3. Klik produk untuk melihat detail

#### Filter Produk
- **Kategori:** Pilih kategori dari menu navigasi
- **Harga:** Filter berdasarkan range harga
- **Rating:** Filter produk dengan rating tertentu

### 4.4 Detail Produk

Halaman detail produk menampilkan:
- **Gambar produk:** Klik untuk zoom
- **Nama & deskripsi**
- **Harga:** Harga normal dan harga diskon (jika ada)
- **Spesifikasi teknis**
- **Stok tersedia**
- **Rating & review** dari pembeli lain
- **Tombol aksi:**
  - 🛒 Tambah ke Keranjang
  - 💝 Tambah ke Wishlist
  - 🔔 Notifikasi Stok (jika stok habis)
  - ⚖️ Bandingkan

### 4.5 Keranjang Belanja

#### Menambah Item ke Keranjang
1. Buka halaman detail produk
2. Klik **"Tambah ke Keranjang"**
3. Item akan masuk ke keranjang

#### Mengelola Keranjang
1. Klik icon keranjang di header
2. Anda dapat:
   - **Ubah jumlah:** Klik + atau - untuk mengubah quantity
   - **Hapus item:** Klik icon sampah
   - **Lihat subtotal:** Total harga otomatis dihitung

### 4.6 Checkout & Pembayaran

#### Proses Checkout

1. **Di halaman keranjang**, klik **"Checkout"**

2. **Isi Alamat Pengiriman:**
   ```
   - Nama penerima
   - Nomor telepon
   - Alamat lengkap
   - Kota
   - Kode pos
   ```

3. **Pilih Layanan Pengiriman:**
   - JNE (Rp 15.000)
   - J&T (Rp 12.000)
   - SiCepat (Rp 10.000)
   - Ongkir akan otomatis ditambahkan ke total

4. **Pilih Metode Pembayaran:**
   - Transfer Bank (BCA, Mandiri, BNI)
   - E-Wallet (akan segera hadir)

5. **Masukkan Kode Kupon (Opsional):**
   - Ketik kode kupon di field yang tersedia
   - Klik **"Terapkan"**
   - Diskon akan otomatis dikurangi dari total

6. **Review Pesanan:**
   - Subtotal produk
   - Ongkos kirim
   - Diskon (jika ada)
   - **Total pembayaran**

7. **Klik "Buat Pesanan"**

#### Upload Bukti Pembayaran

Setelah pesanan dibuat:

1. Lakukan transfer sesuai nominal yang tertera
2. Buka **"Pesanan Saya"**
3. Klik pesanan yang baru dibuat
4. Klik **"Upload Bukti Pembayaran"**
5. Pilih file bukti transfer (JPG/PNG, max 2MB)
6. Tunggu admin verifikasi

### 4.7 Pelacakan Pesanan

1. Klik menu **"Pesanan Saya"** atau **"Profile" → "Pesanan"**
2. Lihat daftar semua pesanan dengan status:
   - 🟡 **PENDING:** Menunggu pembayaran
   - 🔵 **PAID:** Pembayaran diterima, sedang diproses
   - 📦 **SHIPPED:** Pesanan dikirim
   - ✅ **COMPLETED:** Pesanan selesai
   - ❌ **CANCELLED:** Pesanan dibatalkan

3. Klik pesanan untuk melihat detail:
   - Nomor pesanan
   - Items yang dibeli
   - Alamat pengiriman
   - Riwayat status
   - Bukti pembayaran

### 4.8 Review Produk

#### Memberikan Review

1. Buka **"Pesanan Saya"**
2. Pilih pesanan dengan status **COMPLETED**
3. Klik **"Beri Review"** pada produk
4. Isi form review:
   - Rating (1-5 bintang)
   - Komentar (opsional)
5. Klik **"Kirim Review"**
6. Review akan muncul setelah disetujui admin

### 4.9 Wishlist

#### Menambah ke Wishlist
1. Buka detail produk
2. Klik icon ❤️ **"Tambah ke Wishlist"**

#### Mengelola Wishlist
1. Klik menu **"Wishlist"**
2. Lihat semua produk favorit
3. Klik produk untuk melihat detail
4. Hapus dari wishlist dengan klik icon ❤️ lagi

### 4.10 Perbandingan Produk

1. Pilih produk yang ingin dibandingkan (max 3 produk)
2. Klik **"Bandingkan"** pada setiap produk
3. Akses halaman **"Compare"**
4. Lihat perbandingan spesifikasi side-by-side

### 4.11 Notifikasi Stok

Jika produk habis stok:
1. Klik **"Beritahu Saya"** di halaman produk
2. Masukkan email
3. Anda akan menerima email saat stok tersedia lagi

### 4.12 Manajemen Profil

1. Klik icon user di header
2. Pilih **"Profile"**
3. Anda dapat:
   - **Edit profil:** Ubah nama, email
   - **Ganti password:** Ubah password akun
   - **Lihat pesanan:** Riwayat semua pesanan
   - **Logout:** Keluar dari akun

---

## 5. Panduan Administrator

### 5.1 Akses Admin Panel

1. Login menggunakan akun admin
2. Anda akan diarahkan ke **Admin Dashboard** di `/admin`
3. Atau klik **"Admin Panel"** di menu user

### 5.2 Dashboard Admin

Dashboard menampilkan:

#### Statistik Utama (Cards)
- 📦 **Total Pesanan:** Jumlah pesanan hari ini / bulan ini
- 💰 **Total Pendapatan:** Revenue hari ini / bulan ini
- 👥 **Total Pelanggan:** Jumlah customer terdaftar
- ⏳ **Pesanan Pending:** Pesanan yang menunggu konfirmasi

#### Grafik Analytics
- 📈 **Grafik Penjualan:** Penjualan per hari (7 hari terakhir)
- 📊 **Kategori Terlaris:** Breakdown per kategori

#### Quick Info
- 🏆 **Produk Terlaris:** Top 5 produk bestseller
- 📦 **Pesanan Terbaru:** 5 pesanan terakhir
- ⚠️ **Stok Rendah:** Produk dengan stok < 10

### 5.3 Manajemen Produk

#### Melihat Daftar Produk

1. Klik menu **"Products"** di sidebar
2. Daftar produk ditampilkan dengan:
   - Gambar
   - Nama & SKU
   - Kategori
   - Harga
   - Stok
   - Status (Active/Inactive)
   - Aksi (Edit/Delete)

#### Menambah Produk Baru

1. Klik **"+ Tambah Produk"**
2. Isi form:

   **Informasi Dasar:**
   - Nama produk
   - Kategori
   - SKU (Stock Keeping Unit)
   - Deskripsi

   **Harga:**
   - Harga normal
   - Harga diskon (opsional)
   - Persentase diskon (auto-calculated)

   **Stok & Status:**
   - Jumlah stok
   - Status (Active/Inactive)

   **Gambar:**
   - Upload gambar produk (max 5 gambar)
   - Format: JPG, PNG
   - Ukuran max: 2MB per file

   **Spesifikasi Teknis:**
   - Tambah field spesifikasi (key-value pairs)
   - Contoh:
     - Brand: Intel
     - Cores: 8
     - Threads: 16
     - Base Clock: 3.6 GHz

3. Klik **"Simpan Produk"**

#### Mengedit Produk

1. Klik icon **✏️ Edit** pada produk
2. Ubah data yang diperlukan
3. Klik **"Update Produk"**

#### Menghapus Produk

1. Klik icon **🗑️ Delete** pada produk
2. Konfirmasi penghapusan
3. Produk akan dihapus permanen (termasuk dari keranjang & wishlist)

> ⚠️ **Perhatian:** Produk yang sudah ada di pesanan tidak bisa dihapus. Set status menjadi "Inactive" sebagai gantinya.

### 5.4 Manajemen Kategori

#### Melihat Daftar Kategori

1. Klik menu **"Categories"** di sidebar
2. Lihat semua kategori dengan:
   - Nama kategori
   - Slug (URL-friendly name)
   - Deskripsi
   - Jumlah produk
   - Status

#### Menambah Kategori

1. Klik **"+ Tambah Kategori"**
2. Isi form:
   - Nama kategori
   - Slug (auto-generate dari nama)
   - Deskripsi
   - Upload gambar kategori (opsional)
   - Parent category (jika sub-kategori)
3. Klik **"Simpan"**

#### Mengedit Kategori

1. Klik icon **✏️ Edit**
2. Ubah data
3. Klik **"Update"**

#### Menghapus Kategori

1. Klik icon **🗑️ Delete**
2. Konfirmasi
3. Kategori dihapus (produk di kategori akan otomatis deleted/reassigned)

### 5.5 Manajemen Pesanan

#### Melihat Daftar Pesanan

1. Klik menu **"Orders"** di sidebar
2. Lihat pesanan dengan filter:
   - Semua pesanan
   - Pending
   - Paid
   - Shipped
   - Completed
   - Cancelled

#### Detail Pesanan

Klik pesanan untuk melihat:
- **Informasi Order:**
  - Nomor pesanan
  - Tanggal
  - Status pembayaran
  - Status pengiriman

- **Customer Info:**
  - Nama
  - Email
  - No. telepon
  - Alamat pengiriman

- **Items:**
  - Daftar produk
  - Quantity
  - Harga
  - Subtotal

- **Ringkasan:**
  - Subtotal produk
  - Ongkir
  - Diskon
  - Total

- **Bukti Transfer** (jika sudah upload)

#### Update Status Pesanan

1. Buka detail pesanan
2. Pilih status baru dari dropdown:
   - **PENDING → PAID:** Setelah verifikasi pembayaran
   - **PAID → SHIPPED:** Setelah barang dikirim
   - **SHIPPED → COMPLETED:** Setelah barang diterima
   - **Any → CANCELLED:** Untuk cancel pesanan

3. Klik **"Update Status"**
4. Customer akan menerima notifikasi (future: email notification)

#### Cetak Invoice

1. Buka detail pesanan
2. Klik **"Print Invoice"**
3. Invoice akan terbuka di tab baru
4. Cetak atau save as PDF

### 5.6 Manajemen User

#### Melihat Daftar User

1. Klik menu **"Users"** di sidebar
2. Lihat semua user dengan info:
   - Nama
   - Email
   - Role (CUSTOMER/ADMIN)
   - Tanggal registrasi
   - Total pesanan

#### Mengubah Role User

1. Klik **"Edit Role"** pada user
2. Pilih role baru:
   - CUSTOMER
   - ADMIN
3. Klik **"Update"**

> ⚠️ **Hati-hati:** Admin bisa akses semua fitur admin panel!

#### Menonaktifkan User

1. Klik **"Disable User"**
2. User tidak bisa login
3. Klik **"Enable User"** untuk aktifkan kembali

### 5.7 Manajemen Review

#### Melihat Review

1. Klik menu **"Reviews"** di sidebar
2. Lihat semua review dengan:
   - Product name
   - Customer name
   - Rating (1-5)
   - Komentar
   - Status approval

#### Menyetujui Review

1. Untuk review baru (pending):
2. Klik **"✓ Approve"** untuk publish review
3. Atau **"✗ Reject"** untuk tolak

#### Menghapus Review

1. Klik **"🗑️ Delete"**
2. Konfirmasi penghapusan
3. Review akan dihapus permanen

### 5.8 Manajemen Kupon

#### Melihat Daftar Kupon

1. Klik menu **"Coupons"** di sidebar
2. Lihat semua kupon:
   - Kode kupon
   - Tipe (Percentage/Fixed)
   - Nilai diskon
   - Periode aktif
   - Usage limit
   - Status

#### Menambah Kupon Baru

1. Klik **"+ Tambah Kupon"**
2. Isi form:

   - **Kode:** Kode unik (contoh: NEWYEAR2026)
   - **Tipe Diskon:**
     - Percentage: Diskon persentase (contoh: 10%)
     - Fixed: Diskon nominal (contoh: Rp 50.000)
   
   - **Nilai:** Nilai diskon
   
   - **Periode:**
     - Tanggal mulai
     - Tanggal berakhir
   
   - **Syarat (Opsional):**
     - Minimal pembelian (contoh: Rp 500.000)
     - Maksimal diskon (untuk percentage type)
     - Batas penggunaan (contoh: 100 kali)
   
   - **Status:** Active/Inactive

3. Klik **"Simpan Kupon"**

#### Mengedit Kupon

1. Klik **✏️ Edit**
2. Ubah data
3. Klik **"Update"**

#### Menonaktifkan Kupon

1. Toggle status menjadi **"Inactive"**
2. Atau hapus kupon

### 5.9 Analytics & Reports

#### Melihat Analytics

1. Klik menu **"Analytics"** di sidebar
2. Lihat berbagai metrik:

   **Revenue Analytics:**
   - Revenue hari ini
   - Revenue minggu ini
   - Revenue bulan ini
   - Revenue tahun ini
   - Grafik trend penjualan

   **Order Analytics:**
   - Total pesanan
   - Conversion rate
   - Average order value
   - Grafik pesanan per status

   **Product Analytics:**
   - Best selling products
   - Low stock alerts
   - Product views
   - Category performance

   **Customer Analytics:**
   - New customers
   - Returning customers
   - Customer lifetime value

#### Export Reports

1. Pilih jenis report
2. Set date range
3. Klik **"Export CSV"** atau **"Export PDF"**

---

## 6. Dokumentasi Teknis

### 6.1 Struktur Database

System menggunakan 12 model Prisma:

#### User
- Menyimpan data pengguna (customer & admin)
- Fields: id, name, email, password, role
- Relations: carts, orders, reviews, wishlists

#### Category
- Kategori produk dengan support hierarchical (parent-child)
- Fields: id, name, slug, description, image, parentId
- Relations: products, parent, children

#### Product
- Produk yang dijual
- Fields: id, name, slug, description, price, discountPrice, stock, sku, images, specifications
- Relations: category, carts, orderItems, reviews, wishlists

#### Cart
- Keranjang belanja user
- Fields: id, userId, productId, quantity
- Unique constraint: (userId, productId)

#### Order
- Pesanan customer
- Fields: id, orderNumber, totalAmount, status, paymentMethod, paymentStatus, shippingAddress, shippingCost, shippingService, discountCode, receiptUrl
- Relations: user, orderItems

#### OrderItem
- Detail item dalam pesanan
- Fields: id, orderId, productId, quantity, price
- Relations: order, product

#### Review
- Review produk dari customer
- Fields: id, userId, productId, rating, comment, isApproved
- Unique constraint: (userId, productId) - 1 review per user per product

#### Wishlist
- Produk favorit user
- Fields: id, userId, productId
- Unique constraint: (userId, productId)

#### Coupon
- Kupon diskon
- Fields: id, code, type (PERCENTAGE/FIXED), value, startDate, endDate, minPurchase, maxDiscount, usageLimit, usedCount

#### Newsletter
- Email subscribers untuk newsletter
- Fields: id, email, isActive, subscribedAt

#### FAQ
- Frequently Asked Questions
- Fields: id, question, answer, category, order

#### StockNotification
- Notifikasi stok produk untuk user
- Fields: id, userId, productId, email, notified

### 6.2 Struktur Folder

```
chipset_computer/
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeder
│
├── public/                     # Static files
│   ├── images/
│   └── uploads/
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin pages
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── products/       # Product management
│   │   │   ├── categories/     # Category management
│   │   │   ├── orders/         # Order management
│   │   │   ├── users/          # User management
│   │   │   ├── reviews/        # Review moderation
│   │   │   ├── coupons/        # Coupon management
│   │   │   └── analytics/      # Analytics & reports
│   │   │
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── products/       # Product endpoints
│   │   │   ├── cart/           # Cart endpoints
│   │   │   ├── orders/         # Order endpoints
│   │   │   ├── reviews/        # Review endpoints
│   │   │   ├── coupons/        # Coupon validation
│   │   │   └── upload/         # File upload
│   │   │
│   │   ├── products/           # Product pages
│   │   │   └── [slug]/         # Product detail
│   │   │
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout page
│   │   ├── orders/             # Order history & detail
│   │   ├── wishlist/           # Wishlist
│   │   ├── compare/            # Product comparison
│   │   ├── profile/            # User profile
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   │
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductFilter.tsx
│   │   ├── cart/
│   │   │   └── CartItem.tsx
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── DataTable.tsx
│   │   └── ui/
│   │       ├── ConfirmationModal.tsx
│   │       ├── SuccessModal.tsx
│   │       └── Toast.tsx
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── utils.ts            # Helper functions
│   │   └── validations.ts      # Zod schemas
│   │
│   ├── contexts/               # React contexts
│   │   ├── CartContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── ConfirmationContext.tsx
│   │
│   └── types/                  # TypeScript types
│       └── index.ts
│
├── .env                        # Environment variables
├── .env.example                # Environment template
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

### 6.3 Authentication Flow

System menggunakan NextAuth.js v5 dengan Credentials Provider:

1. **Registration:**
   ```
   POST /api/register
   → Hash password dengan bcrypt
   → Create user di database
   → Return success
   ```

2. **Login:**
   ```
   POST /api/auth/signin/credentials
   → Verify email & password
   → Create JWT token
   → Set session cookie
   → Redirect to dashboard
   ```

3. **Session Management:**
   - JWT stored in HTTP-only cookie
   - Session expires in 30 days
   - Auto-refresh on page load

4. **Protected Routes:**
   - Middleware checks session
   - Redirect to login if unauthorized
   - Role-based access control (RBAC)

### 6.4 Image Upload System

Menggunakan built-in Next.js file handling:

1. **Upload Endpoint:** `/api/upload`
2. **Allowed formats:** JPG, PNG, WEBP
3. **Max file size:** 2MB
4. **Storage:** `public/uploads/`
5. **Naming:** `{timestamp}-{randomString}.{ext}`

### 6.5 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `mysql://user:pass@localhost:3306/db` |
| `NEXTAUTH_SECRET` | Secret key for JWT signing | `your-random-32-char-secret` |
| `NEXTAUTH_URL` | Base URL of application | `http://localhost:3000` |

### 6.6 Security Features

1. **Password Hashing:** bcrypt with salt rounds = 10
2. **SQL Injection Prevention:** Prisma ORM (parameterized queries)
3. **XSS Prevention:** React auto-escaping + CSP headers
4. **CSRF Protection:** NextAuth built-in CSRF tokens
5. **Rate Limiting:** Future implementation
6. **Input Validation:** Zod schemas on all forms

---

## 7. API Reference

### 7.1 Authentication

#### POST `/api/register`
Registrasi user baru

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "clxxx..."
}
```

#### POST `/api/auth/signin`
Login user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "session": {
    "user": {
      "id": "clxxx...",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "CUSTOMER"
    }
  }
}
```

### 7.2 Products

#### GET `/api/products`
Get daftar produk dengan filter

**Query Parameters:**
- `category` (optional): Filter by category slug
- `search` (optional): Search by product name
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `sortBy` (optional): Sort field (name, price, createdAt)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
[
  {
    "id": "clxxx...",
    "name": "Intel Core i9-13900K",
    "slug": "intel-core-i9-13900k",
    "price": 8500000,
    "discountPrice": 7999000,
    "stock": 15,
    "images": ["url1.jpg", "url2.jpg"],
    "category": {
      "id": "clxxx...",
      "name": "Processor"
    }
  }
]
```

#### GET `/api/products/[slug]`
Get detail produk by slug

**Response:**
```json
{
  "id": "clxxx...",
  "name": "Intel Core i9-13900K",
  "description": "...",
  "price": 8500000,
  "stock": 15,
  "specifications": {
    "cores": "24",
    "threads": "32"
  },
  "reviews": [...]
}
```

### 7.3 Cart

#### GET `/api/cart`
Get cart items user yang sedang login

**Response:**
```json
[
  {
    "id": "clxxx...",
    "product": {
      "id": "clxxx...",
      "name": "Intel Core i9",
      "price": 8500000
    },
    "quantity": 2
  }
]
```

#### POST `/api/cart`
Add item to cart

**Request Body:**
```json
{
  "productId": "clxxx...",
  "quantity": 1
}
```

#### PUT `/api/cart/[id]`
Update quantity item di cart

**Request Body:**
```json
{
  "quantity": 3
}
```

#### DELETE `/api/cart/[id]`
Remove item from cart

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

### 7.4 Orders

#### GET `/api/orders`
Get daftar order user

**Response:**
```json
[
  {
    "id": "clxxx...",
    "orderNumber": "ORD-2026-0001",
    "totalAmount": 8515000,
    "status": "PENDING",
    "createdAt": "2026-01-06T10:00:00Z",
    "orderItems": [...]
  }
]
```

#### POST `/api/orders`
Create order baru

**Request Body:**
```json
{
  "shippingAddress": "Jl. Sudirman No. 123, Jakarta",
  "shippingService": "JNE",
  "paymentMethod": "TRANSFER",
  "discountCode": "NEWYEAR2026",
  "notes": "Kirim pagi"
}
```

#### GET `/api/orders/[id]`
Get detail order

**Response:**
```json
{
  "id": "clxxx...",
  "orderNumber": "ORD-2026-0001",
  "totalAmount": 8515000,
  "status": "PAID",
  "shippingAddress": "...",
  "orderItems": [
    {
      "product": {...},
      "quantity": 2,
      "price": 8500000
    }
  ]
}
```

### 7.5 Coupons

#### POST `/api/coupons/validate`
Validate coupon code

**Request Body:**
```json
{
  "code": "NEWYEAR2026",
  "subtotal": 8500000
}
```

**Response:**
```json
{
  "valid": true,
  "coupon": {
    "code": "NEWYEAR2026",
    "type": "PERCENTAGE",
    "value": 10,
    "discountAmount": 850000
  }
}
```

### 7.6 Reviews

#### POST `/api/reviews`
Submit product review

**Request Body:**
```json
{
  "productId": "clxxx...",
  "rating": 5,
  "comment": "Produk sangat bagus!"
}
```

### 7.7 Admin APIs

#### GET `/api/admin/orders`
Get all orders (admin only)

#### PUT `/api/admin/orders/[id]/status`
Update order status

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

#### GET `/api/admin/analytics`
Get analytics data

**Response:**
```json
{
  "todayRevenue": 15000000,
  "monthRevenue": 450000000,
  "totalOrders": 1250,
  "totalCustomers": 450
}
```

---

## 8. Troubleshooting

### 8.1 Masalah Instalasi

#### Error: "Module not found"
**Solusi:**
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Cannot find module 'prisma'"
**Solusi:**
```bash
npm install prisma @prisma/client --save-dev
npx prisma generate
```

### 8.2 Masalah Database

#### Error: "Can't reach database server"
**Penyebab:** MySQL server tidak running

**Solusi:**
```bash
# Windows (XAMPP)
- Start XAMPP Control Panel
- Start MySQL

# Linux
sudo service mysql start

# Cek koneksi
mysql -u root -p
```

#### Error: "Table does not exist"
**Solusi:**
```bash
# Push schema ke database
npx prisma db push

# Atau migrate
npx prisma migrate dev
```

#### Error: "Prisma Client validation error"
**Solusi:**
```bash
# Re-generate Prisma Client
npx prisma generate
```

### 8.3 Masalah Authentication

#### Tidak Bisa Login (Kredensial Benar)
**Checklist:**
1. Pastikan `NEXTAUTH_SECRET` sudah diset di `.env`
2. Cek password ter-hash dengan benar di database
3. Clear browser cookies
4. Restart dev server

**Debug:**
```bash
# Cek user di database
npx prisma studio
# Buka table User, cek password hash
```

#### Session Expired Terus
**Solusi:**
- Set `NEXTAUTH_URL` dengan benar di `.env`
- Cek system time (JWT validation sensitive terhadap waktu)

### 8.4 Masalah Upload File

#### Error: "File upload failed"
**Checklist:**
1. Pastikan folder `public/uploads` exists dan writable
2. Cek ukuran file (max 2MB)
3. Cek format file (hanya JPG, PNG)

**Solusi:**
```bash
# Windows
mkdir public\uploads

# Linux/Mac
mkdir -p public/uploads
chmod 777 public/uploads
```

### 8.5 Masalah Performance

#### Website Lambat
**Optimasi:**
1. **Enable Production Build:**
   ```bash
   npm run build
   npm start
   ```

2. **Image Optimization:**
   - Kompres gambar sebelum upload
   - Gunakan WebP format

3. **Database Indexing:**
   - Index pada kolom yang sering di-query (email, slug)

#### Memory Leak
**Solusi:**
```bash
# Increase Node.js memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

### 8.6 Masalah Build Production

#### Error saat `npm run build`
**Common issues:**

1. **TypeScript errors:**
   ```bash
   # Cek error detail
   npm run build -- --debug
   ```

2. **Missing environment variables:**
   - Pastikan semua env vars ada di production
   - Set di Vercel/hosting panel

3. **Prisma client outdated:**
   ```bash
   npx prisma generate
   npm run build
   ```

### 8.7 Masalah Runtime

#### Error 500 pada API Routes
**Debug:**
1. Cek logs di terminal
2. Tambahkan try-catch di API handler:
   ```typescript
   try {
     // your code
   } catch (error) {
     console.error('API Error:', error);
     return NextResponse.json(
       { error: error.message },
       { status: 500 }
     );
   }
   ```

#### Infinite Redirect Loop
**Penyebab:** Middleware authentication loop

**Solusi:**
- Cek `middleware.ts`
- Pastikan public routes di-exclude dari auth check

---

## 9. FAQ

### General

**Q: Apakah sistem ini gratis?**  
A: Ya, sistem ini open-source untuk keperluan pembelajaran dan akademik.

**Q: Apakah bisa digunakan untuk produksi?**  
A: Ya, tapi perlu tambahan fitur keamanan dan optimasi untuk production.

**Q: Apakah support mobile app?**  
A: Belum, saat ini hanya web responsive. Mobile app bisa dikembangkan dengan React Native.

### Technical

**Q: Database apa yang didukung?**  
A: MySQL, PostgreSQL, dan SQLite (untuk development).

**Q: Apakah bisa ganti dari MySQL ke PostgreSQL?**  
A: Ya, tinggal ubah `provider` di `schema.prisma` dan `DATABASE_URL` di `.env`.

**Q: Apakah support internationalization (i18n)?**  
A: Belum, saat ini hanya Bahasa Indonesia. Bisa ditambahkan dengan next-intl.

**Q: Bagaimana cara backup database?**  
A: 
```bash
# MySQL
mysqldump -u username -p chipset_computer > backup.sql

# Restore
mysql -u username -p chipset_computer < backup.sql
```

### Features

**Q: Apakah ada fitur payment gateway?**  
A: Belum terintegrasi. Saat ini hanya manual transfer + upload bukti. Bisa integrate Midtrans/Xendit.

**Q: Apakah support multi-currency?**  
A: Belum, saat ini hanya Rupiah (IDR).

**Q: Bagaimana cara menambah payment method?**  
A: Edit enum di order form dan tambah logic di checkout page.

**Q: Apakah ada fitur live chat?**  
A: Belum ada. Bisa integrate dengan Tawk.to atau Intercom.

### Admin

**Q: Berapa banyak admin yang bisa dibuat?**  
A: Unlimited. Semua user dengan role "ADMIN" bisa akses admin panel.

**Q: Apakah ada audit log untuk admin actions?**  
A: Belum ada. Bisa ditambahkan dengan model AuditLog.

**Q: Bagaimana cara export data?**  
A: Gunakan Prisma Studio atau query langsung ke database:
```bash
npx prisma studio
```

### Customization

**Q: Bagaimana cara ubah warna tema?**  
A: Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

**Q: Bagaimana cara tambah field baru di Product?**  
A:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update TypeScript types
4. Update forms & views

**Q: Apakah bisa customize email template?**  
A: Saat ini email notification belum implemented. Bisa ditambahkan dengan Nodemailer + React Email.

---

## 📞 Kontak & Support

Untuk bantuan lebih lanjut:

- **Email:** support@chipsetcomputer.com
- **Website:** [Documentation](https://docs.chipsetcomputer.com)
- **GitHub:** [Issues](https://github.com/your-repo/issues)

---

## 📝 Changelog

### Version 1.0 (Januari 2026)
- ✅ Initial release
- ✅ Complete e-commerce functionality
- ✅ Admin dashboard
- ✅ Order management
- ✅ Coupon system
- ✅ Review system
- ✅ Wishlist & Compare

---

## 📄 License

Copyright © 2026 Chipset Computer  
Dibuat untuk keperluan akademik - Proyek Semester 5

---

**Manual Book Version:** 1.0  
**Last Updated:** 06 Januari 2026  
**Document Status:** Final
