import React, { useState, useEffect, useMemo } from 'react';

export default function DetailLightboxModal({
  isOpen,
  onClose,
  slides = [],
  currentIndex = 0,
  setCurrentIndex,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const venueCount = useMemo(
    () =>
      slides.filter(
        (s) =>
          !s.category ||
          s.category === 'venue' ||
          s.category === 'indoor' ||
          s.category === 'outdoor' ||
          s.category === 'facility'
      ).length,
    [slides]
  );
  const menuCount = useMemo(() => slides.filter((s) => s.category === 'menu').length, [slides]);
  const menuBookCount = useMemo(
    () => slides.filter((s) => s.category === 'physical_menu').length,
    [slides]
  );

  const categories = useMemo(() => {
    const list = [{ id: 'all', label: 'Semua Foto', count: slides.length }];
    if (venueCount > 0) {
      list.push({ id: 'venue', label: 'Area & Fasilitas', count: venueCount });
    }
    if (menuCount > 0) {
      list.push({ id: 'menu', label: 'Daftar Menu', count: menuCount });
    }
    if (menuBookCount > 0) {
      list.push({ id: 'physical_menu', label: 'Buku Menu Fisik', count: menuBookCount });
    }
    return list;
  }, [slides.length, venueCount, menuCount, menuBookCount]);

  const filteredSlides = useMemo(() => {
    if (selectedCategory === 'all') return slides;
    if (selectedCategory === 'venue') {
      return slides.filter(
        (s) =>
          !s.category ||
          s.category === 'venue' ||
          s.category === 'indoor' ||
          s.category === 'outdoor' ||
          s.category === 'facility'
      );
    }
    return slides.filter((s) => s.category === selectedCategory);
  }, [slides, selectedCategory]);

  const currentSlide = slides[currentIndex] || slides[0];

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') return;
    const targetIdx = slides.findIndex((s) => {
      if (catId === 'venue') {
        return (
          !s.category ||
          s.category === 'venue' ||
          s.category === 'indoor' ||
          s.category === 'outdoor' ||
          s.category === 'facility'
        );
      }
      return s.category === catId;
    });
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    }
  };

  const handlePrev = () => {
    if (filteredSlides.length === 0) return;
    const currentInFiltered = filteredSlides.findIndex((s) => s.image === currentSlide?.image);
    const prevInFiltered =
      currentInFiltered <= 0 ? filteredSlides.length - 1 : currentInFiltered - 1;
    const targetSlide = filteredSlides[prevInFiltered];
    const globalIdx = slides.findIndex((s) => s.image === targetSlide?.image);
    if (globalIdx !== -1) setCurrentIndex(globalIdx);
  };

  const handleNext = () => {
    if (filteredSlides.length === 0) return;
    const currentInFiltered = filteredSlides.findIndex((s) => s.image === currentSlide?.image);
    const nextInFiltered =
      currentInFiltered === -1 || currentInFiltered >= filteredSlides.length - 1
        ? 0
        : currentInFiltered + 1;
    const targetSlide = filteredSlides[nextInFiltered];
    const globalIdx = slides.findIndex((s) => s.image === targetSlide?.image);
    if (globalIdx !== -1) setCurrentIndex(globalIdx);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen || slides.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      {/* Top Header: Categories & Close button */}
      <div
        className="w-full max-w-5xl flex items-center justify-between gap-3 mb-2 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-fixed shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-black/15 text-on-primary-fixed' : 'bg-white/15 text-white'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Galeri"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer transition-colors shrink-0 ml-2"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
      </div>

      {/* Center: Main Image with Nav Arrows */}
      <div
        className="relative max-w-5xl w-full flex-1 flex items-center justify-center min-h-[300px] max-h-[72vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-h-[68vh] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 flex items-center justify-center">
          <img
            alt={currentSlide?.title || 'Foto Galeri'}
            src={currentSlide?.image}
            className="w-full h-full object-contain"
          />

          {/* Badge Kategori di Pojok Kiri Atas Foto */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span>{currentSlide?.badge || 'Foto Tempat'}</span>
            </span>
          </div>

          {/* Navigation Arrows on image */}
          <button
            type="button"
            aria-label="Foto Sebelumnya"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">chevron_left</span>
          </button>
          <button
            type="button"
            aria-label="Foto Selanjutnya"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Bottom Info & Thumbnails Bar */}
      <div
        className="w-full max-w-5xl flex flex-col gap-3 mt-3 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-white px-1">
          <div className="flex flex-col">
            <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-sm">
              {currentSlide?.title}
            </h4>
            {currentSlide?.desc && (
              <p className="text-xs text-white/75 drop-shadow-sm">{currentSlide.desc}</p>
            )}
          </div>
          <div className="text-xs font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full shrink-0 border border-white/10">
            {currentIndex + 1} / {slides.length}
          </div>
        </div>

        {/* Thumbnails strip for active category */}
        {filteredSlides.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/20">
            {filteredSlides.map((slide, sIdx) => {
              const isSelected = slide.image === currentSlide?.image;
              const globalIdx = slides.findIndex((s) => s.image === slide.image);
              return (
                <button
                  key={slide.id || sIdx}
                  type="button"
                  onClick={() => {
                    if (globalIdx !== -1) setCurrentIndex(globalIdx);
                  }}
                  className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    alt={slide.title}
                    src={slide.image}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
