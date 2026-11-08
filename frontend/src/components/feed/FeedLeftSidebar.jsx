import React from 'react';

export default function FeedLeftSidebar({
  onOpenThreadModal,
  onTriggerAppModal,
  selectedFeedTab,
  onSelectFeedTab,
  totalPostsCount,
  myThreadsCount,
  likedPostsCount,
  myRepliesCount,
  currentUserName,
  currentUserRole,
  currentUserCampus,
  currentUserInitials,
}) {
  return (
    <aside className="w-full lg:w-60 xl:w-64 shrink-0 bg-surface-card border border-border-hairline rounded-3xl p-5 shadow-xs flex flex-col gap-5 lg:sticky lg:top-24">
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onOpenThreadModal}
          className="w-full py-3 px-4 rounded-2xl bg-inverse-surface hover:bg-black text-inverse-on-surface font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-primary-container">
            edit_note
          </span>
          <span>+ Buat Utasan</span>
        </button>

        <button
          type="button"
          onClick={(e) => onTriggerAppModal('invite', e)}
          className="w-full py-3 px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs md:text-sm flex items-center justify-center gap-2 border border-border-hairline shadow-2xs transition-colors cursor-pointer group"
          title="Fitur eksklusif aplikasi mobile"
        >
          <span className="material-symbols-outlined text-[18px] text-primary transition-transform">
            smartphone
          </span>
          <span>+ Buat Ajakan</span>
          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-primary-container text-on-primary-fixed">
            App
          </span>
        </button>
      </div>

      <div className="h-px bg-border-hairline" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-subtle px-2 mb-1">
          Navigasi Feed
        </span>

        <button
          type="button"
          onClick={() => onSelectFeedTab('all')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedFeedTab === 'all'
              ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px]">dynamic_feed</span>
            <span>Semua Utas</span>
          </div>
          <span className="text-[11px] opacity-75 font-bold">{totalPostsCount}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFeedTab('my_threads')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedFeedTab === 'my_threads'
              ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-primary">
              edit_note
            </span>
            <span>Utas Saya</span>
          </div>
          <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-primary-container/80 text-on-primary-fixed font-bold">
            {myThreadsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFeedTab('liked')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedFeedTab === 'liked'
              ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-rose-500">
              favorite
            </span>
            <span>Utas Disukai</span>
          </div>
          <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 font-bold">
            {likedPostsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFeedTab('my_replies')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedFeedTab === 'my_replies'
              ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-primary">
              reply
            </span>
            <span>Balasan Saya</span>
          </div>
          <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-primary-container/70 text-on-primary-fixed font-bold">
            {myRepliesCount}
          </span>
        </button>
      </div>

      <div className="h-px bg-border-hairline" />

      <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-border-hairline">
        <div className="w-10 h-10 rounded-xl bg-primary-container text-on-surface font-bold text-xs flex items-center justify-center shrink-0">
          {currentUserInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-on-surface truncate">{currentUserName}</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded border bg-amber-100 text-amber-900 border-amber-300">
              {currentUserRole}
            </span>
          </div>
          <p className="text-[10px] text-charcoal-subtle truncate">{currentUserCampus}</p>
        </div>
      </div>
    </aside>
  );
}

