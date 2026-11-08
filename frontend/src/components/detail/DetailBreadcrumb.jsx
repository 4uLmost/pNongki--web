import React from 'react';

export default function DetailBreadcrumb({
  currentPlace,
  onNavigate,
}) {
  return (
    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border-hairline">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap text-xs text-charcoal-subtle font-medium">
        <button
          type="button"
          onClick={() => {
            if (onNavigate) onNavigate('beranda');
          }}
          className="hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">home</span>
          <span>Beranda</span>
        </button>
        <span className="text-outline-variant">/</span>
        <button
          type="button"
          onClick={() => {
            if (onNavigate) onNavigate('explore');
          }}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          Explore
        </button>
        <span className="text-outline-variant">/</span>
        <button
          type="button"
          onClick={() => {
            if (onNavigate) onNavigate('explore', { category: currentPlace.categoryKey || 'nugas' });
          }}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          {currentPlace.category || 'Nugas & Co-working'}
        </button>
        <span className="text-outline-variant">/</span>
        <span className="text-on-surface font-semibold truncate max-w-[220px] sm:max-w-none">
          {currentPlace.name}
        </span>
      </nav>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex items-center gap-2 bg-surface-card px-3 py-1 rounded-full border border-border-hairline text-xs">
          <span className={`w-2 h-2 rounded-full ${currentPlace.isOpenNow !== false ? 'bg-status-open animate-pulse' : 'bg-red-500'}`} />
          <span className="text-on-surface font-semibold">{currentPlace.isOpenNow !== false ? 'Buka Sekarang' : 'Tutup'}</span>
          {(currentPlace.open_status || currentPlace.openStatus) && (
            <span className="text-charcoal-subtle">• {currentPlace.open_status || currentPlace.openStatus}</span>
          )}
        </div>
        <div className="inline-flex items-center gap-1.5 bg-surface-card px-3 py-1 rounded-full border border-border-hairline text-xs font-medium text-on-surface">
          <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
          <span>Terverifikasi pNongki</span>
        </div>
      </div>
    </section>
  );
}

