# Editorial Portfolio — React + Framer Motion

Portofolio pribadi bergaya editorial hitam-putih (serif besar, kata miring abu-abu,
galeri foto monokrom) dengan animasi interaktif dari Framer Motion.

## Cara menjalankan

```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # hasil produksi ada di folder dist/
```

Butuh Node.js 18 atau lebih baru.

## Mengganti konten

Semua teks, link, dan gambar ada di **`src/data/portfolio.js`**: nama, email,
sosial media, proyek, pengalaman, dan skill.

- Bungkus kata dengan `*bintang*` supaya tampil miring dan abu-abu, contoh: `"Works *I* Keep"`.
- Foto sendiri: simpan di `public/images/` lalu tulis `image: "/images/nama-file.jpg"`.
  Foto otomatis dibuat hitam-putih, dan kembali berwarna saat di-hover.
- Proyek punya `size: "tall"` atau `"short"` untuk ritme tinggi-pendek seperti desain aslinya.

Warna dan font bisa diubah di bagian `:root` di `src/index.css`.

## Animasi yang dipakai

| Bagian | Efek |
|---|---|
| Preloader | Penghitung 0–100%, lalu tirai naik |
| Hero | Teks muncul kata per kata dari balik mask, foto terbuka dengan clip-path, parallax saat scroll |
| Marquee | Teks berjalan tanpa henti dan ikut miring sesuai kecepatan scroll |
| About | Paragraf menyala kata per kata saat di-scroll, angka statistik menghitung naik |
| Works | Scroll vertikal menggeser galeri ke samping (desktop), hover = zoom + warna, klik = modal detail |
| Experience | Garis tergambar saat muncul, baris terisi hitam saat di-hover |
| Contact | Tombol magnetik, underline animasi, jam lokal langsung |
| Global | Kursor custom (label "View" di kartu), navbar sembunyi saat scroll ke bawah, progress bar |

Animasi otomatis dikurangi kalau pengguna mengaktifkan "Reduce motion" di sistem operasinya.

## Struktur

```
src/
├── App.jsx                # Susunan halaman
├── index.css              # Semua style
├── data/portfolio.js      # ← EDIT KONTEN DI SINI
├── hooks/useMediaQuery.js
└── components/
    ├── Preloader.jsx  Cursor.jsx  Navbar.jsx
    ├── Hero.jsx  Marquee.jsx  About.jsx
    ├── Works.jsx  Experience.jsx  Contact.jsx
    ├── RevealText.jsx  Magnetic.jsx
    └── motion.js          # easing & helper teks miring
```

## Deploy

Folder ini bisa langsung di-deploy ke Vercel atau Netlify (framework: Vite,
build command: `npm run build`, output: `dist`).
