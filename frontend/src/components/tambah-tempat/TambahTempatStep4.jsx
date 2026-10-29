import React from 'react';
import { PARTNERSHIP_PERKS_OPTIONS } from './tambahTempatData';

export default function TambahTempatStep4({
  menuRecommendations,
  handleAddMenuRecommendation,
  handleRemoveMenuRecommendation,
  handleUpdateMenuRecommendation,
  handleMenuPhotoUpload,
  handleRemoveMenuPhoto,
  uploadedMenuBookPhotos = [],
  handleMenuBookPhotoUpload,
  handleDeleteMenuBookPhoto,
  contactPhone,
  setContactPhone,
  instagram,
  setInstagram,
  requestPartnership,
  setRequestPartnership,
  onNavigate,
  partnershipServices,
  togglePartnershipService,
  picName,
  setPicName,
  picRole,
  setPicRole,
  picEmail,
  setPicEmail,
  legalDocNumber,
  setLegalDocNumber,
  proofUrl,
  setProofUrl,
  partnershipNotes,
  setPartnershipNotes,
  agreementChecked,
  setAgreementChecked,
  fieldErrors,
  setFieldErrors,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">Menu Rekomendasi &amp; Konfirmasi Akhir</h2>
          <p className="text-xs text-[#6E6E6B]">Tinjau rekomendasi menu sebelum data diajukan ke antrean admin</p>
        </div>
        <span className="text-[11px] font-bold text-[#181e00] bg-[#d4e684] px-3 py-1 rounded-full uppercase tracking-wider">
          Langkah 4 dari 4
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#242424]">Rekomendasi Menu Favorit</span>
            <p className="text-[11px] text-[#6E6E6B]">Tambahkan nama, foto makanan/minuman, dan estimasi harga</p>
          </div>
          <button
            type="button"
            onClick={handleAddMenuRecommendation}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#181e00] bg-[#d4e684] px-3 py-1.5 rounded-xl hover:bg-[#c5dc69] transition-colors cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Tambah Menu</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {menuRecommendations.length === 0 ? (
            <div className="p-6 border border-dashed border-[#E8E8E4] rounded-2xl bg-[#F8F8F6] text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-[#A0A09C] mb-1">restaurant_menu</span>
              <p className="text-xs font-semibold text-[#6E6E6B]">Belum ada rekomendasi menu yang ditambahkan.</p>
              <p className="text-[11px] text-[#A0A09C] mt-0.5">Klik tombol &quot;+ Tambah Menu&quot; di atas untuk menambahkan menu andalan tempat (opsional).</p>
            </div>
          ) : (
            menuRecommendations.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#F8F8F6] border border-[#E8E8E4] flex flex-col sm:flex-row items-center gap-2.5 text-xs"
              >
                {/* Upload Foto Menu Item */}
                <div className="relative shrink-0">
                  {item.image ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-[#E8E8E4] group shadow-2xs">
                      <img alt={item.name || 'Menu'} src={item.image} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        aria-label="Hapus Foto Menu"
                        onClick={() => handleRemoveMenuPhoto(item.id)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ) : (
                    <label className="w-12 h-12 rounded-xl border border-dashed border-[#d4e684] hover:border-[#242424] bg-white flex flex-col items-center justify-center text-[#6E6E6B] hover:text-[#242424] cursor-pointer transition-colors shadow-2xs group relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleMenuPhotoUpload(item.id, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">add_a_photo</span>
                    </label>
                  )}
                </div>

                {/* Nama Menu */}
                <input
                  type="text"
                  placeholder="Nama menu (cth: Es Kopi Susu Creamy)"
                  value={item.name}
                  onChange={(e) => handleUpdateMenuRecommendation(item.id, 'name', e.target.value)}
                  className="w-full sm:flex-1 bg-white text-[#242424] rounded-xl px-3.5 py-2.5 border border-[#E8E8E4] focus:outline-none focus:border-[#242424]"
                />

                {/* Harga Input: User hanya mengetik angka (cth: 20000) */}
                <div className="relative w-full sm:w-36 flex items-center shrink-0">
                  <span className="absolute left-3 text-xs font-bold text-[#6E6E6B] pointer-events-none">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="20000"
                    value={item.priceRaw !== undefined ? item.priceRaw : (item.price || '').replace(/\D/g, '')}
                    onChange={(e) => {
                      const numericVal = e.target.value.replace(/\D/g, '');
                      const formatted = numericVal ? `Rp ${Number(numericVal).toLocaleString('id-ID')}` : '';
                      handleUpdateMenuRecommendation(item.id, 'price', formatted, numericVal);
                    }}
                    className="w-full bg-white text-[#242424] rounded-xl pl-8 pr-3 py-2.5 border border-[#E8E8E4] focus:outline-none focus:border-[#242424] font-medium"
                  />
                </div>

                {/* Kategori Menu */}
                <div className="w-full sm:w-36 relative shrink-0">
                  <select
                    value={item.category}
                    onChange={(e) => handleUpdateMenuRecommendation(item.id, 'category', e.target.value)}
                    className="w-full appearance-none bg-white text-[#242424] rounded-xl px-3.5 py-2.5 border border-[#E8E8E4] focus:outline-none focus:border-[#242424] pr-7 cursor-pointer"
                  >
                    <option value="kopi">Kopi / Minuman</option>
                    <option value="makanan">Makanan Utama</option>
                    <option value="pastry">Pastry / Cemilan</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6E6E6B] text-[16px]">
                    expand_more
                  </span>
                </div>

                {/* Hapus Button */}
                <button
                  type="button"
                  aria-label="Hapus Menu"
                  onClick={() => handleRemoveMenuRecommendation(item.id)}
                  className="text-[#6E6E6B] hover:text-red-600 transition-colors p-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Foto Lembar Buku Menu Fisik */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#E8E8E4]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#242424] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#242424]">menu_book</span>
              Foto Lembar Buku Menu Fisik (Opsional)
            </span>
            <p className="text-[11px] text-[#6E6E6B] mt-0.5">
              Unggah foto lembar daftar menu lengkap atau papan menu tempat usaha
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-[#d4e684] text-[#181e00] px-2.5 py-0.5 rounded-full">
            {uploadedMenuBookPhotos.length} Foto
          </span>
        </div>

        <div className="border-2 border-dashed border-[#d4e684] hover:border-[#242424] rounded-2xl p-4 text-center cursor-pointer group relative bg-[#F8F8F6] flex flex-col items-center justify-center min-h-[100px] transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleMenuBookPhotoUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />
          <div className="w-8 h-8 rounded-full bg-[#d4e684] text-[#181e00] flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          </div>
          <p className="text-xs font-bold text-[#242424]">Klik area ini untuk mengunggah lembar buku menu</p>
          <p className="text-[10px] text-[#6E6E6B]">Mendukung JPG, PNG, WEBP (Maksimal 10MB)</p>
        </div>

        {uploadedMenuBookPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {uploadedMenuBookPhotos.map((book) => (
              <div key={book.id} className="relative rounded-xl overflow-hidden border border-[#E8E8E4] aspect-[16/10] bg-white shadow-2xs group">
                <img alt={book.name} src={book.image} className="w-full h-full object-cover" />
                <button
                  type="button"
                  aria-label="Hapus Foto Menu Fisik"
                  onClick={() => handleDeleteMenuBookPhoto(book.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-xs hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs px-2 py-1 text-[10px] text-white truncate">
                  {book.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E8E8E4]">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="contact-phone">
            Nomor WhatsApp / Telepon (Opsional)
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6E6B] text-[18px]">
              call
            </span>
            <input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Contoh: 0812-3456-7890"
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs bg-white text-[#242424] border border-[#E8E8E4] focus:outline-none focus:border-[#242424]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#242424]" htmlFor="instagram-acc">
            Akun Instagram Tempat (Opsional)
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6E6B] text-[18px]">
              photo_camera
            </span>
            <input
              id="instagram-acc"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Contoh: @koffieandco"
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs bg-white text-[#242424] border border-[#E8E8E4] focus:outline-none focus:border-[#242424]"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#d4e684]/15 border border-[#d4e684] flex items-start gap-3">
        <input
          id="partnership-checkbox"
          type="checkbox"
          checked={requestPartnership}
          onChange={(e) => setRequestPartnership(e.target.checked)}
          className="w-4 h-4 rounded text-[#242424] accent-[#242424] mt-0.5 cursor-pointer"
        />
        <label htmlFor="partnership-checkbox" className="text-xs text-[#242424] cursor-pointer select-none leading-relaxed flex flex-col gap-0.5">
          <span className="font-bold flex items-center gap-1.5 text-[#242424]">
            <span className="material-symbols-outlined text-[16px] text-[#181e00]">handshake</span>
            <span>Ajukan Kemitraan Resmi (Fitur Reservasi Meja Online)</span>
          </span>
          <span className="text-[#6E6E6B] text-[11px]">
            Tempat Anda akan diverifikasi khusus sebagai Mitra Resmi dan dilengkapi tombol reservasi meja online langsung di bagian bawah halaman detail tempat. Untuk tempat yang sudah ada di katalog, silakan buka{' '}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('partnership')}
              className="font-bold underline text-[#242424] hover:text-black cursor-pointer inline"
            >
              Halaman Kemitraan Bisnis Terdaftar
            </button>.
          </span>
        </label>
      </div>

      {requestPartnership && (
        <div className="p-5 md:p-6 rounded-3xl bg-[#F8F8F6] border border-[#E8E8E4] flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#d4e684] text-[#181e00] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#242424]">Dokumen &amp; Layanan Kemitraan</h3>
                <p className="text-[11px] text-[#6E6E6B]">Lengkapi informasi PIC dan berkas pendukung untuk kurasi admin</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#181e00] bg-[#d4e684] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Wajib Mitra
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#242424]">
              Pilihan Layanan Kemitraan <span className="text-red-500">*</span>
            </label>
            {fieldErrors.services && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {fieldErrors.services}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PARTNERSHIP_PERKS_OPTIONS.map((perk) => {
                const isChecked = partnershipServices.includes(perk.id);
                return (
                  <div
                    key={perk.id}
                    onClick={() => togglePartnershipService(perk.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                      isChecked
                        ? 'border-[#242424] bg-[#d4e684]/20 shadow-2xs ring-1 ring-[#242424]'
                        : 'border-[#E8E8E4] bg-white hover:border-[#242424]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[#242424] text-[20px]">{perk.icon}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="accent-[#242424] w-4 h-4 rounded cursor-pointer pointer-events-none"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#242424]">{perk.title}</h4>
                      <p className="text-[11px] text-[#6E6E6B] mt-0.5 leading-snug">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#242424]" htmlFor="partner-pic-name">
                Nama Penanggung Jawab (PIC) <span className="text-red-500">*</span>
              </label>
              <input
                id="partner-pic-name"
                type="text"
                placeholder="Nama lengkap penanggung jawab"
                value={picName}
                onChange={(e) => {
                  setPicName(e.target.value);
                  if (fieldErrors.picName) setFieldErrors((prev) => ({ ...prev, picName: null }));
                }}
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs bg-white text-[#242424] border focus:outline-none focus:border-[#242424] ${
                  fieldErrors.picName ? 'border-red-500 ring-2 ring-red-400/20' : 'border-[#E8E8E4]'
                }`}
              />
              {fieldErrors.picName && (
                <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {fieldErrors.picName}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#242424]" htmlFor="partner-pic-role">
                Jabatan di Tempat Usaha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="partner-pic-role"
                  value={picRole}
                  onChange={(e) => setPicRole(e.target.value)}
                  className="w-full appearance-none bg-white text-[#242424] rounded-xl px-3.5 py-2.5 text-xs border border-[#E8E8E4] focus:outline-none focus:border-[#242424] pr-8 cursor-pointer"
                >
                  <option value="">Pilih Jabatan (Contoh: Owner / Pengelola)</option>
                  <option value="Owner / Pemilik Usaha">Owner / Pemilik Usaha</option>
                  <option value="General Manager / Pengelola">General Manager / Pengelola</option>
                  <option value="Marketing / Public Relations">Marketing / Public Relations</option>
                  <option value="Head Store / Barista Senior">Head Store / Barista Senior</option>
                  <option value="Staff Resmi Perwakilan">Staff Resmi Perwakilan</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6E6E6B] text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#242424]" htmlFor="partner-email">
                Email Bisnis Resmi <span className="text-red-500">*</span>
              </label>
              <input
                id="partner-email"
                type="email"
                placeholder="Contoh: official@kafeanda.com"
                value={picEmail}
                onChange={(e) => {
                  setPicEmail(e.target.value);
                  if (fieldErrors.picEmail) setFieldErrors((prev) => ({ ...prev, picEmail: null }));
                }}
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs bg-white text-[#242424] border focus:outline-none focus:border-[#242424] ${
                  fieldErrors.picEmail ? 'border-red-500 ring-2 ring-red-400/20' : 'border-[#E8E8E4]'
                }`}
              />
              {fieldErrors.picEmail && (
                <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {fieldErrors.picEmail}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#242424]" htmlFor="partner-legal-doc">
                Nomor NIB / Izin Usaha / NPWP (Opsional)
              </label>
              <input
                id="partner-legal-doc"
                type="text"
                placeholder="Contoh: 1234567890123 / NPWP"
                value={legalDocNumber}
                onChange={(e) => setLegalDocNumber(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-white text-[#242424] border border-[#E8E8E4] focus:outline-none focus:border-[#242424]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#242424]" htmlFor="partner-proof-url">
              Tautan Berkas Pendukung (Google Drive / Cloud URL - Opsional)
            </label>
            <input
              id="partner-proof-url"
              type="url"
              placeholder="https://drive.google.com/drive/folders/... (lampiran surat izin, NIB, atau foto tempat)"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-white text-[#242424] border border-[#E8E8E4] focus:outline-none focus:border-[#242424]"
            />
            <span className="text-[11px] text-[#6E6E6B]">
              Pastikan link diset publik (&quot;Siapa saja yang memiliki link dapat melihat&quot;) agar kurator dapat memverifikasi.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#242424]" htmlFor="partner-notes">
              Catatan Tambahan untuk Tim Kurator Admin (Opsional)
            </label>
            <textarea
              id="partner-notes"
              rows={2}
              placeholder="Tuliskan catatan khusus terkait sistem reservasi, nomor kontak alternatif, atau jadwal visitasi tim pNongki!..."
              value={partnershipNotes}
              onChange={(e) => setPartnershipNotes(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-white text-[#242424] border border-[#E8E8E4] focus:outline-none focus:border-[#242424] resize-none"
            />
          </div>
        </div>
      )}

      <div
        className={`p-4 rounded-2xl bg-[#F8F8F6] border flex items-start gap-3 transition-colors ${
          fieldErrors.agreement ? 'border-red-500 bg-red-50/60 ring-2 ring-red-400/20' : 'border-[#E8E8E4]'
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
          required
        />
        <label htmlFor="agreement-checkbox" className="text-xs text-[#242424] cursor-pointer select-none leading-relaxed">
          Saya menyatakan bahwa data tempat yang dimasukkan adalah akurat, bebas dari unsur promosi palsu/spam, dan sesuai dengan situasi fisik saat ini. Data ini akan dikirim ke <strong>Admin pNongki!</strong> untuk proses verifikasi.
        </label>
      </div>
      {fieldErrors.agreement && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 -mt-3">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {fieldErrors.agreement}
        </p>
      )}
    </div>
  );
}

