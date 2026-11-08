import React from 'react';

export default function LandingPartnershipBanner({ onNavigate }) {
  return (
    <section id="tambah-tempat" className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pb-20 w-full">
      <div className="relative bg-inverse-surface text-inverse-on-surface rounded-3xl p-8 md:p-12 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl z-10">
          <p className="text-xs font-semibold text-primary-container tracking-wide uppercase mb-2">
            Kemitraan Tempat
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl leading-tight text-surface-card font-bold">
            Daftarkan Tempat Usahamu di pNongki!
          </h2>
          <p className="text-sm text-inverse-on-surface/80 mt-3 leading-relaxed font-normal">
            Jangkau ribuan mahasiswa dan komunitas lokal yang mencari tempat nongkrong, nugas, dan beraktivitas setiap hari. Dapatkan analitik pengunjung dan ulasan otentik.
          </p>
        </div>

        <div className="shrink-0 z-10 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('tambah-tempat')}
            className="inline-flex w-full md:w-auto items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-primary-container text-on-surface hover:bg-accent-hover text-sm font-bold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add_business</span>
            <span>Tambah Tempat Sekarang</span>
          </button>
        </div>
      </div>
    </section>
  );
}

