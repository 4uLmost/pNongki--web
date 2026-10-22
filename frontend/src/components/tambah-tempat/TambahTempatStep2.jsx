import React from 'react';
import { FACILITY_OPTIONS, OPERATING_HOUR_PRESETS } from './tambahTempatData';

export default function TambahTempatStep2({
  is24Hours,
  setIs24Hours,
  hoursMode,
  setHoursMode,
  weekdayOpen,
  setWeekdayOpen,
  weekdayClose,
  setWeekdayClose,
  weekendOpen,
  setWeekendOpen,
  weekendClose,
  setWeekendClose,
  applyHourPreset,
  facilities,
  toggleFacility,
  customFacilityInput,
  setCustomFacilityInput,
  handleAddCustomFacility,
  customFacilities,
  setCustomFacilities,
  fieldErrors,
  showToast,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">Jam Operasional &amp; Fasilitas</h2>
          <p className="text-xs text-[#6E6E6B]">Gunakan tombol preset cepat untuk mengatur jam buka</p>
        </div>
        <span className="text-[11px] font-bold text-[#181e00] bg-[#d4e684] px-3 py-1 rounded-full uppercase tracking-wider">
          Langkah 2 dari 4
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5 bg-[#F8F8F6] rounded-2xl border border-[#E8E8E4]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E8E4]">
          <div>
            <span className="text-xs font-bold text-[#242424] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#242424]">schedule</span>
              Jadwal Jam Buka &amp; Tutup <span className="text-red-500">*</span>
            </span>
            <p className="text-[11px] text-[#6E6E6B] mt-0.5">
              Pilih dari preset instan atau atur manual waktu buka
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-full border border-[#E8E8E4] shadow-2xs select-none">
            <input
              type="checkbox"
              checked={is24Hours}
              onChange={(e) => setIs24Hours(e.target.checked)}
              className="w-4 h-4 rounded text-[#242424] accent-[#242424] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#242424]">Buka 24 Jam Nonstop</span>
          </label>
        </div>

        {!is24Hours && (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-[#6E6E6B]">Pilihan Preset Populer (1-Klik):</span>
            <div className="flex items-center gap-2 flex-wrap">
              {OPERATING_HOUR_PRESETS.map((preset) => {
                const isPresetActive = weekdayOpen === preset.open && weekdayClose === preset.close;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyHourPreset(preset.open, preset.close)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all font-semibold cursor-pointer border ${
                      isPresetActive
                        ? 'bg-[#d4e684] text-[#181e00] border-[#b8cc68] shadow-2xs'
                        : 'bg-white text-[#242424] border-[#E8E8E4] hover:border-[#242424]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!is24Hours && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#E8E8E4]">
            <button
              type="button"
              onClick={() => setHoursMode('everyday')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hoursMode === 'everyday'
                  ? 'bg-[#242424] text-white shadow-xs'
                  : 'bg-white text-[#6E6E6B] border border-[#E8E8E4] hover:text-[#242424]'
              }`}
            >
              Buka Setiap Hari Sama
            </button>
            <button
              type="button"
              onClick={() => setHoursMode('weekday-weekend')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hoursMode === 'weekday-weekend'
                  ? 'bg-[#242424] text-white shadow-xs'
                  : 'bg-white text-[#6E6E6B] border border-[#E8E8E4] hover:text-[#242424]'
              }`}
            >
              Beda Hari Kerja &amp; Akhir Pekan
            </button>
          </div>
        )}

        {!is24Hours && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-[#E8E8E4] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#242424]">
                  {hoursMode === 'everyday' ? 'Senin – Minggu (Setiap Hari)' : 'Senin – Jumat (Hari Kerja)'}
                </span>
                <span className="text-[10px] bg-[#d4e684] text-[#181e00] px-2 py-0.5 rounded-full font-bold">
                  Buka
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-[#6E6E6B] block mb-0.5">Jam Buka</label>
                  <input
                    type="time"
                    value={weekdayOpen}
                    onChange={(e) => setWeekdayOpen(e.target.value)}
                    className="w-full bg-[#F8F8F6] px-3 py-2 rounded-lg border border-[#E8E8E4] text-xs font-bold text-[#242424] focus:outline-none focus:border-[#242424]"
                  />
                </div>
                <span className="text-[#6E6E6B] font-bold mt-4">—</span>
                <div className="flex-1">
                  <label className="text-[10px] text-[#6E6E6B] block mb-0.5">Jam Tutup</label>
                  <input
                    type="time"
                    value={weekdayClose}
                    onChange={(e) => setWeekdayClose(e.target.value)}
                    className="w-full bg-[#F8F8F6] px-3 py-2 rounded-lg border border-[#E8E8E4] text-xs font-bold text-[#242424] focus:outline-none focus:border-[#242424]"
                  />
                </div>
              </div>
            </div>

            {hoursMode === 'weekday-weekend' && (
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E8E4] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#242424]">Sabtu – Minggu (Akhir Pekan)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setWeekendOpen(weekdayOpen);
                      setWeekendClose(weekdayClose);
                      showToast('Jam akhir pekan disamakan.');
                    }}
                    className="text-[10px] text-[#242424] underline font-semibold hover:opacity-80 cursor-pointer"
                  >
                    Samakan
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#6E6E6B] block mb-0.5">Jam Buka</label>
                    <input
                      type="time"
                      value={weekendOpen}
                      onChange={(e) => setWeekendOpen(e.target.value)}
                      className="w-full bg-[#F8F8F6] px-3 py-2 rounded-lg border border-[#E8E8E4] text-xs font-bold text-[#242424] focus:outline-none focus:border-[#242424]"
                    />
                  </div>
                  <span className="text-[#6E6E6B] font-bold mt-4">—</span>
                  <div className="flex-1">
                    <label className="text-[10px] text-[#6E6E6B] block mb-0.5">Jam Tutup</label>
                    <input
                      type="time"
                      value={weekendClose}
                      onChange={(e) => setWeekendClose(e.target.value)}
                      className="w-full bg-[#F8F8F6] px-3 py-2 rounded-lg border border-[#E8E8E4] text-xs font-bold text-[#242424] focus:outline-none focus:border-[#242424]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {fieldErrors.hours && (
          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {fieldErrors.hours}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#242424]">
            Fasilitas Tersedia <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] font-semibold bg-[#d4e684] text-[#181e00] px-2.5 py-0.5 rounded-full">
            {facilities.length} Fasilitas Dipilih
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {FACILITY_OPTIONS.map((item) => {
            const isChecked = facilities.includes(item.id);
            return (
              <label
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border select-none transition-all ${
                  isChecked
                    ? 'bg-[#d4e684]/20 border-[#242424] text-[#242424] font-bold shadow-2xs'
                    : 'bg-[#F8F8F6] border-[#E8E8E4] text-[#6E6E6B] hover:border-[#242424]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFacility(item.id)}
                    className="w-4 h-4 rounded text-[#242424] accent-[#242424] cursor-pointer"
                  />
                  <span className="text-xs">{item.label}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#242424]">
                  {item.icon}
                </span>
              </label>
            );
          })}
        </div>
        {fieldErrors.facilities && (
          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {fieldErrors.facilities}
          </p>
        )}

        <div className="p-4 rounded-2xl bg-[#F8F8F6] border border-[#E8E8E4] flex flex-col gap-2.5 mt-1">
          <span className="text-xs font-bold text-[#242424]">Tambah Fasilitas Kustom Lainnya</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Contoh: Private Meeting Pods, Meja Biliar, Rooftop..."
              value={customFacilityInput}
              onChange={(e) => setCustomFacilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomFacility();
                }
              }}
              className="flex-1 bg-white text-[#242424] rounded-xl px-3.5 py-2 text-xs border border-[#E8E8E4] focus:outline-none focus:border-[#242424]"
            />
            <button
              type="button"
              onClick={handleAddCustomFacility}
              className="px-4 py-2 bg-[#242424] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer shrink-0"
            >
              Tambah
            </button>
          </div>
          {customFacilities.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {customFacilities.map((fac) => (
                <span
                  key={fac}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E8E4] text-xs font-semibold text-[#242424] shadow-2xs"
                >
                  <span>{fac}</span>
                  <button
                    type="button"
                    onClick={() => setCustomFacilities(customFacilities.filter((f) => f !== fac))}
                    className="text-[#6E6E6B] hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

