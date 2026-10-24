/**
 * pNongki! Centralized API Client
 * Mengarahkan seluruh permintaan data frontend ke backend NestJS API via fetch.
 * Arsitektur Single Point of Entry: Client -> Backend NestJS -> Supabase Database.
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 7000);

  const config = {
    signal: options.signal || controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status} saat menghubungi ${endpoint}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error('Tidak dapat terhubung ke server backend API pNongki. Pastikan server backend berjalan di http://localhost:3000.');
    }
    throw err;
  }
}

function mapDbPlaceToUi(item) {
  const details = Array.isArray(item.place_details) ? item.place_details[0] : item.place_details;
  const img =
    item.cover_image_url ||
    item.imageUrl ||
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';

  const catRaw = (item.category || 'nongkrong').toLowerCase();
  let categoryLabel = 'NONGKRONG & CHILL';
  let categoryKey = 'nongkrong';
  if (catRaw.includes('nugas')) {
    categoryLabel = 'NUGAS & CO-WORKING';
    categoryKey = 'nugas';
  } else if (catRaw.includes('olahraga')) {
    categoryLabel = 'OLAHRAGA & AKTIVITAS';
    categoryKey = 'olahraga';
  } else if (catRaw.includes('fasilitas') || catRaw.includes('publik')) {
    categoryLabel = 'FASILITAS PUBLIK';
    categoryKey = 'fasilitas-umum';
  }

  const facilitiesList =
    Array.isArray(details?.facilities) && details.facilities.length > 0
      ? details.facilities
      : Array.isArray(item.facilities) && item.facilities.length > 0
      ? item.facilities
      : [];

  const badgesList =
    Array.isArray(item.badges) && item.badges.length > 0
      ? item.badges
      : facilitiesList.slice(0, 3);

  const locString = item.city
    ? `1.2 km dari Anda • ${item.city}`
    : item.address
    ? `1.2 km dari Anda • ${item.address}`
    : '1.2 km dari Anda • Bandung';

  return {
    id: String(item.id || `place-${Date.now()}`),
    name: item.name || 'Spot Nongki',
    shortName: item.shortName || item.name || 'Spot Nongki',
    category: categoryLabel,
    categoryKey: categoryKey,
    location: locString,
    city: item.city || 'Bandung',
    address: item.address || '',
    latitude: Number(item.latitude) || -6.89,
    longitude: Number(item.longitude) || 107.61,
    cover_image_url: img,
    image: img,
    imageUrl: img,
    rating: Number(item.rating) || 0,
    reviewCount: Number(item.review_count || item.reviewCount || 0),
    reviewsCount: Number(item.review_count || item.reviewCount || 0),
    price: item.price_range || item.price || '',
    priceRange: item.price_range || item.price || '',
    openStatus: item.open_status || item.openStatus || '',
    openingHours: item.open_status || item.openingHours || '',
    isOpenNow: true,
    is24Hours: (item.open_status || '').toLowerCase().includes('24 jam'),
    distanceKm: Number(item.distanceKm) || 1.2,
    badges: badgesList,
    facilities: facilitiesList,
    featureBadges: facilitiesList.slice(0, 2).map((fac) => ({
      icon: 'check_circle',
      text: fac,
      isPrimary: true,
    })),
    capacityInfo: { label: 'Kapasitas', value: 'Tempat Tersedia', isHighlight: true },
    recommendedMenu:
      details?.recommended_menu ||
      item.recommended_menu ||
      item.recommendedMenu ||
      '',
    booking_url: details?.booking_url || item.booking_url || null,
    is_partner: Boolean(item.is_partner) && item.partnership_status === 'approved',
    partnership_status: item.partnership_status || 'none',
    added_by: item.added_by || item.owner_id || null,
    owner_id: item.owner_id || item.added_by || null,
    description:
      details?.description ||
      item.description ||
      '',
    opening_hours: details?.opening_hours || item.opening_hours || null,
    menus: Array.isArray(details?.menus) ? details.menus : Array.isArray(item.menus) ? item.menus : [],
    menu_images: Array.isArray(details?.menu_images)
      ? details.menu_images
      : Array.isArray(item.menu_images)
      ? item.menu_images
      : [],
    venue_photos: Array.isArray(details?.venue_photos)
      ? details.venue_photos
      : Array.isArray(item.venue_photos)
      ? item.venue_photos
      : [],
    contact_phone: details?.contact_phone || item.contact_phone || null,
    instagram: details?.instagram || item.instagram || null,
    status: item.status || 'approved',
    created_at: item.created_at || null,
  };
}

export const api = {
  async checkHealth() {
    try {
      return await request('/health');
    } catch {
      return { connected: false, status: 'offline' };
    }
  },

  async getPlaces({ query = '', category = 'all', sort = 'default' } = {}) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'all') params.append('category', category);
    if (sort && sort !== 'default') params.append('sort', sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await request(`/places${qs}`);
    if (Array.isArray(data)) {
      return data.map(mapDbPlaceToUi).filter(Boolean);
    }
    return [];
  },

  async getPlaceById(id) {
    const place = await request(`/places/${id}`);
    if (!place) {
      throw new Error('Tempat tidak ditemukan di database.');
    }
    return mapDbPlaceToUi(place);
  },

  async createPlace(placeData) {
    const rawCat = String(placeData.category || 'nongkrong').toLowerCase().trim();
    let cleanCategory = 'nongkrong';
    if (rawCat.includes('fasilitas') || rawCat.includes('publik') || rawCat.includes('taman')) {
      cleanCategory = 'fasilitas_publik';
    } else if (rawCat.includes('nugas') || rawCat.includes('kerja') || rawCat.includes('coworking')) {
      cleanCategory = 'nugas';
    } else if (rawCat.includes('olahraga') || rawCat.includes('sport') || rawCat.includes('fitness')) {
      cleanCategory = 'olahraga';
    }

    const payload = {
      ...placeData,
      category: cleanCategory,
    };

    const result = await request('/places', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapDbPlaceToUi(result);
  },

  async applyPartnershipForExistingPlace(placeId, partnershipData) {
    const result = await request(`/places/${placeId}/partnership`, {
      method: 'POST',
      body: JSON.stringify(partnershipData),
    });
    return mapDbPlaceToUi(result);
  },

  async getAdminPlaces({ status = 'all', partnershipStatus = 'all' } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (partnershipStatus && partnershipStatus !== 'all') params.append('partnershipStatus', partnershipStatus);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await request(`/places/admin/list${qs}`);
    if (Array.isArray(data)) {
      return data.map(mapDbPlaceToUi).filter(Boolean);
    }
    return [];
  },

  async updatePlaceStatus(placeId, newStatus) {
    const result = await request(`/places/${placeId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
    return mapDbPlaceToUi(result);
  },

  async updatePartnershipStatus(placeId, newPartnershipStatus, isPartner = false) {
    const result = await request(`/places/${placeId}/partnership-status`, {
      method: 'PUT',
      body: JSON.stringify({
        partnershipStatus: newPartnershipStatus,
        isPartner: Boolean(isPartner),
      }),
    });
    return mapDbPlaceToUi(result) || result;
  },

  async getAdminUsers() {
    const data = await request('/users/admin-list');
    return Array.isArray(data) ? data : [];
  },

  async createAdminUser({ email, password, name }) {
    return await request('/users/admin', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  async deleteAdminUser(adminId) {
    return await request(`/users/admin/${adminId}`, {
      method: 'DELETE',
    });
  },

  async getMyPlaces(userId) {
    if (!userId) return [];
    const data = await request(`/places/my?userId=${userId}`);
    if (Array.isArray(data)) {
      return data.map(mapDbPlaceToUi).filter(Boolean);
    }
    return [];
  },

  async getMyBusinessClaims(userId) {
    if (!userId) return [];
    const data = await request(`/users/business-claims?userId=${userId}`);
    return Array.isArray(data) ? data : [];
  },

  async getPosts(userId) {
    const qs = userId ? `?userId=${userId}` : '';
    const posts = await request(`/posts${qs}`);
    return Array.isArray(posts) ? posts : [];
  },

  async createPost(postData) {
    return await request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  async toggleLikePost(postId, userId) {
    return await request(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async addPostComment(postId, commentData) {
    return await request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  async getRewards() {
    const rewards = await request('/rewards');
    return Array.isArray(rewards) ? rewards : [];
  },

  async claimReward(rewardId, currentPoints, userId) {
    return await request('/rewards/claim', {
      method: 'POST',
      body: JSON.stringify({ rewardId, currentPoints, userId }),
    });
  },

  async getMyClaims(userId) {
    if (!userId) return [];
    const claims = await request(`/rewards/my-claims?userId=${userId}`);
    return Array.isArray(claims) ? claims : [];
  },

  async getUserProfile(userId) {
    if (!userId) return null;
    return await request(`/users/profile?userId=${userId}`);
  },

  async updateUserProfile(userId, profileData) {
    if (!userId) return null;
    return await request(`/users/profile?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async getUserActivity(userId) {
    if (!userId) {
      return { reviewsCount: 0, hangoutsCount: 0, threadsCount: 0, logs: [] };
    }
    return await request(`/users/activity?userId=${userId}`);
  },

  async getFavorites(userId) {
    if (!userId) return [];
    const data = await request(`/users/favorites?userId=${userId}`);
    return Array.isArray(data) ? data : [];
  },

  async toggleFavorite(placeId, userId) {
    return await request('/users/favorites', {
      method: 'POST',
      body: JSON.stringify({ placeId, userId }),
    });
  },

  async getNotifications(userId) {
    if (!userId) return [];
    const data = await request(`/users/notifications?userId=${userId}`);
    return Array.isArray(data) ? data : [];
  },

  async markNotificationsRead({ notifId, notifIds, userId }) {
    return await request('/users/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ notifId, notifIds, userId }),
    });
  },

  async deleteNotifications({ notifId, notifIds, userId }) {
    return await request('/users/notifications/delete', {
      method: 'POST',
      body: JSON.stringify({ notifId, notifIds, userId }),
    });
  },

  async submitBusinessClaim(claimData) {
    return await request('/users/business-claim', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  },

  async deleteBusinessClaim(claimId, userId) {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await request(`/users/business-claim/${claimId}${qs}`, {
      method: 'DELETE',
    });
  },

  async deletePartnership(placeId, userId) {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await request(`/places/${placeId}/partnership${qs}`, {
      method: 'DELETE',
    });
  },

  async deletePlace(placeId, userId) {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await request(`/places/${placeId}${qs}`, {
      method: 'DELETE',
    });
  },

  async getPlaceReviews(placeId) {
    if (!placeId) return [];
    const reviews = await request(`/places/${placeId}/reviews`);
    return Array.isArray(reviews) ? reviews : [];
  },

  async addPlaceReview(placeId, { userId, rating, text }) {
    return await request(`/places/${placeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ userId, rating, text }),
    });
  },

  async getPlaceReservations(placeId) {
    if (!placeId) return [];
    const res = await request(`/places/${placeId}/reservations`);
    return Array.isArray(res) ? res : [];
  },

  async createReservation(placeId, reservationData) {
    return await request(`/places/${placeId}/reservations`, {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  async verifyAndSyncOwnerRole(userId) {
    if (!userId) return { role: 'user', reverted: false };
    return await request('/users/revert-owner-if-no-partners', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};
