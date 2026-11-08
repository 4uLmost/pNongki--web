import React from 'react';

export default function AdminAuditModal({
  previewPlace,
  onClose,
  onSelectPlace,
  onUpdatePlaceStatus,
}) {
  if (!previewPlace) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-card border border-border-hairline rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <img
          src={previewPlace.cover_image_url || previewPlace.imageUrl}
          alt={previewPlace.name}
          className="w-full h-48 rounded-2xl object-cover mb-4 border border-border-hairline"
        />

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-surface-container text-primary">
            {previewPlace.category}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700">
            Status: {previewPlace.status}
          </span>
          {previewPlace.is_partner && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700">
              Mitra Resmi
            </span>
          )}
        </div>

        <h3 className="text-xl font-extrabold text-on-surface">{previewPlace.name}</h3>
        <p className="text-xs text-charcoal-subtle mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          {previewPlace.address}
        </p>

        <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-surface rounded-xl border border-border-hairline text-xs">
          <div>
            <span className="text-charcoal-subtle text-[11px] block">Rentang Harga</span>
            <strong className="text-on-surface">{previewPlace.price}</strong>
          </div>
          <div>
            <span className="text-charcoal-subtle text-[11px] block">Jam Buka</span>
            <strong className="text-on-surface">{previewPlace.openStatus}</strong>
          </div>
          <div>
            <span className="text-charcoal-subtle text-[11px] block">Kota</span>
            <strong className="text-on-surface">{previewPlace.city || 'Bandung'}</strong>
          </div>
          <div>
            <span className="text-charcoal-subtle text-[11px] block">Rating Komunitas</span>
            <strong className="text-amber-500 flex items-center gap-1">
              ★ {previewPlace.rating} ({previewPlace.reviewCount} ulasan)
            </strong>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-xs font-bold text-on-surface block mb-1.5">Fasilitas Tempat:</span>
          <div className="flex flex-wrap gap-1.5">
            {(previewPlace.facilities || []).map((fac, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-surface text-charcoal-subtle text-[11px] font-medium border border-border-hairline"
              >
                {fac}
              </span>
            ))}
          </div>
        </div>

        {previewPlace.recommendedMenu && (
          <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs">
            <span className="font-bold text-primary block mb-0.5">Rekomendasi Menu:</span>
            <span className="text-on-surface">{previewPlace.recommendedMenu}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-hairline">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onSelectPlace) onSelectPlace(previewPlace);
            }}
            className="px-4 py-2 rounded-xl border border-border-hairline hover:bg-surface-container text-xs font-bold text-on-surface transition-colors cursor-pointer"
          >
            Buka Halaman Detail
          </button>
          {previewPlace.status === 'pending' && (
            <button
              type="button"
              onClick={() => {
                onUpdatePlaceStatus(previewPlace.id, 'approved');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Setujui Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

