import React from 'react';

export default function LandingPopularGrid({
  places = [],
  popularPlaces = [],
  isLoading = false,
  loadError = null,
  onRetry,
  favorites = [],
  onToggleFavorite,
  onSelectPlace,
  onNavigate,
}) {
  return (
    <section id="rekomendasi" className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-14 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Rekomendasi Populer di Sekitarmu
          </h2>
          <p className="text-sm text-charcoal-subtle mt-1 font-normal">
            Dipilih berdasarkan rating tinggi dan kenyamanan fasilitas nugas / nongkrong
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('explore')}
          className="inline-flex items-center gap-1.5 text-sm text-on-surface font-semibold hover:text-primary transition-colors group cursor-pointer self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          <span>Lihat Semua Tempat ({places.length})</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" aria-hidden="true">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-surface-card rounded-2xl border border-border-hairline overflow-hidden p-4 flex flex-col gap-3 animate-pulse shadow-xs"
            >
              <div className="w-full aspect-[16/10] rounded-xl bg-surface-container" />
              <div className="h-4 bg-surface-container rounded-md w-3/4" />
              <div className="h-3 bg-surface-container rounded-md w-1/2" />
              <div className="h-8 bg-surface-container rounded-xl w-full mt-2" />
            </div>
          ))
        ) : loadError ? (
          <div className="col-span-full bg-surface-card rounded-2xl p-10 text-center border border-dashed border-error/40 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]" aria-hidden="true">wifi_off</span>
            </div>
            <h3 className="font-bold text-base text-on-surface">Oops! Terjadi Kesalahan</h3>
            <p className="text-xs text-charcoal-subtle max-w-sm leading-relaxed">{loadError}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 px-4 py-2 rounded-xl bg-primary-container text-on-primary-fixed hover:bg-accent-hover text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">refresh</span>
                <span>Coba Lagi</span>
              </button>
            )}
          </div>
        ) : popularPlaces.length === 0 ? (
          <div className="col-span-full bg-surface-card rounded-2xl p-10 text-center border border-dashed border-border-hairline">
            <span className="material-symbols-outlined text-[36px] text-charcoal-subtle mb-2" aria-hidden="true">storefront</span>
            <p className="text-sm font-semibold text-on-surface">Belum ada rekomendasi tempat</p>
          </div>
        ) : (
          popularPlaces.map((place) => {
            const isFav = Array.isArray(favorites) && favorites.includes(place.id);
            return (
              <article
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="bg-surface-card rounded-2xl shadow-xs border border-border-hairline hover:border-charcoal/20 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={place.name || 'Foto Tempat'}
                    src={place.imageUrl || place.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-surface-card/95 text-on-surface text-[11px] font-bold shadow-2xs">
                    {place.category || 'NONGKRONG'}
                  </span>
                  <button
                    aria-label={isFav ? `Hapus ${place.name} dari favorit` : `Simpan ${place.name} ke favorit`}
                    onClick={(e) => onToggleFavorite(place.id, e)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-card/90 backdrop-blur flex items-center justify-center transition-colors shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isFav ? 'text-error' : 'text-on-surface hover:text-error'
                    }`}
                    type="button"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isFav ? 'fill-1' : ''}`} aria-hidden="true">
                      favorite
                    </span>
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-charcoal-subtle text-xs mb-1.5">
                      <span>{place.location || place.city || 'Bandung'}</span>
                      <span className="flex items-center gap-0.5 text-on-surface font-bold text-xs">
                        <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1" aria-hidden="true">
                          star
                        </span>
                        {Number(place.rating) > 0 ? Number(place.rating).toFixed(1) : '0'} ({place.reviewCount || 0})
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {place.name}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(place.badges || place.facilities || []).slice(0, 3).map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-surface-container text-[11px] font-medium text-charcoal-subtle"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 flex items-center justify-between border-t border-border-hairline/60">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-status-open">
                      <span className="w-2 h-2 rounded-full bg-status-open" aria-hidden="true" />
                      {place.openStatus || 'Buka'}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-charcoal-subtle group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true">
                      chevron_right
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

