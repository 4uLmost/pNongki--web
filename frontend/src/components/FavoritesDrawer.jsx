import React from 'react';

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites = [],
  places = [],
  onRemoveFavorite,
  onClearFavorites,
  onSelectPlace,
}) {
  if (!isOpen) return null;

  const favPlaces = (Array.isArray(places) ? places : []).filter(
    (p) => p && Array.isArray(favorites) && favorites.includes(p.id)
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface-card shadow-2xl flex flex-col border-l border-border-hairline"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-hairline bg-surface-card">
          <div className="w-9"></div>
          <h2 className="text-lg font-bold text-on-surface text-center flex-1">Favorit Tersimpan</h2>
          <button
            type="button"
            aria-label="Tutup favorit"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-3 bg-surface-container-low border-b border-border-hairline text-xs">
          <span className="text-charcoal-subtle font-medium">
            Tersimpan: <strong className="text-on-surface font-bold">{favPlaces.length} Tempat</strong>
          </span>
          {favPlaces.length > 0 && (
            <button
              type="button"
              onClick={onClearFavorites}
              className="text-error hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">delete_sweep</span> Hapus Semua
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-3.5 divide-y divide-border-hairline">
          {favPlaces.length === 0 ? (
            <div className="p-12 text-center text-charcoal-subtle text-xs">
              <span className="material-symbols-outlined text-[36px] text-gray-300 block mb-2">favorite_border</span>
              Belum ada tempat favorit tersimpan. Tekan ikon hati pada kartu tempat untuk menyimpan.
            </div>
          ) : (
            favPlaces.map((favPlace) => (
              <div
                key={favPlace.id}
                onClick={() => {
                  onSelectPlace(favPlace);
                  onClose();
                }}
                className="pt-3.5 first:pt-0 flex gap-3.5 items-start group cursor-pointer"
              >
                <img
                  src={favPlace.imageUrl}
                  alt={favPlace.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-border-hairline"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-fixed text-[10px] font-extrabold uppercase">
                      {favPlace.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(favPlace.id);
                      }}
                      title="Hapus dari favorit"
                      className="text-charcoal-subtle hover:text-error transition-colors p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    {favPlace.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-subtle truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">location_on</span>
                    {favPlace.location}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 text-xs font-bold text-on-surface">
                      <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1">star</span>
                      {favPlace.rating}
                    </span>
                    <span className="text-[10px] font-semibold text-status-open bg-status-open/10 px-1.5 py-0.5 rounded">
                      {favPlace.openStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-border-hairline bg-surface-card flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">explore</span>
            <span>Tutup Favorit</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
