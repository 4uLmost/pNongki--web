import React from 'react';

export default function OwnerOverviewTab({
  currentPlace,
  reservations = [],
  onSelectPlace,
  onNavigate,
  setActiveTab,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-surface-card rounded-3xl p-6 border border-border-hairline shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">storefront</span>
              <span>Informasi Tempat &amp; Fasilitas Publik</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                if (onSelectPlace) onSelectPlace(currentPlace);
                if (onNavigate) onNavigate('detail');
              }}
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Edit Profil Tempat</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline">
              <span className="text-charcoal-subtle block font-semibold mb-1">Kategori Tempat</span>
              <span className="font-bold text-on-surface text-sm">
                {currentPlace?.category || 'Kafe & Resto'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline">
              <span className="text-charcoal-subtle block font-semibold mb-1">Kisaran Harga</span>
              <span className="font-bold text-on-surface text-sm">
                {currentPlace?.priceRange || 'Rp 20.000 - Rp 50.000'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline sm:col-span-2">
              <span className="text-charcoal-subtle block font-semibold mb-1">Alamat Lengkap</span>
              <span className="font-bold text-on-surface leading-relaxed">
                {currentPlace?.address || '-'}, {currentPlace?.city || 'Bandung'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-charcoal-subtle block mb-2">
              Fasilitas Terdaftar di Halaman Detail:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(currentPlace?.facilities || [
                'WiFi Cepat (100 Mbps)',
                'Banyak Stopkontak',
                'Area Smoking & Non-Smoking',
                'Musholla Bersih',
                'Parkir Luas',
              ]).map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-surface-container text-on-surface font-semibold text-xs border border-border-hairline inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                  <span>{f}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 via-primary-container/20 to-transparent rounded-3xl p-6 border border-purple-300/60 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-purple-700">verified</span>
            <h4 className="font-bold text-base text-purple-950">Fitur Official Partner Aktif</h4>
          </div>
          <p className="text-xs text-charcoal-subtle leading-relaxed">
            Sebagai mitra terverifikasi, tempat Anda mendapatkan prioritas tampilan di linimasa rekomendasi mahasiswa, lencana ungu resmi di seluruh halaman, serta formulir reservasi meja langsung tanpa biaya komisi.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-surface-card rounded-3xl p-6 border border-border-hairline shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-purple-600">event_available</span>
              <span>Reservasi Terdekat</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('reservasi')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {reservations.slice(0, 2).map((res) => (
              <div
                key={res.id}
                className="p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline flex flex-col gap-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">{res.guestName}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {res.status === 'confirmed' ? 'Dikonfirmasi' : 'Selesai'}
                  </span>
                </div>
                <div className="text-charcoal-subtle flex items-center gap-2">
                  <span>🗓️ {res.date}, {res.time}</span>
                  <span>•</span>
                  <span>👥 {res.guestsCount} Orang</span>
                </div>
                <p className="text-charcoal-subtle italic bg-surface-card p-2 rounded-xl border border-border-hairline/60">
                  &quot;{res.needs}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

