import React from 'react';

export default function ProfileTabsNav({
  activeTab,
  setActiveTab,
  myPlacesCount = 0,
  businessClaimsCount = 0,
  hasApprovedClaim = false,
  claimsHistoryCount = 0,
  favoritesCount = 0,
}) {
  return (
    <div
      id="profile-tabs-section"
      className="flex items-center gap-1.5 p-1.5 bg-surface-card rounded-2xl border border-border-hairline shadow-2xs overflow-x-auto text-xs"
    >
      <button
        type="button"
        onClick={() => setActiveTab('tempat-saya')}
        className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
          activeTab === 'tempat-saya'
            ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
            : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">storefront</span>
        <span>Tempat Ditambahkan ({myPlacesCount})</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('kemitraan')}
        className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
          activeTab === 'kemitraan'
            ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
            : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">handshake</span>
        <span>Kemitraan ({businessClaimsCount})</span>
        {hasApprovedClaim ? (
          <span className="w-2 h-2 rounded-full bg-purple-500" />
        ) : businessClaimsCount > 0 ? (
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('katalog-reward')}
        className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
          activeTab === 'katalog-reward'
            ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
            : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">redeem</span>
        <span>Katalog Reward &amp; Voucer</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('riwayat-klaim')}
        className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
          activeTab === 'riwayat-klaim'
            ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
            : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
        <span>Tiket Hadiah Saya ({claimsHistoryCount})</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('favorit')}
        className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
          activeTab === 'favorit'
            ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
            : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-rose-500">favorite</span>
        <span>Tempat Favorit ({favoritesCount})</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('aktivitas')}
        className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
          activeTab === 'aktivitas'
            ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
            : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">history_edu</span>
        <span>Riwayat Kontribusi</span>
      </button>
    </div>
  );
}

