# pNongki! Workspace

Platform rekomendasi tempat nongkrong, nugas, olahraga, dan fasilitas umum untuk mahasiswa dan komunitas. Proyek ini mengintegrasikan antarmuka modern berbasis React & Tailwind CSS dengan backend API berbasis NestJS dan Database Cloud Supabase.

---

## 📋 Pemenuhan Kebutuhan & Spesifikasi Proyek

Sesuai kriteria tugas dan spesifikasi frontend:
1. **Frontend Stack**:
   - **Framework**: React.js (Vite)
   - **Styling**: Tailwind CSS v4 + Flexbox & Grid modern + Responsive Design
   - **HTTP Client**: Fetch API & Supabase REST Client
2. **Data Source**:
   - Mengambil data murni dari database/API eksternal (Cloud Supabase Database & NestJS backend) menggunakan Fetch API.
   - **Tanpa Fallback Mock Lokal**: Seluruh data (tempat, feeds, ulasan, komentar, likes) diambil langsung dari database. Tidak ada backup data dummy lokal ketika offline.
3. **Tri-State Lifecycle (Loading, Success, Error UI)**:
   - **Loading State**: Animasi placeholder skeleton (Tailwind `animate-pulse`).
   - **Success State**: Merender data dinamis dari database.
   - **Error State**: Menampilkan pesan error *"Something went wrong / Gagal terhubung"* lengkap dengan tombol interaktif **"Coba Lagi" (Retry)**.
4. **Form Validation & Interaktivitas**:
   - Validasi input form client-side (tambah tempat, postingan feeds, komentar, ulasan bintang, reservasi).
5. **Branding & Identitas Visual**:
   - Menggunakan logo resmi `pNongki-Logo.png` di Navbar, Halaman Login, dan Halaman Registrasi.
   - Favicon browser menggunakan `pNongki-FavIcon.png`.

---

## 📁 Struktur Direktori

```text
PNongki/
├── frontend/             # Frontend React (Vite + Tailwind CSS v4)
│   ├── public/
│   │   ├── pNongki-Logo.png      # Logo resmi aplikasi
│   │   └── pNongki-FavIcon.png   # Favicon tab browser
│   ├── src/
│   │   ├── components/           # Komponen Navbar, Footer, Drawers, Modals
│   │   ├── lib/
│   │   │   ├── api.js            # Service Fetch API & Supabase Database murni
│   │   │   └── supabase.js       # Client koneksi Supabase Cloud
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Beranda dengan rekomendasi populer & skeleton
│   │   │   ├── ExplorePage.jsx   # Halaman jelajah filter tempat & error state
│   │   │   ├── DetailPage.jsx    # Halaman detail tempat & transit angkot/bus
│   │   │   ├── FeedPage.jsx      # Halaman komunitas feeds, likes, komentar
│   │   │   ├── AuthPage.jsx      # Halaman Login & Register dengan Logo pNongki!
│   │   │   ├── ProfilePage.jsx   # Profil pengguna, riwayat, dan bookmark
│   │   │   └── TambahTempatPage.jsx # Formulir penambahan rekomendasi tempat baru
│   │   ├── App.jsx               # Router internal, global state & error handler
│   │   ├── index.css             # Tailwind CSS tokens
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── backend/              # Backend API opsional (NestJS + TypeScript)
│   ├── src/
│   │   ├── app.controller.ts     # Endpoint /api/health & /api/places
│   │   ├── app.service.ts        # Service data backend
│   │   └── main.ts
│   └── package.json
│
├── prd_pnongki.md        # Dokumen Spesifikasi Kebutuhan Produk (PRD)
├── design_guidelines.md  # Panduan Sistem Desain UI/UX
└── package.json          # Root scripts
```

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Frontend (React + Vite)
Buka terminal dan jalankan:
```bash
cd frontend
npm run dev
```
Aplikasi frontend akan aktif di: `http://localhost:5173`

### 2. Menjalankan Backend (NestJS API - Opsional)
Jika ingin menggunakan server lokal NestJS sebagai gateway utama:
```bash
cd backend
npm run start:dev
```
API backend aktif di: `http://localhost:3000/api`

*(Catatan: Frontend sudah terhubung secara langsung ke Cloud Database Supabase melalui Fetch API, sehingga aplikasi dapat berjalan penuh bahkan tanpa menjalankan backend lokal).*

---

## 🔄 Arsitektur Pengambilan Data & Penanganan Error

Aplikasi menerapkan siklus hidup data 3 status (*Tri-State Lifecycle*) secara konsisten di seluruh halaman (`LandingPage`, `ExplorePage`, `DetailPage`, dan `FeedPage`):

```
       [ Memulai Request / Fetch Data ]
                      │
                      ▼
             ┌─────────────────┐
             │  LOADING STATE  │ ──> Render Animasi Skeleton Tailwind
             └─────────────────┘
                      │
            Koneksi Berhasil?
             ├─── YA ───> ┌───────────────────┐
             │            │   SUCCESS STATE   │ ──> Render Data Dinamis Database
             │            └───────────────────┘
             │
             └─── TIDAK ─> ┌───────────────────┐
                          │    ERROR STATE    │ ──> Pesan Error + Ikon WiFi Off
                          │  ("Coba Lagi" Btn)│
                          └───────────────────┘
                                   │
                      (Klik Tombol "Coba Lagi")
                                   │
                                   └───> Ulangi Request (Tanpa Reload Halaman)
```

1. **Loading State**:
   - Selama proses asinkronus `fetch` berlangsung, antarmuka merender komponen skeleton placeholder (`animate-pulse`) yang menyesuaikan dimensi kartu aslinya untuk menjaga kestabilan tata letak visual (*Cumulative Layout Shift / CLS* rendah).
2. **Success State**:
   - Data berhasil diterima dan langsung disimpan ke dalam React State untuk dirender ke layar secara dinamis.
3. **Error State**:
   - Tidak ada mock data palsu yang disamarkan. Ketika koneksi internet terputus, API gagal, atau database tidak dapat dijangkau, sistem menangkap exception tersebut dan menampilkan kartu informasi error dengan tombol **"Coba Lagi"**.
4. **Interactive Retry ("Coba Lagi")**:
   - Menekan tombol "Coba Lagi" akan memanggil ulang fungsi `loadPlaces()` atau `loadPosts()` tanpa memerlukan refresh browser (`F5`), memberikan pengalaman pengguna yang responsif.

---

## 🧪 Panduan Pengujian & Simulasi (Cara Mengetes)

Untuk menguji fitur pengambilan data, penanganan kegagalan koneksi, dan tombol **Coba Lagi**, ikuti langkah-langkah berikut:

### Skenario A: Pengujian Kondisi Sukses (Normal / Online)
1. Buka browser dan akses `http://localhost:5173`.
2. Pastikan koneksi internet laptop/komputer Anda aktif.
3. Periksa halaman **Beranda**:
   - 4 Rekomendasi tempat terpopuler berhasil dimuat langsung dari tabel database Supabase.
4. Periksa halaman **Jelajah Spot** (`/explore`):
   - Seluruh daftar tempat (20 tempat nongkrong, nugas, dan olahraga) tampil lengkap dengan filter kategori, pencarian, dan badge harga.
5. Periksa halaman **Feeds Komunitas**:
   - Postingan feeds komunitas berhasil termuat beserta data likes dan balasan komentar.

---

### Skenario B: Pengujian Kondisi Loading (Skeleton State)
1. Buka browser dan buka menu **Inspect / Developer Tools** (`F12` atau `Ctrl + Shift + I`).
2. Masuk ke tab **Network**.
3. Pada dropdown throttling kecepatan koneksi (default: *No throttling*), ubah menjadi **Slow 3G** atau **Fast 3G**.
4. Lakukan refresh halaman (`Ctrl + R` / `F5`).
5. **Hasil yang Terlihat**:
   - Kartu-kartu tempat dan feed menampilkan placeholder balok abu-abu dengan efek berkedip halus (*skeleton pulse*).
   - Setelah respons database selesai diunduh, skeleton berganti secara mulus menjadi kartu tempat asli.

---

### Skenario C: Pengujian Kondisi Gagal (Error State / "Something Went Wrong")
1. Buka Developer Tools (`F12`) dan pilih tab **Network**.
2. Pada dropdown throttling, ubah opsi menjadi **Offline** (atau matikan sambungan Wi-Fi Anda).
3. Lakukan salah satu aksi berikut:
   - Refresh halaman browser, atau
   - Buka tab **Feeds**, atau
   - Klik menu **Jelajah Spot**.
4. **Hasil yang Terlihat**:
   - Sistem **TIDAK** menampilkan data tiruan/mock lokal.
   - Muncul antarmuka Error State:
     - Ikon status jaringan terputus (`wifi_off`).
     - Judul: *"Oops! Terjadi Kesalahan"* / *"Gagal Memuat Feeds Komunitas"*.
     - Keterangan: Penjelasan bahwa koneksi ke database atau backend terputus.
     - Tombol interaktif **"Coba Lagi"**.

---

### Skenario D: Pengujian Tombol "Coba Lagi" (Interactive Retry)
1. Lanjutkan dari kondisi Skenario C saat layar sedang menampilkan pesan error dan tombol **Coba Lagi**.
2. Pada tab **Network** di Developer Tools, kembalikan opsi dari **Offline** ke **No throttling** (atau nyalakan kembali koneksi Wi-Fi).
3. **PENTING**: **Jangan refresh halaman (jangan tekan F5)**.
4. Klik langsung tombol **"Coba Lagi"** pada antarmuka aplikasi.
5. **Hasil yang Terlihat**:
   - Status error langsung hilang dan digantikan oleh animasi skeleton sejenak.
   - Dalam hitungan detik, seluruh data tempat atau postingan feeds berhasil termuat kembali secara otomatis dan normal.

---

## 🔐 Identitas Brand & Pembaruan Antarmuka
- **Navbar**: Teks *"pNongki!"* telah digantikan secara presisi dengan gambar logo `frontend/public/pNongki-Logo.png`.
- **Halaman Login & Registrasi**: Header formulir masuk dan daftar sekarang menampilkan logo resmi `pNongki-Logo.png` dengan rasio proporsional dan responsif.
- **Favicon**: Menggunakan `frontend/public/pNongki-FavIcon.png` pada tag `<link rel="icon">` di file `index.html`.

---

## 🛡️ Panel Administrator & Hierarki Role Admin

Aplikasi kini dilengkapi dengan **Dashboard Administrator** yang terhubung secara dinamis dan real-time ke Database Supabase Cloud dengan sistem keamanan berbasis hierarki role:

### 🔒 Kebijakan Keamanan Akun Admin:
1. **Tidak Bisa Mendaftar Sendiri**:
   - Pendaftaran mandiri melalui formulir publik (`#register`) dengan domain `@admin.pnongki` **DITOLAK** secara otomatis di sisi klien maupun di trigger database Supabase (`handle_new_user()`).
   - Setiap pengguna baru yang mendaftar mandiri secara ketat hanya mendapatkan peran bawaan `mahasiswa`.
2. **Role Super Admin**:
   - Terdapat peran tertinggi **Super Administrator** (`role: 'super_admin'`) yang memiliki hak eksklusif untuk menambahkan atau mencabut akses akun admin baru.
   - Dilengkapi fungsi RPC database berizin tinggi (`public.superadmin_create_admin` & `public.superadmin_delete_admin`) yang hanya dapat dipanggil oleh akun Super Admin.

---

### 🔑 Kredensial Akun Pengujian
| Role | Email | Password | Wewenang |
|---|---|---|---|
| **Super Admin** | `superadmin@admin.pnongki` | `superadmin123` | Approval Tempat, Approval Mitra, & **Daftarkan / Hapus Admin Baru** |
| **Admin Biasa** | `admin@admin.pnongki` | `admin123` | Approval Tambah Tempat & Approval Partnership |

---

### 🧪 Cara Mengetes Fitur Super Admin & Penambahan Admin
1. **Uji Penolakan Pendaftaran Mandiri**:
   - Buka halaman **Daftar Akun** (`#register`).
   - Coba masukkan email apapun dengan domain `@admin.pnongki` (misal: `hacker@admin.pnongki`).
   - Klik **Daftar Sekarang**.
   - Sistem akan langsung menolak pendaftaran dengan pesan: *"Pendaftaran akun admin dibatasi. Akun admin hanya dapat dibuat oleh Super Admin melalui Dashboard Administrator."*
2. **Masuk sebagai Super Admin**:
   - Buka halaman **Sign In** (`#login`).
   - Masukkan email: `superadmin@admin.pnongki` dan kata sandi: `superadmin123`.
   - Klik **Masuk**. Sistem akan menampilkan lencana **SUPER ADMINISTRATOR** dan tab khusus **Kelola Tim Admin** (`shield_person`).
3. **Menambahkan Admin Baru via Super Admin**:
   - Masuk ke tab **Kelola Tim Admin**.
   - Isi formulir **Daftarkan Admin Baru**:
     - Nama Lengkap: misal `Budi Santoso Operations`
     - Email: `budi@admin.pnongki`
     - Kata Sandi Awal: `budi12345`
   - Klik tombol **Buat Akun Admin Sekarang**.
   - Akun admin baru langsung dibuat secara aman di Supabase (`auth.users` dan `public.users`) dan langsung tampil di daftar tim admin.
4. **Login Menggunakan Admin Baru yang Dibuat**:
   - Buka jendela incognito / logout dari Super Admin.
   - Login dengan akun yang baru saja dibuat (`budi@admin.pnongki` / `budi12345`).
   - Akun tersebut berhasil login sebagai **Admin Biasa**: dapat melakukan approval tempat dan kemitraan, tetapi **tidak memiliki** akses untuk menambah atau menghapus admin.
5. **Mencabut Akses Admin**:
   - Kembali ke akun Super Admin (`superadmin@admin.pnongki`).
   - Di tab **Kelola Tim Admin**, klik tombol **Hapus** pada akun admin yang ingin dicabut. Akun admin tersebut langsung dihapus dari sistem.

