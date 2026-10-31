# PROMPT ANTIGRAVITY — IMPLEMENTASI FORMAT PENOMORAN DINAS DINAMIS

Saya ingin mengembangkan fitur pada aplikasi **Permohonan Nomor Surat** yang sudah ada. Terapkan format penomoran surat secara otomatis dan dinamis berdasarkan pilihan **Jenis Naskah Dinas** yang dipilih oleh pengguna.

## 1. Pilihan Jenis Naskah Dinas

Pada form permohonan nomor surat, sediakan lima pilihan berikut:

1. Naskah Dinas Korespondensi Internal
2. Naskah Dinas Korespondensi Eksternal
3. Naskah Dinas Khusus
4. Surat Keputusan (SK)
5. Surat Perintah (SPRIN)

Ketika pengguna memilih salah satu jenis tersebut, tampilkan informasi format penomoran yang sesuai secara otomatis.

## 2. Ketentuan Format Penomoran

Gunakan kode unit tetap **WP.18** untuk seluruh contoh format berikut.

### A. Naskah Dinas Korespondensi Internal

Format:

`KODE UNIT / KODE KLASIFIKASI / NOMOR URUT / TAHUN`

Contoh:

`WP.18/UM.01/001/2026`

Komponen:

- Kode Unit: WP.18
- Kode Klasifikasi: diambil dari pilihan atau master kode klasifikasi yang tersedia.
- Nomor Urut: nomor urut surat.
- Tahun: tahun penerbitan surat.

### B. Naskah Dinas Korespondensi Eksternal

Format:

`KODE UNIT / KATEGORI KEAMANAN / KODE KLASIFIKASI / NOMOR URUT / TAHUN`

Contoh:

`WP.18/B/PB.05.01/001/2026`

Komponen:

- Kode Unit: WP.18
- Kategori Keamanan: SR, R, T, atau B.
- Kode Klasifikasi: diambil dari master kode klasifikasi.
- Nomor Urut: nomor urut surat.
- Tahun: tahun penerbitan surat.

Kode:

- SR — Sangat Rahasia
- R — Rahasia
- T — Terbatas
- B — Biasa/Terbuka

Kategori keamanan wajib dipilih sebelum permohonan dapat dikirim apabila memilih Naskah Dinas Korespondensi Eksternal .

### C. Naskah Dinas Khusus

Format:

`KODE UNIT / KODE KLASIFIKASI / NOMOR URUT / TAHUN`

Contoh:

`WP.18/UM.02/001/2026`


### D. Surat Keputusan (SK)

Format:

`KODE UNIT / NOMOR URUT / KODE KLASIFIKASI / TAHUN`

Contoh:

`WP.18/001/KE.01/2026`

Komponen:

- Kode Unit: WP.18
- Nomor Urut: nomor urut surat keputusan.
- Kode Klasifikasi: diambil dari master kode klasifikasi.
- Tahun: tahun penerbitan.

### E. Surat Perintah (SPRIN)

Format:

`KODE UNIT / KODE KLASIFIKASI / NOMOR URUT`

Contoh:

`WP.18/UM.03/001`

Komponen:

- Kode Unit: WP.18
- Kode Klasifikasi: diambil dari master kode klasifikasi.
- Nomor Urut: nomor urut surat perintah.

## 5. Perbaiki penulisan timestaampe pada saaat pengiriman ke spreadsheet


## 6. Ketentuan Teknis dan Integrasi

Sebelum melakukan coding:

1. Pelajari komponen form permohonan yang sudah ada.
2. Identifikasi bagaimana data permohonan dikirim dan disimpan.
3. Pelajari API GAS yang ada pada code.md kemudian perbaharui sesuai dengan kebutuhan dan tabel untuk menyimpan hasil permohonan pada tb_pemohonan.md

Ketentuan implementasi:

- Jangan menghapus atau merusak fitur yang sudah berjalan.
- Apabila ada perubahan yang di rekomendasikan bisa di bicarakan dulu untuk meminta persetujuan


## 7. Hasil Akhir yang Diharapkan

Saat nanti generare pdf hasil permohonan dibagian field nomro surat nanti nya tidak hanya mencantumpak nomor saja tapi full dengan format penomoran surat yang berlaku sesuai dengan apa yang sudah dijelaskan diatas.

Lakukan implementasi langsung pada project yang ada, bukan hanya memberikan contoh kode atau penjelasan.

Setelah selesai:

1. Jelaskan file apa saja yang diubah.
2. Jelaskan perubahan yang dilakukan.
3. Pastikan seluruh lima jenis penomoran dapat diuji.
4. Jalankan pemeriksaan/build project dan perbaiki error yang ditemukan.
5. Pastikan fitur permohonan lama tetap berfungsi.
