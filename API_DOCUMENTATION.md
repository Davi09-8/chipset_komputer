# API Documentation - Chipset Computer E-Commerce

Dokumentasi lengkap untuk semua endpoint API backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

API menggunakan NextAuth.js dengan JWT strategy. Untuk endpoint yang memerlukan autentikasi, pastikan user sudah login.

### Login
```
POST /api/auth/signin
```

### Register
```
POST /api/register
```

---

## Admin API

Semua endpoint admin memerlukan role `ADMIN`.

### Products

#### List Products
```http
GET /api/admin/products?page=1&limit=10&search=intel&categoryId=xxx&isActive=true
```

**Query Parameters:**
- `page` (optional): Halaman, default 1
- `limit` (optional): Jumlah per halaman, default 10
- `search` (optional): Cari di name, description, SKU
- `categoryId` (optional): Filter by category
- `isActive` (optional): Filter by status (true/false)

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### Create Product
```http
POST /api/admin/products
```

**Body:**
```json
{
  "categoryId": "xxx",
  "name": "Intel Core i9-13900K",
  "slug": "intel-core-i9-13900k",
  "description": "Processor terbaru dari Intel",
  "price": 8500000,
  "stock": 10,
  "sku": "CPU-INTEL-I9-13900K",
  "images": ["url1", "url2"],
  "specifications": {
    "cores": 24,
    "threads": 32,
    "baseClock": "3.0 GHz"
  },
  "isActive": true
}
```

#### Get Product Detail
```http
GET /api/admin/products/:id
```

#### Update Product
```http
PUT /api/admin/products/:id
```

**Body:** Same as create (semua field optional)

#### Delete Product
```http
DELETE /api/admin/products/:id
```

---

### Categories

#### List Categories
```http
GET /api/admin/categories?includeInactive=false
```

#### Create Category
```http
POST /api/admin/categories
```

**Body:**
```json
{
  "name": "Processors",
  "slug": "processors",
  "description": "CPU dan Processor",
  "image": "url",
  "parentId": "xxx",
  "isActive": true
}
```

#### Get Category Detail
```http
GET /api/admin/categories/:id
```

#### Update Category
```http
PUT /api/admin/categories/:id
```

#### Delete Category
```http
DELETE /api/admin/categories/:id
```

---

### Orders

#### List Orders
```http
GET /api/admin/orders?page=1&limit=10&status=PENDING&paymentStatus=UNPAID&userId=xxx&search=ORD
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `paymentStatus`: UNPAID, PAID, REFUNDED
- `userId`: Filter by user
- `search`: Search order number, user name, user email

#### Get Order Detail
```http
GET /api/admin/orders/:id
```

#### Update Order
```http
PUT /api/admin/orders/:id
```

**Body:**
```json
{
  "status": "PROCESSING",
  "paymentStatus": "PAID",
  "notes": "Catatan admin"
}
```

---

### Users

#### List Users
```http
GET /api/admin/users?page=1&limit=10&search=john&role=CUSTOMER
```

#### Get User Detail
```http
GET /api/admin/users/:id
```

#### Update User Role
```http
PUT /api/admin/users/:id
```

**Body:**
```json
{
  "role": "ADMIN"
}
```

---

### Reviews

#### List Reviews
```http
GET /api/admin/reviews?page=1&limit=10&isApproved=false&productId=xxx
```

#### Approve/Reject Review
```http
PUT /api/admin/reviews/:id
```

**Body:**
```json
{
  "isApproved": true
}
```

#### Delete Review
```http
DELETE /api/admin/reviews/:id
```

---

### Dashboard Stats

#### Get Statistics
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "stats": {
    "totalUsers": 100,
    "totalProducts": 50,
    "totalCategories": 10,
    "totalOrders": 200,
    "pendingOrders": 15,
    "totalRevenue": 50000000,
    "pendingReviews": 5
  },
  "recentOrders": [...],
  "lowStockProducts": [...],
  "topSellingProducts": [...],
  "monthlyRevenue": {
    "Jan 2024": 5000000,
    "Feb 2024": 6000000
  }
}
```

---

## User API

### Products (Public)

#### List Products
```http
GET /api/products?page=1&limit=12&search=intel&categorySlug=processors&minPrice=1000000&maxPrice=10000000&sort=price_asc
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search in name, description
- `categoryId` or `categorySlug`: Filter by category
- `minPrice`, `maxPrice`: Price range
- `sort`: newest, oldest, price_asc, price_desc, name_asc, name_desc

**Response:**
```json
{
  "products": [
    {
      "id": "xxx",
      "name": "Intel Core i9",
      "slug": "intel-core-i9",
      "price": 8500000,
      "stock": 10,
      "images": "...",
      "category": {...},
      "averageRating": 4.5,
      "reviewCount": 10
    }
  ],
  "pagination": {...}
}
```

#### Get Product Detail
```http
GET /api/products/:slug
```

**Response:**
```json
{
  "product": {
    "id": "xxx",
    "name": "Intel Core i9",
    "images": ["url1", "url2"],
    "specifications": {...},
    "reviews": [...],
    "averageRating": 4.5,
    "reviewCount": 10,
    "relatedProducts": [...]
  }
}
```

---

### Categories (Public)

#### List Categories
```http
GET /api/categories?includeProducts=true
```

---

### Reviews

#### Get Product Reviews (Public)
```http
GET /api/reviews?productSlug=intel-core-i9&page=1&limit=10
```

**Response:**
```json
{
  "reviews": [...],
  "pagination": {...},
  "stats": {
    "averageRating": 4.5,
    "totalReviews": 50,
    "ratingDistribution": {
      "5": 30,
      "4": 15,
      "3": 3,
      "2": 1,
      "1": 1
    }
  }
}
```

#### Create Review (Auth Required)
```http
POST /api/reviews
```

**Body:**
```json
{
  "productId": "xxx",
  "rating": 5,
  "comment": "Produk sangat bagus!"
}
```

**Requirements:**
- User harus sudah membeli produk
- Satu review per user per produk
- Rating 1-5

---

### Orders (Auth Required)

#### List User Orders
```http
GET /api/orders?page=1&limit=10&status=PENDING
```

#### Get Order Detail
```http
GET /api/orders/:id
```

#### Create Order
```http
POST /api/orders
```

**Body:**
```json
{
  "name": "John Doe",
  "phone": "08123456789",
  "address": "Jl. Contoh No. 123",
  "city": "Jakarta",
  "postalCode": "12345",
  "paymentMethod": "TRANSFER",
  "notes": "Kirim pagi"
}
```

**Process:**
1. Validasi cart tidak kosong
2. Validasi stok produk
3. Buat order
4. Update stok produk
5. Clear cart

---

### Profile (Auth Required)

#### Get Profile
```http
GET /api/profile
```

#### Update Profile
```http
PUT /api/profile
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "currentPassword": "oldpass",
  "newPassword": "newpass",
  "image": "url"
}
```

---

## Error Responses

Semua error menggunakan format:

```json
{
  "error": "Pesan error dalam bahasa Indonesia"
}
```

**HTTP Status Codes:**
- `400` - Bad Request (validasi gagal)
- `401` - Unauthorized (belum login)
- `403` - Forbidden (tidak ada akses)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing dengan cURL

### Admin - Get Products
```bash
curl -X GET "http://localhost:3000/api/admin/products?page=1&limit=10" \
  -H "Cookie: your-session-cookie"
```

### User - Get Products
```bash
curl -X GET "http://localhost:3000/api/products?categorySlug=processors&sort=price_asc"
```

### Create Order
```bash
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "name": "John Doe",
    "phone": "08123456789",
    "address": "Jl. Contoh No. 123",
    "city": "Jakarta",
    "postalCode": "12345",
    "paymentMethod": "TRANSFER"
  }'
```

---

## Notes

- Semua endpoint yang memerlukan autentikasi akan return 401 jika belum login
- Admin endpoints akan return 403 jika user bukan admin
- Pagination default: page=1, limit=10 atau 12
- Semua pesan error dalam bahasa Indonesia
