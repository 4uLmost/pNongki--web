import React, { useState } from 'react';
import { MEMBERSHIP_LEVELS } from './membershipData';

export default function LevelMembershipModal({
  isOpen,
  onClose,
  initialIndex = 0,
  userProfile,
  userLevel,
}) {
  const [carouselIndex, setCarouselIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  if (!isOpen) return null;

  const currentLevel = MEMBERSHIP_LEVELS[carouselIndex] || MEMBERSHIP_LEVELS[0];
  const canGoPrev = carouselIndex > 0;
  const canGoNext = carouselIndex < MEMBERSHIP_LEVELS.length - 1;

  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(MEMBERSHIP_LEVELS.length - 1, prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleMouseDown = (e) => {
    setTouchStartX(e.clientX);
    setTouchEndX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (touchStartX !== null) {
      setTouchEndX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#070808]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto custom-scrollbar-dark animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 ease-in-out opacity-65"
        style={{
          background: `radial-gradient(ellipse 75% 65% at 50% 36%, ${currentLevel.ambientColor} 0%, transparent 75%)`,
        }}
      />

      <div
        className="w-full max-w-2xl sm:max-w-3xl relative my-auto max-h-[92vh] overflow-y-auto custom-scrollbar-dark px-2 sm:px-4 py-2 transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-1 right-2 sm:top-2 sm:right-4 z-40 p-2 sm:p-2.5 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="text-center max-w-md mx-auto mb-3 pt-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/60 block mb-1">
            Koleksi Kartu Reputasi XP
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            Tingkatkan Level
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center mb-3 transition-all duration-300">
          {currentLevel.id === userLevel?.id ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/20 backdrop-blur-md animate-in zoom-in-95 duration-200">
              <span className="material-symbols-outlined text-[16px] text-amber-300">
                stars
              </span>
              <span>Yang Sedang Aktif</span>
              <span className="text-amber-200/75 font-semibold text-[11px] hidden sm:inline">
                • Level Kamu Saat Ini
              </span>
            </div>
          ) : userProfile.xpPoints >= currentLevel.minXp ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow-lg shadow-emerald-500/20 backdrop-blur-md animate-in zoom-in-95 duration-200">
              <span className="material-symbols-outlined text-[16px] text-emerald-300">
                check_circle
              </span>
              <span>Yang Sudah Tercapai</span>
              <span className="text-emerald-200/75 font-semibold text-[11px] hidden sm:inline">
                • Sudah Terbuka
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white/10 text-white/85 border border-white/20 shadow-lg backdrop-blur-md animate-in zoom-in-95 duration-200">
              <span className="material-symbols-outlined text-[16px] text-white/60">
                lock
              </span>
              <span>Terkunci</span>
              <span className="text-white/60 font-semibold text-[11px] hidden sm:inline">
                • Butuh {currentLevel.minXp - userProfile.xpPoints} XP lagi
              </span>
            </div>
          )}
        </div>

        <div
          className="relative w-full h-[230px] sm:h-[260px] md:h-[280px] flex items-center justify-center overflow-hidden my-2 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`absolute left-1 sm:left-3 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              canGoPrev
                ? 'bg-black/75 hover:bg-black text-white hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-md'
                : 'bg-black/20 text-white/20 border border-white/5 cursor-not-allowed opacity-0 pointer-events-none'
            }`}
            aria-label="Kartu Sebelumnya"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_left</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            className={`absolute right-1 sm:right-3 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              canGoNext
                ? 'bg-black/75 hover:bg-black text-white hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-md'
                : 'bg-black/20 text-white/20 border border-white/5 cursor-not-allowed opacity-0 pointer-events-none'
            }`}
            aria-label="Kartu Berikutnya"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_right</span>
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {MEMBERSHIP_LEVELS.map((lvl, idx) => {
              const offset = idx - carouselIndex;
              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isLocked = userProfile.xpPoints < lvl.minXp;

              let transformStyle = '';
              let zIndex = 10;
              let opacity = 0;
              let cursorClass = 'pointer-events-none';

              if (isCenter) {
                transformStyle = 'translate(-50%, -50%) scale(1)';
                zIndex = 30;
                opacity = 1;
                cursorClass = 'cursor-default';
              } else if (isLeft) {
                transformStyle = 'translate(calc(-50% - 130px), -50%) scale(0.88)';
                zIndex = 20;
                opacity = 0.45;
                cursorClass = 'cursor-pointer hover:opacity-75';
              } else if (isRight) {
                transformStyle = 'translate(calc(-50% + 130px), -50%) scale(0.88)';
                zIndex = 20;
                opacity = 0.45;
                cursorClass = 'cursor-pointer hover:opacity-75';
              } else if (offset < -1) {
                transformStyle = 'translate(calc(-50% - 240px), -50%) scale(0.75)';
                zIndex = 10;
                opacity = 0;
              } else if (offset > 1) {
                transformStyle = 'translate(calc(-50% + 240px), -50%) scale(0.75)';
                zIndex = 10;
                opacity = 0;
              }

              return (
                <div
                  key={lvl.id}
                  onClick={() => {
                    if (isLeft) handlePrev();
                    if (isRight) handleNext();
                  }}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease',
                  }}
                  className={`absolute left-1/2 top-1/2 w-[280px] sm:w-[340px] md:w-[380px] aspect-[1.586/1] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl border flex flex-col justify-between overflow-hidden ${lvl.cardBg} ${cursorClass}`}
                >
                  <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/5 blur-xl pointer-events-none" />
                  <div className="absolute right-1 bottom-0 opacity-5 pointer-events-none font-black text-8xl tracking-tighter select-none">
                    XP
                  </div>

                  {isLocked && (
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-[1.5px] rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center z-20 pointer-events-none transition-opacity duration-300">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/85 border border-white/20 shadow-2xl flex items-center justify-center text-white/95">
                        <span className="material-symbols-outlined text-[26px] sm:text-[30px]">
                          lock
                        </span>
                      </div>
                      <span className="mt-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white/95 bg-black/70 px-2.5 py-0.5 rounded-full border border-white/15 shadow-sm">
                        Terkunci • Butuh {lvl.minXp - userProfile.xpPoints} XP lagi
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between relative z-10 w-full">
                    <span className="text-sm sm:text-base font-black tracking-wider uppercase opacity-95">
                      pNongki<span className={lvl.accentColor}>!</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border shadow-2xs backdrop-blur-xs ${lvl.badgeStyle}`}
                    >
                      <span className="material-symbols-outlined text-[13px] sm:text-[14px]">
                        {lvl.icon}
                      </span>
                      <span>{lvl.name}</span>
                    </span>
                  </div>

                  <div className="relative z-10 flex items-end justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest opacity-70 mb-0.5">
                        <span className="material-symbols-outlined text-[12px] sm:text-[13px]">
                          military_tech
                        </span>
                        <span>TOTAL REPUTASI XP</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                          {userProfile.xpPoints}
                        </span>
                        <span className={`text-xs sm:text-sm font-black tracking-wider ${lvl.accentColor}`}>
                          XP
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold tracking-wider opacity-60 block">
                        Ambang Batas
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold opacity-90">
                        {lvl.minXp === 0 ? '0 XP' : `${lvl.minXp}+ XP`}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 pt-2 border-t border-white/10">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium opacity-80">
                        <span>
                          {lvl.id === 'master'
                            ? 'Level Tertinggi Tercapai'
                            : `Menuju ${MEMBERSHIP_LEVELS[idx + 1]?.name || 'Next'}`}
                        </span>
                        <span className="font-bold">
                          {lvl.id === 'master'
                            ? '1.000+ XP'
                            : `${userProfile.xpPoints} / ${lvl.maxXp + 1} XP`}
                        </span>
                      </div>
                      <div
                        className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden p-0.5 ${lvl.progressBg}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${lvl.progressFill}`}
                          style={{
                            width: `${
                              userProfile.xpPoints >=
                              (lvl.maxXp === Infinity ? lvl.minXp : lvl.maxXp + 1)
                                ? 100
                                : Math.min(
                                    100,
                                    Math.round(
                                      (userProfile.xpPoints /
                                        (lvl.maxXp === Infinity
                                          ? lvl.minXp
                                          : lvl.maxXp + 1)) *
                                        100
                                    )
                                  )
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] sm:text-xs pt-0.5">
                      <span className="font-bold uppercase tracking-wider opacity-90">
                        {userProfile.name}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-wider opacity-75">
                        {lvl.tierName.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          {MEMBERSHIP_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setCarouselIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === carouselIndex
                  ? `w-8 ${
                      lvl.id === 'master'
                        ? 'bg-primary-container shadow-md shadow-primary-container/40'
                        : lvl.id === 'sepuh'
                        ? 'bg-amber-400 shadow-md shadow-amber-400/40'
                        : lvl.id === 'nugas'
                        ? 'bg-blue-400 shadow-md shadow-blue-400/40'
                        : 'bg-slate-300 shadow-md shadow-slate-300/40'
                    }`
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
              aria-label={`Pilih level ${lvl.name}`}
            />
          ))}
        </div>

        <div className="rounded-3xl border border-white/15 bg-black/45 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl text-white transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">
                    {currentLevel.icon}
                  </span>
                </div>
                <h4 className="font-black text-lg sm:text-xl text-white">
                  {currentLevel.name}
                </h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80">
                  {currentLevel.tierName}
                </span>
              </div>
              <p className="text-xs text-white/75 mt-1.5 leading-relaxed font-normal">
                {currentLevel.description}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">
                Ambang Batas XP
              </span>
              <span className="font-black text-base sm:text-lg text-primary-container">
                {currentLevel.minXp === 0 ? '0 XP' : `${currentLevel.minXp}+ XP`}
              </span>
            </div>
          </div>

          <div className="pt-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-2.5">
              Privilege &amp; Keuntungan Level Ini:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentLevel.perks.map((perk, pIdx) => {
                const isUnlocked = userProfile.xpPoints >= currentLevel.minXp;
                return (
                  <li
                    key={pIdx}
                    className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 transition-colors"
                  >
                    <span
                      className={`material-symbols-outlined text-[17px] shrink-0 mt-0.5 ${
                        isUnlocked ? 'text-primary-container' : 'text-white/35'
                      }`}
                    >
                      {isUnlocked ? 'check_circle' : 'lock'}
                    </span>
                    <span
                      className={`leading-relaxed text-xs ${
                        isUnlocked ? 'text-white font-medium' : 'text-white/55'
                      }`}
                    >
                      {perk}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-2">
              Cara Cepat Mengumpulkan XP Reputasi:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.05] border border-white/10">
                <span className="font-black text-primary-container block text-xs sm:text-sm">
                  +50 XP
                </span>
                <span className="text-white/60 text-[10px] sm:text-[11px] block mt-0.5">
                  Tambah Tempat
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.05] border border-white/10">
                <span className="font-black text-primary-container block text-xs sm:text-sm">
                  +20 XP
                </span>
                <span className="text-white/60 text-[10px] sm:text-[11px] block mt-0.5">
                  Tulis Ulasan
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.05] border border-white/10">
                <span className="font-black text-primary-container block text-xs sm:text-sm">
                  +15 XP
                </span>
                <span className="text-white/60 text-[10px] sm:text-[11px] block mt-0.5">
                  Ajak Nongkrong
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.05] border border-white/10">
                <span className="font-black text-primary-container block text-xs sm:text-sm">
                  +10 XP
                </span>
                <span className="text-white/60 text-[10px] sm:text-[11px] block mt-0.5">
                  Utas Diskusi
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shadow-md"
            >
              Tutup Jendela
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

