# EduScore 🎓

EduScore adalah sebuah aplikasi Sistem Informasi Akademik berbasis *web* yang dirancang khusus untuk mempermudah sekolah dalam mengelola, memantau, dan mendistribusikan nilai siswa secara digital dan *real-time*.

## 📖 Penjelasan Singkat (Non-Teknis)
Sederhananya, EduScore adalah "Rapor Digital" bagi sekolah. Di dalam aplikasi ini, terdapat 3 peran utama yang saling terhubung:
1. **Admin (Tata Usaha/Kepala Sekolah):** Memiliki kendali penuh untuk menambahkan data siswa baru, menyetujui akun guru, melihat ringkasan statistik sekolah (seperti rata-rata kelulusan), serta mencetak laporan nilai (rapor) dalam bentuk PDF.
2. **Guru:** Dapat dengan mudah memasukkan dan mengubah nilai siswa untuk mata pelajaran yang diampunya. Guru memasukkan nilai Tugas, UTS, dan UAS, dan sistem akan otomatis menghitung nilai akhir beserta status kelulusannya.
3. **Siswa:** Dapat login ke dalam portal untuk melihat hasil belajar dan nilai rapor mereka secara langsung dari perangkat masing-masing, tanpa harus menunggu lembar rapor fisik dibagikan.

Aplikasi ini dibuat agar proses penilaian di sekolah tidak lagi memusingkan, tidak memakan banyak kertas (*paperless*), serta transparan bagi seluruh pihak terkait.

## 🚀 Fitur Utama
* **Dashboard Interaktif:** Menampilkan ringkasan data siswa dan tingkat kelulusan.
* **Manajemen Pengguna:** Pendaftaran multi-peran (Siswa, Guru, Admin) dengan sistem persetujuan (Approval) untuk menjaga keamanan data.
* **Kalkulasi Otomatis:** Sistem secara pintar menghitung nilai akhir dengan bobot tertentu (contoh: Tugas 30%, UTS 30%, UAS 40%) dan menentukan status Lulus/Tidak Lulus berdasarkan KKM.
* **Ekspor Laporan (PDF):** Fitur mencetak kumpulan data nilai siswa menjadi dokumen PDF yang rapi dengan satu klik.

## 🛠️ Teknologi yang Digunakan
Aplikasi ini dikembangkan menggunakan bahasa pemrograman **JavaScript** dengan teknologi-teknologi modern berikut:
* **Frontend:**
  * **React.js (v19):** *Library* JavaScript populer untuk membangun antarmuka pengguna (UI) yang interaktif.
  * **Vite:** *Tool* untuk mem-build dan menjalankan aplikasi React dengan sangat cepat.
  * **Tailwind CSS:** *Framework* CSS yang digunakan untuk mendesain tampilan agar terlihat modern, elegan, dan responsif di berbagai ukuran layar.
* **Backend & Database (BaaS):**
  * **Firebase Firestore:** Database sinkronisasi *real-time* milik Google yang digunakan untuk menyimpan data pengguna dan nilai dengan aman.
  * **Firebase Authentication:** Sistem keamanan login dan registrasi akun.
* **Modul Tambahan:**
  * **React Router:** Mengatur navigasi dan perpindahan halaman.
  * **jsPDF & jsPDF-AutoTable:** Membuat dan mengunduh laporan ke dalam format PDF secara langsung dari peramban (browser).

---
*Dibuat untuk tugas dan evaluasi LSP (Lembaga Sertifikasi Profesi) Programmer.*
