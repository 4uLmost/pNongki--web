import React from 'react';

export default function AdminTempatTab({
  places = [],
  filteredTempatPlaces,
  tempatFilter,
  setTempatFilter,
  tempatSearch,
  setTempatSearch,
  pendingTempatCount,
  isLoading,
  error,
  onRetry,
  actionLoadingId,
  onUpdatePlaceStatus,
  onPreviewPlace,
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'pending', label: 'Perlu Persetujuan', count: pendingTempatCount },
            { key: 'all', label: 'Semua Status', count: places.length },
            { key: 'approved', label: 'Disetujui', count: places.filter((p) => p.status === 'approved').length },
            { key: 'rejected', label: 'Ditolak', count: places.filter((p) => p.status === 'rejected').length },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTempatFilter(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                tempatFilter === item.key
                  ? 'bg-inverse-surface text-inverse-on-surface'
                  : 'bg-surface-card hover:bg-surface-container text-charcoal-subtle border border-border-hairline'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  tempatFilter === item.key
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-charcoal-subtle pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama atau alamat tempat..."
            value={tempatSearch}
            onChange={(e) => setTempatSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-card border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-charcoal-subtle mt-2">
            Memuat data tempat dari Supabase Cloud...
          </p>
        </div>
      ) : error ? (
        <div className="py-12 text-center bg-surface-card border border-dashed border-error/40 rounded-3xl p-8 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">wifi_off</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">Gagal Memuat Antrean Tempat</h3>
          <p className="text-xs text-charcoal-subtle max-w-md">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-fixed hover:bg-accent-hover font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : filteredTempatPlaces.length === 0 ? (
        <div className="py-16 text-center bg-surface-card border border-dashed border-border-hairline rounded-3xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">done_all</span>
          </div>
          <h3 className="text-base font-bold text-on-surface mb-1">
            Tidak Ada Tempat yang Sesuai
          </h3>
          <p className="text-xs text-charcoal-subtle max-w-sm mx-auto">
            {tempatFilter === 'pending'
              ? 'Hebat! Semua antrean penambahan tempat baru telah selesai ditinjau.'
              : 'Tidak ditemukan tempat yang cocok dengan kriteria filter atau pencarian Anda.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTempatPlaces.map((place) => {
            const isPending = place.status === 'pending';
            const isApproved = place.status === 'approved';
            const isRejected = place.status === 'rejected';
            const isCurrentActionLoading = actionLoadingId === place.id;

            return (
              <div
                key={place.id}
                className="bg-surface-card border border-border-hairline rounded-2xl p-4 sm:p-5 hover:border-outline-variant/60 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-start gap-4 w-full lg:w-auto">
                  <img
                    src={place.cover_image_url || place.imageUrl}
                    alt={place.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-border-hairline"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-surface-container text-primary">
                        {place.category}
                      </span>

                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Menunggu Verifikasi
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Disetujui (Tayang)
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30">
                          <span className="material-symbols-outlined text-[12px]">cancel</span>
                          Ditolak
                        </span>
                      )}

                      {place.is_partner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-800 dark:text-purple-300">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          Official Partner
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-on-surface truncate">
                      {place.name}
                    </h3>

                    <p className="text-xs text-charcoal-subtle flex items-center gap-1 mt-0.5 truncate">
                      <span className="material-symbols-outlined text-[14px] shrink-0 text-charcoal-subtle">
                        location_on
                      </span>
                      <span className="truncate">{place.address}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-charcoal-subtle">
                      <span className="font-semibold text-on-surface">{place.price}</span>
                      <span>•</span>
                      <span>{place.openStatus}</span>
                      <span>•</span>
                      <span className="truncate">
                        Fasilitas: {(place.facilities || []).slice(0, 3).join(', ') || 'Standar'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-border-hairline justify-end">
                  <button
                    type="button"
                    onClick={() => onPreviewPlace(place)}
                    className="px-3 py-2 rounded-xl border border-border-hairline hover:bg-surface-container text-xs font-bold text-on-surface transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px] text-charcoal-subtle">
                      visibility
                    </span>
                    <span className="hidden sm:inline">Lihat Detail</span>
                  </button>

                  {isPending && (
                    <>
                      <button
                        type="button"
                        disabled={isCurrentActionLoading}
                        onClick={() => onUpdatePlaceStatus(place.id, 'rejected')}
                        className="px-3.5 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        <span>Tolak</span>
                      </button>

                      <button
                        type="button"
                        disabled={isCurrentActionLoading}
                        onClick={() => onUpdatePlaceStatus(place.id, 'approved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isCurrentActionLoading ? (
                          <span className="material-symbols-outlined text-[16px] animate-spin">
                            progress_activity
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                        <span>Setujui Tempat</span>
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      type="button"
                      disabled={isCurrentActionLoading}
                      onClick={() => onUpdatePlaceStatus(place.id, 'rejected')}
                      className="px-3 py-2 rounded-xl border border-border-hairline hover:bg-rose-500/10 hover:text-rose-600 text-xs font-semibold text-charcoal-subtle transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      title="Tarik kembali dari aplikasi publik"
                    >
                      <span className="material-symbols-outlined text-[16px]">block</span>
                      <span>Batalkan / Tolak</span>
                    </button>
                  )}

                  {isRejected && (
                    <button
                      type="button"
                      disabled={isCurrentActionLoading}
                      onClick={() => onUpdatePlaceStatus(place.id, 'approved')}
                      className="px-3 py-2 rounded-xl bg-surface-container hover:bg-emerald-600 hover:text-white text-xs font-bold text-on-surface transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">restore</span>
                      <span>Pulihkan &amp; Setujui</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

