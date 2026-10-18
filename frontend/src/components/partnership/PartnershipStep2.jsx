import React from 'react';

export default function PartnershipStep2({
  picName,
  setPicName,
  picRole,
  setPicRole,
  contactPhone,
  setContactPhone,
  email,
  setEmail,
  instagram,
  setInstagram,
  fieldErrors,
  setFieldErrors,
  handlePrevStep,
  handleNextStep,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">Data Penanggung Jawab &amp; Kontak Resmi</h2>
          <p className="text-xs text-[#6E6E6B]">Digunakan tim kurator untuk verifikasi dan aktivasi kemitraan</p>
        </div>
        <span className="text-[11px] font-bold text-[#181e00] bg-[#d4e684] px-3 py-1 rounded-full uppercase tracking-wider">
          Langkah 2 dari 3
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="pic-name">
            Nama Lengkap PIC / Pemohon <span className="text-red-500">*</span>
          </label>
          <input
            id="pic-name"
            type="text"
            placeholder="Nama lengkap Anda"
            value={picName}
            onChange={(e) => {
              setPicName(e.target.value);
              if (fieldErrors.picName) setFieldErrors((prev) => ({ ...prev, picName: null }));
            }}
            className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none ${
              fieldErrors.picName
                ? 'border-2 border-red-500 bg-red-50/60 ring-2 ring-red-400/20'
                : 'border border-[#E8E8E4] bg-white text-[#242424] focus:border-[#242424]'
            }`}
          />
          {fieldErrors.picName && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {fieldErrors.picName}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="pic-role">
            Jabatan / Peran di Tempat Usaha
          </label>
          <select
            id="pic-role"
            value={picRole}
            onChange={(e) => setPicRole(e.target.value)}
            className="w-full rounded-xl px-3.5 py-3 text-sm border border-[#E8E8E4] bg-white text-[#242424] focus:outline-none focus:border-[#242424]"
          >
            <option value="Owner / Pemilik">Owner / Pemilik Bisnis</option>
            <option value="Store Manager">Store Manager / General Manager</option>
            <option value="Marketing & Brand">Head of Marketing / Public Relations</option>
            <option value="Operasional">Staf Operasional / Perwakilan Resmi</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="pic-phone">
            Nomor WhatsApp Bisnis Aktif <span className="text-red-500">*</span>
          </label>
          <input
            id="pic-phone"
            type="tel"
            placeholder="Contoh: 0812-3456-7890"
            value={contactPhone}
            onChange={(e) => {
              setContactPhone(e.target.value);
              if (fieldErrors.contactPhone) setFieldErrors((prev) => ({ ...prev, contactPhone: null }));
            }}
            className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none ${
              fieldErrors.contactPhone
                ? 'border-2 border-red-500 bg-red-50/60 ring-2 ring-red-400/20'
                : 'border border-[#E8E8E4] bg-white text-[#242424] focus:border-[#242424]'
            }`}
          />
          {fieldErrors.contactPhone && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {fieldErrors.contactPhone}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="pic-email">
            Alamat Email Resmi Bisnis <span className="text-red-500">*</span>
          </label>
          <input
            id="pic-email"
            type="email"
            placeholder="Contoh: partnership@kafeanda.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
            }}
            className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none ${
              fieldErrors.email
                ? 'border-2 border-red-500 bg-red-50/60 ring-2 ring-red-400/20'
                : 'border border-[#E8E8E4] bg-white text-[#242424] focus:border-[#242424]'
            }`}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-[#242424]" htmlFor="pic-instagram">
            Akun Instagram Tempat Usaha (Opsional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E6B] text-sm font-semibold">
              @
            </span>
            <input
              id="pic-instagram"
              type="text"
              placeholder="namatempatmu"
              value={instagram.replace(/^@/, '')}
              onChange={(e) => setInstagram(e.target.value.replace(/^@/, ''))}
              className="w-full rounded-xl pl-9 pr-4 py-3 text-sm border border-[#E8E8E4] bg-white text-[#242424] focus:outline-none focus:border-[#242424]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#E8E8E4]">
        <button
          type="button"
          onClick={handlePrevStep}
          className="px-5 py-2.5 rounded-xl border border-[#E8E8E4] hover:border-[#242424] text-xs font-bold text-[#242424] transition-colors cursor-pointer"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className="px-6 py-2.5 rounded-xl bg-[#242424] hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Langkah Selanjutnya</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

