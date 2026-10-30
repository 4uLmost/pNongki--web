import React from 'react';

export default function ExplorePagination({
  totalItems,
  startIndex,
  endIndex,
  safeCurrentPage,
  totalPages,
  onPageChange,
}) {

  return (
    <div className="p-4 rounded-2xl border border-border-hairline bg-surface-card flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs mt-2">
      <span className="text-xs text-charcoal-subtle font-medium">
        Menampilkan {startIndex + 1}–{endIndex} dari {totalItems} spot terdaftar
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => {
            onPageChange(Math.max(1, safeCurrentPage - 1));
            window.scrollTo({ top: 140, behavior: 'smooth' });
          }}
          className="w-8 h-8 rounded-lg border border-border-hairline flex items-center justify-center text-charcoal-subtle disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface transition-colors cursor-pointer"
          aria-label="Halaman sebelumnya"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === safeCurrentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => {
                onPageChange(pageNum);
                window.scrollTo({ top: 140, behavior: 'smooth' });
              }}
              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
                  : 'border border-border-hairline hover:bg-surface text-on-surface'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={safeCurrentPage === totalPages}
          onClick={() => {
            onPageChange(Math.min(totalPages, safeCurrentPage + 1));
            window.scrollTo({ top: 140, behavior: 'smooth' });
          }}
          className="w-8 h-8 rounded-lg border border-border-hairline hover:bg-surface text-on-surface flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Halaman berikutnya"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

