import React from 'react';

export default function RewardCatalogTab({
  selectedRewardType,
  setSelectedRewardType,
  pointsBalance = 0,
  isLoadingProfileData,
  profileLoadError,
  loadProfileData,
  filteredRewards = [],
  handleInitiateRedeem,
}) {
  return (
    <div id="katalog-reward-section" className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-card rounded-2xl p-4 border border-border-hairline shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-charcoal-subtle font-semibold mr-1">Tipe:</span>
          {[
            { id: 'all', label: 'Semua Hadiah' },
            { id: 'voucher', label: '☕ Voucer Kafe Mitra' },
            { id: 'merchandise', label: '🎒 Merchandise Resmi' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedRewardType(type.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedRewardType === type.id
                  ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-charcoal-subtle font-medium">
          Saldo Poin Kamu:{' '}
          <strong className="text-primary font-bold text-sm">
            {pointsBalance} Poin
          </strong>
        </div>
      </div>

      {isLoadingProfileData ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-charcoal-subtle mt-2">
            Memuat katalog hadiah &amp; voucer...
          </p>
        </div>
      ) : profileLoadError ? (
        <div className="p-10 text-center bg-surface-card rounded-3xl border border-dashed border-error/40 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">wifi_off</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">Gagal Memuat Katalog</h4>
          <p className="text-xs text-charcoal-subtle max-w-sm">{profileLoadError}</p>
          <button
            type="button"
            onClick={loadProfileData}
            className="mt-1 px-4 py-2 rounded-xl bg-primary-container text-on-primary-fixed hover:bg-accent-hover font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : filteredRewards.length === 0 ? (
        <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-charcoal-subtle">
            redeem
          </span>
          <h3 className="font-bold text-base text-on-surface">Tidak ada hadiah untuk kategori ini</h3>
          <p className="text-xs text-charcoal-subtle">Silakan pilih kategori hadiah lainnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRewards.map((reward) => {
            const canAfford = pointsBalance >= reward.pointCost;
            const isOutOfStock = reward.stock <= 0;

            return (
              <div
                key={reward.id}
                className="bg-surface-card rounded-3xl border border-border-hairline p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md hover:border-outline-variant"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden mb-3.5 h-44 bg-surface-container-low border border-border-hairline">
                    <img
                      src={reward.imageUrl}
                      alt={reward.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-2xs ${
                        reward.type === 'merchandise'
                          ? 'bg-purple-900/80 text-white'
                          : 'bg-amber-900/80 text-white'
                      }`}
                    >
                      {reward.type === 'merchandise' ? 'Merchandise' : 'Voucer Digital'}
                    </span>

                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                      Sisa: {reward.stock} unit
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle">
                    {reward.merchant}
                  </span>
                  <h3 className="font-bold text-sm md:text-base text-on-surface mt-0.5 leading-snug">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-charcoal-subtle line-clamp-2 mt-1 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-hairline flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-subtle block">
                      Biaya Tukar
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-primary">
                        {reward.pointCost}
                      </span>
                      <span className="text-xs font-semibold text-on-surface">Poin</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canAfford || isOutOfStock}
                    onClick={() => handleInitiateRedeem(reward)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs ${
                      isOutOfStock
                        ? 'bg-surface-container text-charcoal-subtle cursor-not-allowed'
                        : canAfford
                        ? 'bg-inverse-surface hover:bg-black text-inverse-on-surface cursor-pointer active:scale-95'
                        : 'bg-surface-container-high text-charcoal-subtle cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isOutOfStock ? 'block' : canAfford ? 'shopping_bag' : 'lock'}
                    </span>
                    <span>
                      {isOutOfStock
                        ? 'Stok Habis'
                        : canAfford
                        ? 'Tukar Hadiah'
                        : 'Poin Kurang'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

