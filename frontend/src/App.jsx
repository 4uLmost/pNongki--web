import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FavoritesDrawer from './components/FavoritesDrawer';
import NotificationDrawer from './components/NotificationDrawer';
import PlaceDetailModal from './components/PlaceDetailModal';
import InviteModal from './components/InviteModal';
import LocationModal from './components/LocationModal';
import AuthAlertModal from './components/AuthAlertModal';
import PartnershipPromptModal from './components/PartnershipPromptModal';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import DetailPage from './pages/DetailPage';
import TambahTempatPage from './pages/TambahTempatPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PartnershipPage from './pages/PartnershipPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { api } from './lib/api';

const VALID_PAGES = ['beranda', 'explore', 'detail', 'tambah-tempat', 'feeds', 'profile', 'admin', 'login', 'register', 'partnership', 'ajukan-bisnis', 'owner-dashboard', 'owner'];

function getInitialPage() {
  try {
    const saved = localStorage.getItem('pnongki_current_page');
    if (saved && VALID_PAGES.includes(saved)) {
      return saved;
    }
  } catch {}
  return 'beranda';
}

function getInitialExploreParams() {
  try {
    const saved = localStorage.getItem('pnongki_explore_params');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { query: '', category: 'all' };
}

function getInitialSelectedPlace(defaultPlaces) {
  try {
    const savedId = localStorage.getItem('pnongki_selected_place_id');
    if (savedId && Array.isArray(defaultPlaces) && defaultPlaces.length > 0) {
      const found = defaultPlaces.find((p) => p && String(p.id) === String(savedId));
      if (found) return found;
    }
  } catch {}
  return defaultPlaces[0];
}

function getStoredSet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveStoredSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {}
}

function AppContent() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [places, setPlaces] = useState([]);
  const [isPlacesLoading, setIsPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState(null);
  const [inviteModalPlace, setInviteModalPlace] = useState(null);
  const [currentCity, setCurrentCity] = useState('Dago, Bandung (Otomatis GPS)');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [authAlertOpen, setAuthAlertOpen] = useState(false);
  const [partnershipModalOpen, setPartnershipModalOpen] = useState(false);
  const [tambahTempatMode, setTambahTempatMode] = useState('normal');
  const [exploreParams, setExploreParams] = useState(getInitialExploreParams);
  const [profileParams, setProfileParams] = useState({ tab: null, modal: null });
  const [authNotice, setAuthNotice] = useState('');
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    message: 'Menghubungkan NestJS API...',
  });

  // Fungsi pengambil data tempat dari Database / API (mendukung Retry / Coba Lagi)
  const loadPlaces = async () => {
    setIsPlacesLoading(true);
    setPlacesError(null);
    try {
      const remotePlaces = await api.getPlaces();
      if (Array.isArray(remotePlaces) && remotePlaces.length > 0) {
        setPlaces(remotePlaces);
        setSelectedPlace((prev) => {
          const savedId = localStorage.getItem('pnongki_selected_place_id');
          const targetId = savedId || prev?.id;
          if (targetId) {
            const found = remotePlaces.find((p) => p && String(p.id) === String(targetId));
            if (found) return found;
          }
          return remotePlaces[0];
        });
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.warn('Gagal memuat tempat:', err);
      setPlaces([]);
      setPlacesError(
        err.message || 'Gagal memuat direktori tempat dari server backend API pNongki. Pastikan server backend sedang aktif.'
      );
    } finally {
      setIsPlacesLoading(false);
    }
  };

  // Check Backend NestJS API integration & load initial data
  useEffect(() => {
    let isMounted = true;
    api
      .checkHealth()
      .then((data) => {
        if (!isMounted) return;
        if (data.status === 'ok') {
          setBackendStatus({ connected: true, message: `NestJS Online (${data.service})` });
        } else {
          setBackendStatus({ connected: false, message: 'Backend NestJS Offline (Mode Supabase Cloud)' });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setBackendStatus({ connected: false, message: 'Backend NestJS Offline (Mode Supabase Cloud)' });
      });

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sinkronkan halaman aktif ke localStorage dan URL hash agar saat refresh tetap di halaman terakhir
  useEffect(() => {
    try {
      localStorage.setItem('pnongki_current_page', currentPage);
      if (currentPage === 'beranda') {
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        if (window.location.hash !== `#${currentPage}`) {
          window.location.hash = currentPage;
        }
      }
    } catch {}
  }, [currentPage]);

  const getActiveAuthUser = (overrideUser) => {
    if (overrideUser) return overrideUser;
    if (user) return user;
    try {
      const saved = localStorage.getItem('pnongki_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  // Dukung tombol Back / Forward browser via hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && VALID_PAGES.includes(hash)) {
        const activeUser = getActiveAuthUser();
        if ((hash === 'tambah-tempat' || hash === 'feeds') && !activeUser) {
          setAuthAlertOpen(true);
          return;
        }
        if (hash === 'admin') {
          const cleanEmail = (activeUser?.email || '').toLowerCase().trim();
          const isSuperAdmin = activeUser?.role === 'super_admin' || cleanEmail === 'superadmin@admin.pnongki';
          const isAdmin = isSuperAdmin || activeUser?.role === 'admin' || cleanEmail.includes('@admin.pnongki');
          if (!activeUser || !isAdmin) {
            setAuthNotice('Silakan masuk dengan akun admin (@admin.pnongki) untuk mengakses Dashboard Admin.');
            setCurrentPage('login');
            return;
          }
          setAuthNotice('');
        }
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage('beranda');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Auth guard jika user refresh langsung di rute terproteksi tanpa login
  useEffect(() => {
    const activeUser = getActiveAuthUser();
    if ((currentPage === 'tambah-tempat' || currentPage === 'feeds') && !activeUser) {
      setAuthAlertOpen(true);
    }
  }, [currentPage, user]);

  const fetchUserNotifications = useCallback(() => {
    if (!user?.id) return;
    const readKey = `pnongki_read_notifs_${user.id}`;
    const deletedKey = `pnongki_deleted_notifs_${user.id}`;
    const readIds = getStoredSet(readKey);
    const deletedIds = getStoredSet(deletedKey);

    api.getNotifications(user.id).then((notifs) => {
      const raw = Array.isArray(notifs) ? notifs : [];
      const processed = raw
        .filter((n) => !deletedIds.has(String(n.id)))
        .map((n) => ({
          ...n,
          isUnread: readIds.has(String(n.id)) ? false : Boolean(n.isUnread),
        }));
      setNotifications(processed);
    }).catch((err) => {
      console.warn('Gagal memuat notifikasi:', err);
    });
  }, [user?.id]);

  // Fetch user-specific favorites & notifications on login/logout
  useEffect(() => {
    let isMounted = true;
    if (!user?.id) {
      setFavorites([]);
      setNotifications([]);
      return;
    }

    api.getFavorites(user.id).then((favs) => {
      if (isMounted) {
        setFavorites(Array.isArray(favs) ? favs : []);
      }
    });

    fetchUserNotifications();

    const interval = setInterval(() => {
      fetchUserNotifications();
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.id, fetchUserNotifications]);

  useEffect(() => {
    if (notificationDrawerOpen) {
      fetchUserNotifications();
    }
  }, [notificationDrawerOpen, fetchUserNotifications]);

  const handleMarkAllNotificationsRead = () => {
    if (!user?.id) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
      return;
    }
    const readKey = `pnongki_read_notifs_${user.id}`;
    const readIds = getStoredSet(readKey);
    notifications.forEach((n) => readIds.add(String(n.id)));
    saveStoredSet(readKey, readIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    api.markNotificationsRead({
      userId: user.id,
      notifIds: notifications.map((n) => String(n.id)),
    });
  };

  const handleMarkNotificationAsRead = (notifId) => {
    if (!notifId) return;
    if (user?.id) {
      const readKey = `pnongki_read_notifs_${user.id}`;
      const readIds = getStoredSet(readKey);
      readIds.add(String(notifId));
      saveStoredSet(readKey, readIds);
      api.markNotificationsRead({ userId: user.id, notifId: String(notifId) });
    }
    setNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(notifId) ? { ...n, isUnread: false } : n))
    );
  };

  const handleDeleteNotification = (notifId) => {
    if (!notifId) return;
    if (user?.id) {
      const deletedKey = `pnongki_deleted_notifs_${user.id}`;
      const deletedIds = getStoredSet(deletedKey);
      deletedIds.add(String(notifId));
      saveStoredSet(deletedKey, deletedIds);
      api.deleteNotifications({ userId: user.id, notifId: String(notifId) });
    }
    setNotifications((prev) => prev.filter((n) => String(n.id) !== String(notifId)));
  };

  const handleClearAllNotifications = () => {
    if (user?.id) {
      const deletedKey = `pnongki_deleted_notifs_${user.id}`;
      const deletedIds = getStoredSet(deletedKey);
      notifications.forEach((n) => deletedIds.add(String(n.id)));
      saveStoredSet(deletedKey, deletedIds);
      api.deleteNotifications({
        userId: user.id,
        notifIds: notifications.map((n) => String(n.id)),
      });
    }
    setNotifications([]);
  };

  // Handle navigation with authentication guards
  const handleNavigate = (page, params = {}) => {
    if (page === 'partnership-modal') {
      setPartnershipModalOpen(true);
      return;
    }

    if (params.notice) {
      setAuthNotice(params.notice);
    } else if (page !== 'login' && page !== 'register') {
      setAuthNotice('');
    }

    const activeUser = getActiveAuthUser(params.user);

    // PROTECTED ROUTES: Tambah Tempat dan Feeds WAJIB LOGIN
    if ((page === 'tambah-tempat' || page === 'feeds' || page === 'feed') && !activeUser) {
      setAuthAlertOpen(true);
      return;
    }

    if (page === 'tambah-tempat') {
      setTambahTempatMode(params.mode || 'normal');
    }

    if (page === 'admin') {
      const cleanEmail = (activeUser?.email || '').toLowerCase().trim();
      const isSuperAdmin = activeUser?.role === 'super_admin' || cleanEmail === 'superadmin@admin.pnongki';
      const isAdmin = isSuperAdmin || activeUser?.role === 'admin' || cleanEmail.includes('@admin.pnongki');

      if (!activeUser || !isAdmin) {
        setAuthNotice('Silakan masuk dengan akun admin (@admin.pnongki) untuk mengakses Dashboard Admin.');
        setCurrentPage('login');
        return;
      }
      setAuthNotice('');
    }

    if (page === 'owner-dashboard' || page === 'owner') {
      if (!activeUser) {
        setAuthNotice('Silakan masuk terlebih dahulu untuk mengakses Dashboard Owner.');
        setCurrentPage('login');
        return;
      }
      setAuthNotice('');
    }

    if (page === 'explore') {
      // Hanya timpa exploreParams jika diberikan query atau kategori eksplisit baru dari luar
      if (params.category !== undefined || params.query !== undefined) {
        const nextParams = {
          category: params.category || 'all',
          query: params.query || '',
        };
        setExploreParams(nextParams);
        try {
          localStorage.setItem('pnongki_explore_params', JSON.stringify(nextParams));
        } catch {}
      }
    }
    if (params.place) {
      setSelectedPlace(params.place);
      if (params.place.id) {
        try {
          localStorage.setItem('pnongki_selected_place_id', String(params.place.id));
        } catch {}
      }
    }
    if (page === 'profile' || page === 'profil') {
      setProfileParams({
        tab: params.tab || 'tempat-saya',
        modal: params.modal || null,
        scrollToRewards: Boolean(params.scrollToRewards),
      });
    } else {
      setProfileParams({ tab: null, modal: null, scrollToRewards: false });
    }
    setCurrentPage(page);
    const isReturningToExplore = page === 'explore' && params.category === undefined && params.query === undefined;
    if (!params.scrollToRewards && !isReturningToExplore) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle adding new place to backend & local state
  const handleAddPlace = async (newPlace) => {
    try {
      if (newPlace?.status && newPlace.status !== 'approved') {
        return;
      }
      if (newPlace?.id) {
        setPlaces((prev) => {
          const exists = prev.some((p) => p && String(p.id) === String(newPlace.id));
          return exists ? prev : [newPlace, ...prev];
        });
        return;
      }
      const placeWithUser = { ...newPlace, added_by: user?.id };
      const saved = await api.createPlace(placeWithUser);
      if (saved?.status === 'approved') {
        setPlaces((prev) => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Gagal menambahkan tempat:', err);
      alert('Gagal menyimpan tempat ke database. Periksa koneksi internet Anda!');
    }
  };

  // Handle direct place selection to open DetailPage
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    if (place?.id) {
      try {
        localStorage.setItem('pnongki_selected_place_id', String(place.id));
      } catch {}
    }
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite connected to backend & database
  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    api.toggleFavorite(id, user?.id);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveFavorite = (id) => {
    api.toggleFavorite(id, user?.id);
    setFavorites((prev) => prev.filter((item) => item !== id));
  };

  const handleClearFavorites = () => {
    favorites.forEach((favId) => api.toggleFavorite(favId, user?.id));
    setFavorites([]);
  };

  const handleLogout = async () => {
    await logout();
    setFavorites([]);
    setNotifications([]);
    handleNavigate('login');
  };

  const handlePartnershipModalChoice = (choice) => {
    setPartnershipModalOpen(false);
    if (choice === 'already_registered') {
      handleNavigate('partnership');
    } else if (choice === 'new_place') {
      setTambahTempatMode('partnership');
      handleNavigate('tambah-tempat', { mode: 'partnership' });
    }
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'register';

  return (
    <div className="bg-surface font-sans text-on-surface antialiased flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary-fixed">
      {/* 1. REUSABLE NAVBAR (Disembunyikan pada Halaman Login & Register) */}
      {!isAuthPage && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          favoritesCount={favorites.length}
          notificationsCount={notifications.filter((n) => n.isUnread).length}
          onOpenFavorites={() => setFavoritesDrawerOpen(true)}
          onOpenNotifications={() => setNotificationDrawerOpen(true)}
          currentUser={user}
          onLogout={handleLogout}
          onOpenPartnershipModal={() => setPartnershipModalOpen(true)}
        />
      )}

      {/* 2. PAGE CONTENT ROUTER */}
      <main className={`w-full flex-1 flex flex-col ${isAuthPage ? '' : 'pt-20'}`}>
        {currentPage === 'beranda' ? (
          <LandingPage
            places={places}
            isLoading={isPlacesLoading}
            loadError={placesError}
            onRetry={loadPlaces}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlace={handleSelectPlace}
            onNavigate={handleNavigate}
            currentCity={currentCity}
            onOpenLocationModal={() => setLocationModalOpen(true)}
            backendStatus={backendStatus}
          />
        ) : currentPage === 'explore' ? (
          <ExplorePage
            places={places}
            isLoading={isPlacesLoading}
            loadError={placesError}
            onRetry={loadPlaces}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlace={handleSelectPlace}
            currentCity={currentCity}
            onOpenLocationModal={() => setLocationModalOpen(true)}
            initialCategory={exploreParams.category}
            initialQuery={exploreParams.query}
          />
        ) : currentPage === 'detail' ? (
          <DetailPage
            place={selectedPlace || places[0]}
            isLoading={isPlacesLoading}
            loadError={placesError}
            onRetry={loadPlaces}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={handleNavigate}
            onInviteClick={(place) => setInviteModalPlace(place)}
            currentCity={currentCity}
          />
        ) : currentPage === 'tambah-tempat' ? (
          user ? (
            <TambahTempatPage
              onNavigate={handleNavigate}
              onAddPlace={handleAddPlace}
              mode={tambahTempatMode}
            />
          ) : (
            <div className="flex-1 max-w-[1280px] mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/40 text-on-primary-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">
                Akses Terbatas
              </h2>
              <p className="text-sm text-charcoal-subtle max-w-md mb-6 font-medium">
                Untuk menggunakan fitur ini anda harus login
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleNavigate('login')}
                  className="py-2.5 px-6 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Masuk</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('register')}
                  className="py-2.5 px-6 rounded-xl bg-primary-container hover:bg-accent-hover text-on-surface text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Daftar</span>
                </button>
              </div>
            </div>
          )
        ) : currentPage === 'feeds' || currentPage === 'feed' ? (
          user ? (
            <FeedPage
              places={places}
              onNavigate={handleNavigate}
              onSelectPlace={handleSelectPlace}
              currentUser={user}
            />
          ) : (
            <div className="flex-1 max-w-[1280px] mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/40 text-on-primary-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">
                Akses Terbatas
              </h2>
              <p className="text-sm text-charcoal-subtle max-w-md mb-6 font-medium">
                Untuk menggunakan fitur ini anda harus login
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleNavigate('login')}
                  className="py-2.5 px-6 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Masuk</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('register')}
                  className="py-2.5 px-6 rounded-xl bg-primary-container hover:bg-accent-hover text-on-surface text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Daftar</span>
                </button>
              </div>
            </div>
          )
        ) : currentPage === 'profile' || currentPage === 'profil' ? (
          <ProfilePage
            key={`profile-${user?.id || 'guest'}-${profileParams.tab || 'default'}-${profileParams.modal || 'none'}-${
              profileParams.scrollToRewards ? 'scroll' : 'noscroll'
            }`}
            onNavigate={handleNavigate}
            onSelectPlace={handleSelectPlace}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            places={places}
            initialTab={profileParams.tab}
            initialModal={profileParams.modal}
            scrollToRewards={profileParams.scrollToRewards}
            currentUser={user}
            onOpenPartnershipModal={() => setPartnershipModalOpen(true)}
            isLoadingPlaces={isPlacesLoading}
            loadPlacesError={placesError}
            onRetryPlaces={loadPlaces}
          />
        ) : currentPage === 'owner-dashboard' || currentPage === 'owner' ? (
          <OwnerDashboardPage
            places={places}
            onNavigate={handleNavigate}
            onSelectPlace={handleSelectPlace}
            currentUser={user}
            selectedPlace={selectedPlace}
            isLoadingPlaces={isPlacesLoading}
            loadPlacesError={placesError}
            onRetryPlaces={loadPlaces}
          />
        ) : currentPage === 'admin' ? (
          <AdminDashboardPage
            onNavigate={handleNavigate}
            onSelectPlace={handleSelectPlace}
          />
        ) : currentPage === 'partnership' || currentPage === 'ajukan-bisnis' ? (
          <PartnershipPage
            places={places}
            onNavigate={handleNavigate}
            isLoading={isPlacesLoading}
            loadError={placesError}
            onRetry={loadPlaces}
          />
        ) : currentPage === 'login' || currentPage === 'register' ? (
          <AuthPage
            initialMode={currentPage === 'register' ? 'register' : 'login'}
            onNavigate={handleNavigate}
            requiredNotice={authNotice}
          />
        ) : null}
      </main>

      {/* 3. REUSABLE FOOTER (Disembunyikan pada Halaman Login & Register) */}
      {!isAuthPage && (
        <Footer
          onNavigate={handleNavigate}
          onOpenPartnershipModal={() => setPartnershipModalOpen(true)}
        />
      )}

      {/* 4. FAVORITES DRAWER */}
      <FavoritesDrawer
        isOpen={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        favorites={favorites}
        places={places}
        onRemoveFavorite={handleRemoveFavorite}
        onClearFavorites={handleClearFavorites}
        onSelectPlace={(place) => {
          handleSelectPlace(place);
          setFavoritesDrawerOpen(false);
        }}
      />

      {/* 5. NOTIFICATION DRAWER */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onMarkAsRead={handleMarkNotificationAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAllNotifications={handleClearAllNotifications}
        onClearNotifications={handleMarkAllNotificationsRead}
      />

      {/* 6. PLACE DETAIL MODAL */}
      <PlaceDetailModal
        place={selectedPlaceForModal}
        onClose={() => setSelectedPlaceForModal(null)}
        onInviteClick={(place) => setInviteModalPlace(place)}
      />

      {/* 7. AJAK NONGKRONG MODAL */}
      <InviteModal
        place={inviteModalPlace}
        onClose={() => setInviteModalPlace(null)}
      />

      {/* 8. LOCATION SELECTOR MODAL */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
      />

      {/* 9. AUTH REQUIRED ALERT MODAL */}
      <AuthAlertModal
        isOpen={authAlertOpen}
        onClose={() => setAuthAlertOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 10. PARTNERSHIP PROMPT MODAL */}
      <PartnershipPromptModal
        isOpen={partnershipModalOpen}
        onClose={() => setPartnershipModalOpen(false)}
        onSelectChoice={handlePartnershipModalChoice}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
