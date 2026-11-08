import React from 'react';

export default function FavoritesTab({
  favoritePlaces = [],
  onNavigate,
  onSelectPlace,
  onToggleFavorite,
}) {
  return (
    <div className="flex flex-col gap-4">
      {favoritePlaces.length === 0 ? (
        <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-charcoal-subtle">
            favorite_border
          </span>
          <h3 className="font-bold text-base text-on-surface">Belum ada tempat favorit</h3>
          <p className="text-xs text-charcoal-subtle max-w-sm">
            Tandai kafe nugas dan spot nongkrong dengan tombol hati untuk disimpan di daftar bookmark profilmu.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('explore')}
            className="mt-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary-fixed font-bold text-xs cursor-pointer"
          >
            Jelajahi Tempat Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoritePlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => {
                if (onSelectPlace) {
                  onSelectPlace(place);
                } else if (onNavigate) {
                  onNavigate('detail', { place });
                }
              }}
              className="bg-surface-card rounded-3xl border border-border-hairline overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) onToggleFavorite(place.id, e);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 text-rose-500 hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
                    title="Hapus dari Favorit"
                  >
                    <span className="material-symbols-outlined text-[18px] fill-1">
                      favorite
                    </span>
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                    📍 {place.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {place.name}
                    </h4>
                    <span className="text-xs font-bold text-primary flex items-center gap-0.5 shrink-0">
                      ⭐ {place.rating}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-subtle truncate">{place.address}</p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs text-charcoal-subtle">
                <span>{place.priceRange || 'Rp 20.000 - Rp 45.000'}</span>
                <span className="font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Lihat Detail →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

