# NDBotics — Supplier Dashboard + Cart + Checkout + Invoice + WhatsApp (MVP)

Stack: **Next.js (App Router) + Prisma + PostgreSQL**

## Fitur (MVP)
- Produk gabungan dari sumber:
  - Ichibot (WooCommerce Store API)
  - Tokopedia (opsional via Apify / atau import URL manual)
- Admin:
  - Sync Ichibot
  - Sync Tokopedia via Apify (opsional)
  - Edit harga jual (override)
  - Lihat order & ubah status
  - Setting bank & WhatsApp
- User:
  - List produk + search
  - Cart (session cookie)
  - Checkout → auto buat Invoice
  - Tombol WhatsApp: kirim bukti transfer (template sudah terisi)

---

## 1) Cara jalanin
### Prasyarat
- Node.js 18+
- PostgreSQL (mis. Supabase / Neon / Railway / lokal)

### Install
```bash
npm i
```

### Environment
Copy `.env.example` → `.env` lalu isi `DATABASE_URL`.

### Prisma migrate
```bash
npx prisma migrate dev
npx prisma db seed
```

### Run dev
```bash
npm run dev
```

Buka:
- User shop: http://localhost:3000
- Admin: http://localhost:3000/admin

> Admin sederhana ini belum memakai auth. Untuk production, tambahkan login.

---

## 2) Sync produk
- Ichibot: `/admin/sync` → klik "Sync Ichibot"
- Tokopedia:
  - Opsi A: import URL manual di `/admin/import-tokopedia` (isi nama + URL + foto + harga sumber)
  - Opsi B: Apify (isi `APIFY_TOKEN`), lalu "Sync Tokopedia (Apify)"

---

## 3) Pembayaran & WhatsApp
Invoice menampilkan:
- **Bank BRI**
- **6942 0102 9298 534**
- **M NABIL KHAIRI IKHSAN**
WhatsApp supplier:
- **6285346567107**

---

## Catatan
- Tokopedia itu dinamis dan sering anti-bot, jadi untuk MVP disarankan import URL/manual atau memakai scraper service seperti Apify.
