import React from 'react';
import { PERKS_OPTIONS } from './partnershipData';

export default function PartnershipStep3({
  selectedPerks,
  togglePerk,
  legalDocNumber,
  setLegalDocNumber,
  proofFileUrl,
  setProofFileUrl,
  partnershipNotes,
  setPartnershipNotes,
  agreementChecked,
  setAgreementChecked,
  fieldErrors,
  setFieldErrors,
  isSubmitting,
  handlePrevStep,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">Dokumen Persyaratan &amp; Fitur Kemitraan</h2>
          <p className="text-xs text-[#6E6E6B]">Pilih layanan kemitraan dan lampirkan bukti kepemilikan bisnis</p>
        </div>
        <span className="text-[11px] font-bold text-[#181e00] bg-[#d4e684] px-3 py-1 rounded-full uppercase tracking-wider">
          Langkah 3 dari 3
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#242424]">
          Layanan yang Ingin Diaktifkan <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PERKS_OPTIONS.map((perk) => {
            const isChecked = selectedPerks.includes(perk.id);
            return (
              <div
                key={perk.id}
                onClick={() => togglePerk(perk.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  isChecked
                    ? 'border-[#242424] bg-[#d4e684]/15 shadow-xs ring-1 ring-[#242424]'
                    : 'border-[#E8E8E4] bg-[#F8F8F6] hover:border-[#242424]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[#242424] text-[22px]">{perk.icon}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="accent-[#242424] w-4 h-4 rounded cursor-pointer pointer-events-none"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#242424]">{perk.title}</h4>
                  <p className="text-[11px] text-[#6E6E6B] mt-1 leading-normal">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="legal-doc">
            Nomor NIB / Izin Usaha / NPWP (Opsional)
          </label>
          <input
            id="legal-doc"
            type="text"
            placeholder="Contoh: 1234567890123"
            value={legalDocNumber}
            onChange={(e) => setLegalDocNumber(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm border border-[#E8E8E4] bg-white text-[#242424] focus:outline-none focus:border-[#242424]"
          />
          <span className="text-[11px] text-[#6E6E6B]">
            Mempercepat proses kurasi verifikasi legalitas oleh tim kurator pNongki!.
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="proof-url">
            Tautan Bukti Kepemilikan / Foto Outlet bersama PIC (Opsional)
          </label>
          <input
            id="proof-url"
            type="url"
            placeholder="https://drive.google.com/... atau tautan foto publik"
            value={proofFileUrl}
            onChange={(e) => setProofFileUrl(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm border border-[#E8E8E4] bg-white text-[#242424] focus:outline-none focus:border-[#242424]"
          />
          <span className="text-[11px] text-[#6E6E6B]">
            Dapat berupa tautan Google Drive publik atau kartu nama resmi pengelola.
          </span>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-[#242424]" htmlFor="partnership-notes">
            Catatan Tambahan untuk Admin (Opsional)
          </label>
          <textarea
            id="partnership-notes"
            rows={3}
            placeholder="Contoh: Kami siap menyediakan voucher diskon 10% untuk mahasiswa pemegang kartu pNongki!..."
            value={partnershipNotes}
            onChange={(e) => setPartnershipNotes(e.target.value)}
            className="w-full rounded-xl p-3.5 text-sm border border-[#E8E8E4] bg-white text-[#242424] focus:outline-none focus:border-[#242424] resize-none leading-relaxed"
          />
        </div>
      </div>

      <div
        className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${
          fieldErrors.agreement ? 'border-red-500 bg-red-50/60 ring-2 ring-red-400/20' : 'border-[#E8E8E4] bg-[#F8F8F6]'
        }`}
      >
        <input
          id="agreement-checkbox"
          type="checkbox"
          checked={agreementChecked}
          onChange={(e) => {
            setAgreementChecked(e.target.checked);
            if (fieldErrors.agreement) setFieldErrors((prev) => ({ ...prev, agreement: null }));
          }}
          className="w-4 h-4 rounded text-[#242424] accent-[#242424] mt-0.5 cursor-pointer"
        />
        <label htmlFor="agreement-checkbox" className="text-xs text-[#242424] cursor-pointer select-none leading-relaxed">
          Saya menyatakan bahwa saya adalah pemilik atau perwakilan resmi dari tempat usaha ini, dan informasi yang saya cantumkan adalah akurat. Pengajuan akan ditinjau oleh tim kurator dalam waktu <strong>1x24 jam kerja</strong>.
        </label>
      </div>
      {fieldErrors.agreement && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 -mt-2">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {fieldErrors.agreement}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[#E8E8E4]">
        <button
          type="button"
          onClick={handlePrevStep}
          className="px-5 py-2.5 rounded-xl border border-[#E8E8E4] hover:border-[#242424] text-xs font-bold text-[#242424] transition-colors cursor-pointer"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-2xl bg-[#242424] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              <span>Mengirim Dokumen Kemitraan...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px] text-[#d4e684]">send</span>
              <span>Kirim Pengajuan Kemitraan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

