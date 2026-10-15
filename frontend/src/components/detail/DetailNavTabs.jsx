import React from 'react';

export default function DetailNavTabs({
  activeTab,
  setActiveTab,
  reviewCount = 0,
}) {
  return (
    <nav className="sticky top-20 z-30 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 bg-surface/95 backdrop-blur-md py-3 border-b border-border-hairline">
      <div className="max-w-[1280px] mx-auto flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('fasilitas')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'fasilitas'
              ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-bold'
              : 'bg-surface-card hover:bg-surface-container text-on-surface border border-border-hairline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">interests</span>
          <span>Fasilitas & Suasana</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-bold'
              : 'bg-surface-card hover:bg-surface-container text-on-surface border border-border-hairline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          <span>Daftar Menu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ulasan')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'ulasan'
              ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-bold'
              : 'bg-surface-card hover:bg-surface-container text-on-surface border border-border-hairline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>Ulasan Komunitas</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'ulasan'
                ? 'bg-white/20 text-white'
                : 'bg-surface-container text-on-surface'
            }`}
          >
            {reviewCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lokasi')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'lokasi'
              ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-bold'
              : 'bg-surface-card hover:bg-surface-container text-on-surface border border-border-hairline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">directions_bus</span>
          <span>Lokasi & Akses Transit</span>
        </button>
      </div>
    </nav>
  );
}

