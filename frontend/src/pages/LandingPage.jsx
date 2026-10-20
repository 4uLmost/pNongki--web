import React, { useState, useMemo } from 'react';
import { CATEGORY_TABS } from '../components/landing/landingData';
import LandingHero from '../components/landing/LandingHero';
import LandingPopularGrid from '../components/landing/LandingPopularGrid';
import LandingExploreMapBanner from '../components/landing/LandingExploreMapBanner';
import LandingPartnershipBanner from '../components/landing/LandingPartnershipBanner';

export { CATEGORY_TABS };

export default function LandingPage({
  places = [],
  isLoading = false,
  loadError = null,
  onRetry,
  favorites = [],
  onToggleFavorite,
  onSelectPlace,
  onNavigate,
  currentCity,
  onOpenLocationModal,
  backendStatus,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('5');

  const popularPlaces = useMemo(() => {
    try {
      const savedAdminCurated = localStorage.getItem('pnongki_admin_curated_popular');
      if (savedAdminCurated) {
        const ids = JSON.parse(savedAdminCurated);
        if (Array.isArray(ids) && ids.length > 0) {
          const curated = ids
            .map((id) => places.find((p) => p && String(p.id) === String(id)))
            .filter(Boolean);
          if (curated.length > 0) {
            return curated.slice(0, 4);
          }
        }
      }
    } catch {}

    const manualFeatured = places.filter(
      (p) => p && (p.is_curated_popular || p.is_featured || p.is_popular)
    );
    if (manualFeatured.length >= 4) {
      return manualFeatured.slice(0, 4);
    }

    const pool =
      activeCategory === 'all'
        ? places
        : places.filter((p) => p && p.categoryKey === activeCategory);

    return [...pool]
      .filter(Boolean)
      .sort((a, b) => {
        const ratingDiff = (Number(b.rating) || 0) - (Number(a.rating) || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (Number(b.reviewCount || b.review_count) || 0) - (Number(a.reviewCount || a.review_count) || 0);
      })
      .slice(0, 4);
  }, [places, activeCategory]);

  return (
    <div className="flex flex-col w-full">
      <LandingHero
        currentCity={currentCity}
        onOpenLocationModal={onOpenLocationModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRadius={selectedRadius}
        setSelectedRadius={setSelectedRadius}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onNavigate={onNavigate}
      />

      <LandingPopularGrid
        places={places}
        popularPlaces={popularPlaces}
        isLoading={isLoading}
        loadError={loadError}
        onRetry={onRetry}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onSelectPlace={onSelectPlace}
        onNavigate={onNavigate}
      />

      <LandingExploreMapBanner
        placesCount={places.length}
        onNavigate={onNavigate}
      />

      <LandingPartnershipBanner onNavigate={onNavigate} />
    </div>
  );
}
