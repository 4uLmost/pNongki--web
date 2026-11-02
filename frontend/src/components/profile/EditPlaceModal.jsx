import React from 'react';

const DEFAULT_FACILITIES = [
  'WiFi Kencang',
  'Stopkontak Tiap Meja',
  'Outdoor Area',
  'Musholla Bersih',
  'Buka 24 Jam',
  'AC Dingin',
  'Kursi Ergonomis',
  'Live Akustik',
  'Parkir Luas',
  'Area Merokok',
];

export default function EditPlaceModal({
  editingPlace,
  setEditingPlace,
  onSubmit,
  onClose,
  availableFacilities = DEFAULT_FACILITIES,
}) {
  if (!editingPlace) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-border-hairline relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-surface flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">edit_note</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">Edit Data Tempat</h3>
            <p className="text-xs text-charcoal-subtle">
              Perbarui informasi tempat nongkrong yang kamu tambahkan
            </p>
          </div>
        </div>

        <div className="p-3.5 my-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0">
            admin_panel_settings
          </span>
          <div className="leading-relaxed">
            <span className="font-bold block">Pemberitahuan Audit Kurasi Admin:</span>
            <span className="text-[11px] text-amber-800">
              Setelah disimpan, status tempat akan menjadi <strong>Menunggu Audit</strong> dan akan ditinjau kembali oleh Admin pNongki sebelum perubahan tampil luas di linimasa publik.
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Nama Tempat <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={editingPlace.name}
              onChange={(e) =>
                setEditingPlace({ ...editingPlace, name: e.target.value })
              }
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-on-surface">
                Kategori Tempat <span className="text-error">*</span>
              </label>
              <select
                value={editingPlace.category}
                onChange={(e) =>
                  setEditingPlace({ ...editingPlace, category: e.target.value })
                }
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface cursor-pointer"
              >
                <option value="nugas">Nugas &amp; Co-working</option>
                <option value="nongkrong">Nongkrong &amp; Chill</option>
                <option value="olahraga">Olahraga &amp; Komunitas</option>
                <option value="fasilitas_publik">Fasilitas Publik / Taman</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-on-surface">
                Rentang Harga
              </label>
              <input
                type="text"
                value={editingPlace.priceRange || ''}
                onChange={(e) =>
                  setEditingPlace({ ...editingPlace, priceRange: e.target.value })
                }
                placeholder="Contoh: Rp 20.000 - Rp 45.000"
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-on-surface">
                Alamat Lengkap <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={editingPlace.address}
                onChange={(e) =>
                  setEditingPlace({ ...editingPlace, address: e.target.value })
                }
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-on-surface">
                Kota / Wilayah
              </label>
              <input
                type="text"
                value={editingPlace.city || ''}
                onChange={(e) =>
                  setEditingPlace({ ...editingPlace, city: e.target.value })
                }
                placeholder="Contoh: Dago, Bandung"
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Jam Operasional
            </label>
            <input
              type="text"
              value={editingPlace.openStatus || ''}
              onChange={(e) =>
                setEditingPlace({ ...editingPlace, openStatus: e.target.value })
              }
              placeholder="Contoh: Buka s/d 23:00 atau Buka 24 Jam"
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Fasilitas Unggulan (Pilih yang tersedia)
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableFacilities.map((fac) => {
                const isSelected = editingPlace.facilities?.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => {
                      const current = editingPlace.facilities || [];
                      const next = isSelected
                        ? current.filter((f) => f !== fac)
                        : [...current, fac];
                      setEditingPlace({ ...editingPlace, facilities: next });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container text-on-surface border-primary font-bold'
                        : 'bg-surface-container-low text-charcoal-subtle border-border-hairline hover:bg-surface-container'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {fac}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Tautan Foto Tempat
            </label>
            <input
              type="url"
              value={editingPlace.imageUrl || ''}
              onChange={(e) =>
                setEditingPlace({ ...editingPlace, imageUrl: e.target.value })
              }
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-on-surface"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Deskripsi Singkat / Catatan Tempat
            </label>
            <textarea
              rows={2}
              value={editingPlace.description || ''}
              onChange={(e) =>
                setEditingPlace({ ...editingPlace, description: e.target.value })
              }
              placeholder="Ceritakan kelebihan atau tips nongki di sini..."
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs focus:outline-none focus:ring-1 focus:ring-on-surface resize-none leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-border-hairline flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-subtle hover:text-on-surface"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Simpan &amp; Ajukan Audit Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

