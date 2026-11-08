import React from 'react';

export default function OwnerSupportTab({ showToast }) {
  return (
    <div className="bg-surface-card rounded-3xl p-6 md:p-8 border border-border-hairline shadow-xs flex flex-col gap-6">
      <div>
        <h3 className="font-bold text-lg text-on-surface">Bantuan &amp; Tim Kurasi pNongki!</h3>
        <p className="text-xs text-charcoal-subtle mt-1 leading-relaxed max-w-2xl">
          Butuh bantuan mengubah data NPWP / NIB usaha, memperbarui jam operasional khusus libur nasional, atau mengajukan promo banner khusus mahasiswa?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-surface-container-low border border-border-hairline flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">support_agent</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">WhatsApp Kurator Bisnis</h4>
          <p className="text-charcoal-subtle leading-relaxed">
            Hubungi tim kemitraan kami setiap hari kerja (Senin - Jumat, 09:00 - 18:00 WIB).
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20pNongki%2C%20saya%20owner%20mitra%20resmi"
            target="_blank"
            rel="noreferrer"
            className="mt-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1.5 self-start shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Hubungi via WhatsApp</span>
          </a>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-low border border-border-hairline flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">policy</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">Panduan Standar Mitra Resmi</h4>
          <p className="text-charcoal-subtle leading-relaxed">
            Pastikan informasi fasilitas (stopkontak &amp; kecepatan internet) selalu sesuai agar ulasan mahasiswa tetap positif.
          </p>
          <button
            type="button"
            onClick={() => showToast('Panduan operasional telah dikirim ke email terdaftar.')}
            className="mt-1 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-border-hairline text-on-surface font-bold inline-flex items-center gap-1.5 self-start transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Unduh Panduan SOP Mitra (.PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

