import React from 'react';

export default function PartnershipTab({
  businessClaims = [],
  places = [],
  isLoadingProfileData,
  isClaimsLoading,
  profileLoadError,
  loadProfileData,
  onOpenPartnershipModal,
  onNavigate,
  onSelectPlace,
  onDeleteClaim,
  isDeletingClaimId,
}) {
  const uniqueClaims = React.useMemo(() => {
    const seen = new Set();
    return businessClaims.filter((c) => {
      const key = c.placeId ? String(c.placeId) : String(c.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [businessClaims]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-on-surface">
              Kemitraan
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-container text-charcoal-subtle border border-border-hairline">
              {uniqueClaims.length} Pengajuan
            </span>
          </div>
          <p className="text-xs text-charcoal-subtle mt-0.5">
            Pantau alur verifikasi berkas dan aktivasi lencana Official Partner bisnis Anda.
          </p>
        </div>

        {uniqueClaims.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (onOpenPartnershipModal) {
                onOpenPartnershipModal();
              } else if (onNavigate) {
                onNavigate('partnership-modal');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Ajukan Tempat Lain</span>
          </button>
        )}
      </div>

      {isLoadingProfileData || isClaimsLoading ? (
        <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-purple-600 animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-charcoal-subtle">
            Memuat status kemitraan bisnis Anda...
          </p>
        </div>
      ) : profileLoadError ? (
        <div className="p-10 text-center bg-surface-card rounded-3xl border border-dashed border-error/40 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">wifi_off</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">Gagal Memuat Data Kemitraan</h4>
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
      ) : uniqueClaims.length === 0 ? (
        <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[32px] text-primary">handshake</span>
          </div>
          <h3 className="font-bold text-base text-on-surface">Belum ada pengajuan kemitraan aktif</h3>
          <p className="text-xs text-charcoal-subtle max-w-md leading-relaxed">
            Punya spot kafe yang sudah terdaftar di pNongki? Ajukan status Official Partner untuk mengaktifkan reservasi meja online dan lencana terverifikasi resmi.
          </p>
          <button
            type="button"
            onClick={() => {
              if (onOpenPartnershipModal) {
                onOpenPartnershipModal();
              } else if (onNavigate) {
                onNavigate('partnership-modal');
              }
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-fixed font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer hover:brightness-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Ajukan Kemitraan Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {uniqueClaims.map((claim) => {
            const matchedPlace = places.find(
              (p) => String(p.id) === String(claim.placeId || claim.place_id)
            );

            const isPending =
              claim.status === 'pending' ||
              claim.partnership_status === 'pending' ||
              matchedPlace?.partnership_status === 'pending';

            const isApproved =
              !isPending &&
              (claim.status === 'approved' ||
                claim.partnership_status === 'approved' ||
                matchedPlace?.partnership_status === 'approved' ||
                (Boolean(claim.isPartner) && claim.status !== 'rejected') ||
                (Boolean(matchedPlace?.is_partner) && matchedPlace?.partnership_status !== 'rejected'));

            const isRejected =
              !isPending &&
              !isApproved &&
              (claim.status === 'rejected' ||
                claim.partnership_status === 'rejected' ||
                matchedPlace?.partnership_status === 'rejected');

            return (
              <div
                key={claim.id || claim.ticketCode}
                className="bg-surface-card rounded-3xl p-5 md:p-6 border border-border-hairline shadow-xs flex flex-col gap-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border-hairline">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-xl bg-surface-container text-on-surface font-mono font-bold text-xs tracking-wide border border-border-hairline">
                      #{claim.ticketCode || 'PTR-849201'}
                    </span>
                    <span className="text-[11px] text-charcoal-subtle flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {claim.createdAt
                        ? new Date(claim.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Baru saja'}
                    </span>
                  </div>

                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                        <span className="material-symbols-outlined text-[14px] animate-pulse">
                          hourglass_top
                        </span>
                        <span>Menunggu Kurasi Admin</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-300">
                        <span className="material-symbols-outlined text-[14px] text-purple-600">
                          verified
                        </span>
                        <span>Mitra Resmi Terverifikasi</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-300">
                        <span className="material-symbols-outlined text-[14px] text-rose-600">
                          cancel
                        </span>
                        <span>Perlu Perbaikan Dokumen</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={
                        claim.placeCover ||
                        matchedPlace?.imageUrl ||
                        matchedPlace?.image_url ||
                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={claim.placeName || claim.businessName}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover shrink-0 border border-border-hairline shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm md:text-base text-on-surface">
                          {claim.placeName || claim.businessName || 'Bisnis Anda'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-container text-on-surface border border-border-hairline">
                          {claim.category || matchedPlace?.category || 'Kafe'}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-subtle mt-0.5 line-clamp-1">
                        {claim.placeAddress || matchedPlace?.address || matchedPlace?.city || 'Bandung'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-charcoal-subtle flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-primary">person</span>
                          <span>{claim.contactPerson || 'PIC Usaha'}</span>
                        </span>
                        {claim.whatsappNumber && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-emerald-600">call</span>
                            <span>{claim.whatsappNumber}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
                    {matchedPlace && (
                      <button
                        type="button"
                        onClick={() => onSelectPlace && onSelectPlace(matchedPlace)}
                        className="px-3.5 py-2 rounded-xl border border-border-hairline hover:border-[#242424] text-xs font-bold text-on-surface transition-colors cursor-pointer inline-flex items-center gap-1.5 bg-surface-container-low"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        <span>Buka Halaman Tempat</span>
                      </button>
                    )}

                    {onDeleteClaim && (
                      <button
                        type="button"
                        disabled={isDeletingClaimId === claim.id}
                        onClick={() => onDeleteClaim(claim)}
                        className="px-3.5 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                        title="Batalkan atau hapus kemitraan ini"
                      >
                        {isDeletingClaimId === claim.id ? (
                          <span className="material-symbols-outlined text-[15px] animate-spin">
                            progress_activity
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        )}
                        <span>Hapus Kemitraan</span>
                      </button>
                    )}
                  </div>
                </div>

                {isApproved ? (
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <div>
                        <span className="font-bold text-purple-950 block">Mitra Resmi pNongki Aktif</span>
                        <span className="text-purple-800/90 text-xs">
                          Lencana Official Partner &amp; fitur reservasi meja online aktif di linimasa publik.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('owner-dashboard', { place: matchedPlace, claim });
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">storefront</span>
                      <span>Kelola Tempat Saya</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-surface-container-low/60 rounded-2xl p-4 border border-border-hairline">
                    <span className="text-[10px] font-bold text-charcoal-subtle uppercase tracking-wider block mb-2.5">
                      Alur Status Verifikasi:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-card border border-border-hairline">
                        <div className="w-5 h-5 rounded-full bg-[#d4e684] text-[#181e00] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-on-surface block leading-tight">
                            1. Pengajuan Dikirim
                          </span>
                          <span className="text-[10px] text-charcoal-subtle leading-tight block mt-0.5">
                            Tiket #{claim.ticketCode || 'PTR'} terdaftar
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-card border border-border-hairline">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isRejected
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-[#242424] text-white shadow-xs'
                          }`}
                        >
                          {isRejected ? (
                            <span className="material-symbols-outlined text-[13px]">close</span>
                          ) : (
                            <span className="material-symbols-outlined text-[13px] animate-spin">
                              progress_activity
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-on-surface block leading-tight">
                            2. Kurasi Dokumen &amp; PIC
                          </span>
                          <span className="text-[10px] text-charcoal-subtle leading-tight block mt-0.5">
                            {isRejected
                              ? 'Dokumen ditolak kurator'
                              : 'Kurator memverifikasi berkas'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-card border border-border-hairline">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 bg-surface-container text-charcoal-subtle border border-border-hairline">
                          <span className="text-[10px]">3</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-on-surface block leading-tight">
                            3. Aktivasi Mitra Resmi
                          </span>
                          <span className="text-[10px] text-charcoal-subtle leading-tight block mt-0.5">
                            Menunggu hasil kurasi
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border-hairline text-xs">
                      {isPending && (
                        <p className="text-amber-900 font-medium leading-relaxed flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">
                            info
                          </span>
                          <span>
                            Tim kurasi pNongki! sedang memvalidasi kontak dan kelengkapan dokumen kemitraan. Proses kurasi biasanya memerlukan waktu <strong>1x24 jam kerja</strong>. Anda akan dihubungi melalui WhatsApp jika ada dokumen yang perlu dikonfirmasi.
                          </span>
                        </p>
                      )}
                      {isRejected && (
                        <div className="flex flex-col gap-2">
                          <p className="text-rose-900 font-medium leading-relaxed flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-rose-700 shrink-0 mt-0.5">
                              warning
                            </span>
                            <span>
                              Pengajuan kemitraan belum dapat disetujui kurator. Silakan periksa kembali berkas izin usaha/legalitas Anda atau hubungi kurator untuk klarifikasi.
                            </span>
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenPartnershipModal) {
                                onOpenPartnershipModal();
                              } else if (onNavigate) {
                                onNavigate('partnership-modal');
                              }
                            }}
                            className="self-start px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">refresh</span>
                            <span>Ajukan Ulang Kemitraan</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

