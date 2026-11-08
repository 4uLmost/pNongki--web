import React from 'react';

export default function AuthAlerts({
  requiredNotice,
  errorMessage,
  successMessage,
  handleResendVerification,
  isResending,
}) {
  return (
    <>
      {requiredNotice && !successMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-primary-container/40 border border-primary/30 text-on-surface flex items-start gap-2.5 text-xs animate-in fade-in shadow-2xs">
          <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">
            lock
          </span>
          <div>
            <h5 className="font-extrabold text-on-surface">Akses Membutuhkan Akun</h5>
            <p className="font-semibold text-charcoal-subtle mt-0.5 leading-relaxed">
              {requiredNotice}
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-error/10 border border-error/20 text-error flex flex-col gap-2.5 text-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
              error
            </span>
            <span className="font-semibold leading-relaxed">{errorMessage}</span>
          </div>
          {errorMessage.toLowerCase().includes('konfirmasi') && (
            <div className="pl-7 pt-1 border-t border-error/20 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className="px-3 py-1 rounded-xl bg-error/15 hover:bg-error/25 font-bold text-[11px] text-error transition-all cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                <span>{isResending ? 'Mengirim...' : 'Kirim Ulang Email Konfirmasi'}</span>
              </button>
              <span className="text-[10px] text-charcoal-subtle">
                Cek juga folder Spam/Junk di email Anda.
              </span>
            </div>
          )}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-2.5 text-xs animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
            check_circle
          </span>
          <span className="font-semibold leading-relaxed">{successMessage}</span>
        </div>
      )}
    </>
  );
}

