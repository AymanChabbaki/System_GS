# 📦 API Routes Documentation — Gestion de Stock

**Base URL:** `http://localhost:5000/api`

**Authentication:** All protected routes require a `Bearer` token in the `Authorization` header.

```
Authorization: Bearer <your_jwt_token>
```

**Roles:**
| Role | Description |
|------|-------------|
| `admin` | Full access to all endpoints |
| `employee` | Read + stock movement creation only |

---

## 🔐 Authentication

### `POST /api/auth/login`
Login and receive a JWT token.

**Access:** Public

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@stock-gs.ma",
    "role": "admin"
  }
}
```

---

### `GET /api/auth/me`
Get the currently authenticated user's profile.

**Access:** Any authenticated user

**Response `200`:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@stock-gs.ma",
    "role": "admin",
    "is_active": 1,
    "created_at": "2025-01-01T10:00:00.000Z"
  }
}
```

---

## 📋 Products

### `GET /api/products`
List all products with optional filters.

**Access:** Any authenticated user

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name or description |
| `category_id` | integer | Filter by category |
| `supplier_id` | integer | Filter by supplier |
| `low_stock` | boolean | `true` to only show products at/below threshold |

---

### `GET /api/products/alerts`
Get all products at or below minimum stock threshold.

**Access:** Any authenticated user

**Response `200`:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 5,
      "name": "Hot Wheels Pack",
      "quantity": 2,
      "min_stock_threshold": 5,
      "category_name": "Voitures",
      "supplier_name": "MattelMA"
    }
  ]
}
```

---

### `GET /api/products/:id`
Get a single product by ID.

**Access:** Any authenticated user

---

### `POST /api/products`
Create a new product with optional image upload.

**Access:** Any authenticated user

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `name` | string | YES |
| `description` | string | no |
| `purchase_price` | number | YES |
| `sale_price` | number | YES |
| `quantity` | integer | YES |
| `min_stock_threshold` | integer | YES |
| `category_id` | integer | no |
| `supplier_id` | integer | no |
| `image` | file | no (max 5MB) |

**Response `201`:**
```json
{ "success": true, "message": "Product created successfully.", "data": { "id": 7 } }
```

---

### `PUT /api/products/:id`
Update an existing product.

**Access:** Any authenticated user

**Content-Type:** `multipart/form-data` (same fields as POST)

---

### `DELETE /api/products/:id`
Delete a product and its image.

**Access:** ADMIN ONLY

---

## 🏷️ Categories

### `GET /api/categories`
List all categories with product count.

**Access:** Any authenticated user

### `GET /api/categories/:id`
Get a single category.

**Access:** Any authenticated user

### `POST /api/categories`
Create a new category.

**Access:** Any authenticated user

**Request Body:**
```json
{ "name": "Jeux de Société", "description": "Board games for all ages" }
```

### `PUT /api/categories/:id`
Update a category.

**Access:** Any authenticated user

### `DELETE /api/categories/:id`
Delete a category (only if no products are associated).

**Access:** ADMIN ONLY

---

## 📦 Stock Movements

### `GET /api/movements`
List all movements.

**Access:** Any authenticated user

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | `entry` or `exit` | Filter by type |
| `product_id` | integer | Filter by product |
| `user_id` | integer | Filter by user |
| `date_from` | YYYY-MM-DD | Start date |
| `date_to` | YYYY-MM-DD | End date |

### `GET /api/movements/:id`
Get a single movement.

**Access:** Any authenticated user

### `POST /api/movements`
Record a stock entry or exit. Automatically updates product quantity.

**Access:** Any authenticated user

**Request Body:**
```json
{
  "product_id": 3,
  "type": "entry",
  "quantity": 20,
  "reason": "Livraison fournisseur ToyWorld"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Stock entry recorded successfully.",
  "data": {
    "movement_id": 48,
    "product_id": 3,
    "product_name": "LEGO City Set",
    "type": "entry",
    "quantity_moved": 20,
    "new_quantity": 32
  }
}
```

**Response `400`:** Insufficient stock for exit operations.

---

## 🏭 Suppliers

### `GET /api/suppliers`
List all suppliers.

**Access:** Any authenticated user

**Query Parameters:** `search` (by name or email)

### `GET /api/suppliers/:id`
Get a supplier with their product list.

**Access:** Any authenticated user

### `POST /api/suppliers`
Add a new supplier.

**Access:** Any authenticated user

**Request Body:**
```json
{
  "name": "MattelMA",
  "phone": "+212611223344",
  "email": "ma@mattel.com",
  "address": "Rabat, Maroc"
}
```

### `PUT /api/suppliers/:id`
Update a supplier.

**Access:** Any authenticated user

### `DELETE /api/suppliers/:id`
Delete a supplier.

**Access:** ADMIN ONLY

---

## 👤 Users — Admin Only

All user management endpoints require admin role.

### `GET /api/users`
List all users (passwords excluded).

### `GET /api/users/:id`
Get a single user.

### `POST /api/users`
Create a new user account.

**Request Body:**
```json
{
  "username": "employee2",
  "email": "emp2@stock-gs.ma",
  "password": "SecurePass123",
  "role": "employee"
}
```

### `PUT /api/users/:id`
Update user info (optionally reset password by including `password` field).

### `PATCH /api/users/:id/status`
Activate or deactivate an account.

**Request Body:**
```json
{ "is_active": false }
```

### `DELETE /api/users/:id`
Delete a user (cannot delete your own account).

---

## 📊 Dashboard

### `GET /api/dashboard/stats`
Aggregated KPIs, chart data, and summaries in a single call.

**Access:** Any authenticated user

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_products": 48,
      "total_stock_value": 24500.00,
      "low_stock_count": 5,
      "total_categories": 9,
      "total_suppliers": 6
    },
    "movement_chart": [
      { "date": "2025-04-01", "total_entries": 120, "total_exits": 75 }
    ],
    "recent_movements": [...],
    "top_products": [
      { "id": 3, "name": "LEGO City Set", "total_moved": 450 }
    ],
    "low_stock_products": [
      { "id": 5, "name": "Hot Wheels Pack", "quantity": 2, "min_stock_threshold": 5 }
    ]
  }
}
```

---

## Error Response Format

```json
{ "success": false, "message": "Description of the error" }
```

| Code | Meaning |
|------|---------|
| `400` | Bad Request |
| `401` | Unauthorized — Missing or invalid token |
| `403` | Forbidden — Admin role required |
| `404` | Not Found |
| `409` | Conflict — Duplicate or FK constraint |
| `413` | File too large |
| `422` | Validation errors |
| `500` | Internal Server Error |

---

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with DB credentials
mysql -u root -p < src/models/db.sql
npm run dev
```

Default admin: **username** `admin` / **password** `Admin@123`
