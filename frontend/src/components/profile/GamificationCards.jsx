import React from 'react';

export default function GamificationCards({
  userProfile,
  activeCardLevel,
  nextLevel,
  onOpenLevelModal,
  onGoToRewardCatalog,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        onClick={onOpenLevelModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenLevelModal();
          }
        }}
        className={`rounded-3xl p-6 shadow-xl border flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300 cursor-pointer group hover:scale-[1.01] hover:shadow-2xl ${activeCardLevel.cardBg}`}
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none font-black text-9xl tracking-tighter select-none">
          XP
        </div>

        <div className="flex items-center justify-between relative z-10 w-full">
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-black tracking-wider uppercase opacity-95">
              pNongki<span className={activeCardLevel.accentColor}>!</span>
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs backdrop-blur-xs ${activeCardLevel.badgeStyle}`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {activeCardLevel.icon}
            </span>
            <span>{activeCardLevel.name}</span>
          </span>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest opacity-70 mb-0.5">
              <span className="material-symbols-outlined text-[13px]">military_tech</span>
              <span>TOTAL REPUTASI XP</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {userProfile.xpPoints}
              </span>
              <span className={`text-sm font-black tracking-wider ${activeCardLevel.accentColor}`}>
                XP
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-2.5 pt-2 border-t border-white/10">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium opacity-80">
              <span>
                {nextLevel
                  ? `Progres menuju ${nextLevel.name}`
                  : 'Level Tertinggi Tercapai!'}
              </span>
              <span className="font-bold">
                {nextLevel
                  ? `${userProfile.xpPoints} / ${nextLevel.minXp} XP (${nextLevel.minXp - userProfile.xpPoints} XP lagi)`
                  : '1.000+ XP'}
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden p-0.5 ${activeCardLevel.progressBg}`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${activeCardLevel.progressFill}`}
                style={{
                  width: `${
                    !nextLevel
                      ? 100
                      : Math.min(
                          100,
                          Math.max(
                            5,
                            Math.round((userProfile.xpPoints / nextLevel.minXp) * 100)
                          )
                        )
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold uppercase tracking-wider opacity-90">
              {userProfile.name}
            </span>
            <span className="text-[11px] font-mono tracking-wider opacity-75">
              {activeCardLevel.tierName.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-3xl p-6 shadow-xs border border-border-hairline flex flex-col justify-between gap-5 relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-charcoal-subtle tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px] text-primary">savings</span>
              <span>SALDO POIN TUKAR</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface">
                {userProfile.pointsBalance}
              </h2>
              <span className="text-xs font-bold text-primary">Poin Aktif</span>
            </div>
            <p className="text-xs text-charcoal-subtle mt-1">
              Poin reward yang dapat ditukarkan dengan berbagai penawaran menarik.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface shadow-2xs">
            <span className="material-symbols-outlined text-[24px]">redeem</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-surface-container-low border border-border-hairline flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-charcoal-subtle">
              event_repeat
            </span>
            <span className="text-charcoal-subtle">Kedaluwarsa Saldo:</span>
          </div>
          <span className="font-bold text-on-surface">{userProfile.pointsExpiry}</span>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-charcoal-subtle">
            Tukarkan dengan voucer kafe atau merchandise resmi
          </span>
          <button
            type="button"
            onClick={onGoToRewardCatalog}
            className="px-4 py-2 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <span>Tukar Sekarang</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

