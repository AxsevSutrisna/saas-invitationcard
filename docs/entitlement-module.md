# Entitlement — Referensi Teknis

> Dokumen ini adalah referensi kode ringkas untuk sub-modul entitlement.
> Dokumentasi modul monetisasi menyeluruh ada di [`packet-bundling-management.md`](./packet-bundling-management.md).

Gating hak akses undangan kini **per-undangan**, bukan lagi "apakah user punya
langganan aktif". Sumber kebenaran: baris `Entitlement` yang menempel pada satu
`Invitation`.

## Peta data

```
Feature ──< PackageFeature >── Package ──< Entitlement >── Invitation
 (katalog)   (gating nyata)     (jualan)   (hak per-undangan)
```

- **Feature** — katalog fitur machine-readable. `type`: `BOOLEAN` (on/off) atau
  `QUOTA` (berangka, punya `limitValue`). Key dipakai di kode → lihat
  [`constants.js`](../src/features/entitlement/constants.js) (`FEATURE_KEYS`).
- **PackageFeature** — fitur apa yang dibawa sebuah paket + nilainya.
- **Package** — `kind` (PLAN/ADDON/BUNDLE) × `saleType` (ONE_TIME/SUBSCRIPTION/
  RESELLER). `features` (Json) = bullet marketing untuk tampilan; **gating nyata
  ada di PackageFeature**. `wholesalePrice` = harga grosir reseller.
- **Entitlement** — hak per-undangan. `featuresSnapshot` membekukan fitur+kuota
  saat hak diberikan (tahan perubahan paket). `source`: PURCHASE | SUBSCRIPTION |
  RESELLER | ADMIN.

## Alur resolusi fitur (`service.js`)

`getFeaturesForInvitation(invitation)`:
1. Entitlement AKTIF pada undangan → pakai `featuresSnapshot`.
2. _Fallback_ (undangan lama tanpa entitlement): langganan aktif pemilik →
   fitur paketnya (tidak ditulis, agar jalur baca murni).
3. FREE default ([`constants.js`](../src/features/entitlement/constants.js) `FREE_FEATURE_MAP`).

Saat undangan dibuat di bawah langganan aktif, entitlement SUBSCRIPTION
di-_mint_ otomatis (lihat `createInvitationAction`) + `quotaUsed` naik.

## Dikelola dari admin (tanpa deploy)

Dashboard → Admin → **Paket & Fitur** ([`PackageManager`](../src/features/admin/components/PackageManager.jsx)):
CRUD paket, atur harga/kuota/masa aktif, tugaskan fitur, kelola katalog fitur.
Server action di [`admin/actions.js`](../src/features/admin/actions.js) (bagian 7–9).

## Setelah mengubah schema — jalankan manual

```bash
npx prisma db push      # sinkron tabel baru + regenerasi client
npx prisma db seed      # katalog fitur + paket FREE/BASIC/PRO + penugasan fitur
```

## Fase 2 — SELESAI

- ✅ **Checkout eceran per-undangan.** `createCheckoutAction(packageId,
  { invitationId })` → `Transaction.invitationId` → webhook SUCCESS menerbitkan
  `Entitlement(PURCHASE)`; REFUNDED mencabut (`revokeEntitlementsByTransactionId`).
  UI: tombol "Upgrade undangan ini" ([`InvitationUpgradeButton`](../src/features/invitation/components/InvitationUpgradeButton.jsx)).
- ✅ **Reseller (kredit & alokasi).** AGENCY beli paket `saleType=RESELLER`
  (harga grosir × quantity) → webhook membuat batch `ResellerCredit`. Alokasi via
  [`allocateResellerCreditAction`](../src/features/reseller/actions.js) → `Entitlement(RESELLER)`
  terikat ke undangan klien + `quantityUsed++` (atomik). UI: `/dashboard/reseller`
  ([`ResellerClient`](../src/features/reseller/components/ResellerClient.jsx)), gated ability
  `reseller:access`.
- ✅ **Bundling & add-on.** `Package.kind` BUNDLE/ADDON. Bundle dirakit dari
  `BundleItem` di admin PackageManager; `getPackageFeatureMap` menggabung fitur
  seluruh item bundle. Add-on menumpuk karena `getFeaturesForInvitation`
  menggabung SEMUA entitlement aktif undangan (`mergeFeatureMaps`).

## Batasan yang masih ada

- **Kuota** ditegakkan dengan menghitung total undangan user vs `MAX_INVITATIONS`
  (sederhana; belum per-periode langganan).
- **Refund langganan** mencabut Subscription, tapi entitlement SUBSCRIPTION yang
  sudah di-mint tetap ACTIVE sampai `validUntil`.
- **Refund pembelian kredit reseller** tidak otomatis mencabut kredit (bisa sudah
  dialokasikan) — perlu peninjauan manual.
- **Bundle satu tingkat**: bundle tidak boleh memuat bundle lain (dicegah di UI &
  resolusi fitur hanya menggabung 1 level).
