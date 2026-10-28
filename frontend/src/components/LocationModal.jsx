import React, { useState, useMemo } from 'react';

const SUGGESTED_LOCATIONS = [
  'Dago, Bandung',
  'Dipatiukur, Bandung',
  'Braga & Asia Afrika, Bandung',
  'Riau & Citarum, Bandung',
  'Sukajadi & Setiabudi, Bandung',
  'Buahbatu, Bandung',
  'Bojongsoang, Kab. Bandung (Dekat Telkom)',
  'Dayeuhkolot, Kab. Bandung',
  'Soreang & Ciwidey, Kab. Bandung',
  'Pangalengan, Kab. Bandung',
  'Lembang & Parongpong, Bandung Barat',
  'Padalarang, Bandung Barat (Whoosh)',
  'Kota Cimahi',
];

export default function LocationModal({ isOpen, onClose, currentCity, onSelectCity }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Filter locations by search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return SUGGESTED_LOCATIONS;
    const q = searchQuery.toLowerCase().trim();
    return SUGGESTED_LOCATIONS.filter((loc) => loc.toLowerCase().includes(q));
  }, [searchQuery]);

  if (!isOpen) return null;

  // Handle GPS Auto-detect
  const handleUseCurrentLocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsDetecting(false);
          onSelectCity('Dago, Bandung (Otomatis GPS)');
          onClose();
        },
        () => {
          setIsDetecting(false);
          onSelectCity('Dago, Bandung (Otomatis GPS)');
          onClose();
        },
        { timeout: 4000 }
      );
    } else {
      setIsDetecting(false);
      onSelectCity('Dago, Bandung (Otomatis GPS)');
      onClose();
    }
  };

  const handleSelect = (loc) => {
    onSelectCity(loc);
    setSearchQuery('');
    onClose();
  };

  const hasExactMatch = filteredLocations.some(
    (loc) => loc.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border-hairline relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-4">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Pilih Lokasi Kamu</h3>
            <p className="text-xs text-charcoal-subtle">
              Lokasi saat ini: <strong className="text-primary font-semibold">{currentCity}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-charcoal-subtle hover:text-on-surface rounded-full hover:bg-surface-container cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 1. Tombol Gunakan Lokasi Saat Ini (GPS) */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isDetecting}
          className="w-full py-3 px-4 rounded-2xl bg-primary-container hover:bg-accent-hover text-on-surface text-xs font-bold transition-all shadow-xs flex items-center justify-between mb-4 cursor-pointer active:scale-98 disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-surface-card/80 flex items-center justify-center text-primary shrink-0 shadow-2xs">
              <span className={`material-symbols-outlined text-[18px] ${isDetecting ? 'animate-spin' : ''}`}>
                {isDetecting ? 'sync' : 'my_location'}
              </span>
            </div>
            <div className="text-left">
              <p className="font-bold text-xs">
                {isDetecting ? 'Mendeteksi Koordinat GPS...' : 'Gunakan Lokasi Saat Ini'}
              </p>
              <p className="text-[11px] font-normal text-on-surface/80">
                Deteksi otomatis via GPS perangkat Anda
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>

        {/* 2. Input Search Pencarian Lokasi */}
        <div className="relative mb-3">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-charcoal-subtle">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kota, kecamatan, atau area kampus..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-medium text-on-surface placeholder:text-charcoal-subtle focus:outline-none focus:border-primary focus:bg-surface-card transition-all"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-subtle hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* 3. Daftar Hasil & Rekomendasi Lokasi */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1 max-h-[300px]">
          {/* Opsi kustom jika user mengetik lokasi spesifik yang belum ada di daftar */}
          {searchQuery.trim() && !hasExactMatch && (
            <button
              type="button"
              onClick={() => handleSelect(searchQuery.trim())}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 bg-primary-container/20 hover:bg-primary-container/40 border border-primary/30 text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">add_location_alt</span>
              <span className="truncate">
                Gunakan pencarian: <strong className="text-primary font-bold">"{searchQuery.trim()}"</strong>
              </span>
            </button>
          )}

          {filteredLocations.length === 0 && !searchQuery.trim() ? (
            <div className="py-8 text-center text-xs text-charcoal-subtle">
              Ketik nama lokasi untuk mencari area nongkrong.
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = currentCity.toLowerCase().includes(loc.split(',')[0].toLowerCase());
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors border cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-surface border-primary/30 font-bold'
                      : 'bg-surface-container-low hover:bg-surface-container border-border-hairline text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`material-symbols-outlined text-[16px] shrink-0 ${isSelected ? 'text-primary' : 'text-charcoal-subtle'}`}>
                      location_on
                    </span>
                    <span className="truncate">{loc}</span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                      check
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
