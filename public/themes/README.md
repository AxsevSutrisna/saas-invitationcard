# Aset PNG Sampul Undangan (semua tema)

Sistem ini memakai **layer PNG** untuk sampul (teknik seperti mengundanganda),
dianimasikan GSAP. Berlaku untuk semua tema; aset diatur **per tema** di folder
masing-masing.

## Cara pakai
1. Buat folder sesuai slug tema di dalam `public/themes/`:
   - `classic-elegance/`
   - `floral-blossom/`
   - `floral-blue/`
   - `modern-minimalist/`
   - `nature-harmony/`
2. Taruh file aset (PNG transparan, **lisensi komersial**) dengan **nama persis**:

   | File | Wajib? | Isi |
   |---|---|---|
   | `flower-1.png` … `flower-5.png` | ✅ | 5 elemen dekor sudut (tema floral → bunga; classic → ornamen emas; modern → bentuk geometris; nature → dedaunan; dst) |
   | `leaf.png` | ✅ | ornamen/daun menjuntai di tepi atas (dipakai berulang) |
   | `cover-bg.webp` | ⬜ | latar sampul (potret HP ~1080×1920) |
   | `photo-frame.png` | ⬜ | bingkai foto (lubang tengah transparan) |
   | `petal.png` | ⬜ | partikel kecil melayang |

3. Aktifkan di `src/features/theme/cover-assets.js` → ubah `enabled: false` → **`true`**
   pada tema yang bersangkutan.
4. `npm run dev` → sampul tema itu memakai layer PNG + animasi GSAP. Tuning posisi
   di `cover-assets.js` (`coverLeaves` / `coverFlowers`) sesuai aset Anda.

Selama `enabled: false` atau file belum ada → sampul memakai ornamen SVG bawaan
(tak ada yang rusak).

## Ide kata kunci pencarian per tema (PNG transparan, commercial use)
- **floral-blossom**: "watercolor flower png", "eucalyptus greenery png", "pink dahlia png"
- **floral-blue**: "blue watercolor flower png", "navy floral png", "hydrangea png"
- **classic-elegance**: "gold ornament png", "gold floral corner png", "luxury gold divider png"
- **modern-minimalist**: "minimal line art leaf png", "abstract geometric gold png"
- **nature-harmony**: "green foliage png", "tropical leaves png", "botanical greenery png"

Sumber: Freepik, Vecteezy, rawpixel, Envato Elements, Creative Market.

## ATURAN LISENSI
- Pastikan **izin penggunaan komersial** (ini produk SaaS).
- **JANGAN** memakai gambar milik mengundanganda (`media.mengundanganda.com`).
- Simpan bukti/lisensi tiap aset; idealnya tanpa wajib atribusi.
