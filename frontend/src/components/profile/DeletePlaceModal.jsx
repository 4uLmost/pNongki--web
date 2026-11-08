import React from 'react';

export default function DeletePlaceModal({
  deletingPlace,
  onConfirm,
  onClose,
}) {
  if (!deletingPlace) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-border-hairline relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-error mx-auto flex items-center justify-center mb-3.5">
          <span className="material-symbols-outlined text-[28px]">delete</span>
        </div>

        <h3 className="text-base font-bold text-on-surface mb-1">
          Hapus Tempat Kontribusi?
        </h3>
        <p className="text-xs text-charcoal-subtle leading-relaxed mb-5">
          Apakah kamu yakin ingin menghapus <strong className="text-on-surface">"{deletingPlace.name}"</strong>? Tempat ini akan dihapus dari daftar kontribusimu.
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-error hover:bg-error/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

