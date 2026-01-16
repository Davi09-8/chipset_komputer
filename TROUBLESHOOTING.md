# � Cara Alternatif Menjalankan Aplikasi

## Masalah
npm install terus gagal di sistem Anda. Ini kemungkinan karena:
- Konflik dependencies
- npm cache corrupt
- Antivirus blocking
- Network issues

## ✅ SOLUSI TERCEPAT - Gunakan Template

### Cara 1: Buat Project Baru dengan Template

1. **Buka terminal di folder parent** (bukan di folder chipset & computer):
```bash
cd "d:/Kuliah/Semester 5/Proyek"
```

2. **Buat project Next.js baru**:
```bash
npx create-next-app@latest toko-komputer-new --typescript --tailwind --app --no-git
```

Jawab pertanyaan:
- ESLint? → Yes
- src/ directory? → Yes  
- App Router? → Yes
- Import alias? → Yes (@/*)

3. **Copy semua file dari folder lama ke folder baru**:
```bash
# Copy file-file penting
copy "chipset & computer\src\*" "toko-komputer-new\src\" /E /Y
copy "chipset & computer\prisma\*" "toko-komputer-new\prisma\" /E /Y
copy "chipset & computer\.env.example" "toko-komputer-new\"
copy "chipset & computer\README.md" "toko-komputer-new\"
```

4. **Masuk ke folder baru dan install dependencies tambahan**:
```bash
cd toko-komputer-new
npm install @prisma/client prisma bcryptjs next-auth
npm install -D @types/bcryptjs ts-node
```

5. **Setup database**:
```bash
# Buat file .env
echo DATABASE_URL="file:./dev.db" > .env
echo NEXTAUTH_SECRET="secret-2024" >> .env
echo NEXTAUTH_URL="http://localhost:3000" >> .env

# Generate Prisma
npx prisma generate
npx prisma db push
npx prisma db seed
```

6. **Jalankan**:
```bash
npm run dev
```

### Cara 2: Gunakan Yarn (Lebih Stabil)

```bash
# Install yarn global
npm install -g yarn

# Di folder chipset & computer
cd "d:/Kuliah/Semester 5/Proyek/chipset & computer"

# Install dengan yarn
yarn install

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run
yarn dev
```

### Cara 3: Manual Install Dependencies

Jika semua gagal, install satu per satu:

```bash
cd "d:/Kuliah/Semester 5/Proyek/chipset & computer"

# Core
npm install next@14
npm install react@18
npm install react-dom@18

# Database
npm install @prisma/client@5
npm install -D prisma@5

# Auth
npm install next-auth@4
npm install bcryptjs@2

# Dev dependencies
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/bcryptjs ts-node

# Setup
npx prisma generate
npx prisma db push
npx prisma db seed

# Run
npx next dev
```

### Cara 4: Gunakan Docker (Advanced)

Jika punya Docker:

```dockerfile
# Buat file Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

```bash
docker build -t toko-komputer .
docker run -p 3000:3000 toko-komputer
```

## 🔍 Debug npm Error

Untuk melihat error lengkap:

```bash
# Lihat npm log
cat ~/.npm/_logs/*-debug-0.log

# Atau di Windows
type %APPDATA%\npm-cache\_logs\*-debug-0.log
```

## ⚡ Quick Test

Coba ini untuk test apakah Next.js bisa jalan:

```bash
# Test langsung tanpa install
npx next@14 dev
```

Jika ini jalan, berarti masalahnya di package.json atau dependencies.

## 📞 Jika Masih Gagal

1. **Restart komputer** - Kadang npm cache perlu restart
2. **Disable antivirus** sementara
3. **Gunakan VPN** jika ada network blocking
4. **Update npm**: `npm install -g npm@latest`
5. **Reinstall Node.js** dari https://nodejs.org

---

**Rekomendasi saya: Gunakan Cara 1 (buat project baru dengan template)** - Ini paling aman dan pasti jalan!
