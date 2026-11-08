import React from 'react';
import { getTotalCommentsCount } from './feedData';

export default function FeedDetailView({
  activeDetailPost,
  onNavigate,
  onBackToTimeline,
  onOpenReplyModal,
  onToggleLike,
  onSelectPlace,
  showToast,
  inlineReplyTarget,
  setInlineReplyTarget,
  inlineReplyText,
  setInlineReplyText,
  onSubmitInlineReply,
}) {
  if (!activeDetailPost) return null;

  return (
    <div className="max-w-[860px] w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6 animate-in fade-in duration-200">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-charcoal-subtle font-medium"
      >
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('beranda')}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          Beranda
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <button
          type="button"
          onClick={onBackToTimeline}
          className="hover:text-on-surface transition-colors cursor-pointer"
        >
          Feed Komunitas
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-bold">Detail Postingan</span>
      </nav>

      <div className="sticky top-20 z-30 py-3 -my-2 bg-surface/90 backdrop-blur-md border-b border-border-hairline flex items-center justify-between transition-all">
        <button
          type="button"
          onClick={onBackToTimeline}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-card hover:bg-surface-container border border-border-hairline text-xs font-bold text-on-surface transition-all cursor-pointer shadow-xs group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span>Kembali ke Linimasa</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-charcoal-subtle hidden sm:inline">
            {activeDetailPost.postType === 'hangout' ? 'Ajakan Nongkrong' : 'Utas Diskusi'}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-container text-on-surface">
            💬 {getTotalCommentsCount(activeDetailPost)} Balasan
          </span>
        </div>
      </div>

      <article className="bg-surface-card rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl ${activeDetailPost.author.avatarBg} text-on-surface font-bold text-base flex items-center justify-center shrink-0 shadow-2xs`}
            >
              {activeDetailPost.author.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg text-on-surface">
                  {activeDetailPost.author.name}
                </h3>
                {activeDetailPost.author.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${activeDetailPost.author.badge.color}`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {activeDetailPost.author.badge.icon}
                    </span>
                    <span>{activeDetailPost.author.badge.name}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-subtle">{activeDetailPost.author.campus}</p>
            </div>
          </div>

          {activeDetailPost.category && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-container text-on-surface">
              {activeDetailPost.category === 'nugas'
                ? '💻 Nugas & Kerja'
                : activeDetailPost.category === 'nongkrong'
                ? '☕ Nongkrong Santai'
                : activeDetailPost.category === 'olahraga'
                ? '🏸 Olahraga'
                : '🏛️ Fasilitas Publik'}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {activeDetailPost.title && (
            <h1 className="text-xl md:text-2xl font-extrabold text-on-surface leading-snug">
              {activeDetailPost.title}
            </h1>
          )}
          <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
            {activeDetailPost.content}
          </p>
        </div>

        {activeDetailPost.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-border-hairline max-h-[500px] bg-surface-container-low">
            <img
              src={activeDetailPost.imageUrl}
              alt="Lampiran postingan"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {activeDetailPost.taggedPlace && (
          <div
            onClick={() => {
              if (onSelectPlace) {
                onSelectPlace(activeDetailPost.taggedPlace);
              } else if (onNavigate) {
                onNavigate('detail', { place: activeDetailPost.taggedPlace });
              }
            }}
            className="p-4 bg-surface-container-low rounded-2xl border border-border-hairline hover:bg-surface-container transition-all flex items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={activeDetailPost.taggedPlace.imageUrl}
                alt=""
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-border-hairline group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  📍 {activeDetailPost.taggedPlace.category}
                </span>
                <h4 className="text-sm md:text-base font-bold text-on-surface truncate">
                  {activeDetailPost.taggedPlace.name}
                </h4>
                <p className="text-xs text-charcoal-subtle truncate">
                  {activeDetailPost.taggedPlace.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-primary shrink-0">
              <span>Buka Kafe</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </div>
          </div>
        )}

        {activeDetailPost.postType === 'hangout' && (
          <div className="p-4 rounded-2xl bg-surface-container-low border border-border-hairline flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  schedule
                </span>
                <span className="font-semibold text-on-surface">
                  {activeDetailPost.hangoutTime}
                </span>
              </div>
              <span className="font-bold text-primary">
                Kapasitas: {activeDetailPost.slotCapacity} Orang
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border-hairline">
              <span className="text-charcoal-subtle">Kawan yang Bergabung:</span>
              <div className="flex items-center gap-1.5">
                {activeDetailPost.joinedUsers?.map((u, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-surface-card border text-[11px] font-bold"
                  >
                    {u.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="py-3 border-y border-border-hairline flex items-center justify-between text-xs text-charcoal-subtle">
          <span>{activeDetailPost.timeAgo} • pNongki Web</span>
          <div className="flex items-center gap-4">
            <span>
              <strong className="text-on-surface font-bold">
                {activeDetailPost.likesCount}
              </strong>{' '}
              Suka
            </span>
            <span>
              <strong className="text-on-surface font-bold">
                {getTotalCommentsCount(activeDetailPost)}
              </strong>{' '}
              Balasan
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenReplyModal(activeDetailPost)}
              className="px-4 py-2 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">reply</span>
              <span>Balas Postingan</span>
            </button>

            <button
              type="button"
              onClick={(e) => onToggleLike(activeDetailPost.id, e)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                activeDetailPost.isLiked
                  ? 'bg-rose-50 text-rose-600 font-bold'
                  : 'hover:bg-surface-container text-charcoal-subtle hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  activeDetailPost.isLiked ? 'text-rose-600 fill-1' : ''
                }`}
              >
                favorite
              </span>
              <span>{activeDetailPost.likesCount}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`https://pnongki.id/feed/${activeDetailPost.id}`);
              }
              showToast('Tautan postingan disalin!');
            }}
            className="p-2 rounded-full hover:bg-surface-container text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer"
            title="Salin Tautan"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </article>

      <div
        onClick={() => onOpenReplyModal(activeDetailPost)}
        className="flex items-center gap-3 p-4 rounded-2xl bg-surface-card border border-border-hairline cursor-pointer hover:bg-surface-container transition-all group shadow-xs"
      >
        <div className="w-9 h-9 rounded-xl bg-primary-container text-on-surface font-bold text-xs flex items-center justify-center shrink-0">
          AU
        </div>
        <span className="text-xs text-charcoal-subtle group-hover:text-on-surface transition-colors flex-1">
          Tulis balasan lengkap dengan sematan &amp; gambar...
        </span>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-inverse-surface text-inverse-on-surface font-bold text-xs shadow-2xs group-hover:scale-105 transition-all"
        >
          Balas
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-on-surface">
          Seluruh Balasan ({getTotalCommentsCount(activeDetailPost)})
        </h3>

        {activeDetailPost.comments.length === 0 ? (
          <div className="p-10 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[36px] text-charcoal-subtle">
              forum
            </span>
            <p className="text-sm font-bold text-on-surface">Belum ada balasan</p>
            <p className="text-xs text-charcoal-subtle">
              Jadilah yang pertama menuliskan tanggapan untuk utas ini!
            </p>
            <button
              type="button"
              onClick={() => onOpenReplyModal(activeDetailPost)}
              className="mt-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary-fixed font-bold text-xs cursor-pointer"
            >
              Tulis Balasan Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDetailPost.comments.map((c) => {
              const isReplyingToThisComment =
                inlineReplyTarget &&
                inlineReplyTarget.commentId === c.id &&
                inlineReplyTarget.replyId === null;

              return (
                <div
                  key={c.id}
                  className="p-5 rounded-3xl bg-surface-card border border-border-hairline text-xs flex flex-col gap-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center shrink-0">
                        {c.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-on-surface">
                            {c.author}
                          </span>
                          {c.badge && (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${c.badge.color}`}
                            >
                              {c.badge.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-charcoal-subtle">{c.time}</span>
                  </div>

                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line pl-10">
                    {c.text}
                  </p>

                  {c.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-border-hairline max-h-64 bg-surface-container-low ml-10">
                      <img
                        src={c.imageUrl}
                        alt="Lampiran balasan"
                        className="w-full h-auto object-cover max-h-64"
                      />
                    </div>
                  )}

                  {c.taggedPlace && (
                    <div
                      onClick={() => {
                        if (onSelectPlace) {
                          onSelectPlace(c.taggedPlace);
                        } else if (onNavigate) {
                          onNavigate('detail', { place: c.taggedPlace });
                        }
                      }}
                      className="p-2.5 bg-surface-container-low rounded-xl border border-border-hairline hover:bg-surface-container flex items-center justify-between gap-3 cursor-pointer ml-10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={c.taggedPlace.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <p className="text-xs font-bold text-on-surface truncate">
                          📍 {c.taggedPlace.name}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-primary">Lihat</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 border-t border-border-hairline/60 ml-10">
                    <button
                      type="button"
                      onClick={() => {
                        if (isReplyingToThisComment) {
                          setInlineReplyTarget(null);
                        } else {
                          setInlineReplyTarget({
                            commentId: c.id,
                            replyToAuthor: c.author,
                            replyId: null,
                          });
                          setInlineReplyText('');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-subtle hover:text-primary transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      <span>Balas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenReplyModal(activeDetailPost, null, c, c.author)
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-surface-container-low"
                      title="Balas dengan lampiran foto atau kafe"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        add_photo_alternate
                      </span>
                      <span className="hidden sm:inline">Balas Lengkap</span>
                    </button>
                  </div>

                  {isReplyingToThisComment && (
                    <div className="ml-10 p-3 rounded-2xl bg-surface-container-low border border-primary/30 flex flex-col gap-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-charcoal-subtle">
                          Membalas <strong className="text-primary font-bold">@{c.author}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineReplyTarget(null);
                            setInlineReplyText('');
                          }}
                          className="text-charcoal-subtle hover:text-black font-semibold cursor-pointer"
                        >
                          ✕ Batal
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={inlineReplyText}
                          onChange={(e) => setInlineReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              onSubmitInlineReply(c.id, c.author);
                            }
                          }}
                          placeholder={`Tulis balasan untuk @${c.author}...`}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-surface-card border border-border-hairline focus:outline-none focus:ring-1 focus:ring-on-surface"
                        />
                        <button
                          type="button"
                          disabled={!inlineReplyText.trim()}
                          onClick={() => onSubmitInlineReply(c.id, c.author)}
                          className="px-4 py-2 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}

                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-3 sm:ml-8 pl-3.5 sm:pl-5 border-l-2 border-border-hairline space-y-3 mt-1 pt-1">
                      {c.replies.map((r) => {
                        const isReplyingToThisReply =
                          inlineReplyTarget &&
                          inlineReplyTarget.commentId === c.id &&
                          inlineReplyTarget.replyId === r.id;

                        return (
                          <div
                            key={r.id}
                            className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low/75 border border-border-hairline text-xs flex flex-col gap-2.5 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-surface-container-highest text-on-surface font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {r.author.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-on-surface">
                                    {r.author}
                                  </span>
                                  {r.badge && (
                                    <span
                                      className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border ${r.badge.color}`}
                                    >
                                      {r.badge.name}
                                    </span>
                                  )}
                                  {r.replyToAuthor && (
                                    <span className="text-[10px] text-charcoal-subtle inline-flex items-center gap-1 bg-surface-card px-2 py-0.5 rounded-md border border-border-hairline">
                                      <span>membalas</span>
                                      <strong className="text-primary font-bold">
                                        @{r.replyToAuthor}
                                      </strong>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] text-charcoal-subtle">
                                {r.time}
                              </span>
                            </div>

                            <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line pl-9">
                              {r.text}
                            </p>

                            {r.imageUrl && (
                              <div className="rounded-xl overflow-hidden border border-border-hairline max-h-48 bg-surface-card ml-9">
                                <img
                                  src={r.imageUrl}
                                  alt="Lampiran balasan"
                                  className="w-full h-auto object-cover max-h-48"
                                />
                              </div>
                            )}

                            {r.taggedPlace && (
                              <div
                                onClick={() => {
                                  if (onSelectPlace) {
                                    onSelectPlace(r.taggedPlace);
                                  } else if (onNavigate) {
                                    onNavigate('detail', { place: r.taggedPlace });
                                  }
                                }}
                                className="p-2 bg-surface-card rounded-xl border border-border-hairline hover:bg-surface-container flex items-center justify-between gap-3 cursor-pointer ml-9"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={r.taggedPlace.imageUrl}
                                    alt=""
                                    className="w-7 h-7 rounded-lg object-cover shrink-0"
                                  />
                                  <p className="text-[11px] font-bold text-on-surface truncate">
                                    📍 {r.taggedPlace.name}
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold text-primary">Lihat</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1 border-t border-border-hairline/40 ml-9">
                              <button
                                type="button"
                                onClick={() => {
                                  if (isReplyingToThisReply) {
                                    setInlineReplyTarget(null);
                                  } else {
                                    setInlineReplyTarget({
                                      commentId: c.id,
                                      replyToAuthor: r.author,
                                      replyId: r.id,
                                    });
                                    setInlineReplyText('');
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-charcoal-subtle hover:text-primary transition-colors cursor-pointer py-0.5 px-2 rounded-lg hover:bg-surface-card"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  reply
                                </span>
                                <span>Balas</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onOpenReplyModal(activeDetailPost, null, c, r.author)
                                }
                                className="inline-flex items-center gap-1 text-[10px] text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer py-0.5 px-2 rounded-lg hover:bg-surface-card"
                                title="Balas dengan lampiran foto atau kafe"
                              >
                                <span className="material-symbols-outlined text-[13px]">
                                  add_photo_alternate
                                </span>
                                <span className="hidden sm:inline">Balas Lengkap</span>
                              </button>
                            </div>

                            {isReplyingToThisReply && (
                              <div className="ml-9 p-3 rounded-2xl bg-surface-card border border-primary/30 flex flex-col gap-2 animate-in fade-in duration-150 shadow-xs">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-charcoal-subtle">
                                    Membalas balasan dari{' '}
                                    <strong className="text-primary font-bold">
                                      @{r.author}
                                    </strong>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setInlineReplyTarget(null);
                                      setInlineReplyText('');
                                    }}
                                    className="text-charcoal-subtle hover:text-black font-semibold cursor-pointer"
                                  >
                                    ✕ Batal
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={inlineReplyText}
                                    onChange={(e) => setInlineReplyText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        onSubmitInlineReply(c.id, r.author);
                                      }
                                    }}
                                    placeholder={`Tulis balasan untuk @${r.author}...`}
                                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-border-hairline focus:outline-none focus:ring-1 focus:ring-on-surface"
                                  />
                                  <button
                                    type="button"
                                    disabled={!inlineReplyText.trim()}
                                    onClick={() => onSubmitInlineReply(c.id, r.author)}
                                    className="px-4 py-2 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                                  >
                                    Kirim
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

