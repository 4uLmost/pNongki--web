import React from 'react';

export default function OwnerDashboardHero({
  onNavigate,
  onSelectPlace,
  currentPlace,
  partnerPlaces,
  activePlaceId,
  setActivePlaceId,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-charcoal-subtle">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="hover:text-on-surface hover:underline cursor-pointer"
          >
            Beranda
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('profile', { tab: 'kemitraan' })}
            className="hover:text-on-surface hover:underline cursor-pointer"
          >
            Profil &amp; Kemitraan
          </button>
          <span>/</span>
          <span className="text-on-surface font-bold">Dashboard Owner</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('profile', { tab: 'kemitraan' })}
            className="px-4 py-2 rounded-xl border border-border-hairline hover:border-[#242424] text-on-surface text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-surface-card"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Profil</span>
          </button>

          {currentPlace && (
            <button
              type="button"
              onClick={() => {
                if (onSelectPlace) onSelectPlace(currentPlace);
                if (onNavigate) onNavigate('detail');
              }}
              className="px-4 py-2 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Lihat Halaman Publik</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface-card rounded-3xl p-6 md:p-8 border border-border-hairline shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={
              currentPlace?.imageUrl ||
              currentPlace?.image_url ||
              'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80'
            }
            alt={currentPlace?.name || 'Tempat Usaha'}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover shrink-0 border border-border-hairline shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-300 inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-purple-600">verified</span>
                <span>Mitra Resmi pNongki</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#d4e684]/50 text-[#181e00] border border-[#d4e684]">
                Role: Owner / Pengelola
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-on-surface tracking-tight mt-2">
              {currentPlace?.name || 'Bisnis Kafe Anda'}
            </h1>
            <p className="text-xs md:text-sm text-charcoal-subtle mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              <span>{currentPlace?.address || 'Bandung, Jawa Barat'}</span>
            </p>
          </div>
        </div>

        {partnerPlaces.length > 1 && (
          <div className="flex flex-col gap-1.5 min-w-[220px]">
            <label className="text-xs font-bold text-charcoal-subtle">Ganti Tempat Kelolaan:</label>
            <select
              value={activePlaceId || ''}
              onChange={(e) => setActivePlaceId(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container border border-border-hairline text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {partnerPlaces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
}

