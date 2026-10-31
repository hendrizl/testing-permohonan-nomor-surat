import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { JENIS_NASKAH_DINAS, KATEGORI_KEAMANAN } from "../../utils/formatNomorSurat";

export default function ConfirmModal({ onConfirm, onCancel, sections }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrapper">
          <div className="confirm-icon-circle">
            <FontAwesomeIcon icon={faFileLines} />
          </div>
        </div>
        <div className="modal-title">Konfirmasi Permohonan</div>
        <div className="modal-body">
          <div className="confirm-summary-list">
            {sections.map((s, i) => {
              const jenisLabel = JENIS_NASKAH_DINAS.find((j) => j.value === s.jenisNaskahDinas)?.label || "-";
              const katLabel = s.jenisNaskahDinas === "korespondensi_eksternal"
                ? KATEGORI_KEAMANAN.find((k) => k.value === s.kategoriKeamanan)?.label || "-"
                : null;

              return (
                <div key={s.id} className="confirm-summary-item">
                  {sections.length > 1 && <div className="confirm-summary-badge">{i + 1}</div>}
                  <div className="confirm-summary-text" style={{ fontSize: "13px", lineHeight: "1.6", color: "#1e293b", textAlign: "center" }}>
                    <strong>Anda Mengajukan Permohonan {s.jumlah} Nomor Surat {s.indeksKode || "(Indeks belum dipilih)"}</strong>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      Jenis: {jenisLabel}
                      {katLabel && <> · Kategori: {katLabel}</>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="modal-body-note">
            Pastikan semua data yang diisi sudah benar sebelum permohonan dikirim
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onCancel}>
            Batal
          </button>
          <button className="modal-btn-confirm" onClick={onConfirm}>
            <FontAwesomeIcon icon={faPaperPlane} />
            &nbsp;Ya, Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
