import React from 'react';

export default function ReplyModal({
  replyModalPost,
  replyTargetComment,
  replyText,
  setReplyText,
  replyPlaceId,
  setReplyPlaceId,
  replyPlaceSearchQuery,
  setReplyPlaceSearchQuery,
  isReplyPlaceSearchOpen,
  setIsReplyPlaceSearchOpen,
  selectedReplyPlaceObj,
  filteredPlacesForReply,
  replyFileInputRef,
  replyImagePreview,
  setReplyImagePreview,
  isReplyDragOver,
  setIsReplyDragOver,
  processImageFile,
  handleReplySubmit,
  onClose,
}) {
  if (!replyModalPost) return null;

  return (
    <div
      className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-3xl max-w-xl w-full p-6 md:p-7 shadow-2xl border border-border-hairline relative max-h-[90vh] overflow-y-auto flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">reply</span>
            <h3 className="font-bold text-base text-on-surface">
              {replyTargetComment ? 'Balas Komentar' : 'Kirim Balasan'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-charcoal-subtle hover:text-black rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {replyTargetComment ? (
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline relative">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-surface font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">reply</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-on-surface">
                  {replyTargetComment.replyToAuthor}
                </span>
                <span className="text-[10px] text-charcoal-subtle bg-surface-card px-2 py-0.5 rounded-md border border-border-hairline">
                  Balasan Komentar
                </span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed italic">
                "{replyTargetComment.snippet}"
              </p>
              <p className="text-[11px] text-charcoal-subtle mt-1">
                Membalas balasan dari{' '}
                <span className="text-primary font-bold">
                  @{replyTargetComment.replyToAuthor}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-border-hairline relative">
            <div
              className={`w-9 h-9 rounded-xl ${replyModalPost.author.avatarBg} text-on-surface font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
            >
              {replyModalPost.author.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-on-surface">
                  {replyModalPost.author.name}
                </span>
                <span className="text-[11px] text-charcoal-subtle">
                  {replyModalPost.timeAgo}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
                {replyModalPost.content}
              </p>
              <p className="text-[11px] text-charcoal-subtle mt-1">
                Membalas <span className="text-primary font-bold">@{replyModalPost.author.name}</span>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleReplySubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-on-surface">
              Isi Balasan <span className="text-error">*</span>
            </label>
            <textarea
              autoFocus
              rows={3}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tuliskan tanggapan, info tambahan, atau tips nongkrong..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-border-hairline text-xs focus:outline-none focus:ring-1 focus:ring-on-surface resize-none leading-relaxed"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-on-surface">
                Sematkan Tempat Terkait <span className="text-charcoal-subtle font-normal">(Opsional)</span>
              </label>
              {selectedReplyPlaceObj && (
                <button
                  type="button"
                  onClick={() => {
                    setReplyPlaceId('');
                    setReplyPlaceSearchQuery('');
                  }}
                  className="text-[11px] font-semibold text-error hover:underline cursor-pointer"
                >
                  ✕ Hapus Sematan
                </button>
              )}
            </div>

            {selectedReplyPlaceObj ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-border-hairline">
                <img
                  src={selectedReplyPlaceObj.imageUrl}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-on-surface truncate">
                    📍 {selectedReplyPlaceObj.name}
                  </p>
                  <p className="text-[10px] text-charcoal-subtle truncate">
                    {selectedReplyPlaceObj.address || selectedReplyPlaceObj.location}
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
                    value={replyPlaceSearchQuery}
                    onChange={(e) => {
                      setReplyPlaceSearchQuery(e.target.value);
                      setIsReplyPlaceSearchOpen(true);
                    }}
                    onFocus={() => setIsReplyPlaceSearchOpen(true)}
                    placeholder="Cari kafe yang ingin kamu rekomendasikan..."
                    className="w-full bg-transparent border-0 outline-none text-xs text-on-surface placeholder:text-charcoal-subtle font-medium"
                  />
                </div>

                {isReplyPlaceSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-surface-card rounded-xl border border-border-hairline shadow-lg z-30 p-1 space-y-1">
                    {filteredPlacesForReply.length === 0 ? (
                      <div className="p-3 text-center text-xs text-charcoal-subtle">
                        Tidak ada tempat yang cocok
                      </div>
                    ) : (
                      filteredPlacesForReply.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setReplyPlaceId(p.id);
                            setIsReplyPlaceSearchOpen(false);
                            setReplyPlaceSearchQuery('');
                          }}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container text-left transition-colors cursor-pointer"
                        >
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover shrink-0"
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
              ref={replyFileInputRef}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  processImageFile(file, (base64) => {
                    setReplyImagePreview(base64);
                  });
                }
              }}
              className="hidden"
            />

            {replyImagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border-hairline max-h-48 group">
                <img
                  src={replyImagePreview}
                  alt="Preview lampiran balasan"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setReplyImagePreview('');
                    if (replyFileInputRef.current) replyFileInputRef.current.value = '';
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
                  setIsReplyDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsReplyDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsReplyDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    processImageFile(file, (base64) => {
                      setReplyImagePreview(base64);
                    });
                  }
                }}
                onClick={() => replyFileInputRef.current?.click()}
                className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center ${
                  isReplyDragOver
                    ? 'border-primary bg-primary-container/20 scale-102'
                    : 'border-border-hairline bg-surface-container-low hover:bg-surface-container hover:border-primary/50'
                }`}
              >
                <span className="material-symbols-outlined text-[28px] text-primary">
                  cloud_upload
                </span>
                <p className="font-semibold text-xs text-on-surface">
                  Tarik &amp; lepas file gambar ke sini, atau{' '}
                  <span className="text-primary underline">klik untuk memilih</span>
                </p>
                <p className="text-[10px] text-charcoal-subtle">
                  Format: JPG, PNG, WebP • Maksimal 5 MB
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-hairline">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-charcoal-subtle hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-bold text-xs shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Kirim Balasan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

