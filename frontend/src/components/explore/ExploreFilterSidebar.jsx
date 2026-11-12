import React from 'react';

export default function ExploreFilterSidebar({
  leftSidebarRef,
  resetFilters,
  spotCategories,
  specialCategories,
  selectedCategory,
  setSelectedCategory,
  openNowOnly,
  setOpenNowOnly,
  open24HoursOnly,
  setOpen24HoursOnly,
  selectedFacilities,
  toggleFacility,
  minRating,
  setMinRating,
  maxDistance,
  setMaxDistance,
}) {
  return (
    <aside
      ref={leftSidebarRef}
      className="w-full lg:w-72 shrink-0 bg-surface-card border border-border-hairline rounded-2xl p-5 shadow-xs flex flex-col gap-5 transition-all"
    >
      <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
          <h3 className="font-extrabold text-sm text-on-surface">Filter Pencarian</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-[11px] font-semibold text-charcoal-subtle hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[13px]">restart_alt</span>
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[11px] text-charcoal-subtle">
          Kategori Spot
        </label>
        <div className="flex flex-col gap-1.5">
          {spotCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left group cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs ring-1 ring-primary/30'
                    : 'bg-surface hover:bg-surface-container text-on-surface font-medium border border-border-hairline'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      isSelected ? 'text-primary' : 'text-charcoal-subtle group-hover:text-primary'
                    }`}
                  >
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </span>
                <span
                  className={`text-[11px] ${
                    isSelected
                      ? 'px-1.5 py-0.5 rounded-md bg-on-primary-fixed/10 font-extrabold'
                      : 'text-charcoal-subtle font-medium group-hover:text-on-surface'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-border-hairline">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[11px] text-charcoal-subtle">
          Kategori Khusus
        </label>
        <div className="flex flex-col gap-1.5">
          {specialCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left group cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs ring-1 ring-primary/30'
                    : 'bg-surface hover:bg-surface-container text-on-surface font-medium border border-border-hairline'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      isSelected ? 'text-primary' : 'text-charcoal-subtle group-hover:text-primary'
                    }`}
                  >
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </span>
                <span
                  className={`text-[11px] ${
                    isSelected
                      ? 'px-1.5 py-0.5 rounded-md bg-on-primary-fixed/10 font-extrabold'
                      : 'text-charcoal-subtle font-medium group-hover:text-on-surface'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-border-hairline">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[11px] text-charcoal-subtle">
          Jam Operasional
        </label>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface hover:bg-surface-container border border-border-hairline cursor-pointer transition-colors">
            <span className="text-xs font-semibold text-on-surface flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Buka Sekarang
            </span>
            <input
              type="checkbox"
              checked={openNowOnly}
              onChange={(e) => setOpenNowOnly(e.target.checked)}
              className="accent-primary w-4 h-4 rounded cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface hover:bg-surface-container border border-border-hairline cursor-pointer transition-colors">
            <span className="text-xs font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
              Buka 24 Jam
            </span>
            <input
              type="checkbox"
              checked={open24HoursOnly}
              onChange={(e) => setOpen24HoursOnly(e.target.checked)}
              className="accent-primary w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-border-hairline">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[11px] text-charcoal-subtle">
          Fasilitas
        </label>
        <div className="flex flex-col gap-2">
          {[
            { id: 'WiFi Kencang', label: 'WiFi Kencang', icon: 'wifi' },
            { id: 'Stopkontak / Colokan', label: 'Stopkontak Tiap Meja', icon: 'power' },
            { id: 'Kursi Ergonomis', label: 'Kursi Nyaman / Ergonomis', icon: 'chair' },
            { id: 'Outdoor Area', label: 'Area Outdoor', icon: 'park' },
            { id: 'Parkir Luas', label: 'Parkir Luas', icon: 'local_parking' },
          ].map((item) => {
            const isChecked = selectedFacilities.includes(item.id);
            return (
              <label
                key={item.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface transition-colors text-xs text-on-surface cursor-pointer"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      isChecked ? 'text-primary' : 'text-charcoal-subtle'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFacility(item.id)}
                  className="accent-primary w-4 h-4 rounded cursor-pointer"
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-border-hairline">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[11px] text-charcoal-subtle">
          Rating Minimal
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { key: 'all', label: 'Semua' },
            { key: '4.0', label: '4.0+', star: true },
            { key: '4.5', label: '4.5+', star: true },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setMinRating(item.key)}
              className={`px-2 py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                minRating === item.key
                  ? 'font-bold bg-inverse-surface text-inverse-on-surface shadow-xs'
                  : 'font-medium bg-surface hover:bg-surface-container text-on-surface border border-border-hairline'
              }`}
            >
              {item.star && (
                <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1">
                  star
                </span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-border-hairline">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-charcoal-subtle uppercase tracking-wider text-[11px]">
            Maksimal Radius
          </span>
          <span className="font-bold text-primary text-xs">
            {maxDistance >= 25 ? 'Semua Jarak' : `< ${maxDistance.toFixed(1)} km`}
          </span>
        </div>
        <input
          className="w-full h-1.5 bg-surface-container rounded-lg accent-primary cursor-pointer"
          max="25"
          min="1"
          step="0.5"
          type="range"
          value={maxDistance}
          onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-charcoal-subtle font-medium">
          <span>1 km</span>
          <span>12 km</span>
          <span>Semua</span>
        </div>
      </div>
    </aside>
  );
}

