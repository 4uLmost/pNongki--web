import React from 'react';
import { RATING_LABELS } from './detailData';

export default function DetailReviewsTab({
  reviews = [],
  filteredReviews = [],
  selectedStarFilter,
  setSelectedStarFilter,
  handleReviewSubmit,
  userRating,
  setUserRating,
  reviewInputText,
  setReviewInputText,
  isAnonymous,
  setIsAnonymous,
  myReview,
  editingMyReview,
  setEditingMyReview,
  editReviewText,
  setEditReviewText,
  handleDeleteMyReview,
  handleSaveEditReview,
}) {
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, r) => acc + (Number(r.rating || r.score) || 5), 0) /
          totalReviews
        ).toFixed(1)
      : '-';

  const star5Count = reviews.filter((r) => Math.round(Number(r.rating || r.score)) === 5).length;
  const star4Count = reviews.filter((r) => Math.round(Number(r.rating || r.score)) === 4).length;
  const star3Count = reviews.filter((r) => Math.round(Number(r.rating || r.score)) <= 3).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center justify-center text-center p-5 bg-surface-container-low rounded-2xl w-full md:w-48 shrink-0 border border-border-hairline">
            <span className="text-5xl font-extrabold text-on-surface leading-none">{avgRating}</span>
            <div className="flex items-center gap-0.5 my-2 text-primary">
              {[1, 2, 3, 4, 5].map((starNum) => {
                const numAvg = Number(avgRating) || 0;
                const isFilled = numAvg >= starNum;
                const isHalf = !isFilled && numAvg >= starNum - 0.5;
                return (
                  <span
                    key={starNum}
                    className={`material-symbols-outlined text-[18px] ${
                      isFilled || isHalf ? 'fill-1' : ''
                    }`}
                  >
                    {isFilled ? 'star' : isHalf ? 'star_half' : 'star'}
                  </span>
                );
              })}
            </div>
            <span className="text-xs text-charcoal-subtle">
              {totalReviews > 0
                ? `Berdasarkan ${totalReviews} ulasan terverifikasi`
                : 'Belum ada ulasan'}
            </span>
          </div>

          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((s) => {
              const count = reviews.filter((r) => Math.round(Number(r.rating || r.score)) === s).length;
              const pct = (count / totalReviews) * 100;
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-14 text-xs font-semibold text-on-surface flex items-center gap-1">
                    <span>{s}</span>
                    <span className="material-symbols-outlined text-[13px] text-primary fill-1">star</span>
                  </span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-xs font-bold text-right text-charcoal-subtle">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedStarFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedStarFilter === 'all'
                ? 'bg-inverse-surface text-inverse-on-surface font-bold'
                : 'bg-surface-card hover:bg-surface-container border border-border-hairline text-on-surface'
            }`}
          >
            <span>Semua</span>
            <span className="text-[11px] opacity-75">({totalReviews})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStarFilter('5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              selectedStarFilter === '5'
                ? 'bg-inverse-surface text-inverse-on-surface font-bold'
                : 'bg-surface-card hover:bg-surface-container border border-border-hairline text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-primary fill-1">star</span>
            <span>5 Bintang</span>
            <span className="text-charcoal-subtle text-[11px]">({star5Count})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStarFilter('4')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              selectedStarFilter === '4'
                ? 'bg-inverse-surface text-inverse-on-surface font-bold'
                : 'bg-surface-card hover:bg-surface-container border border-border-hairline text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-primary fill-1">star</span>
            <span>4 Bintang</span>
            <span className="text-charcoal-subtle text-[11px]">({star4Count})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStarFilter('3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              selectedStarFilter === '3'
                ? 'bg-inverse-surface text-inverse-on-surface font-bold'
                : 'bg-surface-card hover:bg-surface-container border border-border-hairline text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-primary fill-1">star</span>
            <span>3 Bintang</span>
            <span className="text-charcoal-subtle text-[11px]">({star3Count})</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-surface-card rounded-2xl p-10 text-center border border-dashed border-border-hairline flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-charcoal-subtle mb-2">rate_review</span>
              <p className="text-sm font-bold text-on-surface">Belum Ada Ulasan</p>
              <p className="text-xs text-charcoal-subtle mt-1">Jadilah yang pertama menuliskan ulasan untuk tempat ini!</p>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-surface-card rounded-2xl p-5 md:p-6 shadow-xs border border-border-hairline flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${rev.bg || 'bg-primary-container'} text-on-surface font-bold flex items-center justify-center text-sm`}
                    >
                      {rev.initials || 'M'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{rev.author}</h4>
                      <span className="text-xs text-charcoal-subtle">{rev.role || 'Mahasiswa Pengguna pNongki!'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-primary">
                    {[...Array(Number(rev.stars || rev.rating) || 5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] fill-1">
                        star
                      </span>
                    ))}
                    <span className="text-xs font-bold text-on-surface ml-1">{Number(rev.rating || 5).toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-sm text-on-surface leading-relaxed">{rev.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6 sticky top-36">
        <form
          onSubmit={handleReviewSubmit}
          className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1 pb-1 border-b border-border-hairline">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-container text-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">rate_review</span>
              </div>
              <h2 className="font-bold text-xl text-on-surface">Tulis Ulasan</h2>
            </div>
            <p className="text-xs text-charcoal-subtle">
              Bagikan review jujur untuk membantu mahasiswa lain menemukan tempat nugas terbaik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-semibold text-on-surface">Beri Skor Tempat Ini:</span>
            <div className="flex items-center gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setUserRating(starVal)}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-[26px] ${
                      starVal <= userRating ? 'text-primary fill-1' : 'text-outline-variant'
                    }`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs text-primary font-bold">
              {RATING_LABELS[userRating - 1]}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="sr-only" htmlFor="review-textarea">
              Tulis Ulasan
            </label>
            <textarea
              id="review-textarea"
              rows={3}
              value={reviewInputText}
              onChange={(e) => setReviewInputText(e.target.value)}
              placeholder="Ceritakan fasilitas, colokan, kecepatan internet, atau menu favorit kamu di sini..."
              className="w-full p-3.5 rounded-xl bg-surface-container-low focus:bg-surface-card focus:outline-none focus:ring-1 focus:ring-on-surface text-on-surface text-sm transition-all resize-none placeholder:text-charcoal-subtle border border-border-hairline"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-on-surface font-medium">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-inverse-surface accent-inverse-surface border-border-hairline cursor-pointer"
            />
            <span>Kirim ulasan sebagai anonim (nama disembunyikan)</span>
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-charcoal-subtle">
              Review kamu membantu komunitas pNongki!
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-black text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            >
              Kirim Ulasan
            </button>
          </div>
        </form>

        {myReview && (
          <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 shadow-xs border border-border-hairline flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-border-hairline">
              <div className="flex items-center gap-1.5 text-on-surface font-bold text-base">
                <span>Ulasan Saya</span>
              </div>
            </div>

            <div className="flex items-start justify-between pt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-surface font-bold flex items-center justify-center text-sm">
                  AU
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-on-surface">{myReview.author}</h4>
                    <span className="text-primary text-xs font-bold">(Kamu)</span>
                  </div>
                  <span className="text-xs text-charcoal-subtle">{myReview.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditReviewText(myReview.text);
                    setEditingMyReview(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer"
                  title="Sunting Ulasan"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMyReview}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-error transition-colors cursor-pointer"
                  title="Hapus Ulasan"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-0.5 text-primary">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[16px] fill-1">
                  star
                </span>
              ))}
              <span className="text-xs font-bold text-on-surface ml-1">{myReview.rating.toFixed(1)}</span>
            </div>

            {editingMyReview ? (
              <div className="flex flex-col gap-2 pt-1">
                <textarea
                  rows={3}
                  value={editReviewText}
                  onChange={(e) => setEditReviewText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-border-hairline focus:outline-none focus:ring-1 focus:ring-on-surface"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingMyReview(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal-subtle hover:bg-surface-container cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditReview}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-inverse-surface text-inverse-on-surface cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-on-surface leading-relaxed">{myReview.text}</p>
            )}

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {myReview.tags?.map((tg, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-medium border border-border-hairline"
                >
                  {tg}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

