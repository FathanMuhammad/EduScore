# Panduan Lengkap Deploy Aplikasi EduScore ke Vercel & Firebase

Dokumen ini berisi panduan langkah-demi-langkah untuk melakukan *deployment* aplikasi EduScore, baik untuk sisi **Backend (Firebase)** maupun **Frontend (Vercel)**.

---

## 1. Setup Backend & Database (Firebase)

Karena EduScore menggunakan konsep *Serverless Backend-as-a-Service* (BaaS) dari Google Firebase, Anda tidak perlu menyewa server VPS. Cukup konfigurasikan Firebase Console Anda dengan langkah berikut:

### A. Membuat Project Baru di Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Klik **Add project** (Tambah proyek).
3. Beri nama proyek Anda (contoh: `eduscore-app`), lalu klik **Continue**.
4. Aktifkan/nonaktifkan Google Analytics sesuai kebutuhan (bisa dinonaktifkan untuk mempercepat setup), lalu klik **Create project**.
5. Tunggu proyek selesai dibuat, lalu klik **Continue**.

### B. Konfigurasi Firebase Authentication (Sistem Login/Register)
1. Pada menu sebelah kiri, masuk ke menu **Build** > **Authentication**.
2. Klik **Get Started**.
3. Di tab **Sign-in method**, pilih **Email/Password**.
4. Aktifkan pilihan **Email/Password** (status: *Enabled*), lalu klik **Save**.

### C. Konfigurasi Cloud Firestore (Database)
1. Pada menu sebelah kiri, masuk ke menu **Build** > **Firestore Database**.
2. Klik **Create database**.
3. Pilih lokasi database terdekat (disarankan `asia-southeast2` untuk Jakarta/Singapura). Klik **Next**.
4. Pilih **Start in test mode** (Mode uji coba) terlebih dahulu untuk mempermudah konfigurasi, lalu klik **Create**.

### D. Menerapkan Aturan Keamanan Firestore (Firestore Security Rules)
Untuk melindungi data agar tidak disalahgunakan, salin aturan keamanan dari proyek lokal Anda:
1. Buka file [firestore.rules](file:///d:/fathan/------- KAMPUS -------/SEMESTER 8/LSP PROGRAMMER/EduScore/firestore.rules) di editor teks.
2. Di Firebase Console, masuk ke tab **Rules** pada Firestore Database.
3. Hapus aturan bawaan Firebase dan tempelkan (*paste*) seluruh baris kode dari `firestore.rules`.
4. Klik **Publish** untuk menyimpan.

### E. Mendaftarkan Aplikasi Web & Mengambil Kunci API
1. Kembali ke **Project Overview** (klik ikon gerigi > **Project settings**).
2. Di bagian bawah tab **General**, klik ikon Web (`</>`) untuk mendaftarkan aplikasi.
3. Beri nama aplikasi (misal: `eduscore-web`), centang *Firebase Hosting* jika tidak diperlukan (lewati saja), lalu klik **Register app**.
4. Salin objek konfigurasi `firebaseConfig` yang muncul. Konfigurasi ini berisi kunci-kunci rahasia seperti:
   * `apiKey`
   * `authDomain`
   * `projectId`
   * `storageBucket`
   * `messagingSenderId`
   * `appId`

---

## 2. Persiapan Berkas Lokal (Frontend)

Sebelum melakukan upload ke Vercel, pastikan berkas-berkas berikut telah disiapkan dengan benar di proyek lokal Anda:

### A. File `.env.local`
Buat berkas bernama `.env.local` di folder utama proyek (sejajar dengan `package.json`). Isi berkas tersebut dengan kunci yang Anda salin dari Firebase Console sebelumnya:
```env
VITE_FIREBASE_API_KEY=AIzaSyA... (Kunci API Anda)
VITE_FIREBASE_AUTH_DOMAIN=eduscore-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eduscore-app
VITE_FIREBASE_STORAGE_BUCKET=eduscore-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567:web:abcd1234
```
*Catatan: Pastikan penamaan variabel lingkungan React menggunakan awalan `VITE_` agar dibaca dengan benar oleh Vite.*

### B. File `vercel.json` (Konfigurasi Routing Vercel)
Aplikasi berbasis React Router (*Single Page Application*) membutuhkan berkas `vercel.json` di folder utama agar halaman tidak mengalami error **404 Not Found** saat pengguna me-refresh browser di halaman rute sekunder (seperti `/admin/dashboard` atau `/siswa/profil`). Berkas `vercel.json` Anda harus berisi:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 3. Deployment Frontend ke Vercel

Ada 2 cara yang dapat Anda gunakan untuk melakukan *deployment* ke Vercel:

### Metode A: Menggunakan GitHub (Sangat Direkomendasikan & Otomatis)
Jika Anda menggunakan git untuk mengelola proyek:
1. Upload/Push *repository* lokal Anda ke GitHub (bisa *Private* maupun *Public*).
   > **Penting:** Pastikan file `.env.local` Anda sudah masuk di dalam berkas `.gitignore` agar kunci API Firebase Anda tidak bocor ke publik di GitHub!
2. Buka [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
3. Klik tombol **Add New...** > **Project**.
4. Pada bagian *Import Git Repository*, pilih repositori proyek `EduScore` Anda, lalu klik **Import**.
5. Di bagian **Configure Project**:
   * **Framework Preset:** Pilih `Vite` (Vercel biasanya mendeteksinya otomatis).
   * **Root Directory:** `./` (tetapkan default).
6. Buka bagian **Environment Variables**:
   * Masukkan nama variabel (Name) dan nilainya (Value) satu per satu sesuai dengan isi file `.env.local` Anda.
   * Contoh:
     * Name: `VITE_FIREBASE_API_KEY` | Value: `AIzaSyA...`
     * Name: `VITE_FIREBASE_AUTH_DOMAIN` | Value: `eduscore-app.firebaseapp.com`
     * (Lakukan untuk ke-6 variabel lingkungan Firebase).
7. Klik tombol **Deploy**.
8. Tunggu proses build selama kurang lebih 1-2 menit. Setelah selesai, aplikasi Anda aktif dan Anda akan mendapatkan link domain gratis dari Vercel (contoh: `eduscore-app.vercel.app`).

### Metode B: Menggunakan Vercel CLI (Deploy Langsung dari Terminal Lokal)
Jika Anda tidak menggunakan GitHub dan ingin men-deploy langsung dari terminal laptop Anda:
1. Buka terminal (Command Prompt / PowerShell) di folder proyek EduScore Anda.
2. Install Vercel CLI secara global (jika belum ada) menggunakan npm:
   ```bash
   npm install -g vercel
   ```
3. Lakukan login ke akun Vercel Anda lewat terminal:
   ```bash
   vercel login
   ```
   *Ikuti instruksi di layar untuk login via browser.*
4. Mulai proses inisialisasi deployment:
   ```bash
   vercel
   ```
5. Jawab pertanyaan yang muncul di terminal:
   * *Set up and deploy?* `y`
   * *Which scope?* (Pilih akun Vercel Anda)
   * *Link to existing project?* `n` (Buat proyek baru)
   * *What's your project's name?* `eduscore`
   * *In which directory is your code located?* `./`
   * *Want to modify settings?* `n` (Biarkan default karena Vite otomatis terdeteksi)
6. Setelah inisialisasi selesai, masuk ke dashboard [Vercel](https://vercel.com/) di browser Anda.
7. Buka proyek `eduscore` Anda > **Settings** > **Environment Variables**.
8. Masukkan ke-6 variabel lingkungan Firebase Anda di menu tersebut.
9. Kembali ke terminal Anda, lalu lakukan *deployment* ulang agar variabel lingkungan tersebut diterapkan:
   ```bash
   vercel --prod
   ```
10. Selesai! Link produksi aktif Anda akan ditampilkan di terminal.

---

## 4. Verifikasi Deployment

Setelah deployment sukses, lakukan langkah verifikasi berikut:
1. Kunjungi tautan website Vercel yang diberikan.
2. Coba lakukan pendaftaran akun Siswa baru melalui form registrasi di web produksi.
3. Periksa Firebase Console > Authentication untuk memastikan email siswa baru masuk ke daftar database.
4. Login menggunakan akun Admin Anda untuk memverifikasi fungsionalitas dashboard.
5. Cobalah menginput nilai, memfilter kelas, dan mengunduh berkas laporan cetak PDF untuk memastikan seluruh fitur berjalan dengan sempurna di server produksi.
