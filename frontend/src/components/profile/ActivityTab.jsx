import React from 'react';

export default function ActivityTab({
  isLoadingProfileData,
  profileLoadError,
  loadProfileData,
  myPlacesCount = 0,
  activityStats = { reviewsCount: 0, hangoutsCount: 0, threadsCount: 0, logs: [] },
}) {
  if (isLoadingProfileData) {
    return (
      <div className="py-16 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-xs font-semibold text-charcoal-subtle">
          Memuat riwayat kontribusi &amp; gamifikasi...
        </p>
      </div>
    );
  }

  if (profileLoadError) {
    return (
      <div className="p-10 text-center bg-surface-card rounded-3xl border border-dashed border-error/40 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">wifi_off</span>
        </div>
        <h4 className="font-bold text-sm text-on-surface">Gagal Memuat Aktivitas</h4>
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
    );
  }

  return (
    <div className="bg-surface-card rounded-3xl p-6 md:p-8 border border-border-hairline shadow-xs flex flex-col gap-6">
      <div>
        <h3 className="font-bold text-base md:text-lg text-on-surface">
          Aktivitas Kontribusi Terverifikasi
        </h3>
        <p className="text-xs text-charcoal-subtle">
          Setiap kontribusimu di platform pNongki! menghasilkan reputasi XP seumur hidup dan saldo Poin Hadiah.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-low border border-border-hairline text-center flex flex-col items-center">
          <span className="text-2xl font-extrabold text-on-surface">{myPlacesCount}</span>
          <span className="text-xs font-semibold text-charcoal-subtle mt-1">Tempat Ditambah</span>
          <span className="text-[10px] font-bold text-primary mt-0.5">+{myPlacesCount * 50} XP</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low border border-border-hairline text-center flex flex-col items-center">
          <span className="text-2xl font-extrabold text-on-surface">{activityStats.reviewsCount}</span>
          <span className="text-xs font-semibold text-charcoal-subtle mt-1">Ulasan Ditulis</span>
          <span className="text-[10px] font-bold text-primary mt-0.5">+{activityStats.reviewsCount * 20} XP</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low border border-border-hairline text-center flex flex-col items-center">
          <span className="text-2xl font-extrabold text-on-surface">{activityStats.hangoutsCount}</span>
          <span className="text-xs font-semibold text-charcoal-subtle mt-1">Ajakan Nongkrong</span>
          <span className="text-[10px] font-bold text-primary mt-0.5">+{activityStats.hangoutsCount * 15} XP</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low border border-border-hairline text-center flex flex-col items-center">
          <span className="text-2xl font-extrabold text-on-surface">{activityStats.threadsCount}</span>
          <span className="text-xs font-semibold text-charcoal-subtle mt-1">Utas Diskusi</span>
          <span className="text-[10px] font-bold text-primary mt-0.5">+{activityStats.threadsCount * 10} XP</span>
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle">
          Log Transaksi Reputasi Terkini
        </span>
        {activityStats.logs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container-low border border-dashed border-border-hairline text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-charcoal-subtle">
              history_edu
            </span>
            <p className="text-xs text-charcoal-subtle max-w-sm">
              Belum ada riwayat aktivitas reputasi tercatat. Mulai tambahkan tempat, tulis ulasan, atau bagikan rekomendasi di Feeds!
            </p>
          </div>
        ) : (
          activityStats.logs.map((log, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  check_circle
                </span>
                <span className="font-semibold text-on-surface">{log.activity}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-primary">{log.xp}</span>
                <span className="text-charcoal-subtle hidden sm:inline">{log.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

