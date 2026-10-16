import React from 'react';
import { CATEGORY_OPTIONS } from './tambahTempatData';
import SearchableSelect from './SearchableSelect';

export default function TambahTempatStep1({
  name,
  setName,
  nameInputRef,
  categories,
  handleToggleCategory,
  categorySectionRef,
  city,
  setCity,
  cityOptions,
  citySectionRef,
  district,
  setDistrict,
  districtOptions,
  districtSectionRef,
  priceRange,
  setPriceRange,
  address,
  setAddress,
  addressInputRef,
  description,
  setDescription,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  pinPosition,
  setPinPosition,
  handleTriggerGPS,
  fieldErrors,
  setFieldErrors,
  showToast,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">Informasi Tempat &amp; Titik Lokasi</h2>
          <p className="text-xs text-[#6E6E6B]">Pastikan data yang kamu masukkan sesuai kondisi fisik lapangan</p>
        </div>
        <span className="text-[11px] font-bold text-[#181e00] bg-[#d4e684] px-3 py-1 rounded-full uppercase tracking-wider">
          Langkah 1 dari 4
        </span>
      </div>

      <div className="flex flex-col gap-1.5" ref={nameInputRef}>
        <label className="text-xs font-bold text-[#242424] flex items-center justify-between" htmlFor="place-name">
          <span>
            Nama Tempat / Usaha <span className="text-red-500">*</span>
          </span>
          <span className="text-[11px] text-[#6E6E6B] font-normal">{name.length}/60</span>
        </label>
        <input
          id="place-name"
          type="text"
          maxLength={60}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: null }));
          }}
          placeholder="Contoh: Koffie & Co. Workspace, Kopi Siliwangi, Gelora Futsal"
          className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none ${
            fieldErrors.name
              ? 'border-2 border-red-500 bg-red-50/60 text-[#242424] ring-2 ring-red-400/20'
              : 'border border-[#E8E8E4] bg-white text-[#242424] focus:border-[#242424] focus:ring-1 focus:ring-[#242424]'
          }`}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2" ref={categorySectionRef}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#242424]">
            Kategori Utama <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] font-semibold bg-[#d4e684] text-[#181e00] px-2.5 py-0.5 rounded-full">
            {categories.length} Kategori Dipilih
          </span>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-1 rounded-2xl ${
            fieldErrors.categories ? 'border-2 border-red-500 bg-red-50/30' : ''
          }`}
        >
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = categories.includes(cat.val);
            return (
              <div
                key={cat.val}
                onClick={() => handleToggleCategory(cat.val)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between gap-3 select-none ${
                  isSelected
                    ? 'bg-[#d4e684]/20 border-[#242424] text-[#242424] shadow-xs'
                    : 'bg-[#F8F8F6] border-[#E8E8E4] text-[#6E6E6B] hover:border-[#242424]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isSelected ? 'text-[#242424]' : 'text-[#6E6E6B]'
                    }`}
                  >
                    {cat.icon}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border text-[14px] ${
                      isSelected
                        ? 'bg-[#242424] text-white border-[#242424]'
                        : 'border-[#E8E8E4] bg-white'
                    }`}
                  >
                    {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#242424]">{cat.label}</p>
                  <p className="text-[11px] text-[#6E6E6B] mt-0.5 leading-snug">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        {fieldErrors.categories && (
          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {fieldErrors.categories}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5" ref={citySectionRef}>
          <label className="text-xs font-bold text-[#242424]">
            Kota / Wilayah <span className="text-red-500">*</span>
          </label>
          <SearchableSelect
            value={city}
            onChange={(val) => {
              setCity(val);
              setDistrict('');
              if (fieldErrors.city) setFieldErrors((prev) => ({ ...prev, city: null }));
              if (fieldErrors.district) setFieldErrors((prev) => ({ ...prev, district: null }));
            }}
            options={cityOptions}
            placeholder="Pilih Kota / Wilayah"
            searchPlaceholder="Cari wilayah (cth: Kota Bandung, Kab. Bandung)..."
            hasError={Boolean(fieldErrors.city)}
            errorMessage={fieldErrors.city}
          />
        </div>

        <div className="flex flex-col gap-1.5" ref={districtSectionRef}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#242424]">
              Kawasan / Kecamatan <span className="text-red-500">*</span>
            </label>
            {!city && (
              <span className="text-[10px] text-[#6E6E6B] font-medium">
                Pilih kota terlebih dahulu
              </span>
            )}
          </div>
          <SearchableSelect
            value={district}
            onChange={(val) => {
              setDistrict(val);
              if (fieldErrors.district) setFieldErrors((prev) => ({ ...prev, district: null }));
            }}
            options={districtOptions}
            placeholder={city ? `Pilih Kawasan di ${city}` : 'Pilih kota/wilayah terlebih dahulu'}
            searchPlaceholder={city ? `Cari kawasan / kecamatan di ${city}...` : 'Pilih kota terlebih dahulu...'}
            disabled={!city}
            hasError={Boolean(fieldErrors.district)}
            errorMessage={fieldErrors.district}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#242424]" htmlFor="place-price">
          Estimasi Pengeluaran per Menu / Orang <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="place-price"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full appearance-none bg-white text-[#242424] rounded-xl px-4 py-3 text-xs font-medium border border-[#E8E8E4] focus:outline-none focus:border-[#242424] pr-8 cursor-pointer"
          >
            <option value="under20">&lt; Rp 20.000 (Sangat Murah / Ramah Kantong)</option>
            <option value="20-40">Rp 20.000 - Rp 45.000 (Standar Mahasiswa)</option>
            <option value="40-75">Rp 45.000 - Rp 75.000 (Menengah)</option>
            <option value="above75">&gt; Rp 75.000 (Spesialti / Premium)</option>
            <option value="free">Gratis (Fasilitas Publik / Ruang Terbuka)</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6E6E6B] text-[18px]">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5" ref={addressInputRef}>
        <label className="text-xs font-bold text-[#242424]" htmlFor="place-address">
          Alamat Lengkap <span className="text-red-500">*</span>
        </label>
        <textarea
          id="place-address"
          rows={2}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: null }));
          }}
          placeholder="Nama jalan, nomor gedung, lantai, dan patokan agar mudah ditemukan pengunjung..."
          className={`w-full rounded-xl px-4 py-3 text-xs resize-none transition-all focus:outline-none ${
            fieldErrors.address
              ? 'border-2 border-red-500 bg-red-50/60 text-[#242424] ring-2 ring-red-400/20'
              : 'border border-[#E8E8E4] bg-white text-[#242424] focus:border-[#242424] focus:ring-1 focus:ring-[#242424]'
          }`}
        />
        {fieldErrors.address && (
          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {fieldErrors.address}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#242424] flex items-center justify-between" htmlFor="place-description">
          <span>Deskripsi Singkat &amp; Suasana Tempat (Opsional)</span>
          <span className="text-[11px] text-[#6E6E6B] font-normal">{description.length}/350</span>
        </label>
        <textarea
          id="place-description"
          rows={3}
          maxLength={350}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ceritakan suasana, keunggulan kopi/makanan, tipe pengunjung (cocok nugas/santai/meeting), atau hal unik yang wajib dicoba..."
          className="w-full rounded-xl px-4 py-3 text-xs resize-none transition-all border border-[#E8E8E4] bg-white text-[#242424] focus:outline-none focus:border-[#242424] focus:ring-1 focus:ring-[#242424]"
        />
      </div>

      <div className="pt-4 border-t border-[#E8E8E4] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-[#242424]">Titik Peta Presisi (GPS)</h3>
            <p className="text-[11px] text-[#6E6E6B]">
              Klik peta atau gunakan tombol GPS untuk menyesuaikan titik masuk tempat
            </p>
          </div>
          <button
            type="button"
            onClick={handleTriggerGPS}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d4e684] text-[#181e00] text-xs font-bold hover:bg-[#c5dc69] transition-colors cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">my_location</span>
            <span>Gunakan Lokasi GPS Saya</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setPinPosition({ x, y });
              setLatitude((-6.89182 + (y - 50) * 0.0004).toFixed(5));
              setLongitude((107.61194 + (x - 50) * 0.0004).toFixed(5));
              showToast('Titik koordinat disesuaikan.');
            }}
            className="md:col-span-8 relative h-48 rounded-2xl overflow-hidden bg-[#F8F8F6] border border-[#E8E8E4] cursor-crosshair select-none shadow-inner"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAEAej9XGrBjmrT1qtugymayIqSCkz2yqfDrlk6Y8r3P565BzIxeEvYZuRD4Y-Gt_YUSu86SKmmz3KRWsihItR-XxUFfsh505CNY0qUSAk3siIkYGtxCqixB5H4xiIjzvGD2YTGYzoZNk-MXF5-JL4TT3DlmC5PBYRfHGReD-8LX7bBXjdsyaTApH-uoOw390a2ajS-Rk_r2mhyNPOkRrwdOmVu84Crzw-7cQFdl-oi9pdBMGIhQKQOg")`,
              }}
            ></div>
            {pinPosition ? (
              <div
                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-100 flex flex-col items-center"
                style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-[#242424] text-[#d4e684] flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                <span className="bg-white/90 text-[#242424] px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#242424]">touch_app</span>
                  Klik area peta atau tekan GPS untuk menentukan titik
                </span>
              </div>
            )}
          </div>

          <div className="md:col-span-4 flex flex-col gap-2 p-4 bg-[#F8F8F6] rounded-2xl border border-[#E8E8E4] text-xs">
            <span className="font-bold text-[#242424] text-[11px] uppercase tracking-wider text-[#6E6E6B]">
              Koordinat Terdeteksi
            </span>
            <div className="flex items-center justify-between">
              <span className="text-[#6E6E6B]">Latitude:</span>
              <span className="font-mono font-bold text-[#242424]">{latitude || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6E6E6B]">Longitude:</span>
              <span className="font-mono font-bold text-[#242424]">{longitude || '-'}</span>
            </div>
            <span className="text-[10px] text-[#6E6E6B] pt-2 border-t border-[#E8E8E4]">
              Akurasi ±3m sesuai peta koordinat Kota Bandung.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

