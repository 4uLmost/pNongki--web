import React from 'react';

export default function ExploreSearchBar({
  searchQuery,
  setSearchQuery,
  currentCity,
  onOpenLocationModal,
}) {
  const isTooShort = searchQuery && searchQuery.trim().length === 1;
  const hasInvalidChars = Boolean(searchQuery && /[<>{}\\]/.test(searchQuery));

  return (
    <div className="sticky top-20 z-30 w-full border-b border-border-hairline bg-surface-card/95 backdrop-blur-md shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 flex items-center min-w-0">
            <div
              className={`w-full relative flex items-center bg-surface rounded-xl border transition-all shadow-xs ${
                hasInvalidChars
                  ? 'border-error ring-1 ring-error'
                  : 'border-border-hairline focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-primary ml-3.5 shrink-0 pointer-events-none">
                search
              </span>
              <input
                className="w-full h-10 pl-3 pr-2 rounded-xl bg-transparent border-0 outline-none text-on-surface placeholder:text-charcoal-subtle text-xs sm:text-sm font-medium min-w-0"
                placeholder="Cari kafe nugas, spot nongkrong, fasilitas publik, atau nama tempat..."
                type="text"
                maxLength={60}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Status / Validasi Pill & Tombol Clear (Responsif di dalam input) */}
              <div className="flex items-center gap-1.5 pr-3 shrink-0">
                {hasInvalidChars ? (
                  <span className="px-2 py-0.5 rounded-lg bg-error/10 text-error text-[11px] font-semibold flex items-center gap-1 shrink-0 animate-in fade-in">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    <span className="hidden xs:inline">Karakter tidak valid</span>
                  </span>
                ) : isTooShort ? (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 text-[11px] font-medium flex items-center gap-1 shrink-0 animate-in fade-in">
                    <span className="material-symbols-outlined text-[13px]">info</span>
                    <span>Min. 2 karakter</span>
                  </span>
                ) : null}

                {searchQuery.length > 40 && (
                  <span className="text-[10px] text-charcoal-subtle font-mono hidden sm:inline">
                    {searchQuery.length}/60
                  </span>
                )}

                {searchQuery && (
                  <button
                    aria-label="Hapus pencarian"
                    className="text-charcoal-subtle hover:text-on-surface transition-colors flex items-center cursor-pointer p-0.5"
                    type="button"
                    onClick={() => setSearchQuery('')}
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2.5 shrink-0 bg-surface rounded-xl border border-border-hairline px-3 py-2 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                near_me
              </span>
              <span className="text-xs font-bold text-on-surface truncate max-w-[150px] sm:max-w-xs">
                {currentCity}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors shrink-0 flex items-center gap-0.5 cursor-pointer ml-1"
              title="Ubah Lokasi"
            >
              <span>Ubah</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

