# 🗄️ Setup Database MySQL dengan phpMyAdmin

Panduan lengkap untuk membuat dan mengkonfigurasi database MySQL menggunakan phpMyAdmin.

---

## ✅ Status Perubahan

- [x] Schema Prisma sudah diubah dari SQLite ke MySQL
- [x] Prisma Client sudah terinstall
- [ ] Database MySQL perlu dibuat di phpMyAdmin
- [ ] File `.env` perlu dibuat dengan konfigurasi MySQL
- [ ] Schema perlu di-push ke database MySQL
- [ ] Data seed perlu dijalankan

---

## 📝 Langkah-Langkah Setup

### **Langkah 1: Pastikan XAMPP/WAMP Berjalan**

1. Buka **XAMPP Control Panel** atau **WAMP**
2. Start service **Apache** dan **MySQL**
3. Pastikan status keduanya berwarna hijau/running

---

### **Langkah 2: Buat Database di phpMyAdmin**

1. Buka browser, akses: **`http://localhost/phpmyadmin`**
2. Klik tab **"Databases"** di menu atas
3. Di bagian **"Create database"**:
   - **Database name**: ketik `chipset_computer`
   - **Collation**: pilih `utf8mb4_general_ci`
4. Klik tombol **"Create"**
5. Database baru akan muncul di sidebar kiri

![phpMyAdmin Create Database](https://i.imgur.com/example.png)

---

### **Langkah 3: Buat File `.env`**

1. Di folder root project (`d:\Kuliah\Semester 5\Proyek\chipset & computer\`), buat file baru bernama **`.env`** (tanpa ekstensi)
2. Copy-paste konfigurasi berikut ke dalam file `.env`:

```env
DATABASE_URL="mysql://root:@localhost:3306/chipset_computer"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

#### 🔧 Konfigurasi `DATABASE_URL`

Format: `mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME`

**Sesuaikan dengan konfigurasi MySQL Anda:**

| Komponen | Default XAMPP | Default WAMP | Keterangan |
|----------|---------------|--------------|------------|
| USERNAME | `root` | `root` | Username MySQL |
| PASSWORD | *(kosong)* | *(kosong)* | Password MySQL (jika ada, tambahkan setelah `:`) |
| HOST | `localhost` | `localhost` | Host database |
| PORT | `3306` | `3306` | Port MySQL |
| DATABASE_NAME | `chipset_computer` | `chipset_computer` | Nama database yang dibuat |

**Contoh jika ada password:**
```env
DATABASE_URL="mysql://root:password123@localhost:3306/chipset_computer"
```

---

### **Langkah 4: Generate Prisma Client**

Buka terminal/PowerShell di folder project, jalankan:

```bash
node node_modules/prisma/build/index.js generate
```

**Output yang diharapkan:**
```
✔ Generated Prisma Client
```

---

### **Langkah 5: Push Schema ke Database**

Jalankan perintah berikut untuk membuat tabel-tabel di database:

```bash
node node_modules/prisma/build/index.js db push
```

**Output yang diharapkan:**
```
🚀  Your database is now in sync with your Prisma schema.
```

Setelah berhasil, buka phpMyAdmin dan refresh. Anda akan melihat tabel-tabel berikut di database `chipset_computer`:
- `User`
- `Category`
- `Product`
- `Cart`
- `Order`
- `OrderItem`
- `Review`

---

### **Langkah 6: Seed Data (Opsional)**

Jika ada file seed untuk mengisi data awal, jalankan:

```bash
node node_modules/prisma/build/index.js db seed
```

---

## 🔍 Verifikasi Database

### Cek di phpMyAdmin:
1. Buka `http://localhost/phpmyadmin`
2. Klik database `chipset_computer` di sidebar kiri
3. Anda akan melihat semua tabel yang sudah dibuat
4. Klik tabel untuk melihat struktur dan data

### Cek dengan Prisma Studio (Opsional):
```bash
node node_modules/prisma/build/index.js studio
```
Akan membuka interface visual di `http://localhost:5555` untuk melihat dan mengedit data.

---

## ❌ Troubleshooting

### Error: `P1001: Can't reach database server`
**Penyebab:** MySQL service tidak berjalan
**Solusi:** 
- Pastikan MySQL di XAMPP/WAMP sudah running
- Cek port 3306 tidak digunakan aplikasi lain

### Error: `P1003: Database does not exist`
**Penyebab:** Database `chipset_computer` belum dibuat
**Solusi:** Ulangi Langkah 2 untuk membuat database

### Error: `P1012: error: Environment variable not found: DATABASE_URL`
**Penyebab:** File `.env` tidak ditemukan atau salah lokasi
**Solusi:** 
- Pastikan file `.env` ada di root project
- Pastikan nama file benar (`.env` bukan `.env.txt`)

### Error: `Access denied for user 'root'@'localhost'`
**Penyebab:** Username atau password salah
**Solusi:** 
- Cek username dan password MySQL Anda
- Update `DATABASE_URL` di file `.env`

---

## 📚 Referensi

- [Prisma MySQL Documentation](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [phpMyAdmin Documentation](https://docs.phpmyadmin.net/)
- [XAMPP Documentation](https://www.apachefriends.org/docs/)

---

## ✨ Setelah Setup Selesai

Setelah semua langkah di atas berhasil, Anda bisa:
1. Menjalankan development server: `npm run dev`
2. Akses aplikasi di: `http://localhost:3000`
3. Database sudah siap digunakan!
