import React from 'react';

export default function PlaceDetailModal({ place, onClose, onInviteClick }) {
  if (!place) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-border-hairline relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-52 object-cover rounded-2xl mb-4"
        />

        <div className="space-y-4">
          <div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary-container text-on-surface">
              {place.category}
            </span>
            <h3 className="text-2xl font-bold text-on-surface mt-2">{place.name}</h3>
            <p className="text-xs text-charcoal-subtle flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px] text-error">location_on</span>
              {place.address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-surface-container-low rounded-xl border border-border-hairline">
              <span className="text-charcoal-subtle block text-[10px] font-bold uppercase tracking-wider">Jam Operasional</span>
              <span className="font-bold text-on-surface mt-0.5 block">{place.openStatus}</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl border border-border-hairline">
              <span className="text-charcoal-subtle block text-[10px] font-bold uppercase tracking-wider">Rating Komunitas</span>
              <span className="font-bold text-on-surface mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">star</span>
                {place.rating} ({place.reviewCount} ulasan)
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1.5">
              Menu Andalan / Kisaran Harga
            </h4>
            <div className="p-3.5 bg-primary-container/20 rounded-xl border border-primary-container/50 text-xs">
              <p className="font-bold text-on-surface">{place.recommendedMenu}</p>
              <p className="text-charcoal-subtle mt-0.5">Kisaran: {place.priceRange}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1.5">
              Fasilitas Terverifikasi
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(place.facilities || []).map((f, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs bg-surface-container text-on-surface font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onInviteClick(place);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-primary-container hover:bg-accent-hover text-on-surface font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Ajak Nongkrong Bareng!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
