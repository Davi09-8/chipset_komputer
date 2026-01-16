# 🖥️ Chipset Computer - E-Commerce Next.js Fullstack

Sistem e-commerce fullstack untuk penjualan chipset dan komputer menggunakan Next.js 14, TypeScript, Prisma, dan NextAuth.

## 🚀 Fitur Utama

### Untuk Pengunjung
- ✅ Browse katalog produk
- ✅ Pencarian dan filter produk
- ✅ Lihat detail produk dan spesifikasi

### Untuk Customer
- ✅ Registrasi dan login
- ✅ Keranjang belanja
- ✅ Checkout dan pembayaran
- ✅ Riwayat pesanan
- ✅ Ulasan produk
- ✅ Manajemen profil

### Untuk Admin
- ✅ Dashboard dengan statistik
- ✅ Manajemen kategori (CRUD)
- ✅ Manajemen produk (CRUD)
- ✅ Manajemen pesanan
- ✅ Update status pesanan
- ✅ Laporan penjualan

## 📋 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL / SQLite
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form**: React Hook Form + Zod
- **Deployment**: Vercel (recommended)

## 🛠️ Setup & Instalasi

### Prasyarat
- Node.js 18+ 
- npm atau yarn
- PostgreSQL (atau gunakan SQLite untuk development)

### Langkah Instalasi

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Database**

Untuk PostgreSQL, buat file `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/toko_komputer"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Untuk SQLite (development), gunakan:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. **Setup Prisma Schema**

Buat file `prisma/schema.prisma` (lihat dokumentasi lengkap di implementation_plan.md)

4. **Generate Prisma Client**
```bash
npx prisma generate
```

5. **Push Schema ke Database**
```bash
npx prisma db push
```

6. **Seed Database** (opsional)
```bash
npx prisma db seed
```

7. **Run Development Server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Proyek

```
toko-komputer/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeder
├── public/                    # Static files
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (shop)/           # Shop pages group
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── orders/
│   │   ├── admin/            # Admin pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   └── orders/
│   │   ├── api/              # API Routes
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   └── orders/
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── layout/
│   │   ├── products/
│   │   ├── cart/
│   │   └── admin/
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # Auth config
│   │   └── validations.ts    # Zod schemas
│   ├── actions/              # Server Actions
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   └── types/                # TypeScript types
├── .env                      # Environment variables
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## 🎨 Development Guide

### 1. Membuat Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // atau "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  carts     Cart[]
  orders    Order[]
  reviews   Review[]
}

enum Role {
  ADMIN
  CUSTOMER
}

// ... model lainnya (Category, Product, Cart, Order, dll)
```

### 2. Membuat API Routes

Contoh `src/app/api/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  
  const products = await prisma.product.findMany({
    where: category ? { category: { slug: category } } : {},
    include: { category: true },
  });
  
  return NextResponse.json(products);
}
```

### 3. Membuat Server Actions

Contoh `src/actions/products.ts`:

```typescript
'use server';

import { prisma } from '@/lib/prisma';

export async function getProducts(filters?: {
  category?: string;
  search?: string;
}) {
  return await prisma.product.findMany({
    where: {
      ...(filters?.category && { 
        category: { slug: filters.category } 
      }),
      ...(filters?.search && {
        name: { contains: filters.search, mode: 'insensitive' }
      }),
    },
    include: { category: true },
  });
}
```

### 4. Membuat Components

Contoh `src/components/products/ProductCard.tsx`:

```typescript
import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        <span className="text-6xl">💻</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-lg font-bold text-indigo-600">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <Link 
          href={`/products/${product.slug}`}
          className="mt-4 block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
```

## 🔐 Authentication

Setup NextAuth di `src/lib/auth.ts`:

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        
        if (!user) return null;
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        
        if (!isValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
```

## 📊 Database Seeding

Buat `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password', 10),
      role: 'ADMIN',
    },
  });

  // Create categories
  const processor = await prisma.category.create({
    data: {
      name: 'Processor',
      slug: 'processor',
      description: 'CPU dan Processor untuk komputer',
    },
  });

  // Create products
  await prisma.product.create({
    data: {
      categoryId: processor.id,
      name: 'Intel Core i9-13900K',
      slug: 'intel-core-i9-13900k',
      description: 'Processor Intel Core i9 Generasi ke-13',
      price: 8500000,
      stock: 15,
      sku: 'CPU-INTEL-I9-13900K',
      specifications: {
        cores: '24',
        threads: '32',
        baseClock: '3.0 GHz',
        boostClock: '5.8 GHz',
      },
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy!

### Self-Hosted

```bash
npm run build
npm start
```

## 📝 TODO

Untuk melanjutkan development, ikuti urutan ini:

1. ✅ Setup konfigurasi dasar (DONE)
2. ⏳ Buat Prisma schema lengkap
3. ⏳ Setup NextAuth
4. ⏳ Buat API routes
5. ⏳ Buat server actions
6. ⏳ Buat components
7. ⏳ Buat pages
8. ⏳ Testing & debugging

## 📞 Support

Untuk bantuan lebih lanjut, lihat:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

Proyek ini dibuat untuk keperluan akademik.
