import React from 'react';

export default function OwnerReservationTab({
  currentPlace,
  reservations = [],
  isLoadingReservations,
  reservationsError,
  loadOwnerReservations,
  handleUpdateReservationStatus,
}) {
  return (
    <div className="bg-surface-card rounded-3xl p-6 border border-border-hairline shadow-xs flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-on-surface">Daftar Reservasi Meja Mahasiswa</h3>
          <p className="text-xs text-charcoal-subtle mt-0.5">
            Kelola pemesanan meja masuk dari pengunjung linimasa pNongki untuk spot {currentPlace?.name}.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold self-start sm:self-auto">
          {reservations.length} Total Reservasi
        </span>
      </div>

      {isLoadingReservations ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined text-[36px] text-purple-600 animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-charcoal-subtle mt-2">
            Memuat data reservasi meja...
          </p>
        </div>
      ) : reservationsError ? (
        <div className="py-12 text-center bg-surface-card border border-dashed border-error/40 rounded-3xl p-8 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">wifi_off</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">Gagal Memuat Reservasi</h4>
          <p className="text-xs text-charcoal-subtle max-w-sm">{reservationsError}</p>
          <button
            type="button"
            onClick={loadOwnerReservations}
            className="mt-1 px-4 py-2 rounded-xl bg-primary-container text-on-primary-fixed hover:bg-accent-hover font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-12 text-center text-xs text-charcoal-subtle">
          Belum ada reservasi meja masuk.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-hairline text-charcoal-subtle uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3.5 px-4">Nama Mahasiswa &amp; Kontak</th>
                <th className="py-3.5 px-4">Waktu &amp; Jumlah Tamu</th>
                <th className="py-3.5 px-4">Kebutuhan Nugas</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-4 px-4 align-middle">
                    <span className="font-bold text-on-surface block text-sm">{res.guestName}</span>
                    <span className="text-[11px] text-charcoal-subtle">{res.campus}</span>
                    <a
                      href={`https://wa.me/${res.phone.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 mt-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>{res.phone}</span>
                    </a>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <span className="font-bold text-on-surface block">{res.date}</span>
                    <span className="text-charcoal-subtle">{res.time}</span>
                    <span className="text-[11px] text-purple-800 font-semibold block mt-1">
                      👥 {res.guestsCount} Orang
                    </span>
                  </td>

                  <td className="py-4 px-4 align-middle max-w-[220px]">
                    <span className="text-charcoal-subtle leading-relaxed line-clamp-2">
                      {res.needs}
                    </span>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    {res.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>Menunggu Hadir</span>
                      </span>
                    ) : res.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        <span>Selesai</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        <span className="material-symbols-outlined text-[13px]">cancel</span>
                        <span>Dibatalkan</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {res.status === 'confirmed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateReservationStatus(res.id, 'completed')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            <span>Tandai Selesai</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                            className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-rose-50 text-charcoal-subtle hover:text-error border border-border-hairline text-xs font-bold transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </>
                      )}
                      {res.status !== 'confirmed' && (
                        <span className="text-charcoal-subtle text-[11px] font-medium">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

