# 🧶 Uphaar – Premium Handmade Crochet Gifts

A production-ready, mobile-first e-commerce platform for the Uphaar crochet brand.

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.

---

## ✨ Features

### Storefront
- 🏠 Beautiful homepage with hero, featured products, process story, testimonials
- 🛍️ Product listing with category filters & sort
- 🔍 Product detail with image gallery, variants, custom message
- 🛒 Cart drawer with real-time updates
- 📦 Guest checkout (no login required)
- ✅ Order confirmation page

### Admin Panel (`/admin`)
- 📊 Dashboard with revenue, orders, top products stats
- 📦 Product CRUD with image upload (Cloudinary)
- 📋 Order management with status updates
- 📈 Analytics with revenue chart

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14, TypeScript, Tailwind  |
| Backend     | Next.js API Routes                |
| Database    | PostgreSQL (Neon/Supabase)        |
| ORM         | Prisma                            |
| Auth        | JWT (jose) + HTTP-only cookies    |
| Images      | Cloudinary                        |
| State       | Zustand (cart)                    |
| Deployment  | Vercel + Neon                     |

---

## 🚀 Quick Setup Guide

### 1. Clone & Install

```bash
git clone <your-repo>
cd uphaar
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
JWT_SECRET="your_secret_32chars_minimum"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup Database (Neon – Free)

1. Go to [neon.tech](https://neon.tech) → Create account → New project
2. Copy the connection string to `DATABASE_URL` in `.env`

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Database (Demo Data)

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@uphaar.com` / `admin123`
- 6 sample products
- 4 testimonials

### 5. Setup Cloudinary (Free)

1. Go to [cloudinary.com](https://cloudinary.com) → Free account
2. Copy Cloud Name, API Key, API Secret to `.env`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🌐 Deploy to Vercel (Free)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/uphaar.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Add all environment variables from `.env`
4. Click **Deploy**

### Step 3: Run Prisma Migrations on Production

After first deploy, in Vercel dashboard → Functions → Run:

```bash
npx prisma db push
npx prisma db seed
```

Or use Vercel CLI:
```bash
npx vercel env pull
npx prisma db push
```

---

## 📁 Project Structure

```
uphaar/
├── app/
│   ├── (store)/              # Public storefront
│   │   ├── page.tsx          # Homepage
│   │   ├── products/         # Product listing + detail
│   │   ├── checkout/         # Checkout page
│   │   └── order-confirmation/
│   ├── (admin)/admin/        # Admin panel
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # Product management
│   │   ├── orders/           # Order management
│   │   ├── analytics/        # Analytics
│   │   └── login/            # Admin login
│   ├── api/                  # API routes
│   │   ├── products/
│   │   ├── orders/
│   │   ├── upload/
│   │   └── admin/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/               # Header, Footer, Hero etc.
│   ├── product/              # ProductCard, CartDrawer, etc.
│   └── ui/                   # ProductFormModal, etc.
├── hooks/
│   └── useCart.ts            # Zustand cart store
├── lib/
│   ├── db/prisma.ts          # DB client
│   └── utils/                # Helpers, auth, cloudinary
├── prisma/
│   ├── schema.prisma         # DB schema
│   └── seed.ts               # Demo data
├── types/
│   └── index.ts              # TypeScript types
└── middleware.ts             # Admin route protection
```

---

## 🔐 Admin Access

| Field    | Value                |
|----------|----------------------|
| URL      | `/admin`             |
| Email    | `admin@uphaar.com`   |
| Password | `admin123`           |

> ⚠️ Change the password in production via Prisma Studio or by updating the seed.

---

## 🎨 Colour Palette

| Name    | Hex       |
|---------|-----------|
| Cream   | `#F5EFE6` |
| Beige   | `#EDE0D0` |
| Brown   | `#8B5E3C` |
| Blush   | `#E8CFC5` |
| Gold    | `#C9A96E` |

---

## 🔧 Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:push      # Push schema to DB
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio (DB GUI)
```

---

## 📦 Deployment Checklist

- [ ] Set all env variables in Vercel
- [ ] Run `prisma db push` on production DB
- [ ] Run seed for initial data
- [ ] Change admin password
- [ ] Set `NEXT_PUBLIC_APP_URL` to your live domain
- [ ] Add Cloudinary upload preset (optional)
- [ ] Test checkout flow end-to-end

---

## 🤝 Custom Orders

The checkout supports a **notes field** for custom order instructions. Customers can also add custom messages per product on the product detail page.

---

Made with 🧶 by Uphaar
