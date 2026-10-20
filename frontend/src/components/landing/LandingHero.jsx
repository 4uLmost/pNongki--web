import React from 'react';
import { CATEGORY_TABS } from './landingData';

export default function LandingHero({
  currentCity,
  onOpenLocationModal,
  searchQuery,
  setSearchQuery,
  selectedRadius,
  setSelectedRadius,
  activeCategory,
  setActiveCategory,
  onNavigate,
}) {
  return (
    <div className="relative w-full">
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pt-10 pb-14 md:pt-14 md:pb-16 text-center flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-on-surface max-w-4xl tracking-tight leading-tight">
          Cari Tempat Nongkrong &amp; Nugas{' '}
          <span className="text-on-surface font-extrabold">Paling Pas</span>{' '}
          Buat Kamu
        </h1>

        <p className="text-base sm:text-lg text-charcoal-subtle max-w-2xl mt-4 mb-8 leading-relaxed font-normal">
          Rekomendasi spot cafe dengan WiFi kencang, coworking nugas, arena olahraga, hingga fasilitas umum terdekat dari lokasimu.
        </p>

        <div className="w-full max-w-4xl bg-surface-card rounded-2xl p-4 md:p-6 shadow-xs border border-border-hairline text-left flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-border-hairline/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">near_me</span>
              <span className="text-xs sm:text-sm text-on-surface">
                Lokasi Kamu: <strong className="text-on-surface font-semibold">{currentCity}</strong>
              </span>
            </div>
            <button
              onClick={onOpenLocationModal}
              className="text-xs sm:text-sm text-primary font-bold hover:underline flex items-center gap-1 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              type="button"
            >
              Ubah Lokasi
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">tune</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 flex items-center gap-3 bg-surface-container-low/70 border border-transparent focus-within:border-border-hairline px-4 py-3 rounded-xl focus-within:bg-surface-card focus-within:shadow-xs transition-all">
              <span className="material-symbols-outlined text-[20px] text-charcoal-subtle" aria-hidden="true">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-on-surface placeholder:text-charcoal-subtle focus:outline-none"
                placeholder="Cari cafe, coworking, spot badminton, atau fasilitas..."
                aria-label="Cari tempat atau fasilitas"
                type="text"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-charcoal-subtle hover:text-on-surface cursor-pointer"
                  aria-label="Hapus pencarian"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">cancel</span>
                </button>
              )}
            </div>

            <div className="md:col-span-3 flex items-center gap-2 bg-surface-container-low/70 px-4 py-3 rounded-xl border border-transparent">
              <span className="material-symbols-outlined text-[20px] text-charcoal-subtle" aria-hidden="true">radar</span>
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(e.target.value)}
                aria-label="Pilih radius jarak"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="3">Radius 3 km</option>
                <option value="5">Radius 5 km</option>
                <option value="10">Radius 10 km</option>
                <option value="20">Seluruh Kota</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                className="w-full py-3 px-5 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                type="button"
                onClick={() => onNavigate('explore', { query: searchQuery, category: activeCategory })}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">travel_explore</span>
                <span>Cari Tempat</span>
              </button>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? 'bg-primary-container text-on-surface shadow-2xs font-bold'
                      : 'bg-surface-card hover:bg-surface-container-high text-on-surface border border-border-hairline'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

