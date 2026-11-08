import React from 'react';

export default function ConfirmExchangeModal({
  confirmingReward,
  onClose,
  isRedeeming,
  onConfirm,
  pointsBalance,
}) {
  if (!confirmingReward) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={() => !isRedeeming && onClose()}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-border-hairline relative"
        onClick={(e) => e.stopPropagation()}
      >
        {!isRedeeming && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-on-surface rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            title="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-surface flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">redeem</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-on-surface leading-tight">
              Konfirmasi Tukar Poin
            </h3>
            <p className="text-xs text-charcoal-subtle mt-0.5">
              Tukarkan saldo poinmu dengan voucher pilihan
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline mb-4 flex items-center gap-3">
          <img
            src={confirmingReward.imageUrl}
            alt={confirmingReward.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-border-hairline"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block truncate">
              {confirmingReward.merchant}
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-on-surface line-clamp-1 mt-0.5">
              {confirmingReward.title}
            </h4>
            <span className="inline-block mt-1 text-[11px] font-extrabold text-primary">
              {confirmingReward.pointCost} Poin
            </span>
          </div>
        </div>

        <div className="space-y-2.5 p-3.5 rounded-2xl bg-surface-container-low/70 border border-border-hairline text-xs mb-5">
          <div className="flex items-center justify-between">
            <span className="text-charcoal-subtle">Poin user sekarang:</span>
            <span className="font-bold text-on-surface">{pointsBalance} Poin</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoal-subtle">Harga yang ditukarkan:</span>
            <span className="font-bold text-error">-{confirmingReward.pointCost} Poin</span>
          </div>
          <div className="pt-2 border-t border-border-hairline flex items-center justify-between font-bold text-on-surface">
            <span>Sisa poin setelah tukar:</span>
            <span className="text-primary font-extrabold">
              {Math.max(0, pointsBalance - confirmingReward.pointCost)} Poin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isRedeeming}
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isRedeeming}
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isRedeeming ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Tukar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

