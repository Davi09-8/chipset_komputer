# Walkthrough - Perbaikan Autentikasi

Saya telah memperbaiki masalah keamanan pada fitur registrasi dan memverifikasi backend user.

## Perubahan yang Dilakukan

1.  **Registrasi Aman**:
    -   Mengubah `src/app/register/page.tsx` untuk mengirim password plaintext (HTTPS diasumsikan untuk production).
    -   Mengubah `src/app/api/register/route.ts` untuk melakukan hashing password menggunakan `bcryptjs` di sisi server.
    -   Ini mencegah hashing di client yang dianggap kurang aman dan best-practice.

2.  **Verifikasi Backend**:
    -   Memastikan API admin user (`/api/admin/users`) tersedia.

## Hasil Verifikasi

### Tes Registrasi
Saya menjalankan script tes otomatis untuk mendaftar user baru.

-   **Input**: Email `test_[timestamp]@example.com`, Password `password123`
-   **Hasil**: Sukses (201 Created)
-   **Log**:
    ```json
    {
      "user": {
        "id": "cm...",
        "name": "Test User",
        "email": "test_...@example.com"
      }
    }
    ```

### Status Server
Server berjalan dengan baik pada port 3000.
Silakan akses [http://localhost:3000/login](http://localhost:3000/login).
Admin dashboard seharusnya ada di [http://localhost:3000/admin](http://localhost:3000/admin) (Pastikan login sebagai admin).
