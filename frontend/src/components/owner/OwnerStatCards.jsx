import React from 'react';

export default function OwnerStatCards({ currentPlace, reservations = [] }) {
  const confirmedReservationsCount = reservations.filter((r) => r.status === 'confirmed').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-4 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">verified</span>
        </div>
        <div>
          <span className="text-[11px] text-charcoal-subtle font-medium block">Status Kemitraan</span>
          <span className="text-sm md:text-base font-extrabold text-purple-900">Official Partner</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">table_restaurant</span>
        </div>
        <div>
          <span className="text-[11px] text-charcoal-subtle font-medium block">Reservasi Meja</span>
          <span className="text-sm md:text-base font-extrabold text-emerald-900">
            {confirmedReservationsCount} Menunggu Hadir
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">schedule</span>
        </div>
        <div>
          <span className="text-[11px] text-charcoal-subtle font-medium block">Jam Operasional</span>
          <span className="text-sm md:text-base font-extrabold text-amber-900 truncate max-w-[140px] block">
            {currentPlace?.openStatus || 'Buka Setiap Hari'}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">star</span>
        </div>
        <div>
          <span className="text-[11px] text-charcoal-subtle font-medium block">Rating Tempat</span>
          <span className="text-sm md:text-base font-extrabold text-blue-900">
            {Number(currentPlace?.rating) > 0 ? Number(currentPlace.rating).toFixed(1) : '0'} ⭐ ({currentPlace?.reviewCount ?? 0} Ulasan)
          </span>
        </div>
      </div>
    </div>
  );
}

