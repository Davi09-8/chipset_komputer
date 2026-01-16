# Walkthrough - Fitur Role & Autentikasi

Saya telah menyelesaikan verifikasi dan implementasi fitur untuk 3 role: **Admin, Pengunjung, dan Pembeli**.

## 1. Perubahan Autentikasi
-   **Registrasi Aman**: Password hashing dipindahkan ke server untuk keamanan.
-   **Admin Access**: Akun admin (`admin@example.com`) telah di-reset dan diverifikasi bisa mengakses backend user.

## 2. Fitur Berdasarkan Role

### 👤 Pengunjung (Visitor)
-   Dapat melihat produk, kategori, dan detail produk.
-   Di halaman detail produk, tombol **"Tambah ke Keranjang" TIDAK MUNCUL**.
-   Sebagai gantinya, muncul tombol **"Login untuk Membeli"** yang mengarahkan ke halaman login.

### 🛒 Pembeli (Customer)
-   Setelah login, tombol **"Login untuk Membeli" BERUBAH menjadi "Tambah ke Keranjang"**.
-   Dapat mengakses halaman `/cart` dan melakukan checkout.
-   Data keranjang terhubung dengan akun user.

### 🔧 Admin
-   Memiliki akses penuh ke halaman `/admin` (User, Produk, Order).
-   Memiliki kemampuan yang sama dengan Pembeli (bisa belanja juga untuk testing).

## Cara Verifikasi

1.  **Sebagai Admin**:
    -   Login: `admin@example.com` / `admin`
    -   Buka: [http://localhost:3001/admin](http://localhost:3001/admin)

2.  **Sebagai Pengunjung**:
    -   Logout atau buka Incognito.
    -   Buka produk apa saja.
    -   Anda akan melihat tombol "Login untuk Membeli".

3.  **Sebagai Pembeli**:
    -   Register akun baru atau Login.
    -   Buka produk.
    -   Tombol berubah menjadi "Tambah ke Keranjang".
