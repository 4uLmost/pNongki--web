import React from 'react';

export default function LandingExploreMapBanner({ placesCount = 0, onNavigate }) {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pb-16 w-full">
      <div className="w-full bg-surface-card rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 flex flex-col gap-3">
          <p className="text-xs font-semibold text-charcoal-subtle tracking-wide uppercase">
            Explore Tempat
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface leading-snug">
            Jelajah Spot dengan Filter Jarak &amp; Suasana
          </h2>
          <p className="text-sm text-charcoal-subtle leading-relaxed font-normal">
            Lihat tempat nongki di sekitar mu langsung lengkap dengan status ketersediaan meja, colokan listrik, serta rute tercepat via Google Maps atau transportasi umum.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate('explore')}
              className="px-6 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface text-sm font-semibold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">explore</span>
              <span>Jelajahi Tempat</span>
            </button>
          </div>
        </div>

        <div className="md:w-1/2 w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-inner relative border border-border-hairline">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCM_PanB47Kyu1V9Ik4MwIALrNnVfnfO2EdPi-80Ej2GhGa5e7971HN97nhrdk1-WxUTZXFh4K1bzY4waeuiJyfmvIVZCX8psV0NlnubKK_-dBYRIQsortyh3r6sKlqtRM66zEzaQViLkekh8i-pRqpvS5O7K375EQoyhx_0dy_r-hCZU4m0v3mNiQ4Myo8iOPDcbl9BfJJOzeraS6Q0NH0FChPHE4TR5HAV-A6wUQcSSWDoslpFX_ilQ")`,
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-inverse-surface/95 text-inverse-on-surface px-4 py-2 rounded-xl shadow-md flex items-center gap-2 border border-white/10 backdrop-blur-xs">
            <span className="material-symbols-outlined text-[16px] text-primary-container" aria-hidden="true">location_on</span>
            <span className="text-xs font-semibold">{placesCount > 0 ? `${placesCount} Spot Terdaftar` : 'Spot Terverifikasi'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

