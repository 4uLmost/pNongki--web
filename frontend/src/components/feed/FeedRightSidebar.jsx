import React from 'react';

export default function FeedRightSidebar({
  feedSearchQuery,
  onSearchChange,
  popularPlacesList,
  partnerPlacesList,
  onSelectPlace,
  onNavigate,
  rightCardsRef,
}) {
  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 self-stretch flex flex-col gap-4">
      <div className="sticky top-20 z-20 bg-surface/90 backdrop-blur-md py-1">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface-card border border-border-hairline shadow-xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <span className="material-symbols-outlined text-[18px] text-charcoal-subtle" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            value={feedSearchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari utas, spot, atau topik..."
            className="w-full bg-transparent text-xs text-on-surface placeholder:text-charcoal-subtle focus:outline-none font-medium"
            aria-label="Cari di linimasa feed"
          />
          {feedSearchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-charcoal-subtle hover:text-on-surface cursor-pointer"
              aria-label="Hapus kata kunci pencarian"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">cancel</span>
            </button>
          )}
        </div>
      </div>

      <div ref={rightCardsRef} className="flex flex-col gap-5">
        <section className="bg-surface-card border border-border-hairline rounded-3xl p-5 shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-border-hairline">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">
                trending_up
              </span>
              <h3 className="font-bold text-xs uppercase tracking-wide text-on-surface">
                Tempat Populer
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('explore')}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="flex flex-col divide-y divide-border-hairline/60">
            {popularPlacesList.map((place) => (
              <article
                key={place.id}
                onClick={() => {
                  if (onSelectPlace) {
                    onSelectPlace(place);
                  } else if (onNavigate) {
                    onNavigate('detail', { place });
                  }
                }}
                className="py-3 first:pt-1 last:pb-1 flex items-center gap-3 hover:bg-surface-container-low/60 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <img
                  src={place.imageUrl || place.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80'}
                  alt={place.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 bg-surface-container"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {place.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-subtle truncate mt-0.5">
                    {place.address ? place.address.split(',')[0] : (place.location || place.city || 'Bandung')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-on-surface">
                      <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1" aria-hidden="true">
                        star
                      </span>
                      {Number(place.rating) > 0 ? Number(place.rating).toFixed(1) : '0'}
                    </span>
                    <span className="text-[10px] text-charcoal-subtle">
                      • {place.category || 'Nongkrong'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-surface-card border border-border-hairline rounded-3xl p-5 shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-border-hairline">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">
                verified
              </span>
              <h3 className="font-bold text-xs uppercase tracking-wide text-on-surface">
                Mitra Resmi pNongki
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-container text-on-surface">
              Partner
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {partnerPlacesList.map((place) => (
              <article
                key={place.id}
                onClick={() => {
                  if (onSelectPlace) {
                    onSelectPlace(place);
                  } else if (onNavigate) {
                    onNavigate('detail', { place });
                  }
                }}
                className="p-3 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors border border-border-hairline/80 cursor-pointer group flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={place.imageUrl || place.image || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80'}
                    alt={place.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 bg-surface-container"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                        {place.name}
                      </h4>
                      <span className="material-symbols-outlined text-[13px] text-primary shrink-0" title="Partner Terverifikasi" aria-hidden="true">
                        check_circle
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-subtle truncate mt-0.5">
                      {place.city || place.location || 'Bandung'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border-hairline/60">
                  <span className="text-status-open font-semibold flex items-center gap-1 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-open" aria-hidden="true"></span>
                    {place.openStatus || 'Buka'}
                  </span>
                  <span className="font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px]">
                    <span>Lihat Spot</span>
                    <span className="material-symbols-outlined text-[13px]" aria-hidden="true">chevron_right</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

