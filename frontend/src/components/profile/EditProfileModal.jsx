import React from 'react';

export default function EditProfileModal({
  isOpen,
  name,
  setName,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-md w-full p-6 md:p-7 shadow-2xl border border-border-hairline relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <h3 className="text-lg font-bold text-on-surface mb-1">Perbarui Profil Akun</h3>
        <p className="text-xs text-charcoal-subtle mb-4">
          Ubah informasi nama akun Anda di pNongki!.
        </p>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-on-surface">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-subtle hover:text-on-surface cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs shadow-xs cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

