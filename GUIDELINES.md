# Coding Guidelines & Best Practices - EduScore

Dokumen ini berisi standar penulisan kode (*Coding Guidelines*) dan praktik-praktik terbaik (*Best Practices*) yang diterapkan dalam pengembangan sistem EduScore. Tujuannya adalah agar kode tetap bersih, mudah dibaca, dan mudah dikembangkan di masa depan (*maintainable*).

---

## 1. Pemisahan Tanggung Jawab (*Separation of Concerns*)
Sistem ini memisahkan logika menjadi beberapa lapisan (folder) agar tidak menumpuk di satu tempat:
*   **`src/components/`**: Khusus berisi potongan antarmuka UI murni (Tombol, Input, Tabel). Komponen di sini tidak boleh mengambil data langsung dari *database*, melainkan hanya menerima *props* (data titipan).
*   **`src/pages/`**: Komponen skala besar yang merepresentasikan satu layar penuh (misal: Halaman Dashboard, Halaman Login). Berfungsi merakit *components* dan menyuntikkan data ke dalamnya.
*   **`src/context/`**: Lapisan tempat berkumpulnya data (State Management) dari server/database. Seluruh pengaturan Firebase dan aliran data *real-time* difokuskan di sini, agar *pages* tidak repot menangani koneksi database.
*   **`src/hooks/`**: Lapisan fungsi pembantu bagi *React*. Dipakai untuk mempermudah pemanggilan data dari Context (contoh: `useSiswa()`, `useNilai()`).
*   **`src/utils/`**: Kumpulan fungsi matematika atau teks yang murni logika (tanpa elemen UI sama sekali).

## 2. Paradigma Pemrograman Campuran (*Hybrid Programming*)
Alih-alih fanatik terhadap satu jenis paradigma, EduScore memadukan kekuatan dua paradigma secara harmonis:
*   **Pemrograman Fungsional (*Functional Programming*):** Digunakan pada ekosistem React. Seluruh elemen UI dibangun sebagai *Functional Components* (bukan *Class Components*) karena lebih modern, ringan, dan mendukung ekosistem *Hooks* (`useState`, `useEffect`). Fungsi perhitungan di folder `utils` juga dirancang sebagai *Pure Functions* agar bebas bug.
*   **Pemrograman Berorientasi Objek (*OOP*):** Diterapkan pada manajemen tipe data dasar di dalam folder `src/classes/` (misal: class `Siswa`, `Guru`, `Nilai`). Hal ini berguna sebagai *blueprint* pelindung untuk mencegah format objek berantakan sebelum dikirim ke Firebase.

## 3. Prinsip DRY (*Don't Repeat Yourself*)
Jangan pernah menulis kode yang sama dua kali. EduScore mematuhi prinsip ini secara ketat di sisi antarmuka pengguna:
*   Semua kotak *input* form menggunakan komponen tunggal `<Input />`.
*   Seluruh tombol menggunakan komponen `<Button />`.
*   Apabila ke depannya ada perubahan desain tombol (misal sudutnya ingin lebih melengkung), *programmer* hanya perlu mengedit satu *file* `<Button />`, dan seluruh tombol di aplikasi akan otomatis berubah.

## 4. Pengelolaan Error dan Kesalahan Input (Defensive Programming)
Untuk mencegah aplikasi hancur mendadak (*crash*), diterapkan sistem perlindungan:
*   *Fallback Values*: Pada setiap penarikan data atau kalkulasi, selalu ditambahkan nilai cadangan (contoh: `const data = user.nama || 'Tanpa Nama'`).
*   *Validation Check*: Setiap sebelum menekan "Simpan", aplikasi akan mengecek ulang apakah semua isian teks sudah benar dan apakah formatnya sesuai (melalui fungsi validasi independen).
*   Mencegah *Click-Spamming*: Tombol aksi wajib memiliki penanda *Loading* (`disabled={loading}`) saat memproses data, demi mencegah pengguna mengeklik tombol puluhan kali secara tidak sengaja yang memicu beban ganda (*Double Submission*) pada server.

## 5. Tata Penamaan (*Naming Conventions*)
*   **CamelCase (`namaVariabel`):** Digunakan untuk semua penamaan fungsi biasa dan variabel penyimpanan data.
*   **PascalCase (`NamaKomponen`):** Digunakan HANYA untuk *file* yang berisi antarmuka React Component dan *Class* OOP.
*   **UPPER_SNAKE_CASE (`BATAS_NILAI`):** Digunakan untuk data patokan yang nilainya permanen dan tidak akan pernah berubah (*konstanta*).

## 6. Penataan CSS (Tailwind Rules)
Alih-alih membuat puluhan *file* `.css` yang berantakan, EduScore menggunakan **Tailwind CSS**. Seluruh pewarnaan (warna dasar: *Navy* dan *Emerald*) telah dibakukan dalam setelan tema global agar palet warnanya konsisten di seluruh halaman sistem.
