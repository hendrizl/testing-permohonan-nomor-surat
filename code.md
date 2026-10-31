/**
 * TESTING SPREADSHEET 
 */
const SS_ID = '1SWeNy8frB_iA_A0LXuTyeYBOHDWgGR2T2N8ubpIPnC0';

const SHEETS = {
  USER: 'tb_user',
  BIDANG: 'tb_bidang',
  KODE: 'tb_kode',
  INDEKS: 'tb_indeks',
  PERMOHONAN: 'tb_permohonan',
  JENIS: 'tb_jenis',
  SIFAT: 'tb_sifat'
};

const kodeInput = "";
const jenisInput = "";

/**
 * GET REQUEST
 */
function doGet(e) {
  const action = e.parameter.action;
  let response;

  try {
    switch (action) {
      case 'getUser': // Cari nama berdasarkan username
        response = getNamaByUsername(e.parameter.username);
        break;
      case 'getNamaByNIP': // NEW: Cari nama berdasarkan NIP
        response = getNamaByNIP(e.parameter.nip);
        break;
      case 'getLists':
        response = getBidang_Kode_Jenis_Sifat();
        break; 
      case 'getIndeks':
        response = getIndeksByKode(e.parameter.kode);
        break;
      case 'getPermohonan':
        response = getPermohonanByNIP(e.parameter.nip);
        break;
      default:
        throw new Error("Action tidak valid.");
    }

    return buildResponse(response);
  } catch (error) {
    return buildResponse({ error: error.message }, 400);
  }
}

/**
 * POST REQUEST
 */
function doPost(e) {
  try {
    const jsonData = JSON.parse(e.postData.contents);
    const action = jsonData.action;

    if (action === 'tambahPermohonan') {
      const result = prosesTambahPermohonan(jsonData.data);
      return buildResponse({code: 200, success: true, message: "Data berhasil disimpan", detail: result });
    } else {
      throw new Error("Action POST tidak valid.");
    }
  } catch (error) {
    return buildResponse({ success: false, error: error.message }, 400);
  }
}

/**
 * NEW: Get Nama berdasarkan NIP
 * Asumsi: Di tb_user, NIP ada di Kolom A dan Nama ada di Kolom B
 * (Jika letak kolom berbeda, ubah angka di index row[x])
 */
function getNamaByNIP(nipInput) {
  if (!nipInput) throw new Error("Parameter 'nip' diperlukan.");
  
  const data = getSheetData(SHEETS.USER);
  const nipMap = new Map();

  // Optimasi: Mapping data untuk pencarian O(1)
  data.slice(1).forEach(row => {
    // row[0] adalah kolom A (NIP), row[1] adalah kolom B (Nama)
    // Silakan sesuaikan index jika NIP/Nama di kolom lain
    nipMap.set(String(row[1]), row[2]); 
  });
  
  const hasilNama = nipMap.get(String(nipInput));
  
  return { 
    nip: nipInput,
    nama: hasilNama || "Nama tidak ditemukan untuk NIP tersebut" 
  };
}
/**
 * 2. Get Seluruh Bidang & Kode
 */
function getBidang_Kode_Jenis_Sifat() {
  const bidangData = getSheetData(SHEETS.BIDANG);
  const kodeData = getSheetData(SHEETS.KODE);
  const jenisData = getSheetData(SHEETS.JENIS);
  const sifatData = getSheetData(SHEETS.SIFAT);

  return {
    bidang: bidangData.slice(1)
      .filter(row => row[1] && row[1].toString().trim() !== "")
      .map(row => row[1]),
      
    kode: kodeData.slice(1)
      .filter(row => row[1] && row[1].toString().trim() !== "")
      .map(row => `${row[1]} (${row[2] || ''})`),
    
    jenis: jenisData.slice(1)
      .filter(row => row[1] && row[1].toString().trim() !== "")
      .map(row => row[1]),

    sifat: sifatData.slice(1)
      .filter(row => row[2] && row[1].toString().trim() !== "")
      .map(row => row[2]),  

    kodeInput: kodeData.slice(1)
      .filter(row => row[1] && row[1].toString().trim() !== "")
      .map(row => row[1]),

  };

  
}

/**
 * 3. Get Seluruh Indeks berdasarkan Kode yang Sama
 * Menggunakan teknik Grouping agar tetap cepat untuk data 300+
 */
function getIndeksByKode(kodeInput) {
  if (!kodeInput) throw new Error("Parameter 'kode' diperlukan.");
  
  const data = getSheetData(SHEETS.INDEKS);
  const rows = data.slice(1); // Buang header
  
  /**
   * OPTIMASI: Mengelompokkan data berdasarkan kode ke dalam array
   * Hasil struktur indeksGroups: { "SA": ["Indeks 1", "Indeks 2"], "PR": ["Indeks A"] }
   */
  const indeksGroups = rows.reduce((acc, row) => {
    const kode = String(row[1]); // Kolom B sebagai Kunci
    const indeksValue = row[2];  // Kolom C sebagai Nilai Indeks
    
    if (!acc[kode]) {
      acc[kode] = []; // Buat array baru jika kode belum ada
    }
    
    // Hanya masukkan jika kolom indeks tidak kosong
    if (indeksValue) {
      acc[kode].push(indeksValue);
    }
    
    return acc;
  }, {});
  
  // Ambil daftar indeks berdasarkan input
  const hasil = indeksGroups[kodeInput] || [];
  
  return { 
    kode: kodeInput,
    jumlah_ditemukan: hasil.length,
    daftar_indeks: hasil.length > 0 ? hasil : "Indeks tidak ditemukan" 
  };
}

/**
 * 4. Get Data Permohonan berdasarkan NIP (Optimasi 2000+ data)
 */
function getPermohonanByNIP(nipInput) {
  if (!nipInput) throw new Error("Parameter 'nip' diperlukan.");
  
  const data = getSheetData(SHEETS.PERMOHONAN);
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows
    .filter(row => String(row[0]) === String(nipInput))
    .map(row => {
      let obj = {};
      headers.forEach((header, i) => obj[header] = row[i]);
      return obj;
    })
    .sort((a, b) => {
      // 1. Sort berdasarkan Tanggal (Terbaru ke Terlama)
      const dateA = new Date(a.tgl_surat);
      const dateB = new Date(b.tgl_surat);
      
      if (dateB - dateA !== 0) {
        return dateB - dateA;
      }

      // 2. Sort berdasarkan nomorSurat Terbesar (Descending)
      // Gunakan parseFloat jika kode adalah angka murni
      const numA = parseFloat(a.nomor_surat) || 0;
      const numB = parseFloat(b.nomor_surat) || 0;

      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA; // Jika angka murni, gunakan pengurangan
      }
      
      // 2. Jika tanggal sama, Sort berdasarkan nomorSurat (A-Z atau Angka)
      // Gunakan localeCompare agar pengurutan string lebih akurat
      return String(b.nomor_surat).localeCompare(String(a.nomor_surat), undefined, {numeric: true});
    });

  return {
    count: result.length,
    data: result
  };
}

/**
 * 05. Simpan ke tb_permohonan dengan Auto Number
 * 
 * Kolom tb_permohonan (sesuai tb_permohonan.md):
 *   A: nip
 *   B: id (REQ-yyyyMMddHHmmss)
 *   C: nama
 *   D: nomor_surat
 *   E: bidang
 *   F: kode
 *   G: indeks
 *   H: jenis_surat
 *   I: kat_keamanan
 *   J: tgl_permohonan
 *   K: tgl_surat
 *   L: isi_surat
 *   M: pengirim
 *   N: tujuan
 *   O: timestamp
 */
function prosesTambahPermohonan(item) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); 

  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    const sheet = ss.getSheetByName(SHEETS.PERMOHONAN);
    const lastRow = sheet.getLastRow();
    const timestamp = new Date();
    const ddmmyyyy = Utilities.formatDate(timestamp, "Asia/Makassar", "ddMMyyyy");
    const timeForID = Utilities.formatDate(timestamp, "Asia/Makassar", "yyyyMMddHHmmss");
    const nama_pemohon = item.nama;
    const kode_surat = item.kode;
    const indeks_surat = item.indeks;
    const ket = item.isi_surat;


    // --- MENCARI NOMOR URUT ID TERAKHIR (xxx) ---
    let nextIdCounter = 1;

    if (lastRow > 1) {

      const allIds = sheet.getRange(2, 2, lastRow - 1, 1).getValues().flat();
      
      // Debug: Cek apakah data terbaca
      console.log("Semua ID di kolom:", allIds);

      const searchString = "REQ-" + ddmmyyyy;
      const todayIds = allIds.filter(id => id && id.toString().includes(searchString));
      
      console.log("ID hari ini yang ketemu:", todayIds);

      if (todayIds.length > 0) {
        // Ambil ID terakhir dari hasil filter
        const lastId = todayIds[todayIds.length - 1].toString();
        const lastParts = lastId.split("-");
        
        // Ambil bagian angka paling belakang
        const lastCounter = parseInt(lastParts[lastParts.length - 1]);
        
        if (!isNaN(lastCounter)) {
          nextIdCounter = lastCounter + 1;
        }
      }
    }
    
    // Gabungkan menjadi REQ-20042026-1, dst.
    const requestId = "REQ-" + timeForID;
    // --------------------------------------------

    // Ambil nomor surat terakhir (Kolom D)
    let lastNumber = 0;
    if (lastRow > 1) {
      const dataNomor = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
      const numbers = dataNomor.map(r => parseInt(r[0])).filter(n => !isNaN(n));
      if (numbers.length > 0) lastNumber = Math.max(...numbers);
    }

    const jumlahLoop = parseInt(item.jumlah) || 1;
    const rowsToInsert = [];

    // Format tanggal permohonan dan tanggal surat dengan timezone yang benar
    const tglPermohonan = item.tgl_permohonan || Utilities.formatDate(timestamp, "Asia/Makassar", "yyyy-MM-dd");
    const tglSurat = item.tgl_surat || Utilities.formatDate(timestamp, "Asia/Makassar", "yyyy-MM-dd");
    
    // Format timestamp yang benar dengan timezone Asia/Makassar (WITA)
    const formattedTimestamp = Utilities.formatDate(timestamp, "Asia/Makassar", "yyyyMMddHHmmss");

    for (let i = 0; i < jumlahLoop; i++) {
      lastNumber++; 
      rowsToInsert.push([
        item.nip,                                // A: nip
        requestId,                               // B: id (REQ-yyyyMMddHHmmss)
        item.nama,                               // C: nama
        lastNumber,                              // D: nomor_surat
        item.bidang,                             // E: bidang
        item.kode,                               // F: kode
        item.indeks,                             // G: indeks
        item.jenis_surat || "",                  // H: jenis_surat
        item.kat_keamanan || "",                 // I: kat_keamanan
        tglPermohonan,                           // J: tgl_permohonan
        tglSurat,                                // K: tgl_surat
        item.isi_surat,                          // L: isi_surat
        item.pengirim,                           // M: pengirim
        item.tujuan,                             // N: tujuan
        formattedTimestamp                       // O: timestamp
      ]);
    }

    sheet.getRange(lastRow + 1, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);
    
    return { 
      nama_pemohon : nama_pemohon,
      kode : kode_surat,
      indeks : indeks_surat,
      jumlah_dibuat: jumlahLoop,
      first_number : `${lastNumber - jumlahLoop + 1}`,
      last_number : `${lastNumber}`,
      sample_id: rowsToInsert[0][0],
      keterangan : ket,
      jenis_surat: item.jenis_surat || "",
      jenis_naskah_id: item.jenis_naskah_id || "",
      kat_keamanan: item.kat_keamanan || ""
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * HELPER: Ambil data dari sheet
 */

function getSheetData(sheetName) {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet '${sheetName}' tidak ditemukan.`);
  return sheet.getDataRange().getValues();
}

/**
 * HELPER: Format response ke JSON
 */

function buildResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
