import React from 'react';
import { getTotalCommentsCount } from './feedData';

export default function FeedPostCard({
  post,
  onOpenPostDetail,
  onOpenReplyModal,
  onToggleLike,
  onToggleHangoutClosed,
  onSelectPlace,
  onNavigate,
}) {
  const isHangout = post.postType === 'hangout';
  const isFull =
    isHangout &&
    (post.isClosed ||
      (post.joinedUsers && post.joinedUsers.length >= (post.slotCapacity || 0)));

  return (
    <article
      id={`post-${post.id}`}
      onClick={() => onOpenPostDetail(post.id)}
      className="bg-surface-card rounded-3xl p-6 md:p-7 shadow-xs border border-border-hairline flex flex-col gap-4.5 transition-all hover:border-outline-variant hover:shadow-md cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl ${post.author.avatarBg} text-on-surface font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs`}
          >
            {post.author.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                {post.author.name}
              </h3>
              {post.author.isMe && (
                <span className="text-[10px] font-bold text-primary bg-primary-container/60 px-2 py-0.5 rounded-full">
                  Kamu
                </span>
              )}

              {post.author.badge && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${post.author.badge.color}`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {post.author.badge.icon}
                  </span>
                  <span>{post.author.badge.name}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-subtle">
              {post.author.campus} • {post.timeAgo}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isHangout ? (
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                isFull
                  ? 'bg-neutral-200 text-neutral-700'
                  : 'bg-status-open/15 text-status-open'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {isFull ? 'lock' : 'group'}
              </span>
              <span>{isFull ? 'Slot Penuh' : 'Ajakan Terbuka'}</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-container text-charcoal-subtle flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">chat</span>
              <span>Utas Diskusi</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {post.title && (
          <h2 className="text-lg md:text-xl font-bold text-on-surface leading-snug">
            {post.title}
          </h2>
        )}
        <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {post.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-border-hairline max-h-96 bg-surface-container-low">
          <img
            src={post.imageUrl}
            alt="Foto postingan"
            className="w-full h-auto object-cover max-h-96 hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {post.taggedPlace && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectPlace) {
              onSelectPlace(post.taggedPlace);
            } else if (onNavigate) {
              onNavigate('detail', { place: post.taggedPlace });
            }
          }}
          className="p-3 bg-surface-container-low rounded-2xl border border-border-hairline hover:bg-surface-container transition-all flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={post.taggedPlace.imageUrl}
              alt=""
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-border-hairline"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  📍 {post.taggedPlace.category}
                </span>
                <span className="text-[10px] text-charcoal-subtle">•</span>
                <span className="text-[10px] font-semibold text-charcoal-subtle">
                  ⭐ {post.taggedPlace.rating}
                </span>
              </div>
              <h4 className="text-sm font-bold text-on-surface truncate">
                {post.taggedPlace.name}
              </h4>
              <p className="text-xs text-charcoal-subtle truncate">
                {post.taggedPlace.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
            <span className="hidden sm:inline">Lihat Kafe</span>
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </div>
        </div>
      )}

      {isHangout && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-border-hairline text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              schedule
            </span>
            <span className="font-semibold text-on-surface">{post.hangoutTime}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              {post.joinedUsers &&
                post.joinedUsers.map((user, idx) => (
                  <div
                    key={idx}
                    title={user.name}
                    className={`inline-block h-7 w-7 rounded-full ring-2 ring-surface-card ${user.bg} text-on-surface font-bold text-[10px] flex items-center justify-center`}
                  >
                    {user.initials}
                  </div>
                ))}
            </div>
            <span className="font-bold text-on-surface">
              {isFull ? (
                <span className="text-charcoal-subtle">
                  Kapasitas Penuh ({post.slotCapacity}/{post.slotCapacity})
                </span>
              ) : (
                <span>
                  Sisa{' '}
                  <strong className="text-primary">
                    {Math.max(
                      0,
                      (post.slotCapacity || 0) - (post.joinedUsers?.length || 0)
                    )}{' '}
                    Slot
                  </strong>{' '}
                  ({post.joinedUsers?.length}/{post.slotCapacity})
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-hairline">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => onOpenReplyModal(post, e)}
            className="px-3 py-1.5 rounded-xl hover:bg-surface-container text-charcoal-subtle hover:text-on-surface text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Tulis balasan"
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            <span>Balas</span>
          </button>

          <button
            type="button"
            onClick={(e) => onToggleLike(post.id, e)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              post.isLiked
                ? 'bg-rose-50 text-rose-600 font-bold'
                : 'hover:bg-surface-container text-charcoal-subtle hover:text-on-surface'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] transition-transform active:scale-125 ${
                post.isLiked ? 'text-rose-600 fill-1' : ''
              }`}
            >
              favorite
            </span>
            <span>{post.likesCount} Suka</span>
          </button>

          {isHangout && post.author.isMe && (
            <button
              type="button"
              onClick={(e) => onToggleHangoutClosed(post.id, e)}
              className="px-3 py-1 rounded-xl border border-border-hairline hover:bg-surface-container text-xs font-semibold text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer"
            >
              {post.isClosed ? 'Buka Slot' : 'Tandai Penuh'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-charcoal-subtle group-hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span>{getTotalCommentsCount(post)} Balasan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        </div>
      </div>
    </article>
  );
}

