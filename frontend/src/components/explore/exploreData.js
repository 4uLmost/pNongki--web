export const isPlaceNew = (place) => {
  if (!place) return false;
  if (place.is_new || place.isNew || place.isNewAdded) return true;
  if (place.status === 'pending') return true;
  if (place.created_at) {
    const createdTime = new Date(place.created_at).getTime();
    if (!isNaN(createdTime)) {
      const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      return createdTime >= fourteenDaysAgo;
    }
  }
  return false;
};

export const isPlaceTrending = (place) => {
  if (!place) return false;
  if (place.is_trending || place.isTrending) return true;
  const rating = Number(place.rating || 0);
  const reviews = Number(place.reviewCount || place.reviewsCount || place.review_count || 0);
  return (rating >= 4.7 && reviews >= 80) || (rating >= 4.8 && reviews >= 50);
};

export const isPlacePartner = (place) => {
  if (!place) return false;
  return Boolean(
    place.is_partner ||
    place.isPartner ||
    place.partnership_status === 'approved' ||
    place.partnership_status === 'active' ||
    place.booking_url
  );
};

export const EXPLORE_STATE_KEY = 'pnongki_explore_state';

export const getSavedExploreState = () => {
  try {
    const raw = sessionStorage.getItem(EXPLORE_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

