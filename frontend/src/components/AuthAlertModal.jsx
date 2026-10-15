import React from 'react';

export default function AuthAlertModal({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-border-hairline text-center flex flex-col items-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Alert Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary-container/40 text-on-primary-container flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>

        {/* Alert Content */}
        <h3 className="text-lg sm:text-xl font-bold text-on-surface mb-2">
          Perlu Masuk Akun
        </h3>
        <p className="text-sm text-charcoal-subtle leading-relaxed mb-6 font-medium">
          Untuk menggunakan fitur ini anda harus login
        </p>

        {/* Action Buttons: Tombol Masuk & Tombol Daftar */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('login');
            }}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Masuk</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('register');
            }}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-primary-container hover:bg-accent-hover text-on-surface text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Daftar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

