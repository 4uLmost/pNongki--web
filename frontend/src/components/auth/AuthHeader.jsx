import React from 'react';

export default function AuthHeader({ onNavigate }) {
  return (
    <div className="flex items-center justify-between w-full">
      <button
        type="button"
        onClick={() => onNavigate && onNavigate('beranda')}
        className="flex items-center group cursor-pointer text-left focus:outline-none"
      >
        <img
          src="/pNongki-Logo.png"
          alt="pNongki!"
          className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
        />
      </button>

      {onNavigate && (
        <button
          type="button"
          onClick={() => onNavigate('beranda')}
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface bg-surface-card hover:bg-surface-container-high px-4 py-2.5 rounded-2xl border border-border-hairline shadow-xs transition-all cursor-pointer group active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-charcoal-subtle transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          <span>Kembali ke Beranda</span>
        </button>
      )}
    </div>
  );
}

