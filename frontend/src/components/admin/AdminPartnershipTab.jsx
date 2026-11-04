import React from 'react';

export default function AdminPartnershipTab({
  places = [],
  filteredPartnerPlaces,
  partnerFilter,
  setPartnerFilter,
  partnerSearch,
  setPartnerSearch,
  pendingPartnerCount,
  activePartnerCount,
  isLoading,
  error,
  onRetry,
  actionLoadingId,
  onUpdatePartnership,
  onDeletePartnership,
  onPreviewPlace,
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'pending', label: 'Pengajuan Pending', count: pendingPartnerCount },
            { key: 'active', label: 'Mitra Aktif', count: activePartnerCount },
            { key: 'rejected', label: 'Ditolak / Riwayat', count: places.filter((p) => p.partnership_status === 'rejected').length },
            { key: 'all', label: 'Semua Tempat', count: places.length },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setPartnerFilter(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                partnerFilter === item.key
                  ? 'bg-inverse-surface text-inverse-on-surface'
                  : 'bg-surface-card hover:bg-surface-container text-charcoal-subtle border border-border-hairline'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  partnerFilter === item.key
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
            placeholder="Cari tempat mitra..."
            value={partnerSearch}
            onChange={(e) => setPartnerSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-card border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-[36px] text-purple-600 animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-charcoal-subtle mt-2">
            Memuat data kemitraan dari Supabase Cloud...
          </p>
        </div>
      ) : error ? (
        <div className="py-12 text-center bg-surface-card border border-dashed border-error/40 rounded-3xl p-8 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">wifi_off</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">Gagal Memuat Data Kemitraan</h3>
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
      ) : filteredPartnerPlaces.length === 0 ? (
        <div className="py-16 text-center bg-surface-card border border-dashed border-border-hairline rounded-3xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">handshake</span>
          </div>
          <h3 className="text-base font-bold text-on-surface mb-1">
            Tidak Ada Pengajuan Kemitraan
          </h3>
          <p className="text-xs text-charcoal-subtle max-w-sm mx-auto">
            {partnerFilter === 'pending'
              ? 'Saat ini belum ada pengajuan kemitraan baru yang menunggu persetujuan.'
              : 'Tidak ada data tempat mitra yang sesuai dengan filter pencarian Anda.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPartnerPlaces.map((place) => {
            const isPendingPartner = place.partnership_status === 'pending';
            const isOfficialPartner = Boolean(place.is_partner) && place.partnership_status === 'approved';
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

                      {isOfficialPartner ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          MITRA RESMI AKTIF
                        </span>
                      ) : isPendingPartner ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                          Pengajuan Mitra Pending
                        </span>
                      ) : place.partnership_status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-800 dark:text-rose-300">
                          <span className="material-symbols-outlined text-[12px]">cancel</span>
                          Pengajuan Ditolak
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-surface-container text-charcoal-subtle">
                          Belum Mengajukan Mitra
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-on-surface truncate flex items-center gap-1.5">
                      <span>{place.name}</span>
                      {isOfficialPartner && (
                        <span
                          className="material-symbols-outlined text-emerald-600 text-[18px]"
                          title="Verified Official Partner"
                        >
                          verified
                        </span>
                      )}
                    </h3>

                    <p className="text-xs text-charcoal-subtle flex items-center gap-1 mt-0.5 truncate">
                      <span className="material-symbols-outlined text-[14px] shrink-0 text-charcoal-subtle">
                        location_on
                      </span>
                      <span className="truncate">{place.address}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-charcoal-subtle">
                      <span className="inline-flex items-center gap-0.5 font-bold text-amber-500">
                        <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                        {Number(place.rating) > 0 ? Number(place.rating).toFixed(1) : '0'} ({place.reviewCount || 0} Ulasan)
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-on-surface">{place.price}</span>
                      <span>•</span>
                      <span className="text-primary font-medium">
                        Benefit Mitra: Prioritas Rekomendasi &amp; Reservasi Khusus
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
                    <span className="hidden sm:inline">Pratinjau</span>
                  </button>

                  {isPendingPartner && (
                    <>
                      <button
                        type="button"
                        disabled={isCurrentActionLoading}
                        onClick={() => onUpdatePartnership(place.id, 'rejected', false)}
                        className="px-3.5 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        <span>Tolak</span>
                      </button>

                      <button
                        type="button"
                        disabled={isCurrentActionLoading}
                        onClick={() => onUpdatePartnership(place.id, 'approved', true)}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isCurrentActionLoading ? (
                          <span className="material-symbols-outlined text-[16px] animate-spin">
                            progress_activity
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[16px]">handshake</span>
                        )}
                        <span>Terima Kemitraan</span>
                      </button>
                    </>
                  )}

                  {isOfficialPartner && (
                    <>
                      <button
                        type="button"
                        disabled={isCurrentActionLoading}
                        onClick={() => onUpdatePartnership(place.id, 'none', false)}
                        className="px-3 py-2 rounded-xl border border-border-hairline hover:bg-rose-500/10 hover:text-rose-600 text-xs font-semibold text-charcoal-subtle transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        title="Cabut status kemitraan resmi"
                      >
                        <span className="material-symbols-outlined text-[16px]">do_not_disturb_on</span>
                        <span>Cabut Status Mitra</span>
                      </button>

                      {onDeletePartnership && (
                        <button
                          type="button"
                          disabled={isCurrentActionLoading}
                          onClick={() => onDeletePartnership(place.id)}
                          className="px-3 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          title="Hapus kemitraan tempat ini secara permanen"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Hapus Kemitraan</span>
                        </button>
                      )}
                    </>
                  )}

                  {!isOfficialPartner && !isPendingPartner && (
                    <>
                      <button
                        type="button"
                        disabled={isCurrentActionLoading}
                        onClick={() => onUpdatePartnership(place.id, 'approved', true)}
                        className="px-3 py-2 rounded-xl bg-surface-container hover:bg-purple-600 hover:text-white text-xs font-bold text-on-surface transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Resmikan Jadi Mitra</span>
                      </button>

                      {onDeletePartnership && place.partnership_status === 'rejected' && (
                        <button
                          type="button"
                          disabled={isCurrentActionLoading}
                          onClick={() => onDeletePartnership(place.id)}
                          className="px-3 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          title="Hapus pengajuan kemitraan yang ditolak"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Hapus</span>
                        </button>
                      )}
                    </>
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

