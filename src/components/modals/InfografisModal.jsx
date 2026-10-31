import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import imgInfo from "../../assets/img_info.jpg";

export default function InfografisModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="infografis-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          className="infografis-modal-close"
          onClick={onClose}
          type="button"
          aria-label="Tutup Infografis"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <img
          src={imgInfo}
          alt="Infografis Panduan Permohonan Nomor Surat"
          className="infografis-modal-img"
        />
      </div>
    </div>
  );
}

