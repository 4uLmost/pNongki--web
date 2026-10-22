import React from 'react';
import { getFacilityDetails } from './detailData';

export default function DetailOverviewTab({
  currentPlace,
  isPartner,
  bookingSuccess,
  setBookingSuccess,
  bookingGuestCount,
  setBookingGuestCount,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  bookingSeating,
  setBookingSeating,
  bookingCode,
  setBookingCode,
  onConfirmBooking,
  showToast,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[20px]">info</span>
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">
              Tentang {currentPlace.name}
            </h2>
          </div>

          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            {currentPlace.description ||
              `Dirancang khusus untuk memenuhi kebutuhan mahasiswa dan pengunjung di Bandung, ${currentPlace.name} menyajikan suasana yang nyaman dengan fasilitas lengkap untuk mendukung aktivitas nongkrong, berdiskusi santai, maupun fokus nugas.`}
          </p>

          {(currentPlace.contact_phone || currentPlace.instagram) && (
            <div className="flex items-center gap-4 flex-wrap pt-3 border-t border-border-hairline text-xs">
              {currentPlace.contact_phone && (
                <a
                  href={`https://wa.me/${currentPlace.contact_phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-on-surface hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-green-600">call</span>
                  <span>{currentPlace.contact_phone}</span>
                </a>
              )}
              {currentPlace.instagram && (
                <a
                  href={`https://instagram.com/${currentPlace.instagram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-on-surface hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-pink-600">photo_camera</span>
                  <span>@{currentPlace.instagram.replace(/^@/, '')}</span>
                </a>
              )}
            </div>
          )}
        </div>

        <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[20px]">interests</span>
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">
              Fasilitas Tempat
            </h2>
          </div>

          {Array.isArray(currentPlace.facilities) && currentPlace.facilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentPlace.facilities.map((fac, idx) => {
                const { label, icon } = getFacilityDetails(fac);
                return (
                  <div
                    key={idx}
                    className="bg-surface-container-low p-3.5 rounded-xl flex items-center gap-3 border border-border-hairline"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-card text-primary flex items-center justify-center shrink-0 border border-border-hairline">
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-on-surface">{label}</h3>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 border border-dashed border-border-hairline rounded-2xl bg-surface-container-low text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-charcoal-subtle mb-1">interests</span>
              <p className="text-xs font-semibold text-on-surface">Fasilitas belum ditambahkan untuk tempat ini.</p>
              <p className="text-[11px] text-charcoal-subtle mt-0.5">Informasi fasilitas akan diperbarui oleh pengelola.</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </span>
              <h2 className="text-xl font-bold text-on-surface">Jam Operasional</h2>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              currentPlace.isOpenNow !== false
                ? 'bg-status-open/15 text-status-open'
                : 'bg-red-500/15 text-red-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                currentPlace.isOpenNow !== false ? 'bg-status-open animate-pulse' : 'bg-red-500'
              }`} />
              <span>{currentPlace.isOpenNow !== false ? 'BUKA' : 'TUTUP'}</span>
            </div>
          </div>

          <div className="space-y-2">
            {currentPlace.opening_hours?.is24Hours ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-border-hairline">
                <span className="text-sm font-medium text-on-surface">Setiap Hari</span>
                <span className="text-sm font-bold text-status-open">Buka 24 Jam</span>
              </div>
            ) : currentPlace.opening_hours?.weekday ? (
              <>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-border-hairline">
                  <span className="text-sm font-medium text-on-surface">Senin – Jumat</span>
                  <span className="text-sm font-bold text-on-surface">{currentPlace.opening_hours.weekday} WIB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-border-hairline">
                  <span className="text-sm font-medium text-on-surface">Sabtu – Minggu</span>
                  <span className="text-sm font-bold text-on-surface">{currentPlace.opening_hours.weekend || currentPlace.opening_hours.weekday} WIB</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-border-hairline">
                <span className="text-sm font-medium text-on-surface">Jadwal Operasional</span>
                <span className="text-sm font-bold text-on-surface">{currentPlace.open_status || currentPlace.openStatus || currentPlace.openingHours || 'Hubungi pengelola'}</span>
              </div>
            )}
          </div>
        </div>

        {isPartner && (
          <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">table_restaurant</span>
                </span>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-on-surface">Reservasi Meja</h2>
                </div>
              </div>
            </div>

            <p className="text-xs text-charcoal-subtle leading-relaxed">
              Layanan reservasi langsung untuk mitra resmi {currentPlace.name}. Bebas biaya pemesanan awal dan konfirmasi instan.
            </p>

            {!bookingSuccess ? (
              <div className="space-y-3.5 pt-1 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Jumlah Tamu</label>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low border border-border-hairline">
                    <button
                      type="button"
                      onClick={() => setBookingGuestCount((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center font-bold text-on-surface shadow-2xs hover:bg-surface-container transition-colors cursor-pointer"
                      aria-label="Kurangi tamu"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-on-surface">{bookingGuestCount} Orang</span>
                    <button
                      type="button"
                      onClick={() => setBookingGuestCount((prev) => Math.min(16, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center font-bold text-on-surface shadow-2xs hover:bg-surface-container transition-colors cursor-pointer"
                      aria-label="Tambah tamu"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Tanggal</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-on-surface">Jam Kedatangan</label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-on-surface">Preferensi Area</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'indoor', label: 'Indoor' },
                      { id: 'outdoor', label: 'Outdoor' },
                      { id: 'pod', label: 'Private Pod' },
                    ].map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setBookingSeating(area.id)}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                          bookingSeating === area.id
                            ? 'bg-primary-container text-on-surface border-primary font-bold shadow-2xs'
                            : 'bg-surface-container-low border-border-hairline text-charcoal-subtle hover:bg-surface-container'
                        }`}
                      >
                        {area.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onConfirmBooking) {
                        onConfirmBooking();
                      } else {
                        setBookingCode(`PNK-${Math.floor(100000 + Math.random() * 900000)}`);
                        setBookingSuccess(true);
                        if (showToast) {
                          showToast('Reservasi meja berhasil dikonfirmasi! 🎟️');
                        }
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary-container">table_restaurant</span>
                    <span>Konfirmasi Reservasi</span>
                  </button>
                  <p className="text-[10px] text-charcoal-subtle text-center mt-2">
                    Bebas biaya pembatalan hingga 1 jam sebelum jadwal.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3 bg-surface-container-low rounded-2xl p-4 border border-border-hairline">
                <div className="w-12 h-12 rounded-full bg-status-open/15 text-status-open mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Reservasi Terkonfirmasi!</h3>
                  <p className="text-xs text-charcoal-subtle mt-1">
                    Meja untuk <strong>{bookingGuestCount} orang</strong> pada <strong>{bookingDate} ({bookingTime} WIB)</strong> telah dikonfirmasi di area <strong>{bookingSeating === 'pod' ? 'Private Pod' : bookingSeating}</strong>.
                  </p>
                </div>
                <div className="p-2.5 bg-surface-card rounded-xl border border-border-hairline text-xs font-mono">
                  Kode Booking: <span className="font-bold text-primary">{bookingCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingSuccess(false)}
                  className="w-full py-2 rounded-xl bg-surface border border-border-hairline text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Ubah / Buat Reservasi Lain
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

