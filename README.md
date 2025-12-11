# lastseen

# 🛍️ Next.js Ecommerce Website (In Progress)

An ecommerce web application built using **Next.js 14 (App Router)**, **TypeScript**, **NextAuth**, and **Prisma**.  
Currently supports seller and customer roles with authentication and basic product management.

---

## 🚀 Tech Stack

| Category | Tools |
|---------|------|
| Framework | Next.js 14 with App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Authentication | NextAuth (Credentials Provider + JWT) |
| Database | Prisma + SQLite (dev environment) |
| Security | Password hashing with bcrypt |

---

## ✔️ Features Completed

### 🧾 Project Setup
- Next.js setup with TypeScript & Tailwind
- Prisma configured with SQLite database

### 👥 User Roles & Authentication
- Role-based auth using NextAuth: **SELLER** & **CUSTOMER**
- Login page common for both roles
- Separate signup pages:
  - `/signup/customer`
  - `/signup/seller`
- Passwords stored securely using bcrypt hashing
- Role stored in JWT token & session

### 🧑‍💼 Seller Features
- Protected Seller Dashboard (`/seller/dashboard`)
- Only users with role **SELLER** can access seller pages
- Seller can:
  - ➕ Add products
  - ✏️ Edit existing products
  - ❌ Delete products
  - 🏷️ Add optional discount
- CRUD API routes with authorization checks

### 🛒 Customer Features
- Home page (`/`) shows:
  - All products created by sellers
  - Seller information
  - Price + Discount calculations
- Simple product listing UI

---

## 📌 Prisma Data Models

Models included:
- `User` (Seller / Customer roles)
- `Product`
- `Role` enum

---

## 🛒 Cart & Order Management – Newly Added

Customers can add products to cart

Cart stored in database (CartItem model)

View cart page: /cart

Shows products, quantities, computed pricing (with discount)

Remove from cart option

Checkout system implemented

Creates order records via /api/order/create

Transfers items from cart → Order + OrderItem tables

Stores snapshot price at the moment of purchase

Clears cart after successful order

Order Status workflow ready (currently defaults to PENDING)

Status enum: PENDING, PAID, SHIPPED, DELIVERED, CANCELLED

## 🛣️ Project Structure (Important Folders)

