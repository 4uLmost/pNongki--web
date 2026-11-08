import React from 'react';

function StylizedQrSvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto" fill="currentColor">
      <rect x="5" y="5" width="26" height="26" rx="4" fill="#111" />
      <rect x="9" y="9" width="18" height="18" rx="2" fill="#fff" />
      <rect x="13" y="13" width="10" height="10" rx="1" fill="#111" />

      <rect x="69" y="5" width="26" height="26" rx="4" fill="#111" />
      <rect x="73" y="9" width="18" height="18" rx="2" fill="#fff" />
      <rect x="77" y="13" width="10" height="10" rx="1" fill="#111" />

      <rect x="5" y="69" width="26" height="26" rx="4" fill="#111" />
      <rect x="9" y="73" width="18" height="18" rx="2" fill="#fff" />
      <rect x="13" y="77" width="10" height="10" rx="1" fill="#111" />

      <rect x="36" y="8" width="5" height="5" fill="#111" />
      <rect x="46" y="8" width="5" height="5" fill="#111" />
      <rect x="56" y="8" width="5" height="5" fill="#111" />
      <rect x="36" y="18" width="5" height="5" fill="#111" />
      <rect x="51" y="18" width="5" height="5" fill="#111" />
      <rect x="41" y="28" width="5" height="5" fill="#111" />
      <rect x="51" y="28" width="5" height="5" fill="#111" />
      <rect x="8" y="36" width="5" height="5" fill="#111" />
      <rect x="18" y="36" width="5" height="5" fill="#111" />
      <rect x="28" y="36" width="5" height="5" fill="#111" />
      <rect x="36" y="36" width="5" height="5" fill="#111" />
      <rect x="46" y="36" width="5" height="5" fill="#111" />
      <rect x="56" y="36" width="5" height="5" fill="#111" />
      <rect x="66" y="36" width="5" height="5" fill="#111" />
      <rect x="76" y="36" width="5" height="5" fill="#111" />
      <rect x="86" y="36" width="5" height="5" fill="#111" />
      <rect x="18" y="46" width="5" height="5" fill="#111" />
      <rect x="28" y="46" width="5" height="5" fill="#111" />
      <rect x="38" y="46" width="5" height="5" fill="#111" />
      <rect x="48" y="46" width="5" height="5" fill="#111" />
      <rect x="58" y="46" width="5" height="5" fill="#111" />
      <rect x="78" y="46" width="5" height="5" fill="#111" />
      <rect x="8" y="56" width="5" height="5" fill="#111" />
      <rect x="28" y="56" width="5" height="5" fill="#111" />
      <rect x="43" y="56" width="5" height="5" fill="#111" />
      <rect x="58" y="56" width="5" height="5" fill="#111" />
      <rect x="68" y="56" width="5" height="5" fill="#111" />
      <rect x="88" y="56" width="5" height="5" fill="#111" />
      <rect x="36" y="66" width="5" height="5" fill="#111" />
      <rect x="46" y="66" width="5" height="5" fill="#111" />
      <rect x="66" y="66" width="5" height="5" fill="#111" />
      <rect x="76" y="66" width="5" height="5" fill="#111" />
    </svg>
  );
}

export default function ClaimReceiptModal({
  ticket,
  showQr,
  qrCountdown,
  qrToken,
  qrImgError,
  setQrImgError,
  handleToggleQr,
  handleRefreshQr,
  onClose,
  showToast,
}) {
  if (!ticket) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-border-hairline relative text-center max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="w-16 h-16 rounded-3xl bg-primary-container text-on-primary-container mx-auto flex items-center justify-center mb-3.5 shadow-sm">
          <span className="material-symbols-outlined text-[32px]">verified</span>
        </div>

        <h3 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight mb-1">
          Tiket Klaim Hadiah
        </h3>
        <p className="text-xs text-charcoal-subtle mb-5">
          Simpan struk digital ini sebagai bukti penukaran poin resmimu di pNongki!.
        </p>

        <div className="p-5 rounded-2xl bg-surface-container-low border border-dashed border-border-hairline text-left flex flex-col gap-3 mb-5">
          <div className="flex items-center justify-between border-b border-border-hairline pb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle">
              KODE KLAIM UNIK
            </span>
            <span className="text-base font-mono font-extrabold text-primary">
              {ticket.claimCode}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-subtle">Nama Hadiah</span>
            <p className="text-sm font-bold text-on-surface">{ticket.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-subtle block">Biaya Poin</span>
              <span className="font-semibold text-on-surface">{ticket.pointCost} Poin</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-subtle block">Status</span>
              <span className="font-semibold text-primary">
                {ticket.type === 'merchandise' ? 'Menunggu Ambil' : 'Siap Pakai'}
              </span>
            </div>
          </div>

          {ticket.voucherCode && (
            <div className="pt-2 border-t border-border-hairline">
              <span className="text-[10px] uppercase font-bold text-charcoal-subtle block mb-1">
                KODE VOUCER KASIR
              </span>
              <div className="p-2 rounded-xl bg-surface-card border font-mono font-bold text-center text-sm text-on-surface tracking-wider">
                {ticket.voucherCode}
              </div>
            </div>
          )}

          {ticket.type !== 'merchandise' && showQr && (
            <div className="pt-3 border-t border-dashed border-border-hairline flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-charcoal-subtle flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">qr_code_scanner</span>
                  QR Dinamis Kasir
                </span>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    qrCountdown > 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-red-100 text-red-700 border border-red-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px] animate-pulse">timer</span>
                  {qrCountdown > 0 ? `${qrCountdown}s` : 'Expired'}
                </span>
              </div>

              {qrCountdown > 0 ? (
                <div className="flex flex-col items-center bg-white p-3 rounded-2xl border shadow-xs w-full max-w-[200px]">
                  {!qrImgError ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        `PNONGKI-PROMO:${ticket.voucherCode || ticket.claimCode}:${qrToken}`
                      )}`}
                      alt="QR Code Voucher"
                      className="w-36 h-36 object-contain"
                      onError={() => setQrImgError(true)}
                    />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center">
                      <StylizedQrSvg />
                    </div>
                  )}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-1000 rounded-full"
                      style={{ width: `${(qrCountdown / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-charcoal-subtle mt-1.5 text-center">
                    Tunjukkan QR ke kasir mitra pNongki!
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center w-full flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-[28px]">error</span>
                  <p className="text-xs font-bold text-red-700">QR Code Telah Kedaluwarsa</p>
                  <p className="text-[10px] text-red-600 max-w-[220px]">
                    Batas waktu 30 detik telah habis demi keamanan voucer kamu.
                  </p>
                  <button
                    type="button"
                    onClick={handleRefreshQr}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">refresh</span>
                    <span>Perbarui QR (30 Detik)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {ticket.type === 'merchandise' ? (
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `Halo Admin pNongki!, saya telah menukarkan poin untuk "${ticket.title}" dengan Kode Klaim ${ticket.claimCode}. Mohon konfirmasi jadwal pengambilan barang di kampus.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-status-open text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-status-open/90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Konfirmasi Ambil via WhatsApp Admin</span>
            </a>
          ) : (
            <>
              <button
                type="button"
                onClick={handleToggleQr}
                className="w-full py-2.5 px-4 rounded-xl bg-primary-container hover:bg-accent-hover text-on-surface font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                <span>{showQr ? 'Sembunyikan QR' : 'Tampilkan QR (30 Detik)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard && ticket.voucherCode) {
                    navigator.clipboard.writeText(ticket.voucherCode);
                  }
                  if (showToast) showToast('Kode voucer disalin!');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span>Salin Kode Voucer</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer"
          >
            Tutup Struk
          </button>
        </div>
      </div>
    </div>
  );
}

