import React from 'react';

export default function PartnershipPromptModal({ isOpen, onClose, onSelectChoice }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-[#E8E8E4] shadow-2xl relative flex flex-col gap-5 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#6E6E6B] hover:text-[#242424] rounded-full hover:bg-[#F8F8F6] transition-colors cursor-pointer"
          aria-label="Tutup dialog"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#d4e684]/30 text-[#181e00] flex items-center justify-center shrink-0 border border-[#d4e684]">
            <span className="material-symbols-outlined text-[26px]">handshake</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#181e00] bg-[#d4e684] px-2.5 py-0.5 rounded-full inline-block mb-1">
              Mitra Resmi pNongki!
            </span>
            <h3 className="text-lg font-bold text-[#242424] leading-snug">
              Ajukan Bisnis / Kemitraan
            </h3>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#242424]">
            Apakah bisnis Anda sudah terdaftar di pNongki?
          </h4>
          <p className="text-xs text-[#6E6E6B] mt-1 leading-relaxed">
            Pilih status usaha Anda untuk diarahkan ke alur pengisian formulir dan verifikasi dokumen yang sesuai.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Pilihan 1: Sudah Terdaftar */}
          <button
            type="button"
            onClick={() => onSelectChoice('already_registered')}
            className="p-4 rounded-2xl border border-[#E8E8E4] hover:border-[#242424] hover:shadow-xs bg-[#F8F8F6] hover:bg-white text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-white border border-[#E8E8E4] flex items-center justify-center text-[#242424] group-hover:bg-[#d4e684] group-hover:text-[#181e00] transition-colors">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </span>
              <span className="text-[10px] font-bold text-[#6E6E6B] bg-white px-2 py-0.5 rounded-md border border-[#E8E8E4]">
                Sudah Ada
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#242424] block">Sudah Terdaftar</span>
              <span className="text-[11px] text-[#6E6E6B] block mt-0.5 leading-normal">
                Tempat sudah ada di katalog. Klaim kepemilikan dan lengkapi berkas kemitraan.
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#242424] pt-1">
              <span>Lengkapi Berkas</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </button>

          {/* Pilihan 2: Belum Terdaftar */}
          <button
            type="button"
            onClick={() => onSelectChoice('new_place')}
            className="p-4 rounded-2xl border border-[#E8E8E4] hover:border-[#242424] hover:shadow-xs bg-[#F8F8F6] hover:bg-white text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-white border border-[#E8E8E4] flex items-center justify-center text-[#242424] group-hover:bg-[#d4e684] group-hover:text-[#181e00] transition-colors">
                <span className="material-symbols-outlined text-[20px]">add_business</span>
              </span>
              <span className="text-[10px] font-bold text-[#6E6E6B] bg-white px-2 py-0.5 rounded-md border border-[#E8E8E4]">
                Tempat Baru
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#242424] block">Belum Terdaftar</span>
              <span className="text-[11px] text-[#6E6E6B] block mt-0.5 leading-normal">
                Daftarkan profil tempat usaha baru Anda sekaligus mengajukan diri menjadi mitra resmi.
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#242424] pt-1">
              <span>Tambah Tempat Baru</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </button>
        </div>

        <div className="pt-2 border-t border-[#E8E8E4] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

