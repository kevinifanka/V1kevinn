/* ============================================================
   SEMUA KONTEN PORTOFOLIO ADA DI SINI.
   Ganti teks, link, dan gambar sesuai data pribadimu.

   Gambar: taruh foto kamu di folder /public/images lalu tulis
   path-nya seperti "/images/foto-saya.jpg".
   Foto otomatis dibuat hitam-putih lewat CSS (hover = berwarna).

   Tips teks: bungkus kata dengan *bintang* untuk membuatnya
   miring + abu-abu (gaya editorial), contoh: "I *design* things".
   ============================================================ */

// Foto pribadi dari folder src/Foto (di-import supaya diproses oleh Vite)
import fotoHeroBg from "../Foto/Foto3.jpg";
import fotoWork06 from "../Foto/Foto4.jpg.jpeg";
import fotoAboutBg from "../Foto/About.jpg";
import fotoWisuda from "../Foto/ALT09482.jpg";
import fotoCumLaude from "../Foto/Foto_2_HD.jpg";

// Logo tools (Tools & craft) — dari library simple-icons
import {
  siAdobephotoshop,
  siAndroid,
  siDart,
  siFlutter,
  siGit,
  siHtml5,
  siNodedotjs,
  siPython,
  siSupabase,
} from "simple-icons";

const img = (seed, w = 900, h = 1200) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

export const profile = {
  name: "Kevin Ifanka",
  role: "Creative Developer & Designer",
  location: "North, Sumatra",
  timezone: "Asia/Jakarta",
  email: "kevinifanka98@gmail.com",
  year: "2026",
  available: "Available for work",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
  ],
};

/* Menu navbar.
   - id       : id section di halaman utama (scroll ke sana)
   - children : sub-menu. href "#/nama" = halaman terpisah, "#id" = section */
export const navLinks = [
  {
    id: "about",
    label: "About",
    children: [
      { label: "Overview", href: "#about" },
      { label: "Experience", href: "#/experience" },
      { label: "Album", href: "#/album" },
    ],
  },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

// Halaman terpisah (dibuka lewat link "#/nama")
export const pages = {
  experience: { label: "Experience", parent: "about" },
  album: { label: "Album", parent: "about" },
};

/* Hero — meniru komposisi slide "Midnight doesn't erase the past" */
export const hero = {
  line1: "Beyond",
  line1Italic: "code",
  // Kata miring di baris pertama berganti otomatis (kata pertama = tampilan awal).
  // Kosongkan array / hapus baris ini untuk memakai line1Italic saja.
  line1Rotate: ["code", "screens", "networks", "firewalls"],
  line2: "there's more to explore",
  sub1: "from mobile apps to",
  subItalic: "connected networks",
  sub2: "and digital security.",
  // Foto kecil di kiri bawah halaman pertama. null = disembunyikan.
  image: null,
  imageAlt: "Portrait",
  // Titik fokus foto di dalam bingkai: "horizontal vertikal".
  // Nilai vertikal kecil = bagian atas foto (wajah) lebih terlihat.
  imagePosition: "50% 22%",

  // Foto latar penuh di belakang teks halaman pertama.
  // Hapus / beri null pada `background` untuk kembali ke latar polos.
  background: fotoHeroBg,
  // Titik fokus foto "horizontal vertikal" — 0% = kiri, 100% = kanan
  backgroundPosition: "25% center", // desktop
  backgroundPositionMobile: "62% center", // HP (layar sempit, jadi pilih bagian terpenting)
  backgroundGrayscale: false, // true = hitam-putih seperti foto lain
  backgroundDim: 0.45, // gelapnya lapisan di atas foto (0 = tanpa, 1 = hitam)
};

export const marquee = [
  "Interface Design",
  "*Creative* Development",
  "Brand Identity",
  "*Motion*",
  "Art Direction",
];

export const about = {
  // Teks besar yang "menyala" kata per kata saat di-scroll
  statement:
    "A fresh graduate in Informatics Engineering, driven by curiosity and a passion for technology.I don't just want to write code. I want to explore how technology works, connect systems, build mobile experiences, and understand the importance of digital security. Always learning, always exploring, and always building..",
  portrait: null, // foto di bagian About. null = disembunyikan
  portraitPosition: "50% 30%",

  // Foto latar bagian About (diam/sticky saat di-scroll).
  // Hapus / beri null pada `background` untuk kembali ke latar terang polos.
  background: fotoAboutBg,
  backgroundPosition: "42% center", // desktop (0% = kiri, 100% = kanan)
  backgroundPositionMobile: "40% center", // HP
  backgroundDim: 0.55, // gelapnya lapisan di atas foto (0 = tanpa, 1 = hitam)
  facts: [
    { label: "Based in", value: "Jakarta, Indonesia" },
    { label: "Focus", value: "Web design, React, motion" },
    { label: "Currently", value: "Freelance & open to roles" },
  ],
  stats: [
    { value: 5, suffix: "+", label: "Fresh Graduate" },
    { value: 40, suffix: "", label: "Projects shipped" },
    { value: 18, suffix: "", label: "Happy clients" },
  ],
};

/* Works — meniru slide "Moments We Keep".
   size: "tall" (foto tinggi) atau "short" (foto lebih pendek) */
export const projects = [
  {
    id: "noir",
    title: "Noir Studio",
    category: "Brand Identity",
    year: "2026",
    caption: "The laughs that broke a heavy day",
    description:
      "A monochrome identity system for an independent photo studio — logotype, editorial grid, and a website that lets the pictures do the talking.",
    tags: ["Branding", "Web", "Art Direction"],
    link: "#",
    image: img("works-noir", 900, 1350),
    size: "tall",
  },
  {
    id: "dialog",
    title: "Dialog",
    category: "Web App",
    year: "2026",
    caption: "The conversations we revisit in our minds",
    description:
      "A journaling app built with React that turns daily notes into a calm, searchable timeline. Designed for slow reading, not doom-scrolling.",
    tags: ["React", "UI/UX", "Framer Motion"],
    link: "#",
    image: img("works-dialog", 900, 1020),
    size: "short",
  },
  {
    id: "people",
    title: "People & Places",
    category: "Editorial Website",
    year: "2025",
    caption: "People who stayed, people who left, people who changed us",
    description:
      "An online magazine with long-form stories, scroll-driven layouts and a custom CMS so the editors can publish without a developer.",
    tags: ["Next.js", "CMS", "Editorial"],
    link: "#",
    image: img("works-people", 900, 1350),
    size: "tall",
  },
  {
    id: "leaf",
    title: "Leaf Archive",
    category: "E-commerce",
    year: "2025",
    caption: "Small memories that feel like black-and-white photographs — imperfect but meaningful",
    description:
      "A plant shop storefront focused on product photography, slow transitions and a checkout that takes three steps instead of seven.",
    tags: ["Shopify", "Design System"],
    link: "#",
    image: img("works-leaf", 900, 1020),
    size: "short",
  },
  {
    id: "atlas",
    title: "Atlas Coffee",
    category: "Packaging & Web",
    year: "2024",
    caption: "Mornings that start slowly and end well",
    description:
      "Packaging, menu design and a one-page site for a neighbourhood roastery. Everything printed in one ink.",
    tags: ["Packaging", "Landing Page"],
    link: "#",
    image: img("works-atlas", 900, 1350),
    size: "tall",
  },
  {
    id: "one-family",
    title: "One Family",
    category: "Internship — Hotel Grandhika",
    year: "2025", // ganti dengan tahun magangmu
    caption: "Strangers on the first day, family by the last",
    description:
      "My internship at Hotel Grandhika — learning how a hotel truly runs, one shift at a time. It started as a placement and ended as a team I still call family: people who taught me patience, warmth, and what it means to take care of others.",
    tags: ["Internship", "Hospitality", "Teamwork"],
    link: "#",
    image: fotoWork06,
    imagePosition: "50% 65%", // fokus ke barisan orang (bukan plafon)
    size: "short",
  },
];

/* ============================================================
   TIMELINE — halaman About › Experience
   Urutkan dari yang TERBARU di atas.
   type: "education" | "internship" | "experience" | "achievement"
   points: detail yang muncul saat kartu diklik (boleh dikosongkan [])

   ⚠ DRAF: entri bertanda "GANTI" masih contoh — sesuaikan dengan
   riwayatmu (tahun, nama tempat, peran), atau hapus jika tidak perlu.
   ============================================================ */
export const timeline = [
  {
    year: "2026",
    type: "achievement",
    title: "Graduated *Cum Laude*",
    place: "Universitas Sumatera Utara",
    description:
      "Completed my Informatics Engineering studies with honours — the end of one chapter and the start of the next.",
    points: [
      "Graduated with Cum Laude distinction",
      "Informatics Engineering", // GANTI: tulis program / jurusan lengkapmu
    ],
  },
  {
    year: "2025", // GANTI: tahun magangmu
    type: "internship",
    title: "Internship",
    place: "Hotel Grandhika",
    description:
      "Strangers on the first day, family by the last — learning how a hotel truly runs, one shift at a time.",
    points: [
      "GANTI: divisi / posisi magangmu (mis. IT Department)",
      "GANTI: tugas utama yang kamu kerjakan",
      "Became part of a team I still call one family",
    ],
  },
  {
    year: "20XX — 2026", // GANTI: tahun masuk kuliah
    type: "education",
    title: "Informatics Engineering",
    place: "Universitas Sumatera Utara",
    description:
      "Where curiosity turned into craft — mobile development, computer networks and the basics of digital security.",
    points: [
      "GANTI: mata kuliah / fokus yang paling kamu suka",
      "GANTI: proyek akhir / tugas akhirmu",
    ],
  },
  {
    year: "20XX", // GANTI
    type: "experience",
    title: "Organisation / Project", // GANTI: organisasi, kepanitiaan, atau proyek
    place: "GANTI: nama tempat",
    description: "GANTI: ceritakan singkat pengalaman ini — atau hapus entri ini.",
    points: [],
  },
  {
    year: "20XX — 20XX", // GANTI
    type: "education",
    title: "Senior High School",
    place: "GANTI: nama SMA / SMK",
    description: "GANTI: jurusan dan satu hal yang paling kamu ingat.",
    points: [],
  },
];

// Label kategori timeline (dipakai untuk tombol filter)
export const timelineTypes = {
  education: "Education",
  internship: "Internship",
  experience: "Experience",
  achievement: "Achievement",
};

/* ============================================================
   ALBUM — halaman About › Album
   Tambah foto: taruh file di src/Foto, import di atas, lalu
   tambahkan { src, caption, year } ke daftar di bawah.
   ============================================================ */
export const album = [
  { src: fotoWisuda, caption: "Graduation day", year: "2026" },
  { src: fotoCumLaude, caption: "Cum Laude, in motion", year: "2026" },
  { src: fotoWork06, caption: "One family — Hotel Grandhika", year: "2025" },
  { src: fotoAboutBg, caption: "City lights, quiet night", year: "2026" },
  { src: fotoHeroBg, caption: "Beyond the frame", year: "2026" },
];

/* ============================================================
   TOOLS & CRAFT — barisan logo berjalan di halaman Experience.
   icon: ikon dari simple-icons (cari nama di https://simpleicons.org,
   lalu import di bawah dengan awalan "si", mis. "Kotlin" -> siKotlin).
   Tools dibagi otomatis menjadi 3 baris yang berjalan bergantian arah.
   ============================================================ */
export const skills = [
  { name: "Flutter", icon: siFlutter },
  { name: "Android", icon: siAndroid },
  { name: "Python", icon: siPython },
  { name: "Supabase", icon: siSupabase },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Dart", icon: siDart },
  { name: "HTML5", icon: siHtml5 },
  { name: "Git", icon: siGit },
  { name: "Adobe Photoshop", icon: siAdobephotoshop },
];

export const contact = {
  line1: "Let's make",
  line2: "something",
  line2Italic: "worth",
  line3: "keeping.",
};
