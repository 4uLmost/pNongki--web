import React from 'react';

export default function DetailHeroGallery({
  dynamicSlides = [],
  currentSlideIndex = 0,
  currentSlide,
  setIsCarouselHovered,
  handlePrevSlide,
  handleNextSlide,
  handleGoToSlide,
  openLightboxWithIndex,
  openLightboxWithImage,
}) {
  // Filter foto area/fasilitas
  const venueSlides = dynamicSlides.filter((s) => s.category === 'venue');
  // Card 1: Foto area venue kedua (misal: Area Outdoor / Santai)
  const card1Slide = venueSlides[1] || dynamicSlides[1] || dynamicSlides[0];

  // Card 2: Foto Menu Fisik Saja (bukan daftar menu rekomendasi)
  const physicalMenuSlide = dynamicSlides.find((s) => s.category === 'physical_menu');
  const card2Slide = physicalMenuSlide || venueSlides[2] || dynamicSlides[2] || dynamicSlides[0];

  // Card 3: Foto latar tombol Lihat Galeri Foto
  const card3Slide = venueSlides[3] || dynamicSlides[3] || dynamicSlides[0];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Banner Utama / Carousel Kiri */}
        <div className="lg:col-span-8 flex flex-col gap-2.5">
          <div
            className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10] bg-surface-container shadow-xs group select-none border border-border-hairline"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <div className="w-full h-full relative overflow-hidden">
              {dynamicSlides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    idx === currentSlideIndex
                      ? 'opacity-100 z-10 pointer-events-auto'
                      : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    src={slide.image}
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

            <div className="absolute top-4 left-4 z-20 pointer-events-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                <span>{currentSlideIndex + 1} / {dynamicSlides.length}</span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Foto Sebelumnya"
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
            </button>
            <button
              type="button"
              aria-label="Foto Selanjutnya"
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_right</span>
            </button>

            {currentSlide && (
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between pointer-events-auto z-20">
                <div className="text-white flex flex-col gap-1 max-w-[85%]">
                  <span className="bg-primary-container text-on-surface text-[10px] px-2.5 py-0.5 rounded-full w-fit uppercase font-bold tracking-wider">
                    {currentSlide.badge}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-sm">
                    {currentSlide.title}
                  </h3>
                </div>
                <span className="hidden sm:inline-flex bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold items-center gap-1.5 border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-[15px] text-primary-container">photo_camera</span>
                  <span>{currentSlide.tag}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Slot Foto Sebelah Kanan */}
        <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-4">
          {/* Slot 1: Foto Suasana / Area Lainnya */}
          <div
            onClick={() => {
              const idx = dynamicSlides.findIndex((s) => s.image === card1Slide?.image);
              if (idx !== -1) handleGoToSlide(idx);
            }}
            className="relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-[16/7] bg-surface-container shadow-2xs group cursor-pointer border border-border-hairline"
          >
            <img
              alt={card1Slide?.title || 'Area Santai'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={card1Slide?.image}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
            <span className="absolute bottom-2.5 left-3 text-xs md:text-sm font-semibold text-white drop-shadow line-clamp-1">
              {card1Slide?.title || 'Area Santai'}
            </span>
          </div>

          {/* Slot 2: Foto Menu Fisik Saja */}
          <div
            onClick={() => {
              if (physicalMenuSlide?.image) {
                if (openLightboxWithImage) {
                  openLightboxWithImage(physicalMenuSlide.image);
                } else {
                  const idx = dynamicSlides.findIndex((s) => s.image === physicalMenuSlide.image);
                  if (idx !== -1) openLightboxWithIndex(idx);
                }
              } else {
                const idx = dynamicSlides.findIndex((s) => s.image === card2Slide?.image);
                if (idx !== -1) handleGoToSlide(idx);
              }
            }}
            className="relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-[16/7] bg-surface-container shadow-2xs group cursor-pointer border border-border-hairline"
          >
            <img
              alt={physicalMenuSlide ? 'Buku Menu Fisik' : card2Slide?.title || 'Suasana Tempat'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={card2Slide?.image}
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors" />
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/10">
                {physicalMenuSlide ? 'Menu Fisik' : card2Slide?.badge || 'Suasana'}
              </span>
            </div>
            <span className="absolute bottom-2.5 left-3 text-xs md:text-sm font-semibold text-white drop-shadow line-clamp-1">
              {physicalMenuSlide ? 'Buku Menu Fisik' : card2Slide?.title || 'Suasana Tempat'}
            </span>
          </div>

          {/* Slot 3: Tombol Lihat Galeri Foto */}
          <div
            onClick={() => openLightboxWithIndex(0)}
            className="relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-[16/7] bg-surface-container shadow-2xs group cursor-pointer border border-border-hairline"
          >
            <img
              alt={card3Slide?.title || 'Area Tambahan'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={card3Slide?.image}
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors flex items-center justify-center flex-col gap-1 text-center p-2">
              <span className="material-symbols-outlined text-[24px] text-white">grid_view</span>
              <span className="text-xs md:text-sm font-bold text-white">
                {dynamicSlides.length > 3 ? `+${dynamicSlides.length - 2} Foto Lainnya` : 'Lihat Galeri Foto'}
              </span>
              <span className="text-[11px] text-white/80 hidden sm:block">Fasilitas, Menu & Suasana</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
