import React from 'react';

export default function DetailMenuTab({
  currentPlace,
  selectedMenuCategory,
  setSelectedMenuCategory,
  menuPage,
  setMenuPage,
  filteredMenuItems = [],
  dynamicMenuBookPhotos = [],
  openLightboxWithIndex,
  openLightboxWithImage,
}) {
  const allCategories = Array.from(
    new Set(
      (Array.isArray(currentPlace?.menus) ? currentPlace.menus : [])
        .map((m) => m.category)
        .filter(Boolean)
    )
  );

  const categoryLabelMap = {
    kopi: 'Kopi & Minuman',
    makanan: 'Makanan Utama',
    pastry: 'Pastry & Cemilan',
  };

  return (
    <div className="bg-surface-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xs border border-border-hairline flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-hairline">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[22px]">menu_book</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">Daftar Menu</h2>
            <p className="text-xs text-charcoal-subtle">Harga dan ketersediaan menu diperbarui secara berkala</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          {allCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setSelectedMenuCategory('all');
                  setMenuPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedMenuCategory === 'all'
                    ? 'bg-inverse-surface text-inverse-on-surface font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                Semua Menu
              </button>
              {allCategories.map((catKey) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => {
                    setSelectedMenuCategory(catKey);
                    setMenuPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer capitalize ${
                    selectedMenuCategory === catKey
                      ? 'bg-inverse-surface text-inverse-on-surface font-bold'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {categoryLabelMap[catKey] || catKey}
                </button>
              ))}
            </div>
          )}

          <div className="bg-surface-container-low rounded-xl p-4 md:p-5 flex flex-col gap-3 border border-border-hairline">
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Daftar Menu Pilihan
                </h3>
                {currentPlace.recommendedMenu && (
                  <span className="text-[11px] font-semibold bg-primary-container text-on-surface px-2.5 py-0.5 rounded-full">
                    Andalan: {currentPlace.recommendedMenu}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-charcoal-subtle">
                {filteredMenuItems.length} Menu Ditampilkan
              </span>
            </div>

            {filteredMenuItems.length === 0 ? (
              <div className="p-8 border border-dashed border-border-hairline rounded-2xl bg-surface-card text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[36px] text-charcoal-subtle mb-2">restaurant_menu</span>
                <p className="text-xs font-semibold text-on-surface">Belum ada daftar menu khusus yang diunggah.</p>
                <p className="text-[11px] text-charcoal-subtle mt-1">Pengelola tempat belum mengunggah rincian menu ke sistem.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMenuItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-4 pb-2.5 ${
                      idx !== filteredMenuItems.length - 1 ? 'border-b border-border-hairline/60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <div
                          onClick={() => openLightboxWithImage && openLightboxWithImage(item.image)}
                          className="relative group/thumb cursor-pointer shrink-0 rounded-xl overflow-hidden w-14 h-14"
                          title="Klik untuk memperbesar foto menu"
                        >
                          <img
                            alt={item.name}
                            className="w-full h-full object-cover border border-border-hairline group-hover/thumb:scale-110 transition-transform duration-300"
                            src={item.image}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-charcoal-subtle shrink-0 border border-border-hairline">
                          <span className="material-symbols-outlined text-[24px]">
                            {item.category === 'makanan' ? 'lunch_dining' : item.category === 'pastry' ? 'bakery_dining' : 'local_cafe'}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-on-surface">{item.name}</span>
                          {item.tag && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                item.tagType === 'primary'
                                  ? 'bg-primary-container text-on-primary-container'
                                  : item.tagType === 'success'
                                  ? 'bg-status-open/15 text-status-open'
                                  : 'bg-surface-container text-charcoal-subtle'
                              }`}
                            >
                              {item.tag}
                            </span>
                          )}
                        </div>
                        {item.desc ? (
                          <span className="text-xs text-charcoal-subtle line-clamp-1">{item.desc}</span>
                        ) : null}
                      </div>
                    </div>
                    {item.price ? (
                      <span className="text-sm font-bold text-on-surface shrink-0">{item.price}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredMenuItems.length > 6 && (
            <div className="bg-surface-card rounded-xl p-3 border border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-charcoal-subtle">
                Menampilkan <strong className="text-on-surface font-semibold">1–{filteredMenuItems.length}</strong> dari{' '}
                <strong className="text-on-surface font-semibold">{filteredMenuItems.length}</strong> menu
              </span>
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  disabled={menuPage === 1}
                  onClick={() => setMenuPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-subtle hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMenuPage(1)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                    menuPage === 1
                      ? 'bg-inverse-surface text-inverse-on-surface'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  aria-label="Selanjutnya"
                  disabled={menuPage === 1}
                  onClick={() => setMenuPage((p) => p + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-36">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">photo_camera</span>
              Buku Menu Fisik
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {dynamicMenuBookPhotos.length === 0 ? (
              <div className="p-8 border border-dashed border-border-hairline rounded-2xl bg-surface-card text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-charcoal-subtle mb-1">photo_camera</span>
                <p className="text-xs font-semibold text-on-surface">Buku menu fisik belum tersedia.</p>
                <p className="text-[11px] text-charcoal-subtle mt-0.5">Belum ada foto lembar buku menu yang diunggah.</p>
              </div>
            ) : (
              dynamicMenuBookPhotos.map((book) => (
                <div
                  key={book.id}
                  onClick={() => openLightboxWithImage ? openLightboxWithImage(book.image) : openLightboxWithIndex(0)}
                  className="relative rounded-2xl overflow-hidden bg-surface-container shadow-2xs group border border-border-hairline cursor-pointer aspect-[16/10]"
                >
                  <img
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={book.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-75 group-hover:opacity-60 transition-opacity pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {book.title}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                    <div className="text-white flex flex-col">
                      <span className="text-xs font-bold drop-shadow-sm">{book.caption}</span>
                      <span className="text-[11px] text-white/90">{book.sub}</span>
                    </div>
                    <span className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-white/10">
                      <span className="material-symbols-outlined text-[15px] text-primary-container">fullscreen</span>
                      Perbesar
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-border-hairline">
            <span className="material-symbols-outlined text-primary text-[18px]">info</span>
            <span className="text-xs text-charcoal-subtle">Harga belum termasuk PPN 11% sesuai ketentuan resto.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

