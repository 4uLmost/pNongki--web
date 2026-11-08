import React from 'react';

export default function DetailTransitTab({
  currentPlace,
  mapZoom,
  setMapZoom,
  handleCopyAddress,
  currentTransitRoute,
  transitInfo,
  handleCopyTransitRoute,
  activeTransitMode,
  setActiveTransitMode,
}) {
  return (
    <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-6">
      <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-container text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">Lokasi & Rute</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div
            className="w-full h-96 rounded-2xl bg-surface-container bg-cover bg-center relative overflow-hidden shadow-inner border border-border-hairline transition-all duration-300"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBNGVTElGlv83djKQD-Y4erlx7HBe8Ffa5Sxms0qsWORzCWEbHzlCEUWMhWPU3BuCQ1kQeSy0YkT4v9w5-2ybUnai6ccUtAYs-FvTKD1Edl0XsdZuGuZgtehNCzxO1fCZzaKM67MZQch6qRTNdvyTjABBje7ZlDX2CCSDE5yDmqkaJ1NZQlxHd6-ngFMTH9q3HIWfFsjEgB_75evYzR18QlHFj0npKfKCrw_CrghRhQTTOQYENv60DwA")`,
              transform: `scale(${mapZoom})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-auto">
              <div className="bg-surface-card/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5 text-on-surface text-[11px] font-bold border border-border-hairline">
                <span className="w-2 h-2 rounded-full bg-status-open animate-pulse" />
                Koordinat: {currentPlace.latitude || -6.89245}, {currentPlace.longitude || 107.61058}
              </div>
            </div>

            <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-auto">
              <button
                type="button"
                aria-label="Perbesar Peta"
                onClick={() => setMapZoom((prev) => Math.min(prev + 0.15, 1.45))}
                className="w-8 h-8 rounded-lg bg-surface-card/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-xs hover:bg-surface-container transition-colors cursor-pointer border border-border-hairline"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button
                type="button"
                aria-label="Perkecil Peta"
                onClick={() => setMapZoom((prev) => Math.max(prev - 0.15, 0.9))}
                className="w-8 h-8 rounded-lg bg-surface-card/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-xs hover:bg-surface-container transition-colors cursor-pointer border border-border-hairline"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center">
                <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping" />
                  <span className="text-sm font-bold">{currentPlace.name}</span>
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-inverse-surface" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="bg-surface-card/90 backdrop-blur-md text-on-surface px-3 py-1 rounded-full text-[10px] font-semibold shadow-2xs border border-border-hairline">
                Peta Area {currentPlace.city || 'Sekitar Lokasi'}
              </span>
              <span className="bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface px-2.5 py-1 rounded-full text-[10px] font-medium">
                OpenStreetMap
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-charcoal-subtle px-1">
            <span className="text-[11px]">Akurasi GPS ±3 meter</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-3.5 border border-border-hairline">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
                <h3 className="text-sm font-bold text-on-surface">Alamat Lengkap</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Salin</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-on-surface leading-snug">
                {currentPlace.address || 'Jl. Ir. H. Juanda No. 115, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132'}
              </p>
              <p className="text-xs text-charcoal-subtle">
                <strong className="text-on-surface font-medium">Patokan:</strong> Seberang gerbang utama / 800m dari simpang utama.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="px-2.5 py-1 rounded-md bg-surface-card text-on-surface text-[11px] font-medium border border-border-hairline flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-status-open">check_circle</span>
                Akurasi GPS Tinggi
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-card text-on-surface text-[11px] font-medium border border-border-hairline flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">directions_car</span>
                Akses Motor & Mobil
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-card text-on-surface text-[11px] font-medium border border-border-hairline flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">local_parking</span>
                Parkir Luas
              </span>
            </div>

            <div className="pt-2 border-t border-border-hairline flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-subtle flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
                  Jarak dari posisi kamu:
                </span>
                <span className="font-bold text-on-surface">
                  {currentPlace.distanceKm ? `${currentPlace.distanceKm} km` : '800 meter'} (~{Math.max(3, Math.round((currentPlace.distanceKm || 0.8) * 3))} mnt)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <a
              className="w-full py-3 px-4 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
              href={`https://www.google.com/maps/dir/?api=1&destination=${currentPlace.latitude || -6.89245},${currentPlace.longitude || 107.61058}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[20px] text-primary-container">directions</span>
              Buka Rute di Google Maps
            </a>

            <button
              type="button"
              onClick={() => {
                document.getElementById('transportasi-umum-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-2 border border-border-hairline transition-all cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">directions_bus</span>
              <span>Lihat Panduan Transportasi Umum (Angkot & Bus)</span>
            </button>
          </div>
        </div>
      </div>

      <div id="transportasi-umum-section" className="mt-4 pt-6 border-t border-border-hairline flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-surface flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">directions_bus</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg md:text-xl font-bold text-on-surface">
                  Akomodasi & Rute Transportasi Umum
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-container text-on-surface">
                  {currentTransitRoute.badge}
                </span>
              </div>
              <p className="text-xs text-charcoal-subtle mt-0.5">
                Panduan rute langkah demi langkah hemat dari lokasi Anda menuju {currentPlace.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => handleCopyTransitRoute(currentTransitRoute)}
              className="py-2 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-border-hairline transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Salin Panduan Rute</span>
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${currentPlace.latitude || -6.89245},${currentPlace.longitude || 107.61058}&travelmode=transit`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-container">open_in_new</span>
              <span>Google Maps Transit</span>
            </a>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-4 md:p-5 border border-border-hairline flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="w-3 h-3 rounded-full bg-status-open ring-4 ring-status-open/20" />
              <span className="w-0.5 h-6 bg-border-hairline my-0.5" />
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-charcoal-subtle font-medium min-w-[42px]">Dari:</span>
                <span className="font-bold text-on-surface">{transitInfo.userOrigin}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-charcoal-subtle font-medium min-w-[42px]">Tujuan:</span>
                <span className="font-bold text-on-surface">{currentPlace.name}</span>
                <span className="text-[11px] text-charcoal-subtle hidden sm:inline">• {currentPlace.address || 'Pusat Kota'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap border-t md:border-t-0 pt-3 md:pt-0 border-border-hairline text-xs">
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[10px] text-charcoal-subtle uppercase tracking-wider font-semibold">Estimasi Waktu</span>
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                {currentTransitRoute.duration}
              </span>
            </div>
            <div className="h-7 w-px bg-border-hairline hidden md:block" />
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[10px] text-charcoal-subtle uppercase tracking-wider font-semibold">Estimasi Tarif</span>
              <span className="font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">payments</span>
                {currentTransitRoute.fare}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTransitMode('angkot')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTransitMode === 'angkot'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-bold'
                : 'bg-surface-card hover:bg-surface-container text-on-surface border border-border-hairline'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">local_taxi</span>
            <span>Angkot (Angkutan Kota)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTransitMode === 'angkot' ? 'bg-white/20 text-white' : 'bg-primary-container text-on-surface'}`}>
              Paling Hemat
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTransitMode('bus')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTransitMode === 'bus'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-bold'
                : 'bg-surface-card hover:bg-surface-container text-on-surface border border-border-hairline'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">directions_bus</span>
            <span>Bus Trans / Teman Bus</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTransitMode === 'bus' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'}`}>
              Ber-AC
            </span>
          </button>
        </div>

        <div className="relative pl-8 md:pl-10 space-y-5 before:absolute before:left-3.5 md:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-border-hairline">
          <div className="relative">
            <div className="absolute -left-8 md:-left-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-card border border-border-hairline text-on-surface flex items-center justify-center font-bold text-xs shadow-xs">
              <span className="material-symbols-outlined text-[16px]">directions_walk</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border border-border-hairline flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">
                  Langkah 1: Menuju Titik Keberangkatan
                </span>
                <span className="text-[11px] font-semibold text-charcoal-subtle bg-surface-card px-2 py-0.5 rounded border border-border-hairline">
                  {currentTransitRoute.walkToPickup}
                </span>
              </div>
              <p className="text-xs text-charcoal-subtle leading-relaxed">
                Dari posisi Anda saat ini ({transitInfo.userOrigin}), jalan santai menuju <strong className="text-on-surface font-semibold">{currentTransitRoute.pickupPoint}</strong>.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 md:-left-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary-container text-on-surface flex items-center justify-center font-bold text-xs shadow-xs">
              <span className="material-symbols-outlined text-[16px]">
                {activeTransitMode === 'bus' ? 'directions_bus' : 'local_taxi'}
              </span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border border-border-hairline flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span>Langkah 2: Naik {currentTransitRoute.type}</span>
                  <span className="text-[11px] font-bold text-on-surface bg-primary-container px-2 py-0.5 rounded-full">
                    {currentTransitRoute.code}
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-on-surface bg-surface-card px-2 py-0.5 rounded border border-border-hairline">
                  {currentTransitRoute.fare} • {currentTransitRoute.duration}
                </span>
              </div>
              {currentTransitRoute.color && (
                <div className="text-[11px] font-medium text-charcoal-subtle flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Ciri Kendaraan: {currentTransitRoute.color} ({currentTransitRoute.routeDescription})</span>
                </div>
              )}
              <p className="text-xs text-on-surface leading-relaxed bg-surface-card p-3 rounded-lg border border-border-hairline">
                {currentTransitRoute.instruction}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 md:-left-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-card border border-border-hairline text-on-surface flex items-center justify-center font-bold text-xs shadow-xs">
              <span className="material-symbols-outlined text-[16px]">signpost</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border border-border-hairline flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">
                  Langkah 3: Turun di Titik Pemberhentian
                </span>
                <span className="text-[11px] font-semibold text-charcoal-subtle bg-surface-card px-2 py-0.5 rounded border border-border-hairline">
                  Titik Turun
                </span>
              </div>
              <p className="text-xs text-charcoal-subtle leading-relaxed">
                Turun di <strong className="text-on-surface font-semibold">{currentTransitRoute.dropPoint}</strong>.
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs bg-primary-container/30 text-on-surface px-3 py-2 rounded-lg border border-primary/20">
                <span className="material-symbols-outlined text-[16px] text-primary">record_voice_over</span>
                <span className="font-semibold">{currentTransitRoute.dropTips}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 md:-left-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-bold text-xs shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-primary-container">verified</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border border-border-hairline flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">
                  Langkah 4: Tiba di Tempat Tujuan
                </span>
                <span className="text-[11px] font-semibold text-charcoal-subtle bg-surface-card px-2 py-0.5 rounded border border-border-hairline">
                  {currentTransitRoute.walkToDest}
                </span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                Jalan santai <strong className="font-semibold">{currentTransitRoute.walkToDest}</strong>, Anda telah tiba di <strong className="font-bold text-primary">{currentPlace.name}</strong>. Selamat menikmati waktu nongkrong dan nugas! 🎉
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-4 border border-border-hairline flex flex-col sm:flex-row items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <h4 className="font-bold text-on-surface">Tips Naik Angkutan Umum:</h4>
            <p className="text-charcoal-subtle leading-relaxed">
              Siapkan uang pas (pecahan Rp 2.000 atau Rp 5.000) sebelum naik atau pastikan saldo QRIS/E-Money aktif. Angkot dan bus lokal beroperasi mulai pukul <strong>05:30 s/d 22:00 WIB</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

