import React from 'react';

export default function ProfileHeader({
  userProfile,
  userLevel,
  userInitials,
  onOpenEditProfile,
  businessClaims = [],
  places = [],
  onOpenPartnershipModal,
  onNavigate,
  setActiveTab,
}) {
  const hasApprovedClaim = businessClaims.some((c) => {
    const p = places.find(
      (pl) => String(pl.id) === String(c.placeId || c.place_id)
    );
    const isPending =
      c.status === 'pending' ||
      c.partnership_status === 'pending' ||
      p?.partnership_status === 'pending';
    return (
      !isPending &&
      (c.status === 'approved' ||
        c.partnership_status === 'approved' ||
        p?.partnership_status === 'approved')
    );
  });

  const hasPendingClaim = !hasApprovedClaim && businessClaims.some((c) => {
    const p = places.find(
      (pl) => String(pl.id) === String(c.placeId || c.place_id)
    );
    return (
      c.status === 'pending' ||
      c.partnership_status === 'pending' ||
      p?.partnership_status === 'pending'
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-surface-card rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-primary-container text-on-surface font-extrabold text-2xl flex items-center justify-center shadow-md">
              {userInitials}
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-status-open text-white flex items-center justify-center text-[14px] ring-2 ring-surface-card shadow-xs"
              title="Akun Aktif"
            >
              <span className="material-symbols-outlined text-[14px]">check</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                {userProfile.name}
              </h1>
              {userLevel && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-lg border flex items-center gap-1 shadow-2xs ${userLevel.profileBadgeStyle}`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {userLevel.icon}
                  </span>
                  <span>{userLevel.name}</span>
                </span>
              )}
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface uppercase tracking-wider border border-border-hairline">
                {userProfile.role === 'user' || userProfile.role === 'mahasiswa' ? 'User' : userProfile.role?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-subtle mt-0.5">
              <span className="inline-flex items-center gap-1 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[15px] text-primary">military_tech</span>
                <span>{userProfile.xpPoints} Reputasi XP</span>
              </span>
              <span className="text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[15px] text-primary">savings</span>
                <span>{userProfile.pointsBalance} Saldo Poin</span>
              </span>
            </div>
          </div>
        </div>

        <div className="z-10 w-full md:w-auto flex items-center">
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="w-full md:w-auto px-4 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-border-hairline text-xs font-bold text-on-surface inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>Pengaturan Profil</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-card rounded-3xl p-5 md:p-6 shadow-xs border border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-surface flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-[24px]">storefront</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-sm md:text-base text-on-surface">
                Ajukan bisnis anda
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container text-primary uppercase tracking-wider">
                Mitra Kafe
              </span>
              {hasApprovedClaim ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>Mitra Resmi Terverifikasi</span>
                </span>
              ) : hasPendingClaim ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  <span className="material-symbols-outlined text-[13px] animate-pulse">hourglass_top</span>
                  <span>Pengajuan Sedang Ditinjau Admin</span>
                </span>
              ) : null}
            </div>
            <p className="text-xs text-charcoal-subtle mt-0.5 leading-relaxed">
              Pemilik atau pengelola kafe? Verifikasi bisnis Anda untuk mengelola menu resmi, jam operasional, dan menjangkau ribuan mahasiswa.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {businessClaims.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('kemitraan');
                setTimeout(() => {
                  const el = document.getElementById('profile-tabs-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="px-4 py-2.5 rounded-2xl border border-border-hairline hover:border-[#242424] text-on-surface text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-surface-container/50 hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">handshake</span>
              <span>Kemitraan ({businessClaims.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onOpenPartnershipModal) {
                onOpenPartnershipModal();
              } else if (onNavigate) {
                onNavigate('partnership-modal');
              }
            }}
            className="px-5 py-2.5 rounded-2xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] text-primary-container">
              storefront
            </span>
            <span>{businessClaims.length > 0 ? 'Ajukan Tempat Lain' : 'Ajukan bisnis anda'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

