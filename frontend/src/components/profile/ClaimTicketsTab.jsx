import React from 'react';

export default function ClaimTicketsTab({
  claimsHistory = [],
  isLoadingProfileData,
  profileLoadError,
  loadProfileData,
  setActiveReceiptModal,
  onOpenRewardCatalog,
}) {
  return (
    <div className="flex flex-col gap-4">
      {isLoadingProfileData ? (
        <div className="py-16 text-center bg-surface-card rounded-3xl border border-border-hairline">
          <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-charcoal-subtle mt-2">
            Memuat riwayat tiket hadiah...
          </p>
        </div>
      ) : profileLoadError ? (
        <div className="p-10 text-center bg-surface-card rounded-3xl border border-dashed border-error/40 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">wifi_off</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">Gagal Memuat Riwayat</h4>
          <p className="text-xs text-charcoal-subtle max-w-sm">{profileLoadError}</p>
          <button
            type="button"
            onClick={loadProfileData}
            className="mt-1 px-4 py-2 rounded-xl bg-primary-container text-on-primary-fixed hover:bg-accent-hover font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : claimsHistory.length === 0 ? (
        <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-charcoal-subtle">
            receipt_long
          </span>
          <h3 className="font-bold text-base text-on-surface">Belum ada hadiah yang ditukarkan</h3>
          <p className="text-xs text-charcoal-subtle max-w-sm">
            Gunakan saldo poin hadiahmu untuk menukar voucer kafe atau merchandise resmi pNongki!.
          </p>
          <button
            type="button"
            onClick={onOpenRewardCatalog}
            className="mt-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary-fixed font-bold text-xs cursor-pointer"
          >
            Buka Katalog Hadiah
          </button>
        </div>
      ) : (
        claimsHistory.map((claim) => (
          <div
            key={claim.id}
            className="bg-surface-card rounded-3xl p-5 md:p-6 border border-border-hairline shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                  claim.type === 'merchandise'
                    ? 'bg-purple-100 text-purple-900'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {claim.type === 'merchandise' ? 'inventory_2' : 'local_cafe'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-surface-container text-on-surface border">
                    {claim.claimCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      claim.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {claim.status === 'completed'
                      ? 'Telah Diterima'
                      : 'Menunggu Pengambilan'}
                  </span>
                </div>
                <h4 className="font-bold text-sm md:text-base text-on-surface mt-1">
                  {claim.title}
                </h4>
                <p className="text-xs text-charcoal-subtle">
                  Ditukarkan: {claim.claimedAt} • {claim.pointCost} Poin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setActiveReceiptModal(claim)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-border-hairline text-xs font-bold text-on-surface inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">receipt</span>
                <span>Lihat Struk</span>
              </button>

              {claim.type === 'merchandise' && claim.status === 'menunggu_pengambilan' && (
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Admin pNongki!, saya ingin konfirmasi pengambilan merchandise "${claim.title}" dengan Kode Klaim ${claim.claimCode}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-status-open text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs hover:bg-status-open/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Konfirmasi WA</span>
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

