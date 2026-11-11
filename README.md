# pNongki! Workspace

Platform direktori dan komunitas untuk mencari tempat nongkrong, nugas, olahraga, dan fasilitas publik. Proyek ini menggabungkan antarmuka React dan Tailwind CSS dengan REST API NestJS serta layanan database dan autentikasi Supabase.

---

## Pemenuhan Kebutuhan dan Spesifikasi Proyek

Antarmuka web dibangun menggunakan React.js (Vite) dan Tailwind CSS v4 dengan tata letak responsif berbasis Flexbox dan Grid. Seluruh permintaan data utama diarahkan melalui `frontend/src/lib/api.js` menggunakan `fetch` menuju server REST API NestJS (`http://localhost:3000/api`), sedangkan `@supabase/supabase-js` pada frontend mengelola sesi autentikasi pengguna.

Data katalog tempat, feeds, ulasan, komentar, likes, favorit, dan klaim reward diambil dari backend NestJS yang terhubung ke Supabase. Saat backend tidak dapat dijangkau atau melewati batas waktu 7000 ms, antarmuka halaman utama, jelajah, dan feeds tidak memakai daftar tempat tiruan lokal melainkan menampilkan error state. Meski begitu, `frontend/src/context/AuthContext.jsx` masih menyediakan fallback login demo saat variabel lingkungan Supabase belum diisi, serta berkas data statis tetap ada di `frontend/src/data/places.js` dan `backend/src/app.service.ts`.

Setiap halaman data menerapkan siklus tiga status:
- Status loading merender placeholder skeleton dengan utilitas Tailwind `animate-pulse`.
- Status sukses merender daftar atau detail data yang diterima dari backend ke dalam state React.
- Status error menampilkan pesan `"Oops! Terjadi Kesalahan"`, keterangan kendala koneksi dari `api.js`, dan tombol `"Coba Lagi"` tanpa memuat ulang browser.

Validasi formulir sisi klien diterapkan pada pengajuan tempat baru, pengajuan kemitraan, pembuatan utas atau ajakan nongkrong di feeds, pengiriman ulasan bintang, dan reservasi meja mitra. Dari sisi identitas visual, `Navbar.jsx`, `Footer.jsx`, serta halaman login dan registrasi menggunakan `frontend/public/pNongki-Logo.png`, sementara favicon browser memakai `frontend/public/pNongki-FavIcon.png`.

---

## Struktur Direktori

```text
PNongki/
├── frontend/                     # Frontend React (Vite + Tailwind CSS v4)
│   ├── public/
│   │   ├── pNongki-Logo.png      # Logo resmi aplikasi
│   │   └── pNongki-FavIcon.png   # Favicon tab browser
│   ├── src/
│   │   ├── components/           # Komponen global (Navbar, Footer, ErrorBoundary, Drawers, Modals)
│   │   │   ├── admin/            # Tab kurasi tempat, kemitraan, statistik, dan kelola admin
│   │   │   ├── auth/             # Formulir login, registrasi, lupa sandi, dan banner autentikasi
│   │   │   ├── detail/           # Header, galeri lightbox, tab overview, menu, transit, dan ulasan
│   │   │   ├── explore/          # Search bar, sidebar filter, kartu tempat, dan paginasi
│   │   │   ├── feed/             # Kartu postingan feeds, detail diskusi, sidebar, dan modal buat utas
│   │   │   ├── landing/          # Hero beranda, grid populer, banner jelajah, dan banner kemitraan
│   │   │   ├── owner/            # Hero dashboard owner, ringkasan, daftar reservasi, dan bantuan
│   │   │   ├── partnership/      # Wizard 3 langkah pengajuan kemitraan bisnis
│   │   │   ├── profile/          # Kartu gamifikasi, tab favorit, tempat saya, reward, dan tiket klaim
│   │   │   └── tambah-tempat/    # Wizard 4 langkah pengajuan tempat baru
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Provider sesi autentikasi Supabase dan role pengguna
│   │   │   └── useAuth.js        # Hook akses konteks autentikasi
│   │   ├── data/
│   │   │   └── places.js         # Data referensi statis tempat
│   │   ├── lib/
│   │   │   ├── api.js            # Client terpusat Fetch API menuju backend NestJS (/api/*)
│   │   │   └── supabase.js       # Client koneksi Supabase Auth
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx        # Beranda dengan pencarian dan rekomendasi populer
│   │   │   ├── ExplorePage.jsx        # Jelajah tempat dengan filter kategori dan paginasi
│   │   │   ├── DetailPage.jsx         # Detail tempat, galeri, menu, transit, ulasan, dan reservasi
│   │   │   ├── FeedPage.jsx           # Forum komunitas mahasiswa dan ajakan nongkrong
│   │   │   ├── AuthPage.jsx           # Halaman masuk, daftar, dan reset kata sandi
│   │   │   ├── ProfilePage.jsx        # Profil pengguna, level XP, reward, favorit, dan tempat saya
│   │   │   ├── TambahTempatPage.jsx   # Formulir penambahan tempat baru (4 langkah)
│   │   │   ├── PartnershipPage.jsx    # Formulir klaim kemitraan bisnis (3 langkah)
│   │   │   ├── OwnerDashboardPage.jsx # Dashboard mitra untuk profil bisnis dan reservasi masuk
│   │   │   └── AdminDashboardPage.jsx # Dashboard kurasi tempat, kemitraan, dan manajemen admin
│   │   ├── App.jsx               # Manajemen navigasi hash/state halaman dan state global
│   │   ├── index.css             # Konfigurasi token Tailwind CSS v4
│   │   └── main.jsx
│   ├── .env.example              # Contoh variabel lingkungan Supabase untuk frontend
│   ├── .oxlintrc.json            # Aturan linter Oxlint frontend
│   ├── index.html                # Dokumen HTML utama dan tautan favicon
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # REST API server (NestJS + TypeScript)
│   ├── src/
│   │   ├── feeds/                # Controller, module, service untuk utas dan ajakan nongkrong (/api/posts)
│   │   ├── places/               # Controller, module, service untuk tempat, ulasan, reservasi, dan kurasi (/api/places)
│   │   ├── rewards/              # Controller, module, service untuk katalog dan klaim reward (/api/rewards)
│   │   ├── supabase/             # Module dan service klien admin Supabase
│   │   ├── users/                # Controller, module, service untuk profil, favorit, notifikasi, klaim, dan admin (/api/users)
│   │   ├── app.controller.ts     # Endpoint pengecekan health (/api/health)
│   │   ├── app.controller.spec.ts
│   │   ├── app.module.ts         # Root module yang menggabungkan seluruh modul fitur
│   │   ├── app.service.ts        # Service informasi health dan data contoh tempat
│   │   └── main.ts               # Entry point server (global prefix /api, batas body 50mb, port 3000)
│   ├── test/
│   │   └── app.e2e-spec.ts       # Pengujian E2E backend
│   ├── .env.example              # Contoh variabel lingkungan PORT dan kunci Supabase backend
│   ├── .prettierrc
│   ├── nest-cli.json
│   ├── oxlint.json               # Konfigurasi linter Oxlint backend
│   ├── package.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   ├── vitest.config.e2e.ts
│   └── vitest.config.ts
│
├── supabase/
│   └── schema.sql                # Skema tabel PostgreSQL, enum, trigger, RPC, kebijakan RLS, dan data seed
│
└── package.json                  # Root scripts (dev:frontend, dev:backend, build:frontend, build:backend)
```

---

## Cara Menjalankan

Aplikasi menggunakan pola Single Point of Entry, sehingga backend NestJS dan frontend React perlu dijalankan bersama agar seluruh data aplikasi dapat dimuat dari API.

### 1. Menjalankan Backend (NestJS API)

Buka terminal dan jalankan:

```bash
cd backend
npm run start:dev
```

Atau jalankan dari root workspace dengan `npm run dev:backend`. Server API aktif di `http://localhost:3000/api` (endpoint pengecekan status tersedia di `GET /api/health`).

### 2. Menjalankan Frontend (React + Vite)

Buka terminal lain dan jalankan:

```bash
cd frontend
npm run dev
```

Atau jalankan dari root workspace dengan `npm run dev:frontend`. Antarmuka frontend aktif di `http://localhost:5173` dan membaca `VITE_BACKEND_API_URL` dengan nilai bawaan `http://localhost:3000/api`.

---

## Arsitektur Pengambilan Data dan Penanganan Error

Aplikasi menerapkan siklus hidup data tiga status secara konsisten di halaman `LandingPage`, `ExplorePage`, `DetailPage`, dan `FeedPage` melalui `frontend/src/lib/api.js`:

```text
       [ Memulai Request / Fetch ke /api/* ]
                       │
                       ▼
              ┌─────────────────┐
              │  Loading State  │ ──> Render Animasi Skeleton Tailwind
              └─────────────────┘
                       │
             Backend & DB Merespons?
              ├─── Ya ───> ┌───────────────────┐
              │            │   Success State   │ ──> Render Data dari NestJS API
              │            └───────────────────┘
              │
              └─── Tidak ─> ┌───────────────────┐
                           │    Error State    │ ──> "Oops! Terjadi Kesalahan" + WiFi Off
                           │  ("Coba Lagi" Btn)│
                           └───────────────────┘
                                    │
                       (Klik Tombol "Coba Lagi")
                                    │
                                    └───> Panggil Ulang Loader (Tanpa Reload Halaman)
```

Selama proses `fetch` berlangsung, antarmuka merender placeholder skeleton `animate-pulse` yang menyesuaikan dimensi kartu aslinya agar pergeseran tata letak tetap rendah. Setelah respons backend diterima, data disimpan ke state React untuk dirender ke layar.

Jika koneksi jaringan terputus, server backend NestJS tidak aktif, atau permintaan melewati batas waktu 7000 ms (`AbortError`), `api.js` meneruskan pesan error agar UI menampilkan kartu error dengan tombol `"Coba Lagi"`. Menekan tombol tersebut memanggil ulang `loadPlaces()` pada beranda, `handleRetry()` / `fetchPlacesData()` pada halaman jelajah, atau `loadPosts()` pada feeds tanpa perlu menyegarkan halaman (`F5`).

---

## Panduan Pengujian dan Simulasi (Cara Mengetes)

Untuk menguji pengambilan data, tampilan error jaringan/backend, dan tombol `"Coba Lagi"`, ikuti langkah berikut.

### Skenario A: Pengujian Kondisi Sukses (Normal / Online)

1. Pastikan server backend NestJS dan koneksi internet aktif, lalu buka `http://localhost:5173`.
2. Pada halaman Beranda (`#beranda`), periksa bagian Rekomendasi Populer di Sekitarmu yang menampilkan 4 tempat terpilih dari respons `/api/places`.
3. Pada halaman Jelajah Spot (`#explore`), periksa daftar tempat (20 tempat pada data seed `supabase/schema.sql` yang mencakup kategori `nongkrong`, `nugas`, `olahraga`, dan `fasilitas_publik`) beserta filter kategori, pencarian, dan badge harga.
4. Pada halaman Feeds (`#feeds`), periksa daftar utas dan ajakan nongkrong beserta jumlah likes dan balasan komentar dari `/api/posts`.

### Skenario B: Pengujian Kondisi Loading (Skeleton State)

1. Buka Developer Tools browser (`F12` atau `Ctrl + Shift + I`) dan pilih tab Network.
2. Ubah opsi throttling dari `No throttling` menjadi `Slow 3G` atau `Fast 3G`.
3. Muat ulang halaman (`Ctrl + R` atau `F5`).
4. Kartu tempat dan feeds akan menampilkan placeholder skeleton `animate-pulse` selama data masih diunduh, lalu berganti dengan kartu data setelah respons selesai.

### Skenario C: Pengujian Kondisi Gagal (Error State)

1. Pada tab Network Developer Tools, ubah opsi throttling menjadi `Offline` (atau hentikan sementara server backend lokal pada port `3000`).
2. Muat ulang halaman browser, buka menu Jelajah Spot (`#explore`), atau buka halaman Feeds (`#feeds`).
3. Halaman tidak menggantikan daftar tempat dengan data tiruan lokal, melainkan menampilkan kartu error berisi ikon `wifi_off`, judul `"Oops! Terjadi Kesalahan"`, pesan kendala koneksi ke backend/jaringan, dan tombol `"Coba Lagi"`.

### Skenario D: Pengujian Tombol "Coba Lagi" (Interactive Retry)

1. Lanjutkan dari kondisi Skenario C saat layar masih menampilkan kartu error.
2. Kembalikan opsi Network di Developer Tools ke `No throttling` (atau jalankan kembali server backend lokal) tanpa menekan `F5`.
3. Klik langsung tombol `"Coba Lagi"` pada kartu error.
4. Status error akan berganti sementara ke skeleton loading, lalu data tempat atau postingan feeds kembali tampil ke layar.

---

## Identitas Brand dan Aset Antarmuka

`Navbar.jsx`, `Footer.jsx`, serta header formulir masuk dan daftar di `frontend/src/components/auth/AuthHeader.jsx` menggunakan aset gambar `frontend/public/pNongki-Logo.png`. Ikon tab browser menggunakan `frontend/public/pNongki-FavIcon.png` yang ditautkan pada `<link rel="icon">` di `frontend/index.html`.

---

## Panel Administrator dan Hierarki Role Admin

Panel `AdminDashboardPage.jsx` terhubung ke endpoint `/api/places/admin/*` dan `/api/users/admin*` dengan pembatasan akses berdasarkan role pengguna.

### Kebijakan Pembatasan Akun Admin

Pendaftaran mandiri melalui formulir `#register` pada `AuthPage.jsx` dan `AuthContext.jsx` menolak alamat email berdomain `@admin.pnongki` di sisi klien dengan pesan `"Gunakan alamat email yang valid (contoh: nama@gmail.com)."`. Pada tingkat database (`supabase/schema.sql`), fungsi trigger `handle_new_user()` menyinkronkan pendaftar reguler ke tabel `public.users` dengan role bawaan `'mahasiswa'` (kecuali metadata registrasi secara eksplisit membawa role lain).

Role tertinggi pada aplikasi adalah `super_admin` (dikenali dari nilai `role = 'super_admin'` atau email `superadmin@admin.pnongki`), yang memiliki tab khusus `Kelola Tim Admin` di `AdminDashboardPage.jsx` untuk menambah maupun mencabut akun admin biasa (`role = 'admin'`). Di backend, operasi tersebut ditangani oleh `UsersService` melalui endpoint `POST /api/users/admin` dan `DELETE /api/users/admin/:id` yang memanggil fungsi RPC `superadmin_create_admin` dan `superadmin_delete_admin` dengan fallback ke API `auth.admin` Supabase.

### Wewenang dan Penyediaan Akun Pengujian

| Role | Identifikasi Akun | Wewenang Utama |
|---|---|---|
| Super Admin | Email `superadmin@admin.pnongki` atau `role: 'super_admin'` | Approval tempat, kurasi kemitraan, serta tambah dan hapus akun admin |
| Admin | Email berdomain `@admin.pnongki` atau `role: 'admin'` | Approval tempat baru dan kurasi pengajuan kemitraan |
| Owner | Otomatis aktif saat klaim kemitraan disetujui | Mengelola tempat mitra dan melihat reservasi di Owner Dashboard |
| Mahasiswa | Role bawaan pendaftaran reguler | Eksplorasi tempat, ulasan, reservasi, feeds, favorit, dan klaim reward |

Kata sandi akun admin tidak disimpan di repositori maupun disematkan di `supabase/schema.sql`. Untuk pengujian dengan database Supabase aktif, siapkan akun admin melalui Supabase Auth atau tab `Kelola Tim Admin` dari akun Super Admin. Jika frontend dijalankan tanpa konfigurasi `.env` Supabase, mode login demo di `AuthContext.jsx` juga menerima email `superadmin@admin.pnongki` atau domain `@admin.pnongki` untuk mencoba alur antarmuka admin secara lokal.

### Cara Menguji Pembatasan Pendaftaran dan Pengelolaan Admin

1. Uji penolakan pendaftaran admin mandiri lewat halaman Daftar (`#register`), masukkan email berdomain `@admin.pnongki`, lalu klik tombol `"Buat Akun Sekarang"`. Formulir akan menolak pengiriman dan menampilkan `"Gunakan alamat email yang valid (contoh: nama@gmail.com)."`.
2. Masuk sebagai Super Admin lewat halaman login (`#login`) menggunakan akun Super Admin yang sudah Anda siapkan, lalu pastikan tab `Kelola Tim Admin` tampil di Dashboard Administrator.
3. Untuk menambahkan admin baru pada tab `Kelola Tim Admin`, isi nama lengkap admin, username email berdomain `@admin.pnongki`, dan kata sandi awal minimal 6 karakter, lalu klik `"Buat Akun Admin Sekarang"`.
4. Logout lalu login dengan akun admin baru tersebut untuk memastikan pengguna mendapat akses approval tempat dan kemitraan tanpa tab manajemen akun admin.
5. Untuk mencabut akses, masuk kembali sebagai Super Admin dan gunakan tombol hapus pada daftar tim administrator di tab `Kelola Tim Admin` (akun utama `superadmin@admin.pnongki` dilindungi agar tidak dapat dihapus dari UI).
