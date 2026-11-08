import React from 'react';

export default function PartnershipSuccessView({
  submissionResult,
  onNavigate,
}) {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-status-open/15 text-status-open flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[36px]">check_circle</span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4e684] text-[#181e00] text-xs font-bold uppercase tracking-wider mb-2">
        <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
        <span>Menunggu Verifikasi Admin</span>
      </div>

      <h2 className="text-2xl font-bold text-[#242424]">Pengajuan Kemitraan Diterima!</h2>
      <p className="text-xs sm:text-sm text-[#6E6E6B] mt-2 max-w-md leading-relaxed">
        Dokumen kemitraan untuk <strong>{submissionResult.placeName}</strong> telah berhasil dikirimkan ke tim kurasi &amp; administrator pNongki!.
      </p>

      <div className="w-full my-6 p-5 rounded-2xl bg-[#F8F8F6] border border-[#E8E8E4] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
        <div>
          <span className="text-[11px] font-bold text-[#6E6E6B] uppercase tracking-wider block">
            Nomor Tiket Pengajuan
          </span>
          <span className="text-lg font-mono font-bold text-[#242424]">{submissionResult.ticketCode}</span>
        </div>
        <div className="sm:text-right">
          <span className="text-[11px] font-bold text-[#6E6E6B] uppercase tracking-wider block">
            Waktu Pengajuan
          </span>
          <span className="text-xs font-semibold text-[#242424]">{submissionResult.submittedAt}</span>
        </div>
      </div>

      <div className="w-full text-left bg-[#F8F8F6] rounded-2xl p-5 border border-[#E8E8E4] mb-8">
        <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3">
          Tahapan Selanjutnya:
        </h3>
        <ul className="space-y-2.5 text-xs text-[#6E6E6B]">
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#181e00] shrink-0 mt-0.5">check</span>
            <span><strong>Verifikasi Admin:</strong> Kurator memeriksa kelengkapan data tempat dan dokumen pendukung dalam 1x24 jam kerja.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#181e00] shrink-0 mt-0.5">chat</span>
            <span><strong>Konfirmasi Kontak:</strong> Tim kami akan mengirim pesan konfirmasi ke nomor WhatsApp atau Email yang Anda daftarkan.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#181e00] shrink-0 mt-0.5">verified</span>
            <span><strong>Aktivasi Status Mitra:</strong> Setelah disetujui, lencana Official Partner dan fitur reservasi meja akan langsung tayang di pNongki!.</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('profil')}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#242424] hover:bg-black text-white text-xs font-bold shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px] text-[#d4e684]">account_circle</span>
          <span>Pantau Status di Profil</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('beranda')}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#E8E8E4] hover:border-[#242424] text-xs font-bold text-[#242424] transition-colors cursor-pointer"
        >
          Kembali ke Beranda
        </button>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('explore')}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#E8E8E4] hover:border-[#242424] text-xs font-bold text-[#242424] transition-colors cursor-pointer"
        >
          Jelajahi Direktori Tempat
        </button>
      </div>
    </div>
  );
}

