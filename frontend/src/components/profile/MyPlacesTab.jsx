import React from 'react';

export default function MyPlacesTab({
  myPlaces = [],
  isLoadingProfileData,
  profileLoadError,
  loadProfileData,
  onNavigate,
  setEditingPlace,
  setDeletingPlace,
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-on-surface">Tempat yang Ditambahkan</h3>
          <p className="text-xs text-charcoal-subtle mt-0.5">
            Daftar tempat nongkrong dan kafe yang telah Anda bagikan ke komunitas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('tambah-tempat')}
          className="px-4 py-2.5 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Tambah Tempat Baru (+50 XP)</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </div>
          <div>
            <span className="text-[11px] text-charcoal-subtle font-medium block">Total Ditambahkan</span>
            <span className="text-base font-extrabold text-on-surface">{myPlaces.length} Tempat</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div>
            <span className="text-[11px] text-charcoal-subtle font-medium block">Terverifikasi Publik</span>
            <span className="text-base font-extrabold text-emerald-800">
              {myPlaces.filter((p) => p.status === 'verified' || p.status === 'approved').length} Tempat
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          </div>
          <div>
            <span className="text-[11px] text-charcoal-subtle font-medium block">Menunggu Audit</span>
            <span className="text-base font-extrabold text-amber-800">
              {myPlaces.filter((p) => p.status === 'pending_audit' || p.status === 'pending').length} Tempat
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-hairline flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">cancel</span>
          </div>
          <div>
            <span className="text-[11px] text-charcoal-subtle font-medium block">Ditolak Kurasi</span>
            <span className="text-base font-extrabold text-rose-800">
              {myPlaces.filter((p) => p.status === 'rejected').length} Tempat
            </span>
          </div>
        </div>
      </div>

      {isLoadingProfileData ? (
        <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-charcoal-subtle">
            Memuat data tempat yang Anda tambahkan...
          </p>
        </div>
      ) : profileLoadError ? (
        <div className="p-10 text-center bg-surface-card rounded-3xl border border-dashed border-error/40 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">wifi_off</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">Gagal Memuat Tempat</h4>
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
      ) : myPlaces.length === 0 ? (
        <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-charcoal-subtle">
            storefront
          </span>
          <h3 className="font-bold text-base text-on-surface">Belum ada tempat yang ditambahkan</h3>
          <p className="text-xs text-charcoal-subtle max-w-sm">
            Bagikan spot ngopi, kafe nugas, atau coworking space favoritmu ke teman-teman mahasiswa dan kumpulkan +50 XP!
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('tambah-tempat')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-fixed font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Tambah Tempat Sekarang (+50 XP)</span>
          </button>
        </div>
      ) : (
        <div className="bg-surface-card rounded-3xl border border-border-hairline shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-hairline text-charcoal-subtle uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3.5 px-4 md:px-6">Tempat &amp; Kategori</th>
                  <th className="py-3.5 px-4">Lokasi &amp; Jam Buka</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Fasilitas</th>
                  <th className="py-3.5 px-4">Status Audit Admin</th>
                  <th className="py-3.5 px-4 md:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {myPlaces.map((place) => (
                  <tr
                    key={place.id}
                    className="hover:bg-surface-container/50 transition-colors"
                  >
                    <td className="py-4 px-4 md:px-6 align-middle">
                      <div className="flex items-center gap-3">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover shrink-0 border border-border-hairline"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-on-surface truncate">
                            {place.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-container text-on-surface border">
                              📍 {place.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="font-semibold text-on-surface truncate max-w-[200px]">
                          {place.address}
                        </span>
                        <span className="text-[11px] text-charcoal-subtle">
                          {place.city}
                        </span>
                        <span className="text-[11px] font-medium text-primary flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          {place.openStatus || 'Buka setiap hari'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-middle hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {place.facilities?.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-container-low text-charcoal-subtle border border-border-hairline"
                          >
                            {f}
                          </span>
                        ))}
                        {place.facilities && place.facilities.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] text-charcoal-subtle">
                            +{place.facilities.length - 3} lagi
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      {place.status === 'pending_audit' || place.status === 'pending' ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 w-fit">
                            <span className="material-symbols-outlined text-[14px]">
                              hourglass_top
                            </span>
                            Menunggu Audit
                          </span>
                          <span className="text-[10px] text-amber-800 font-medium leading-tight">
                            {place.auditNote || 'Sedang ditinjau oleh kurator'}
                          </span>
                        </div>
                      ) : place.status === 'rejected' ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300 w-fit">
                            <span className="material-symbols-outlined text-[14px]">
                              cancel
                            </span>
                            Ditolak
                          </span>
                          <span className="text-[10px] text-rose-700 font-medium leading-tight">
                            {place.auditNote || 'Belum memenuhi kriteria kurasi'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 w-fit">
                            <span className="material-symbols-outlined text-[14px]">
                              verified
                            </span>
                            Terverifikasi
                          </span>
                          <span className="text-[10px] text-charcoal-subtle">
                            Tayang publik
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 md:px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingPlace(place)}
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-border-hairline text-on-surface text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit Tempat"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingPlace(place)}
                          className="px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-charcoal-subtle hover:text-error border border-border-hairline text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Hapus Tempat"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

