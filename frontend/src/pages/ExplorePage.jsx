import React, { useState, useMemo, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import {
  isPlaceNew,
  isPlaceTrending,
  isPlacePartner,
  EXPLORE_STATE_KEY,
  getSavedExploreState,
} from '../components/explore/exploreData';
import ExploreSearchBar from '../components/explore/ExploreSearchBar';
import ExploreFilterSidebar from '../components/explore/ExploreFilterSidebar';
import ExplorePlaceCard from '../components/explore/ExplorePlaceCard';
import ExplorePagination from '../components/explore/ExplorePagination';

export { isPlaceNew, isPlaceTrending, isPlacePartner };

export default function ExplorePage({
  places = [],
  isLoading: propIsLoading = false,
  loadError: propLoadError = null,
  onRetry: propOnRetry,
  favorites = [],
  onToggleFavorite,
  onSelectPlace,
  currentCity,
  onOpenLocationModal,
  initialCategory = 'all',
  initialQuery = '',
}) {
  const savedState = useMemo(() => getSavedExploreState(), []);
  const hasExplicitPropFilter = Boolean(initialQuery || (initialCategory && initialCategory !== 'all'));

  const [searchQuery, setSearchQuery] = useState(() => {
    if (initialQuery) return initialQuery;
    if (savedState && savedState.searchQuery !== undefined) return savedState.searchQuery;
    return '';
  });

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialCategory && initialCategory !== 'all') return initialCategory;
    if (savedState && savedState.selectedCategory !== undefined) return savedState.selectedCategory;
    return 'all';
  });

  const [openNowOnly, setOpenNowOnly] = useState(() => {
    if (!hasExplicitPropFilter && savedState && savedState.openNowOnly !== undefined) {
      return Boolean(savedState.openNowOnly);
    }
    return false;
  });

  const [open24HoursOnly, setOpen24HoursOnly] = useState(() => {
    if (!hasExplicitPropFilter && savedState && savedState.open24HoursOnly !== undefined) {
      return Boolean(savedState.open24HoursOnly);
    }
    return false;
  });

  const [selectedFacilities, setSelectedFacilities] = useState(() => {
    if (!hasExplicitPropFilter && savedState && Array.isArray(savedState.selectedFacilities)) {
      return savedState.selectedFacilities;
    }
    return [];
  });

  const [minRating, setMinRating] = useState(() => {
    if (!hasExplicitPropFilter && savedState && savedState.minRating !== undefined) {
      return savedState.minRating;
    }
    return 'all';
  });

  const [maxDistance, setMaxDistance] = useState(() => {
    if (!hasExplicitPropFilter && savedState && typeof savedState.maxDistance === 'number') {
      return savedState.maxDistance;
    }
    return 20;
  });

  const [currentPageNum, setCurrentPageNum] = useState(() => {
    if (!hasExplicitPropFilter && savedState && typeof savedState.currentPageNum === 'number' && savedState.currentPageNum > 0) {
      return savedState.currentPageNum;
    }
    return 1;
  });

  const [backendPlaces, setBackendPlaces] = useState(places);
  const [isLoading, setIsLoading] = useState(propIsLoading || false);
  const [loadError, setLoadError] = useState(propLoadError || null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const prevInitialQuery = useRef(initialQuery);
  const prevInitialCategory = useRef(initialCategory);

  useEffect(() => {
    if (prevInitialQuery.current !== initialQuery) {
      prevInitialQuery.current = initialQuery;
      setSearchQuery(initialQuery || '');
      setCurrentPageNum(1);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (prevInitialCategory.current !== initialCategory) {
      prevInitialCategory.current = initialCategory;
      setSelectedCategory(initialCategory || 'all');
      setCurrentPageNum(1);
    }
  }, [initialCategory]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPageNum(1);
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, openNowOnly, open24HoursOnly, selectedFacilities, minRating, maxDistance]);

  useEffect(() => {
    try {
      const stateToSave = {
        currentPageNum,
        searchQuery,
        selectedCategory,
        openNowOnly,
        open24HoursOnly,
        selectedFacilities,
        minRating,
        maxDistance,
      };
      const existing = getSavedExploreState();
      if (existing && typeof existing.scrollY === 'number') {
        stateToSave.scrollY = existing.scrollY;
      }
      sessionStorage.setItem(EXPLORE_STATE_KEY, JSON.stringify(stateToSave));
    } catch {}
  }, [currentPageNum, searchQuery, selectedCategory, openNowOnly, open24HoursOnly, selectedFacilities, minRating, maxDistance]);

  useEffect(() => {
    let scrollTimeout;
    const handleScrollPos = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        try {
          const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
          const existing = getSavedExploreState();
          if (existing) {
            existing.scrollY = currentScroll;
            sessionStorage.setItem(EXPLORE_STATE_KEY, JSON.stringify(existing));
          }
        } catch {}
      }, 150);
    };

    window.addEventListener('scroll', handleScrollPos, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScrollPos);
    };
  }, []);

  const hasRestoredScroll = useRef(false);

  useEffect(() => {
    if (hasRestoredScroll.current) return;
    const saved = getSavedExploreState();
    if (saved && typeof saved.scrollY === 'number' && saved.scrollY > 0) {
      if (!isLoading && backendPlaces.length > 0) {
        hasRestoredScroll.current = true;
        const timer = setTimeout(() => {
          window.scrollTo({
            top: saved.scrollY,
            behavior: 'instant' in window ? 'instant' : 'auto',
          });
        }, 60);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, backendPlaces.length]);

  const handleSelectPlaceWithState = (place) => {
    try {
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      sessionStorage.setItem(
        EXPLORE_STATE_KEY,
        JSON.stringify({
          currentPageNum,
          searchQuery,
          selectedCategory,
          openNowOnly,
          open24HoursOnly,
          selectedFacilities,
          minRating,
          maxDistance,
          scrollY: currentScroll,
        })
      );
    } catch {}
    if (onSelectPlace) {
      onSelectPlace(place);
    }
  };

  const fetchPlacesData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await api.getPlaces();
      if (Array.isArray(data) && data.length > 0) {
        setBackendPlaces(data);
      } else {
        setBackendPlaces([]);
      }
    } catch (err) {
      console.warn('Gagal memuat tempat dari backend di Explore:', err);
      setBackendPlaces([]);
      setLoadError('Gagal memuat daftar tempat dari server database. Silakan periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (propOnRetry) propOnRetry();
    fetchPlacesData();
  };

  useEffect(() => {
    if (Array.isArray(places) && places.length > 0) {
      setBackendPlaces(places);
      setLoadError(null);
    }
  }, [places]);

  useEffect(() => {
    if (propLoadError) {
      setLoadError(propLoadError);
    }
  }, [propLoadError]);

  useEffect(() => {
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading);
    }
  }, [propIsLoading]);

  useEffect(() => {
    if (!places || places.length === 0) {
      fetchPlacesData();
    }
  }, []);

  const { spotCategories, specialCategories } = useMemo(() => {
    const counts = {
      all: backendPlaces.length,
      'baru-ditambahkan': 0,
      trending: 0,
      partnership: 0,
      nugas: 0,
      nongkrong: 0,
      olahraga: 0,
      'fasilitas-umum': 0,
    };

    backendPlaces.forEach((p) => {
      if (!p) return;
      const key = (p.categoryKey || p.category || '').toLowerCase();
      if (key.includes('nugas') || key.includes('co-working')) counts.nugas++;
      else if (key.includes('nongkrong') || key.includes('chill') || key.includes('kopi')) counts.nongkrong++;
      else if (key.includes('olahraga')) counts.olahraga++;
      else if (key.includes('fasilitas') || key.includes('publik')) counts['fasilitas-umum']++;

      if (isPlaceNew(p)) counts['baru-ditambahkan']++;
      if (isPlaceTrending(p)) counts.trending++;
      if (isPlacePartner(p)) counts.partnership++;
    });

    const spot = [
      { id: 'all', label: 'Semua Spot', icon: 'explore', count: counts.all },
      { id: 'nugas', label: 'Nugas & Kerja', icon: 'laptop_mac', count: counts.nugas },
      { id: 'nongkrong', label: 'Nongkrong & Chill', icon: 'local_cafe', count: counts.nongkrong },
      { id: 'olahraga', label: 'Olahraga & Aktivitas', icon: 'sports_tennis', count: counts.olahraga },
      { id: 'fasilitas-umum', label: 'Fasilitas Publik', icon: 'account_balance', count: counts['fasilitas-umum'] },
    ];

    const special = [
      { id: 'baru-ditambahkan', label: 'Baru Ditambahkan', icon: 'auto_awesome', count: counts['baru-ditambahkan'] },
      { id: 'trending', label: 'Trending', icon: 'local_fire_department', count: counts.trending },
      { id: 'partnership', label: 'Partnership', icon: 'handshake', count: counts.partnership },
    ];

    return { spotCategories: spot, specialCategories: special };
  }, [backendPlaces]);

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOpenNowOnly(false);
    setOpen24HoursOnly(false);
    setSelectedFacilities([]);
    setMinRating('all');
    setMaxDistance(20);
    setCurrentPageNum(1);
    try {
      sessionStorage.removeItem(EXPLORE_STATE_KEY);
    } catch {}
  };

  const filteredPlaces = useMemo(() => {
    const filtered = backendPlaces.filter((place) => {
      if (!place) return false;
      if (place.status && place.status !== 'approved') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (place.name || '').toLowerCase().includes(q);
        const matchesLoc = (place.location || place.city || place.address || '').toLowerCase().includes(q);
        const matchesAddr = (place.address || '').toLowerCase().includes(q);
        const matchesBadges = Array.isArray(place.badges) && place.badges.some((b) => typeof b === 'string' && b.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesAddr && !matchesBadges) return false;
      }

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'baru-ditambahkan' || selectedCategory === 'baru') {
          if (!isPlaceNew(place)) return false;
        } else if (selectedCategory === 'trending') {
          if (!isPlaceTrending(place)) return false;
        } else if (selectedCategory === 'partnership') {
          if (!isPlacePartner(place)) return false;
        } else {
          const targetCat = selectedCategory.toLowerCase().replace('-', '_');
          const placeCat = (place.categoryKey || place.category || '').toLowerCase().replace('-', '_');
          const isMatch =
            placeCat.includes(targetCat) ||
            targetCat.includes(placeCat) ||
            (targetCat.includes('fasilitas') && (placeCat.includes('fasilitas') || placeCat.includes('publik')));
          if (!isMatch) return false;
        }
      }

      if (openNowOnly && !place.isOpenNow) {
        return false;
      }

      if (open24HoursOnly && !place.is24Hours) {
        return false;
      }

      if (selectedFacilities.length > 0) {
        const hasAllFacilities = selectedFacilities.every((fac) => {
          const subTerms = fac.toLowerCase().split('/').map((s) => s.trim());
          return (
            Array.isArray(place.facilities) &&
            place.facilities.some(
              (item) => typeof item === 'string' && subTerms.some((term) => item.toLowerCase().includes(term))
            )
          );
        });
        if (!hasAllFacilities) return false;
      }

      if (minRating === '4.0' && Number(place.rating || 0) < 4.0) return false;
      if (minRating === '4.5' && Number(place.rating || 0) < 4.5) return false;

      if (maxDistance && place.distanceKm && Number(place.distanceKm) > maxDistance) {
        return false;
      }

      return true;
    });

    if (selectedCategory === 'baru-ditambahkan' || selectedCategory === 'baru') {
      return [...filtered].sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
    }

    if (selectedCategory === 'trending') {
      return [...filtered].sort((a, b) => {
        const revA = Number(a.reviewCount || a.reviewsCount || a.review_count || 0);
        const revB = Number(b.reviewCount || b.reviewsCount || b.review_count || 0);
        const ratA = Number(a.rating || 0);
        const ratB = Number(b.rating || 0);
        return (ratB * 100 + revB) - (ratA * 100 + revA);
      });
    }

    return filtered;
  }, [backendPlaces, searchQuery, selectedCategory, openNowOnly, open24HoursOnly, selectedFacilities, minRating, maxDistance]);

  const totalItems = filteredPlaces.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPageNum), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const paginatedPlaces = useMemo(() => {
    return filteredPlaces.slice(startIndex, endIndex);
  }, [filteredPlaces, startIndex, endIndex]);

  const leftSidebarRef = useRef(null);

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleScroll = () => {
      const sidebar = leftSidebarRef.current;
      if (!sidebar) return;

      if (window.innerWidth < 1024) {
        sidebar.style.position = '';
        sidebar.style.top = '';
        return;
      }

      const viewportHeight = window.innerHeight;
      const sidebarHeight = sidebar.offsetHeight;
      const topOffset = 156;
      const bottomMargin = 24;

      if (sidebarHeight + topOffset + bottomMargin <= viewportHeight) {
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${topOffset}px`;
        return;
      }

      const scrollY = window.scrollY;
      const deltaY = scrollY - lastScrollY;
      lastScrollY = scrollY;

      if (scrollY <= 80) {
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${topOffset}px`;
        return;
      }

      const maxTop = topOffset;
      const minTop = viewportHeight - sidebarHeight - bottomMargin;

      const computedStyle = window.getComputedStyle(sidebar);
      const currentTopVal = parseFloat(computedStyle.top) || topOffset;

      let newTop;
      if (deltaY > 0) {
        newTop = Math.max(minTop, Math.min(maxTop, currentTopVal - deltaY));
      } else {
        newTop = Math.min(maxTop, Math.max(minTop, currentTopVal - deltaY));
      }

      sidebar.style.position = 'sticky';
      sidebar.style.top = `${newTop}px`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [filteredPlaces, selectedCategory, selectedFacilities]);

  return (
    <div className="w-full flex-1 flex flex-col bg-surface antialiased selection:bg-primary-container selection:text-on-primary-fixed">
      <ExploreSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentCity={currentCity}
        onOpenLocationModal={onOpenLocationModal}
      />

      <section className="w-full flex-1 max-w-[1440px] mx-auto px-4 md:px-8 py-6 min-h-[calc(100vh-140px)]">
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
          <ExploreFilterSidebar
            leftSidebarRef={leftSidebarRef}
            resetFilters={resetFilters}
            spotCategories={spotCategories}
            specialCategories={specialCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            openNowOnly={openNowOnly}
            setOpenNowOnly={setOpenNowOnly}
            open24HoursOnly={open24HoursOnly}
            setOpen24HoursOnly={setOpen24HoursOnly}
            selectedFacilities={selectedFacilities}
            toggleFacility={toggleFacility}
            minRating={minRating}
            setMinRating={setMinRating}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
          />

          <div className="flex-1 flex flex-col gap-5 w-full min-w-0">
            {isLoading || isFilterLoading ? (
              <div className="bg-surface-card rounded-3xl p-16 text-center border border-border-hairline flex flex-col items-center justify-center min-h-[420px]">
                <span className="material-symbols-outlined text-[38px] text-primary animate-spin mb-3">
                  progress_activity
                </span>
                <p className="text-sm font-bold text-on-surface">Menyaring Tempat...</p>
                <p className="text-xs text-charcoal-subtle mt-1">
                  Memuat daftar spot nongkrong sesuai kriteria Anda
                </p>
              </div>
            ) : loadError ? (
              <div className="bg-surface-card rounded-3xl p-12 text-center border border-dashed border-error/40 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[32px]">wifi_off</span>
                </div>
                <h3 className="font-bold text-base text-on-surface">Oops! Terjadi Kesalahan</h3>
                <p className="text-xs text-charcoal-subtle mt-1.5 max-w-sm mx-auto leading-relaxed">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Coba Lagi</span>
                </button>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="bg-surface-card rounded-3xl p-12 text-center border border-dashed border-border-hairline min-h-[380px] flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-3 text-charcoal-subtle">
                  <span className="material-symbols-outlined text-[32px]">search_off</span>
                </div>
                <h3 className="font-bold text-base text-on-surface">Tidak Ada Spot yang Sesuai</h3>
                <p className="text-xs text-charcoal-subtle mt-1 max-w-sm mx-auto leading-relaxed">
                  Coba ubah kata kunci pencarian, kurangi pilihan fasilitas, atau perbesar radius jarak.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-inverse-surface text-inverse-on-surface text-xs font-bold hover:bg-black transition-colors cursor-pointer active:scale-95 shadow-xs"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedPlaces.map((place) => (
                  <ExplorePlaceCard
                    key={place.id}
                    place={place}
                    isFav={Array.isArray(favorites) && favorites.includes(place.id)}
                    onToggleFavorite={onToggleFavorite}
                    onSelectPlaceWithState={handleSelectPlaceWithState}
                  />
                ))}
              </div>
            )}

            <ExplorePagination
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              safeCurrentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPageNum(page)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
