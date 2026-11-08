import React from 'react';

export default function ExplorePlaceCard({
  place,
  isFav,
  onToggleFavorite,
  onSelectPlaceWithState,
}) {
  return (
    <article
      onClick={() => onSelectPlaceWithState(place)}
      className="group rounded-3xl bg-surface-card border border-border-hairline hover:border-outline-variant/80 transition-all p-4 flex flex-col justify-between cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-md"
    >
      <div>
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-surface-container mb-3.5">
          <img
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={place.cover_image_url || place.imageUrl}
            loading="lazy"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80';
            }}
          />

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            <div className="bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
              <span className="material-symbols-outlined text-[13px] text-amber-400 fill-1">
                star
              </span>
              <span>{Number(place.rating) > 0 ? Number(place.rating).toFixed(1) : '0'}</span>
            </div>

            {place.is_partner && (
              <div className="bg-purple-700/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                <span>Official Partner</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-surface-card/90 backdrop-blur-md text-on-surface text-[10px] font-extrabold tracking-wide uppercase shadow-xs border border-white/20">
              {place.category}
            </span>
          </div>

          <button
            aria-label="Simpan ke Favorit"
            type="button"
            onClick={(e) => onToggleFavorite(place.id, e)}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-card/90 backdrop-blur-md hover:bg-surface-card flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-90 ${
              isFav ? 'text-primary' : 'text-charcoal-subtle hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isFav ? 'fill-1' : ''}`}>
              favorite
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-base text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-1">
            {place.name}
          </h3>
          <p className="text-xs text-charcoal-subtle flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-[14px] text-charcoal-subtle shrink-0">
              location_on
            </span>
            <span className="truncate">{place.address || place.location}</span>
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{place.openStatus}</span>
            </span>
            <span className="text-charcoal-subtle text-[11px] font-medium">
              • {place.reviewCount || 0} ulasan
            </span>
            <span className="text-charcoal-subtle text-[11px] font-medium">
              • {place.price}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(place.facilities || ['WiFi Kencang', 'Stopkontak']).slice(0, 3).map((fac, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-surface text-charcoal-subtle text-[11px] font-medium border border-border-hairline"
              >
                {fac}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3.5 mt-3.5 border-t border-border-hairline flex items-center justify-between">
        <span className="text-xs font-semibold text-charcoal-subtle flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-primary">directions_walk</span>
          <span>{place.distanceKm || '1.2'} km dari Anda</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPlaceWithState(place);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-inverse-surface text-inverse-on-surface text-xs font-bold hover:bg-black transition-colors shadow-xs cursor-pointer active:scale-95 inline-flex items-center gap-1"
        >
          <span>Lihat Detail</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </article>
  );
}

