# Packet & Bundling Management

Dokumentasi modul monetisasi IKARA: paket, fitur, entitlement, eceran, langganan,
reseller, dan bundling/add-on. Semua bersifat **data-driven** — harga, kuota,
masa aktif, dan fitur paket diatur dari panel admin tanpa deploy ulang.

> Status: **Fase 1 & 2 selesai & teruji** (25/25 integration test PASS).
> Referensi teknis ringkas ada di [`entitlement-module.md`](./entitlement-module.md).

---

## 1. Konsep inti

Gating hak akses undangan bersifat **per-undangan**, bukan per-user. Sumber
kebenaran adalah baris **`Entitlement`** yang menempel pada satu `Invitation`.
Ini menyatukan tiga model bisnis:

| Model | Cara jual | Hasil |
|---|---|---|
| **Eceran** | Pasangan bayar sekali untuk 1 undangan | `Entitlement(PURCHASE)` ke undangan itu |
| **Langganan (SaaS)** | User bayar berkala | `Subscription` → melahirkan `Entitlement(SUBSCRIPTION)` saat undangan dibuat |
| **Reseller** | Agency beli kredit grosir, alokasikan ke klien | Batch `ResellerCredit` → `Entitlement(RESELLER)` per undangan |

Di atas ketiganya: **Bundle** (gabungan beberapa paket/add-on) dan **Add-on**
(fitur tambahan yang menumpuk).

---

## 2. Model data (DB)

```
Feature ──<PackageFeature>── Package ──<Entitlement>── Invitation ──> User
  (katalog)   (gating nyata)    │  │        (hak per-undangan)
                                │  ├──<BundleItem>── (isi BUNDLE: item → Package)
                                │  └──<ResellerCredit>── (batch kredit milik AGENCY)
                                └── Subscription / Transaction
```

Model & perubahan kunci di [`prisma/schema.prisma`](../prisma/schema.prisma):

| Model | Peran | Field penting |
|---|---|---|
| `Package` | Produk yang dijual | `kind` (PLAN/ADDON/BUNDLE), `saleType` (ONE_TIME/SUBSCRIPTION/RESELLER), `price`, `wholesalePrice`, `maxInvitations`, `durationDays`, `features` (bullet marketing), `isHighlighted` |
| `Feature` | Katalog fitur machine-readable | `key` (unik), `type` (BOOLEAN/QUOTA), `unit` |
| `PackageFeature` | Fitur apa yang dibawa paket | `enabled` (BOOLEAN), `limitValue` (QUOTA, `null`=unlimited) |
| `Entitlement` | Hak akses per-undangan | `invitationId`, `ownerUserId`, `source`, `status`, `validUntil`, `featuresSnapshot` (Json) |
| `BundleItem` | Isi sebuah BUNDLE | `bundleId`, `itemId`, `quantity` |
| `ResellerCredit` | Saldo lisensi AGENCY | `agencyUserId`, `packageId`, `quantityTotal`, `quantityUsed` |
| `Transaction` | Pembayaran Midtrans | + `invitationId` (eceran), + `quantity` (reseller) |

Enum: `PackageKind`, `SaleType`, `FeatureType`, `EntitlementSource`
(PURCHASE/SUBSCRIPTION/RESELLER/ADMIN), `EntitlementStatus` (ACTIVE/EXPIRED/REVOKED).
Enum lama `PackageType` dihapus (diganti `SaleType`).

### Katalog fitur ter-seed (13)

`NO_WATERMARK`, `PREMIUM_THEME`, `DIGITAL_ENVELOPE`, `RSVP`, `QR_CHECKIN`,
`GUEST_BOOK`, `LIVE_STREAM`, `BACKGROUND_MUSIC`, `LOVE_STORY`, `CUSTOM_DOMAIN`
(BOOLEAN); `MAX_INVITATIONS`, `MAX_GUESTS`, `MAX_PHOTOS` (QUOTA).

### Paket ter-seed (6)

| Paket | kind / saleType | harga | grosir |
|---|---|---|---|
| FREE | PLAN / ONE_TIME | 0 | — |
| BASIC | PLAN / ONE_TIME | 99.000 | — |
| PRO | PLAN / SUBSCRIPTION | 199.000 | — |
| Vendor Pack | PLAN / RESELLER | 150.000 | 99.000 |
| Add-on Domain Kustom | ADDON / ONE_TIME | 50.000 | — |
| Paket Komplit | BUNDLE / ONE_TIME | 129.000 | isi: BASIC + Add-on Domain |

---

## 3. Resolusi fitur (gating)

Fungsi inti di [`src/features/entitlement/`](../src/features/entitlement/):

- **`buildFeatureMap(packageFeatures)`** → peta `{ key: boolean|number|null }`.
- **`mergeFeatureMaps(...maps)`** → gabung: BOOLEAN pakai **OR**, QUOTA ambil
  **terbesar** (`null`/unlimited menang). Dipakai untuk BUNDLE & add-on stacking.
- **`getQuota(map, key)`** → angka; `Infinity` jika unlimited; `0` jika tak diberi.
- **`hasFeature(map, key)`** → cek BOOLEAN.

**`getFeaturesForInvitation(invitation)`** (sisi baca gating):
1. Gabung **semua** `Entitlement` ACTIVE undangan (add-on menumpuk) → `featuresSnapshot`.
2. _Fallback_ undangan lama: fitur dari langganan aktif pemilik (read-only).
3. FREE default.

**`getPackageFeatureMap(packageId)`**: untuk BUNDLE, gabung fitur paket + seluruh
item bundle.

Pemakaian gating:
- Halaman publik [`src/app/[slug]/page.jsx`](../src/app/%5Bslug%5D/page.jsx):
  watermark off bila `NO_WATERMARK`.
- Buat/edit undangan [`src/features/invitation/actions.js`](../src/features/invitation/actions.js):
  tema premium butuh `PREMIUM_THEME`; kuota pakai `MAX_INVITATIONS`.

---

## 4. Alur per model (BE)

### Eceran
1. FE [`InvitationUpgradeButton`](../src/features/invitation/components/InvitationUpgradeButton.jsx)
   → `createCheckoutAction(packageId, { invitationId })`.
2. `Transaction` dibuat dengan `invitationId`; Midtrans Snap popup.
3. [Webhook](../src/app/api/v1/payments/webhook/route.js) SUCCESS → `grantEntitlementFromPackage(source: PURCHASE)`.
4. REFUNDED → `revokeEntitlementsByTransactionId`.

### Langganan (SaaS)
1. [`SubscriptionClient`](../src/features/subscription/components/SubscriptionClient.jsx)
   → `createCheckoutAction(packageId)`.
2. Webhook SUCCESS → `upsertActiveSubscription`.
3. Saat undangan dibuat di bawah langganan → `mintEntitlementFromSubscription` +
   `incrementSubscriptionQuota`.

### Reseller
1. [`ResellerClient`](../src/features/reseller/components/ResellerClient.jsx) (`/dashboard/reseller`)
   → `createCheckoutAction(packageId, { quantity })` (paket `saleType=RESELLER`,
   harga grosir × qty, hanya AGENCY).
2. Webhook SUCCESS → `createResellerCredit` (batch kredit).
3. Alokasi → `allocateResellerCreditAction({ invitationId, packageId })`:
   dalam satu transaksi, `quantityUsed++` + buat `Entitlement(RESELLER)`.

### Bundling & Add-on
- Admin merakit BUNDLE via bundle-builder di
  [`PackageManager`](../src/features/admin/components/PackageManager.jsx)
  (→ `BundleItem`).
- Fitur bundle digabung otomatis saat gating. Add-on menumpuk karena resolusi
  menggabung semua entitlement aktif.

---

## 5. Admin & akses

- **Dashboard → Admin → Paket & Fitur** (SUPER_ADMIN): CRUD paket (termasuk
  bundle-builder), CRUD katalog fitur, penugasan fitur per paket, grant
  entitlement manual. Aksi di [`src/features/admin/actions.js`](../src/features/admin/actions.js) (bagian 7–9).
- **Dashboard → Reseller** (AGENCY): ability `reseller:access` di
  [`src/lib/ability.js`](../src/lib/ability.js). Link sidebar muncul untuk agency.

---

## 6. Peta file (ringkas)

| Layer | File |
|---|---|
| DB | `prisma/schema.prisma`, `prisma/seed.js` |
| Entitlement | `src/features/entitlement/{constants,featureMap,repository,service}.js` |
| Reseller | `src/features/reseller/{repository,actions}.js`, `components/ResellerClient.jsx`, `src/app/dashboard/reseller/page.jsx` |
| Payment | `src/features/payment/{actions,repository}.js`, `src/app/api/v1/payments/webhook/route.js` |
| Admin | `src/features/admin/actions.js`, `components/PackageManager.jsx` |
| Invitation/FE | `src/features/invitation/{actions,repository}.js`, `components/InvitationUpgradeButton.jsx`, `src/app/dashboard/page.jsx` |
| Gating publik | `src/app/[slug]/page.jsx` |
| Nav/route | `src/components/layout/Sidebar.jsx`, `src/constants/routes.js` |

---

## 7. Perintah migrasi (jalankan manual)

```bash
npx prisma db push      # sinkron schema ke DB
npx prisma generate     # regenerasi Prisma Client (output custom src/generated/prisma)
npx prisma db seed      # katalog fitur + paket + penugasan + bundle items
```

> `db push` **tidak** otomatis regenerasi client ke output custom di repo ini →
> selalu jalankan `prisma generate` setelahnya.

---

## 8. Testing

### Integration / E2E (tanpa browser, tanpa Midtrans live)

```bash
node -r dotenv/config scripts/e2e-packet-bundling.cjs
```

[`scripts/e2e-packet-bundling.cjs`](../scripts/e2e-packet-bundling.cjs)
menjalankan seluruh alur modul langsung ke database dalam **satu transaksi yang
di-rollback** (tanpa residu). Cakupan (25 assertion):

- Integritas seed (6 paket, bundle 2 item, vendor reseller, add-on).
- Resolusi fitur BASIC/FREE + kuota.
- Merge BUNDLE (mewarisi fitur item).
- Eceran: beli 1 undangan → premium; undangan lain tidak ikut.
- Add-on stacking.
- Refund eceran (revoke by transactionId).
- Reseller: alokasi kredit, habisnya kredit, `quantityUsed`, entitlement RESELLER.
- Kuota FREE (MAX_INVITATIONS).

**Hasil terakhir: 25/25 PASS.**

> Catatan: helper resolusi fitur di skrip test mencerminkan
> `src/features/entitlement/featureMap.js` (direplikasi karena modul app memakai
> import ESM beralias `@/` + `server-only`). Yang belum tercakup otomatis:
> round-trip pembayaran Midtrans sandbox dan rendering FE di browser — uji ini
> dilakukan manual dengan menjalankan aplikasi.

### Test payment gateway (Midtrans)

```bash
node -r dotenv/config scripts/test-midtrans-payment.cjs
```

[`scripts/test-midtrans-payment.cjs`](../scripts/test-midtrans-payment.cjs)
menguji integrasi Midtrans (15 assertion):

- **Offline**: verifikasi signature webhook (SHA-512; valid diterima, diubah/acak
  ditolak) + pemetaan status Midtrans → internal.
- **Live (sandbox)**: `createSnapTransaction` nyata ke Midtrans Sandbox untuk
  **eceran (BASIC)**, **bundle (Paket Komplit)**, dan **reseller (Vendor ×3,
  harga grosir)** → mengembalikan Snap `token` + `redirect_url`; lalu Get Status
  membuktikan endpoint re-verifikasi terjangkau & ter-autentikasi.
- Mode **production otomatis dilewati** untuk uji live (tidak membuat order nyata).

**Hasil terakhir: 15/15 PASS** (SANDBOX). Belum tercakup otomatis: round-trip
pembayaran sungguhan (user bayar di Snap → Midtrans kirim webhook → entitlement
terbit) — perlu app jalan + URL webhook publik; lihat verifikasi manual di bawah.

### Verifikasi manual yang disarankan
1. Jalankan app; sebagai user biasa, buka Dashboard → kartu undangan non-premium
   → "Upgrade undangan ini" → bayar via Midtrans sandbox → cek badge "Premium".
2. Sebagai AGENCY, buka `/dashboard/reseller` → beli kredit → alokasikan.
3. Sebagai SUPER_ADMIN, buka Admin → Paket & Fitur → buat BUNDLE & ADDON.
4. **Round-trip webhook**: agar notifikasi Midtrans sampai ke
   `/api/v1/payments/webhook`, ekspos app ke URL publik (mis. `ngrok`) lalu set
   URL itu di **Midtrans Dashboard → Settings → Configuration → Payment
   Notification URL**. Selesaikan pembayaran dengan kartu uji sandbox
   (mis. `4811 1111 1111 1114`) atau pakai **Transaction Simulator** Midtrans;
   verifikasi transaksi jadi `SUCCESS` dan entitlement/langganan/kredit terbit.

---

## 9. Batasan yang diketahui

- Kuota ditegakkan dari **total undangan** user vs `MAX_INVITATIONS` (belum
  per-periode langganan).
- Refund langganan mencabut `Subscription`, tetapi `Entitlement(SUBSCRIPTION)`
  yang sudah di-mint tetap aktif s.d. `validUntil`.
- Refund pembelian kredit reseller **tidak** otomatis mencabut kredit (mungkin
  sudah dialokasikan) → peninjauan manual.
- Bundle dibatasi **satu tingkat** (bundle tidak boleh memuat bundle lain).

---

## 10. Changelog

- **Fase 1** — Schema (Feature/PackageFeature/Entitlement/BundleItem + Package
  diperluas), gating per-undangan, penegakan kuota, admin CRUD paket & fitur,
  seed FREE/BASIC/PRO.
- **Fase 2** — Checkout eceran per-undangan; reseller (ResellerCredit +
  Transaction.quantity + checkout + webhook + alokasi + dashboard); bundling &
  add-on (BundleItem builder + merge fitur + stacking); seed Vendor/Add-on/Bundle.
