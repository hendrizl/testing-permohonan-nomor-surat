/**
 * Utility untuk membuat format penomoran surat berdasarkan Jenis Naskah Dinas.
 * Kode Unit tetap: WP.18
 */

const KODE_UNIT = "WP.18";

/**
 * Daftar 5 Jenis Naskah Dinas beserta ID dan label.
 */
export const JENIS_NASKAH_DINAS = [
  { value: "korespondensi_internal", label: "Naskah Dinas Korespondensi Internal" },
  { value: "korespondensi_eksternal", label: "Naskah Dinas Korespondensi Eksternal" },
  { value: "naskah_khusus", label: "Naskah Dinas Khusus" },
  { value: "surat_keputusan", label: "Surat Keputusan (SK)" },
  { value: "surat_perintah", label: "Surat Perintah (SPRIN)" },
];

/**
 * Daftar Kategori Keamanan (hanya untuk Korespondensi Eksternal).
 */
export const KATEGORI_KEAMANAN = [
  { value: "SR", label: "SR — Sangat Rahasia" },
  { value: "R", label: "R — Rahasia" },
  { value: "T", label: "T — Terbatas" },
  { value: "B", label: "B — Biasa/Terbuka" },
];

/**
 * Pad nomor urut menjadi 3 digit (001, 002, dst.)
 */
function padNomor(nomor) {
  return String(nomor).padStart(3, "0");
}

/**
 * Menghasilkan format penomoran surat lengkap berdasarkan jenis naskah dinas.
 *
 * @param {object} params
 * @param {string} params.jenisNaskah — value dari JENIS_NASKAH_DINAS
 * @param {string} params.kodeKlasifikasi — kode klasifikasi (misal: "UM.01", "PB.05.01")
 * @param {number|string} params.nomorUrut — nomor urut surat
 * @param {number|string} [params.tahun] — tahun penerbitan (default: tahun sekarang)
 * @param {string} [params.kategoriKeamanan] — kode kategori keamanan (SR/R/T/B), hanya untuk Eksternal
 * @returns {string} format nomor surat lengkap
 */
export function formatNomorSurat({
  jenisNaskah,
  kodeKlasifikasi,
  nomorUrut,
  tahun,
  kategoriKeamanan,
}) {
  const thn = tahun || new Date().getFullYear();
  const nomor = padNomor(nomorUrut);
  const klasifikasi = kodeKlasifikasi || "___";

  switch (jenisNaskah) {
    // A. Naskah Dinas Korespondensi Internal
    // Format: KODE UNIT / KODE KLASIFIKASI / NOMOR URUT / TAHUN
    case "korespondensi_internal":
      return `${KODE_UNIT}/${klasifikasi}/${nomor}/${thn}`;

    // B. Naskah Dinas Korespondensi Eksternal
    // Format: KODE UNIT / KATEGORI KEAMANAN / KODE KLASIFIKASI / NOMOR URUT / TAHUN
    case "korespondensi_eksternal": {
      const kat = kategoriKeamanan || "B";
      return `${KODE_UNIT}/${kat}/${klasifikasi}/${nomor}/${thn}`;
    }

    // C. Naskah Dinas Khusus
    // Format: KODE UNIT / KODE KLASIFIKASI / NOMOR URUT / TAHUN
    case "naskah_khusus":
      return `${KODE_UNIT}/${klasifikasi}/${nomor}/${thn}`;

    // D. Surat Keputusan (SK)
    // Format: KODE UNIT / NOMOR URUT / KODE KLASIFIKASI / TAHUN
    case "surat_keputusan":
      return `${KODE_UNIT}/${nomor}/${klasifikasi}/${thn}`;

    // E. Surat Perintah (SPRIN)
    // Format: KODE UNIT / KODE KLASIFIKASI / NOMOR URUT
    case "surat_perintah":
      return `${KODE_UNIT}/${klasifikasi}/${nomor}`;

    default:
      return `${nomor}`;
  }
}

/**
 * Mendapatkan template format penomoran (untuk ditampilkan sebagai contoh/preview).
 *
 * @param {string} jenisNaskah — value dari JENIS_NASKAH_DINAS
 * @returns {string} template format
 */
export function getFormatTemplate(jenisNaskah) {
  switch (jenisNaskah) {
    case "korespondensi_internal":
      return "WP.18 / [Kode Klasifikasi] / [Nomor Urut] / [Tahun]";
    case "korespondensi_eksternal":
      return "WP.18 / [Kat. Keamanan] / [Kode Klasifikasi] / [Nomor Urut] / [Tahun]";
    case "naskah_khusus":
      return "WP.18 / [Kode Klasifikasi] / [Nomor Urut] / [Tahun]";
    case "surat_keputusan":
      return "WP.18 / [Nomor Urut] / [Kode Klasifikasi] / [Tahun]";
    case "surat_perintah":
      return "WP.18 / [Kode Klasifikasi] / [Nomor Urut]";
    default:
      return "";
  }
}

