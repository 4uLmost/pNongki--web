import React from 'react';

export default function WebAcquisitionModal({
  isOpen,
  onClose,
  acquisitionReason = 'invite',
  onDownloadApk,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-border-hairline relative text-center"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="w-16 h-16 rounded-3xl bg-primary-container text-on-primary-container mx-auto flex items-center justify-center mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[32px]">group_add</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/40 text-on-primary-fixed text-xs font-bold mb-2">
          <span>📱 Fitur Eksklusif Aplikasi Mobile</span>
        </div>

        <h3 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight mb-2">
          Mau Ikutan Nongkrong?
        </h3>

        <p className="text-xs md:text-sm text-charcoal-subtle leading-relaxed mb-6">
          {acquisitionReason === 'invite'
            ? 'Membuat ajakan nongkrong dan mencari kawan nugas secara real-time dirancang khusus untuk kemudahan di aplikasi mobile pNongki!.'
            : 'Menghubungi pengajak dan konfirmasi slot secara instan dapat kamu lakukan langsung melalui aplikasi mobile pNongki!.'}
        </p>

        <div className="p-4 bg-surface-container-low rounded-2xl border border-border-hairline max-w-[200px] mx-auto mb-6 flex flex-col items-center">
          <div className="w-36 h-36 bg-surface-card p-2 rounded-xl border border-border-hairline flex items-center justify-center shadow-2xs">
            <svg
              className="w-full h-full text-on-surface"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M10 10h30v30h-30zM15 15v20h20v-20z" />
              <path d="M20 20h10v10h-10z" />
              <path d="M60 10h30v30h-30zM65 15v20h20v-20z" />
              <path d="M70 20h10v10h-10z" />
              <path d="M10 60h30v30h-30zM15 65v20h20v-20z" />
              <path d="M20 70h10v10h-10z" />
              <path d="M45 10h10v10h-10zM45 25h10v10h-10zM45 45h10v10h-10zM10 45h10v10h-10zM25 45h10v10h-10zM60 45h15v10h-15zM80 45h10v10h-10zM60 60h10v15h-10zM75 60h15v10h-15zM60 80h10v10h-10zM75 75h10v15h-10zM85 85h5v5h-5z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-charcoal-subtle mt-2">
            Scan via Kamera Ponsel
          </span>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onDownloadApk}
            className="w-full py-3 px-4 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              download
            </span>
            <span>Unduh APK Android (.apk)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer"
          >
            Lanjut di Web Saja
          </button>
        </div>
      </div>
    </div>
  );
}

