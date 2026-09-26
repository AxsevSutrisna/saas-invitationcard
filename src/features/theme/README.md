# Sistem Tema Undangan (IKARA)

Panduan menambah & memelihara template undangan. Ditujukan untuk developer.

## Arsitektur singkat

Satu tema hidup di **beberapa sumber yang saling terpisah tugasnya**:

| Sumber | Isi | Dikelola oleh |
|---|---|---|
| **DB `Theme`** (`prisma/schema.prisma`, `prisma/seed.js`) | Data bisnis: `name`, `slug`, `description`, `category`, `thumbnailUrl`, `isPremium`, `isActive`, `sortOrder` | Admin CMS / seed |
| **`theme-config.js`** → `THEME_CONFIG[slug]` | Konfigurasi VISUAL: `renderer`, `accent`, `fonts`, `frame`, `divider`, `particle`, `bankCard`, `hero`, `layout`, `copy`, `cover`, `preview` | Developer (kode) |
| **`theme-catalog.js`** | Metadata KATALOG: daftar kategori + gaya badge/gradient per kategori | Developer (kode) |
| **`components/ThemeRegistry.jsx`** → `RENDERERS` | Peta `renderer` → komponen React | Developer (kode) |

Alur render: `[slug]/page.jsx` → `PublicInvitationClient` → `ThemeRegistry` membaca `invitation.theme.slug` → ambil `THEME_CONFIG[slug]` → pilih komponen via `RENDERERS[config.renderer]`.

**Kunci penting:** `slug` harus SAMA persis di DB, sebagai key `THEME_CONFIG`, dan (untuk komponen desain sendiri) di panggilan `getThemeConfig("<slug>")` internalnya.

## Renderer yang tersedia

| `renderer` | Komponen | Dipakai tema |
|---|---|---|
| `traditional` | `layouts/TraditionalLayout` (config-driven) | classic-elegance, floral-blossom, floral-blue |
| `modern` | `designs/modern-minimalist` | modern-minimalist |
| `nature` | `designs/nature-harmony` | nature-harmony |

---

## Skenario A — tema baru memakai layout yang sudah ada (paling mudah)

Kalau tema baru hanya beda warna/font/copy tapi struktur sama dengan gaya "traditional", **cukup 2 langkah, tanpa menyentuh ThemeRegistry**:

1. **Tambah row DB** (via Admin CMS: Dashboard → Admin → Tema, ATAU tambah di `prisma/seed.js` lalu `npx prisma db seed`). Wajib: `slug` unik, `category`, `isPremium`.
2. **Tambah entri `THEME_CONFIG["<slug>"]`** di `theme-config.js` dengan `renderer: "traditional"` + `accent`, `fonts`, `frame`, `bankCard`, `hero`, `layout`, `copy`, `cover`, `preview` (salin dari tema traditional terdekat lalu sesuaikan).

Selesai. Kategori & badge muncul otomatis (dari `theme-catalog.js`), dan ThemeRegistry memilih renderer otomatis.

## Skenario B — tema baru dengan LAYOUT baru

1–2. Sama seperti Skenario A, tapi `renderer: "<kunci-baru>"` di `THEME_CONFIG`.
3. **Buat komponen desain** di `src/features/theme/designs/<nama>.jsx`, ekspor komponennya (mis. `export function LuxuryDarkTheme(...)`). Ambil config lewat `getThemeConfig("<slug>")`.
4. **Daftarkan di `ThemeRegistry.jsx`**: tambahkan `"<kunci-baru>": LuxuryDarkTheme` ke objek `RENDERERS` + import komponennya.

## Menambah kategori baru

Kategori bersifat kurasi (dropdown di form admin). Untuk menambah (mis. "Sunda", "Islamic"):

1. Tambahkan nama kategori ke `THEME_CATEGORIES` di `theme-catalog.js`.
2. Tambahkan gaya-nya di `CATEGORY_STYLE` (badge + gradient). Pakai `GOLD_STYLE`/`ROSE_STYLE` yang ada atau definisikan gaya baru dari token brand.

Filter di galeri (dashboard & marketing) dan dropdown form admin akan otomatis mengikuti.

## Premium / gratis / aktif

- `isPremium`, `isActive`, `sortOrder`, `thumbnailUrl` = **data DB**, diatur admin lewat CMS (bukan di kode).
- Gating premium ditegakkan di `features/invitation/actions.js` (`createInvitationAction`/`updateInvitationAction`): tema `isPremium` butuh langganan aktif.

## Checklist ringkas (Skenario A)

- [ ] Row DB: `slug`, `category`, `isPremium`, `thumbnailUrl`
- [ ] `THEME_CONFIG["<slug>"]` dengan `renderer: "traditional"` + config visual
- [ ] Uji di `/theme/preview/<slug>` (data mock)
- [ ] (opsional) kategori baru → `theme-catalog.js`
