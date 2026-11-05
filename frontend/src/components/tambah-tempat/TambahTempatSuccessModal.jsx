import React from 'react';

export default function TambahTempatSuccessModal({
  isOpen,
  onClose,
  requestPartnership,
  name,
  submissionId,
  isAdmin,
  onNavigate,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border border-[#E8E8E4] text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#d4e684] text-[#181e00] mx-auto flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full bg-[#d4e684] text-[#181e00] font-bold text-[11px] inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Menunggu Approval Admin
          </span>
          <h3 className="text-xl font-extrabold text-[#242424]">
            {requestPartnership ? 'Pengajuan Tempat & Kemitraan Masuk!' : 'Pengajuan Masuk ke Admin!'}
          </h3>
          <p className="text-xs text-[#6E6E6B] leading-relaxed">
            {requestPartnership ? (
              <>
                Tempat <strong>{name}</strong> beserta berkas kemitraan resmi telah berhasil disimpan ke database Supabase dan langsung masuk ke antrean kurasi Admin pNongki! untuk diverifikasi.
              </>
            ) : (
              <>
                Tempat <strong>{name}</strong> telah berhasil disimpan ke database Supabase dan langsung masuk ke dashboard kurasi Admin pNongki! untuk diverifikasi.
              </>
            )}
          </p>
        </div>

        {submissionId && (
          <div className="p-3 bg-[#F8F8F6] rounded-2xl border border-[#E8E8E4] text-xs font-mono text-[#6E6E6B]">
            ID Antrean: <strong className="text-[#242424] font-bold">{submissionId}</strong>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('admin');
              }}
              className="w-full py-3 rounded-xl bg-[#242424] text-white hover:bg-black text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#d4e684]">dashboard</span>
              <span>Buka Dashboard Admin (Review Sekarang)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('profile', { tab: 'tempat-saya' });
              }}
              className="w-full py-3 rounded-xl bg-[#242424] text-white hover:bg-black text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#d4e684]">storefront</span>
              <span>Lihat Status di Tempat Saya</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('beranda');
              }}
              className="py-2.5 rounded-xl bg-[#F8F8F6] hover:bg-[#E8E8E4] text-[#242424] text-xs font-bold transition-colors cursor-pointer"
            >
              Ke Beranda
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('explore');
              }}
              className="py-2.5 rounded-xl bg-white border border-[#E8E8E4] hover:border-[#242424] text-[#242424] text-xs font-bold transition-colors cursor-pointer"
            >
              Katalog Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

