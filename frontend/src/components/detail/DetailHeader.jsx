import React from 'react';

export default function DetailHeader({
  currentPlace,
  isPartner,
  isFavorite,
  currentCity,
  reviewCount,
  setActiveTab,
  onToggleFavorite,
  showToast,
  handleCopyInviteLink,
}) {
  const displayRating = Number(currentPlace.rating || 0).toFixed(1);

  const displayReviewsCount =
    reviewCount !== undefined && reviewCount !== null
      ? reviewCount
      : currentPlace.reviewCount || 0;
  return (
    <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div className="flex flex-col gap-2 max-w-3xl">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold tracking-wider uppercase border border-border-hairline">
            {currentPlace.categoryKey?.toUpperCase() || 'NUGAS & KERJA'}
          </span>
          {isPartner && (
            <span className="px-3 py-1 rounded-full bg-primary-container text-on-surface text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 border border-primary/20">
              <span className="material-symbols-outlined text-[14px]">handshake</span>
              Mitra Resmi pNongki
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
          {currentPlace.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm text-charcoal-subtle">
          <button
            type="button"
            onClick={() => setActiveTab('ulasan')}
            className="flex items-center gap-1.5 text-on-surface font-bold hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[18px] text-primary fill-1">star</span>
            <span className="text-base">{displayRating}</span>
            <span className="font-normal text-charcoal-subtle group-hover:underline">
              ({displayReviewsCount} ulasan)
            </span>
          </button>

          <span className="text-outline-variant">•</span>

          <div className="flex items-center gap-1 text-on-surface font-medium">
            <span className="material-symbols-outlined text-[17px] text-charcoal-subtle">near_me</span>
            <span>
              {currentPlace.city || currentCity ? (currentPlace.city || currentCity.replace(/\s*\(.*?\)/, '')) : 'Bandung'}
            </span>
          </div>

          {(currentPlace.priceRange || currentPlace.price_range) && (
            <>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1 text-on-surface font-medium">
                <span className="material-symbols-outlined text-[17px] text-charcoal-subtle">payments</span>
                <span>{currentPlace.priceRange || currentPlace.price_range}</span>
              </div>
            </>
          )}

          <span className="text-outline-variant">•</span>

          <button
            type="button"
            onClick={() => {
              setActiveTab('lokasi');
              setTimeout(() => {
                document.getElementById('transportasi-umum-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            className="inline-flex items-center gap-1.5 text-primary hover:text-on-surface font-semibold transition-colors cursor-pointer"
          >
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-end">
        <button
          type="button"
          aria-label="Simpan Tempat Favorit"
          onClick={(e) => {
            if (onToggleFavorite) {
              onToggleFavorite(currentPlace.id, e);
            }
            if (showToast) {
              showToast(isFavorite ? 'Dihapus dari favorit' : 'Tersimpan di tempat favorit! ❤️');
            }
          }}
          className={`h-11 px-4 rounded-xl transition-all flex items-center gap-2 border cursor-pointer active:scale-95 ${
            isFavorite
              ? 'bg-red-50 text-error border-red-200'
              : 'bg-surface-card hover:bg-surface-container border-border-hairline text-on-surface'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              isFavorite ? 'text-error fill-1' : 'text-charcoal-subtle'
            }`}
          >
            favorite
          </span>
          <span className="text-sm font-semibold">{isFavorite ? 'Tersimpan' : 'Simpan'}</span>
        </button>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${currentPlace.latitude || -6.89245},${currentPlace.longitude || 107.61058}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-4 rounded-xl bg-surface-card hover:bg-surface-container border border-border-hairline text-on-surface text-sm font-semibold inline-flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">directions</span>
          <span>Petunjuk Arah</span>
        </a>

        <button
          type="button"
          aria-label="Bagikan Tempat"
          onClick={handleCopyInviteLink}
          className="h-11 w-11 rounded-xl bg-surface-card hover:bg-surface-container border border-border-hairline flex items-center justify-center text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer active:scale-95"
          title="Salin Tautan Tempat"
        >
          <span className="material-symbols-outlined text-[19px]">share</span>
        </button>
      </div>
    </section>
  );
}

