import React from 'react';

export default function CreateThreadModal({
  isOpen,
  onClose,
  newThreadContent,
  setNewThreadContent,
  newThreadPlaceId,
  setNewThreadPlaceId,
  placeSearchQuery,
  setPlaceSearchQuery,
  isPlaceSearchOpen,
  setIsPlaceSearchOpen,
  selectedThreadPlaceObj,
  filteredPlacesForThread,
  newThreadCategory,
  setNewThreadCategory,
  threadFileInputRef,
  uploadedImagePreview,
  setUploadedImagePreview,
  isThreadDragOver,
  setIsThreadDragOver,
  processImageFile,
  handleCreateThreadSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-border-hairline relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-surface flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">edit_note</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">Tulis Utas Diskusi &amp; Review Spot</h3>
            <p className="text-xs text-charcoal-subtle">
              Bagikan pengalamanmu &amp; dapatkan <strong className="text-primary">+10 XP</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateThreadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Cerita / Ulasan Spot <span className="text-error">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              placeholder="Ceritakan suasana tempat, kenyamanan kursi, colokan, kecepatan WiFi, atau menu rekomendasi..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-border-hairline text-xs focus:outline-none focus:ring-1 focus:ring-on-surface resize-none leading-relaxed"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-on-surface">
                Sematkan Kafe / Spot <span className="text-charcoal-subtle font-normal">(Opsional)</span>
              </label>
              {selectedThreadPlaceObj && (
                <button
                  type="button"
                  onClick={() => {
                    setNewThreadPlaceId('');
                    setPlaceSearchQuery('');
                  }}
                  className="text-[11px] font-semibold text-error hover:underline cursor-pointer"
                >
                  ✕ Hapus Sematan
                </button>
              )}
            </div>

            {selectedThreadPlaceObj ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-border-hairline">
                <img
                  src={selectedThreadPlaceObj.imageUrl}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-on-surface truncate">
                    📍 {selectedThreadPlaceObj.name}
                  </p>
                  <p className="text-[11px] text-charcoal-subtle truncate">
                    {selectedThreadPlaceObj.address || selectedThreadPlaceObj.location}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center bg-surface-container-low rounded-xl border border-border-hairline px-3 py-2 focus-within:border-primary">
                  <span className="material-symbols-outlined text-[18px] text-charcoal-subtle mr-2">
                    search
                  </span>
                  <input
                    type="text"
                    value={placeSearchQuery}
                    onChange={(e) => {
                      setPlaceSearchQuery(e.target.value);
                      setIsPlaceSearchOpen(true);
                    }}
                    onFocus={() => setIsPlaceSearchOpen(true)}
                    placeholder="Ketik nama kafe / lokasi untuk mencari..."
                    className="w-full bg-transparent border-0 outline-none text-xs text-on-surface placeholder:text-charcoal-subtle font-medium"
                  />
                </div>

                {isPlaceSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-surface-card rounded-xl border border-border-hairline shadow-lg z-20 p-1 space-y-1">
                    {filteredPlacesForThread.length === 0 ? (
                      <div className="p-3 text-center text-xs text-charcoal-subtle">
                        Tidak ada tempat yang cocok
                      </div>
                    ) : (
                      filteredPlacesForThread.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setNewThreadPlaceId(p.id);
                            setIsPlaceSearchOpen(false);
                            setPlaceSearchQuery('');
                          }}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container text-left transition-colors cursor-pointer"
                        >
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-on-surface truncate">{p.name}</p>
                            <p className="text-[10px] text-charcoal-subtle truncate">
                              {p.address || p.location}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Kategori Topik <span className="text-charcoal-subtle font-normal">(Opsional)</span>
            </label>
            <select
              value={newThreadCategory}
              onChange={(e) => setNewThreadCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-border-hairline text-xs font-semibold cursor-pointer"
            >
              <option value="">Tanpa Kategori (Umum)</option>
              <option value="nugas">💻 Nugas &amp; Kerja</option>
              <option value="nongkrong">☕ Nongkrong Santai</option>
              <option value="olahraga">🏸 Olahraga Bareng</option>
              <option value="fasilitas_publik">🏛️ Fasilitas Publik</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-on-surface">
                Lampiran Foto <span className="text-charcoal-subtle font-normal">(Opsional)</span>
              </label>
              <span className="text-[10px] text-charcoal-subtle">
                Maks. ukuran file: <strong>5 MB</strong> (JPG, PNG, WebP)
              </span>
            </div>

            <input
              type="file"
              ref={threadFileInputRef}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  processImageFile(file, (base64) => {
                    setUploadedImagePreview(base64);
                  });
                }
              }}
              className="hidden"
            />

            {uploadedImagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border-hairline max-h-48 group">
                <img
                  src={uploadedImagePreview}
                  alt="Preview utas"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImagePreview('');
                    if (threadFileInputRef.current) threadFileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                  title="Hapus Foto"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsThreadDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsThreadDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsThreadDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    processImageFile(file, (base64) => {
                      setUploadedImagePreview(base64);
                    });
                  }
                }}
                onClick={() => threadFileInputRef.current?.click()}
                className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center ${
                  isThreadDragOver
                    ? 'border-primary bg-primary-container/20 scale-102'
                    : 'border-border-hairline bg-surface-container-low hover:bg-surface-container hover:border-primary/50'
                }`}
              >
                <span className="material-symbols-outlined text-[32px] text-primary">
                  cloud_upload
                </span>
                <p className="font-semibold text-xs text-on-surface">
                  Tarik &amp; lepas file foto ke sini, atau{' '}
                  <span className="text-primary underline">klik untuk memilih</span>
                </p>
                <p className="text-[10px] text-charcoal-subtle">
                  Maksimal ukuran file: <strong>5 MB</strong> (JPG, PNG, WebP)
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Terbitkan Utas</span>
              <span className="text-xs bg-primary-container text-on-primary-fixed px-2 py-0.5 rounded-md">
                +10 XP
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

