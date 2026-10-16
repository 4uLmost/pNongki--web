import React from 'react';

export default function PartnershipHeader({
  onNavigate,
  submissionResult,
  currentStep,
  totalSteps,
}) {
  return (
    <section className="w-full border-b border-[#E8E8E4] bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6E6E6B] mb-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="hover:text-[#242424] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">home</span>
            <span>Beranda</span>
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('partnership-modal')}
            className="hover:text-[#242424] transition-colors cursor-pointer"
          >
            Pilihan Kemitraan
          </button>
          <span>/</span>
          <span className="text-[#242424] font-semibold">Tempat Terdaftar</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4e684] text-[#181e00] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">handshake</span>
              <span>Program Kemitraan Resmi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
              Formulir Kemitraan Bisnis Terdaftar
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E6B] mt-1 max-w-xl">
              Klaim kepemilikan tempat usaha yang sudah ada di katalog pNongki! dan lengkapi berkas legalitas untuk mengaktifkan status Official Partner.
            </p>
          </div>

          {!submissionResult && (
            <div className="flex items-center gap-2 text-xs text-[#6E6E6B] shrink-0 bg-[#F8F8F6] px-3.5 py-2 rounded-xl border border-[#E8E8E4]">
              <span>Tahap:</span>
              <span className="font-bold text-[#242424]">
                {currentStep} / {totalSteps}
              </span>
              <div className="w-20 bg-white rounded-full h-2 overflow-hidden border border-[#E8E8E4]">
                <div
                  className="bg-[#d4e684] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

