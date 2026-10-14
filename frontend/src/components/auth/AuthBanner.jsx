import React from 'react';

export default function AuthBanner({ onUseDemoAccount }) {
  return (
    <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[500px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-8 shadow-xl border border-border-hairline group">
      <img
        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
        alt="Suasana Sahabat pNongki"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/55 backdrop-blur-[1px]" />

      <div className="relative z-10 my-auto py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/90 text-on-primary-fixed text-xs font-extrabold mb-3.5 shadow-sm backdrop-blur-xs">
          <span className="material-symbols-outlined text-[16px]">groups</span>
          <span>Komunitas Sahabat pNongki!</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          Ayo Bergabung ke <br />
          <span className="text-[#a3e635] font-black">Sahabat pNongki!</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-200 mt-3.5 leading-relaxed font-normal">
          <strong>pNongki!</strong> adalah direktori rekomendasi tempat nongkrong, spot nugas berkoneksi kencang, area olahraga, dan fasilitas publik terverifikasi berbasis komunitas mahasiswa.
        </p>

        <div className="mt-5 space-y-2 text-xs text-neutral-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a3e635] text-[18px]">check_circle</span>
            <span>Cek colokan, kecepatan WiFi &amp; jam buka akurat</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a3e635] text-[18px]">check_circle</span>
            <span>Kumpulkan poin reputasi XP &amp; klaim voucer kafe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a3e635] text-[18px]">check_circle</span>
            <span>Temukan rekan nongkrong seru di sekitarmu</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-3.5 rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-white block">Uji Coba Cepat?</span>
          <span className="text-[11px] text-neutral-300">Masuk via akun demonstrasi aktif.</span>
        </div>
        <button
          type="button"
          onClick={onUseDemoAccount}
          className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs shrink-0 transition-all cursor-pointer inline-flex items-center gap-1.5 border border-white/10 active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px] text-[#a3e635]">bolt</span>
          <span>Akun Demo</span>
        </button>
      </div>
    </div>
  );
}

