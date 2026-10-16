import React from 'react';

export default function PartnershipStep1({
  selectedPlace,
  selectedPlaceId,
  setSelectedPlaceId,
  placeSearchQuery,
  setPlaceSearchQuery,
  searchInputRef,
  fieldErrors,
  setFieldErrors,
  isLoading,
  loadError,
  onRetry,
  filteredPlaces,
  onNavigate,
  handleNextStep,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">Pilih Tempat Usaha di Katalog</h2>
          <p className="text-xs text-[#6E6E6B]">Cari nama kafe, spot nugas, atau usaha yang ingin Anda klaim</p>
        </div>
        <span className="text-[11px] font-bold text-[#181e00] bg-[#d4e684] px-3 py-1 rounded-full uppercase tracking-wider">
          Langkah 1 dari 3
        </span>
      </div>

      {selectedPlace ? (
        <div className="p-4 rounded-2xl bg-[#d4e684]/15 border border-[#d4e684] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={selectedPlace.cover_image_url || selectedPlace.imageUrl}
              alt={selectedPlace.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E8E8E4]"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="min-w-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white text-[#242424] border border-[#E8E8E4]">
                {selectedPlace.category}
              </span>
              <h3 className="text-sm font-bold text-[#242424] truncate mt-1">{selectedPlace.name}</h3>
              <p className="text-xs text-[#6E6E6B] truncate">{selectedPlace.address || selectedPlace.location}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPlaceId('')}
            className="px-3.5 py-1.5 rounded-xl border border-[#242424] bg-white hover:bg-[#F8F8F6] text-xs font-bold text-[#242424] transition-colors cursor-pointer shrink-0"
          >
            Ganti Tempat
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-[#242424]">
            Cari Nama Tempat / Kafe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6E6B] text-[18px]">
              search
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Ketik nama tempat (contoh: Koffie & Co, Ruang Teduh, Wheels)..."
              value={placeSearchQuery}
              onChange={(e) => {
                setPlaceSearchQuery(e.target.value);
                if (fieldErrors.selectedPlace) setFieldErrors((prev) => ({ ...prev, selectedPlace: null }));
              }}
              className={`w-full rounded-xl pl-10 pr-4 py-3 text-sm transition-all focus:outline-none ${
                fieldErrors.selectedPlace
                  ? 'border-2 border-red-500 bg-red-50/60 ring-2 ring-red-400/20'
                  : 'border border-[#E8E8E4] bg-white text-[#242424] focus:border-[#242424]'
              }`}
            />
          </div>
          {fieldErrors.selectedPlace && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {fieldErrors.selectedPlace}
            </p>
          )}

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="col-span-2 p-8 text-center text-xs text-[#6E6E6B] bg-[#F8F8F6] rounded-2xl border border-[#E8E8E4] flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[28px] text-[#242424] animate-spin">
                  progress_activity
                </span>
                <span>Memuat daftar tempat pNongki...</span>
              </div>
            ) : loadError ? (
              <div className="col-span-2 p-6 text-center text-xs text-red-600 bg-red-50 rounded-2xl border border-red-200 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">wifi_off</span>
                <span>{loadError}</span>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-1 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    <span>Coba Lagi</span>
                  </button>
                )}
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="col-span-2 p-6 text-center text-xs text-[#6E6E6B] bg-[#F8F8F6] rounded-2xl border border-dashed border-[#E8E8E4] flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">search_off</span>
                <span>Tidak ditemukan tempat dengan kata kunci &quot;{placeSearchQuery}&quot;.</span>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('tambah-tempat', { mode: 'partnership' })}
                  className="mt-2 text-xs font-bold text-[#242424] underline hover:text-black cursor-pointer"
                >
                  Tempat belum ada? Daftarkan sebagai Tempat Baru
                </button>
              </div>
            ) : (
              filteredPlaces.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPlaceId(String(p.id));
                    setFieldErrors((prev) => ({ ...prev, selectedPlace: null }));
                  }}
                  className="p-3.5 rounded-2xl border border-[#E8E8E4] hover:border-[#242424] hover:bg-[#F8F8F6] cursor-pointer transition-all flex items-center gap-3 text-left group"
                >
                  <img
                    src={p.cover_image_url || p.imageUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8E8E4]"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#242424] truncate group-hover:text-black">{p.name}</h4>
                    <p className="text-[11px] text-[#6E6E6B] truncate">{p.address || p.location}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#6E6E6B] text-[16px] shrink-0 group-hover:text-[#242424]">
                    check_circle
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 p-3.5 rounded-2xl bg-[#F8F8F6] border border-[#E8E8E4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="text-[#6E6E6B]">
              Tempat usaha Anda ternyata belum ada di pNongki!?
            </span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('tambah-tempat', { mode: 'partnership' })}
              className="font-bold text-[#242424] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Daftarkan Tempat Baru</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[#E8E8E4]">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('beranda')}
          className="px-5 py-2.5 rounded-xl border border-[#E8E8E4] hover:border-[#242424] text-xs font-bold text-[#242424] transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          disabled={!selectedPlaceId}
          onClick={handleNextStep}
          className="px-6 py-2.5 rounded-xl bg-[#242424] hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
        >
          <span>Langkah Selanjutnya</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

