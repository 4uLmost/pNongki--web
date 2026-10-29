import React from 'react';

export default function TambahTempatStep3({
  photoCategory,
  setPhotoCategory,
  uploadedPhotos,
  handlePhotoUpload,
  handleSetCoverPhoto,
  handleDeletePhoto,
  fieldErrors,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E4] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
        <div>
          <h2 className="text-lg font-bold text-[#242424]">Foto Tempat &amp; Suasana</h2>
          <p className="text-xs text-[#6E6E6B]">Unggah minimal 1 foto sudut ruangan untuk diverifikasi oleh pengunjung</p>
        </div>
        <span className="text-[11px] font-bold text-[#181e00] bg-[#d4e684] px-3 py-1 rounded-full uppercase tracking-wider">
          Langkah 3 dari 4
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        <div className="md:col-span-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-[#242424]">Kategori Foto Aktif</span>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'indoor', label: 'Area Indoor / Meja Nugas', icon: 'table_restaurant' },
              { id: 'outdoor', label: 'Area Outdoor / Teras', icon: 'deck' },
              { id: 'facility', label: 'Fasilitas & Penunjang', icon: 'room_preferences' },
            ].map((pc) => (
              <button
                key={pc.id}
                type="button"
                onClick={() => setPhotoCategory(pc.id)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl text-left border cursor-pointer transition-all text-xs font-semibold ${
                  photoCategory === pc.id
                    ? 'bg-[#d4e684]/20 text-[#242424] border-[#242424] shadow-2xs font-bold'
                    : 'bg-[#F8F8F6] border-[#E8E8E4] text-[#6E6E6B] hover:border-[#242424]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{pc.icon}</span>
                <span>{pc.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 border-2 border-dashed border-[#d4e684] hover:border-[#242424] rounded-3xl p-6 text-center cursor-pointer group relative bg-[#F8F8F6] flex flex-col items-center justify-center min-h-[190px] transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />
          <div className="w-12 h-12 rounded-full bg-[#d4e684] text-[#181e00] flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
          </div>
          <p className="text-xs font-bold text-[#242424]">
            Pilih file gambar untuk kategori <span className="underline font-bold capitalize">{photoCategory}</span>
          </p>
          <p className="text-[11px] text-[#6E6E6B] mt-0.5">
            Mendukung JPG, PNG, WEBP (Maksimal 5MB per file)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#242424]">
            Foto Terunggah <span className="text-red-500">*</span> (Minimal 1 Foto)
          </span>
          <span className="text-[11px] font-semibold bg-[#d4e684] text-[#181e00] px-2.5 py-0.5 rounded-full">
            {uploadedPhotos.length} Foto Siap
          </span>
        </div>



        {uploadedPhotos.length === 0 ? (
          <div className="p-8 border border-dashed border-[#E8E8E4] rounded-2xl bg-[#F8F8F6] text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[36px] text-[#A0A09C] mb-2">add_photo_alternate</span>
            <p className="text-xs font-semibold text-[#6E6E6B]">Belum ada foto yang diunggah.</p>
            <p className="text-[11px] text-[#A0A09C] mt-1">Pilih kategori lalu klik area unggah di atas untuk menambahkan foto tempat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {uploadedPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`relative rounded-2xl overflow-hidden border bg-[#F8F8F6] shadow-xs ${
                  photo.isCover ? 'border-2 border-[#242424] ring-2 ring-[#d4e684]' : 'border-[#E8E8E4]'
                }`}
              >
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img alt={photo.name} src={photo.image} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Hapus Foto"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-xs hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="p-3 flex items-center justify-between bg-white border-t border-[#E8E8E4] text-xs">
                  <span className="font-bold truncate max-w-[140px] text-[#242424]">{photo.name}</span>
                  {photo.isCover ? (
                    <span className="text-[10px] bg-[#d4e684] text-[#181e00] px-2 py-0.5 rounded-md font-bold">
                      Sampul
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCoverPhoto(photo.id)}
                      className="text-[11px] text-[#6E6E6B] hover:text-[#242424] font-semibold cursor-pointer"
                    >
                      Set Sampul
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

