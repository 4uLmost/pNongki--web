import React, { useState } from 'react';

export default function InviteModal({ place, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!place) return null;

  const handleCopy = () => {
    const text = `Hai! Yuk nongkrong/nugas bareng di "${place.name}". Lokasi: ${place.address}. Cek detail di pNongki!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border-hairline relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-surface flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">share</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">Ajak Teman Nongkrong!</h3>
            <p className="text-xs text-charcoal-subtle">Kirim undangan &amp; lokasi langsung ke WhatsApp/Telegram</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-2xl border border-border-hairline text-xs space-y-2 mb-4">
          <p className="font-bold text-on-surface text-sm">{place.name}</p>
          <p className="text-charcoal-subtle">{place.address}</p>
          <div className="text-[11px] font-mono bg-surface-card p-2 rounded-lg border border-border-hairline text-charcoal-subtle">
            "Hai! Yuk nongki di {place.name}. {place.address}"
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <span className="material-symbols-outlined text-[18px] text-primary-container">check_circle</span>
                <span>Teks Undangan Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] text-primary-container">content_copy</span>
                <span>Salin Pesan Undangan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
