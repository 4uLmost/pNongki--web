import React from 'react';

export default function SuccessRedeemModal({
  data,
  countdown,
  onClose,
  onViewVoucher,
}) {
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-border-hairline relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-on-surface rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          title="Tutup"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[32px]">verified</span>
        </div>

        <h3 className="text-xl font-extrabold text-on-surface tracking-tight mb-2">
          Penukaran Berhasil! 🎉
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-subtle leading-relaxed mb-4">
          Berhasil menukarkan poin dengan{' '}
          <strong className="text-on-surface font-extrabold block mt-1">
            "{data.reward.title}"
          </strong>
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-charcoal-subtle text-[11px] font-semibold mb-6">
          <span className="material-symbols-outlined text-[14px] text-primary">timer</span>
          <span>Menutup otomatis dalam <strong>{countdown} detik</strong></span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              const ticket = data.ticket;
              onClose();
              if (onViewVoucher) onViewVoucher(ticket);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-primary-container">
              confirmation_number
            </span>
            <span>Lihat Voucher</span>
          </button>
        </div>
      </div>
    </div>
  );
}

