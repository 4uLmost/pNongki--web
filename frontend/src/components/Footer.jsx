import React from 'react';

export default function Footer({ onNavigate, onOpenPartnershipModal }) {
  return (
    <footer className="w-full bg-[#F8F8F6] border-t border-[#E8E8E4] pt-10 pb-8 mt-12 text-[#242424]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#E8E8E4]">
          {/* Kolom Brand & Deskripsi */}
          <div className="md:col-span-5 flex flex-col gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('beranda')}
              className="flex items-center shrink-0 cursor-pointer text-left focus:outline-none self-start group"
            >
              <img
                src="/pNongki-Logo.png"
                alt="pNongki!"
                className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </button>
            <p className="text-xs md:text-sm text-[#6E6E6B] max-w-sm leading-relaxed">
              Direktori kurasi tempat nongkrong santai, spot nugas kondusif, dan fasilitas publik ramah mahasiswa di Bandung dan sekitarnya.
            </p>

            {/* Social & Channel Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram pNongki"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center text-[#242424] hover:bg-[#d4e684] hover:border-[#b8cc68] transition-all shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="mailto:halo@pnongki.id"
                aria-label="Email pNongki"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center text-[#242424] hover:bg-[#d4e684] hover:border-[#b8cc68] transition-all shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('feeds')}
                aria-label="Komunitas Feeds"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E8E4] flex items-center justify-center text-[#242424] hover:bg-[#d4e684] hover:border-[#b8cc68] transition-all shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">groups</span>
              </button>
            </div>
          </div>

          {/* Links Navigasi */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Kolom Jelajah */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#242424] uppercase tracking-wider">Jelajah</span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore')}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Semua Spot
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore')}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Peta Spot Interaktif
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('feeds')}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Linimasa Feeds
              </button>
            </div>

            {/* Kolom Kategori */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#242424] uppercase tracking-wider">Kategori</span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore', { category: 'nongkrong' })}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Nongkrong &amp; Kafe
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore', { category: 'nugas' })}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Spot Nugas (Wi-Fi)
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore', { category: 'olahraga' })}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Spot Olahraga
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore', { category: 'fasilitas-umum' })}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Fasilitas Publik
              </button>
            </div>

            {/* Kolom Kontribusi */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#242424] uppercase tracking-wider">Kontribusi</span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('tambah-tempat')}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer font-semibold"
              >
                + Tambah Tempat Baru
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('profile', { tab: 'tempat-saya' })}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Status Pengajuan Tempat
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onOpenPartnershipModal) {
                    onOpenPartnershipModal();
                  } else if (onNavigate) {
                    onNavigate('partnership-modal');
                  }
                }}
                className="text-left text-xs md:text-sm text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-pointer"
              >
                Ajukan Kemitraan Bisnis
              </button>
            </div>
          </div>
        </div>

        {/* Baris Copyright & Informasi */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6E6E6B]">
          <p>© 2026 pNongki! • Platform Komunitas Ruang &amp; Spot Nongkrong</p>
          <div className="flex items-center gap-5">
            <span className="text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-default">
              Pedoman Komunitas
            </span>
            <span className="text-[#E8E8E4]">•</span>
            <span className="text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-default">
              Kebijakan Privasi
            </span>
            <span className="text-[#E8E8E4]">•</span>
            <span className="text-[#6E6E6B] hover:text-[#242424] transition-colors cursor-default">
              Kota Bandung, ID
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
