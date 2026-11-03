import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/useAuth';
import {
  DEFAULT_SLIDES,
  getTransitGuide,
} from '../components/detail/detailData';
import DetailBreadcrumb from '../components/detail/DetailBreadcrumb';
import DetailHeader from '../components/detail/DetailHeader';
import DetailHeroGallery from '../components/detail/DetailHeroGallery';
import DetailNavTabs from '../components/detail/DetailNavTabs';
import DetailOverviewTab from '../components/detail/DetailOverviewTab';
import DetailMenuTab from '../components/detail/DetailMenuTab';
import DetailReviewsTab from '../components/detail/DetailReviewsTab';
import DetailTransitTab from '../components/detail/DetailTransitTab';
import DetailLightboxModal from '../components/detail/DetailLightboxModal';

export default function DetailPage({
  place,
  isLoading = false,
  loadError = null,
  onRetry,
  favorites = [],
  onToggleFavorite,
  onNavigate,
  onInviteClick,
  currentCity = 'Dago, Bandung (Otomatis GPS)',
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const autoSlideRef = useRef(null);

  const [activeTab, setActiveTab] = useState('fasilitas');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('all');
  const [menuPage, setMenuPage] = useState(1);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [bookingGuestCount, setBookingGuestCount] = useState(2);
  const [bookingDate, setBookingDate] = useState('2026-11-08');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingSeating, setBookingSeating] = useState('indoor');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('PNK-842915');

  const auth = useAuth() || {};
  const currentUser = auth.user;
  const currentUserId = currentUser?.id;
  const currentUserName = currentUser?.name || currentUser?.full_name || 'Pengguna pNongki!';

  const [reviewsList, setReviewsList] = useState([]);
  const [selectedStarFilter, setSelectedStarFilter] = useState('all');
  const [userRating, setUserRating] = useState(5);
  const [reviewInputText, setReviewInputText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [myReview, setMyReview] = useState(null);
  const [editingMyReview, setEditingMyReview] = useState(false);
  const [editReviewText, setEditReviewText] = useState('');

  const [mapZoom, setMapZoom] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTransitMode, setActiveTransitMode] = useState('angkot');

  const currentPlace = place;

  const isFavorite = currentPlace ? favorites.includes(currentPlace.id) : false;
  const isPartner = Boolean(
    currentPlace?.is_partner ||
    currentPlace?.isPartner ||
    currentPlace?.partnership_status === 'approved' ||
    currentPlace?.partnership_status === 'active' ||
    currentPlace?.booking_url
  );

  const primaryImage =
    currentPlace?.cover_image_url ||
    currentPlace?.imageUrl ||
    currentPlace?.image ||
    DEFAULT_SLIDES[0].image;

  const getPhotoLabel = (item, defaultIdx = 0) => {
    if (typeof item === 'object' && item !== null) {
      if (item.label) return item.label;
      if (item.badge) return item.badge;
      if (item.category === 'indoor') return 'Area Indoor';
      if (item.category === 'outdoor') return 'Area Outdoor';
      if (item.category === 'facility') return 'Fasilitas & Penunjang';
      if (item.category === 'menu') return 'Menu Tempat';
      if (item.category === 'physical_menu') return 'Buku Menu';
    }
    return defaultIdx === 0 ? 'Area Indoor' : 'Area Outdoor';
  };

  const venuePhotosList = Array.isArray(currentPlace?.venue_photos) ? currentPlace.venue_photos : [];
  const rawMenuImages = Array.isArray(currentPlace?.menu_images) ? currentPlace.menu_images : [];
  const rawMenuItems = Array.isArray(currentPlace?.menus) ? currentPlace.menus : [];

  const builtHeroSlides = [];

  // 1. Foto Sampul / Cover
  if (primaryImage) {
    builtHeroSlides.push({
      id: 'cover',
      image: primaryImage,
      badge: 'Foto Utama',
      title: currentPlace?.name || 'Area Tempat',
      category: 'venue',
      tag: 'Area Tempat',
      desc: currentPlace?.address || 'Spot nongki & nugas',
    });
  }

  // 2. Foto Area & Fasilitas (Indoor, Outdoor, dsb)
  venuePhotosList.forEach((vp, i) => {
    const img = typeof vp === 'object' ? vp.image || vp.url : vp;
    if (!img || builtHeroSlides.some((s) => s.image === img)) return;
    const label = getPhotoLabel(vp, i);
    builtHeroSlides.push({
      id: `venue-${i}`,
      image: img,
      badge: label,
      title: label,
      category: 'venue',
      tag: label,
      desc: currentPlace?.name || '',
    });
  });

  // 3. Foto Lembar Buku Menu Fisik (Hanya menu fisik, bukan daftar item menu rekomendasi)
  rawMenuImages.forEach((bm, i) => {
    const img = typeof bm === 'object' ? bm.image || bm.url : bm;
    if (!img || builtHeroSlides.some((s) => s.image === img)) return;
    builtHeroSlides.push({
      id: `menu-book-${i}`,
      image: img,
      badge: 'Buku Menu',
      title: `Buku Menu Fisik #${i + 1}`,
      category: 'physical_menu',
      tag: 'Buku Menu',
      desc: `Dokumentasi buku menu fisik ${currentPlace?.name || ''}`,
    });
  });

  if (builtHeroSlides.length === 0) {
    builtHeroSlides.push({
      id: 'default',
      image: DEFAULT_SLIDES[0].image,
      badge: 'Area Indoor',
      title: 'Area Indoor',
      category: 'venue',
      tag: 'Area Indoor',
      desc: '',
    });
  }

  // Slides untuk hero gallery carousel dan preview di atas (Area & Buku Menu Fisik saja)
  const dynamicSlides = builtHeroSlides;

  // Seluruh slides untuk modal Lightbox (Termasuk foto dari item daftar menu pilihan)
  const allSlides = [...builtHeroSlides];
  rawMenuItems.forEach((m, i) => {
    if (!m || !m.image || typeof m.image !== 'string' || !m.image.trim()) return;
    if (allSlides.some((s) => s.image === m.image)) return;
    const priceStr = m.price || '';
    allSlides.push({
      id: `menu-${m.id || i}`,
      image: m.image,
      badge: 'Daftar Menu',
      title: m.name || `Menu Rekomendasi #${i + 1}`,
      category: 'menu',
      tag: 'Daftar Menu',
      desc: priceStr ? `${priceStr} • ${m.desc || 'Menu andalan'}` : m.desc || 'Menu andalan',
    });
  });

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? dynamicSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === dynamicSlides.length - 1 ? 0 : prev + 1));
  };

  const handleGoToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const openLightboxWithIndex = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openLightboxWithImage = (targetImage) => {
    if (!targetImage) return;
    const foundIdx = allSlides.findIndex((s) => s.image === targetImage);
    if (foundIdx !== -1) {
      openLightboxWithIndex(foundIdx);
    } else {
      openLightboxWithIndex(0);
    }
  };

  useEffect(() => {
    if (isCarouselHovered || dynamicSlides.length <= 1) return;
    autoSlideRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % dynamicSlides.length);
    }, 4500);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isCarouselHovered, dynamicSlides.length]);

  useEffect(() => {
    if (!currentPlace?.id) return;
    let isMounted = true;
    api
      .getPlaceReviews(currentPlace.id)
      .then((revs) => {
        if (!isMounted) return;
        if (Array.isArray(revs)) {
          setReviewsList(revs);
          if (currentUserId) {
            const foundUserRev = revs.find((r) => r.userId === currentUserId);
            if (foundUserRev) setMyReview(foundUserRev);
          }
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat ulasan tempat:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPlace?.id, currentUserId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleConfirmBooking = async () => {
    if (!currentPlace?.id) return;
    const code = `PNK-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingCode(code);
    setBookingSuccess(true);
    try {
      await api.createReservation(currentPlace.id, {
        userId: currentUserId,
        bookingCode: code,
        guestName: currentUserName,
        phone: currentUser?.phone || '',
        campus: currentUser?.campus || '',
        date: bookingDate,
        time: bookingTime,
        guestsCount: bookingGuestCount,
        seatingArea: bookingSeating,
      });
      showToast('Reservasi meja berhasil dikonfirmasi dan tersimpan di database! 🎟️');
    } catch (err) {
      console.warn('Gagal simpan reservasi ke server:', err);
      showToast('Reservasi meja berhasil dikonfirmasi! 🎟️');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewInputText.trim() || !currentPlace?.id) {
      showToast('Silakan tulis ulasan atau pengalaman nugas kamu terlebih dahulu.');
      return;
    }

    const authorDisplayName = isAnonymous ? 'Mahasiswa Anonim' : currentUserName;

    try {
      const createdReview = await api.addPlaceReview(currentPlace.id, {
        userId: currentUserId,
        rating: userRating,
        text: reviewInputText.trim(),
      });

      const newRev = createdReview || {
        id: `rev-${Date.now()}`,
        placeId: currentPlace.id,
        userId: currentUserId,
        author: authorDisplayName,
        initials: (authorDisplayName || 'M').substring(0, 2).toUpperCase(),
        bg: isAnonymous ? 'bg-surface-container-high' : 'bg-primary-container',
        role: 'Baru saja • Ulasan Terverifikasi',
        rating: userRating,
        stars: userRating,
        text: reviewInputText.trim(),
      };

      setReviewsList((prev) => [newRev, ...prev.filter((r) => r.id !== newRev.id)]);
      setMyReview(newRev);
      setReviewInputText('');
      showToast('Ulasan kamu berhasil dikirim dan tersimpan di database! ✨');
    } catch (err) {
      console.error('Gagal kirim review:', err);
      showToast('Gagal mengirim ulasan ke database. Silakan coba lagi.');
    }
  };

  const handleDeleteMyReview = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ulasan Anda?')) {
      setMyReview(null);
      showToast('Ulasan Anda telah dihapus.');
    }
  };

  const handleSaveEditReview = () => {
    if (!editReviewText.trim()) return;
    setMyReview((prev) => ({
      ...prev,
      text: editReviewText.trim(),
      role: 'Diperbarui baru saja • Mahasiswa Informatika',
    }));
    setEditingMyReview(false);
    showToast('Ulasan Anda berhasil diperbarui!');
  };

  // Safe checks for Early Returns
  if (isLoading && !place) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 bg-gray-200 rounded-lg" />
          <div className="h-72 sm:h-96 bg-gray-200 rounded-3xl" />
          <div className="space-y-3">
            <div className="h-8 w-2/3 bg-gray-200 rounded-xl" />
            <div className="h-4 w-1/3 bg-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            <div className="lg:col-span-2 h-72 bg-gray-200 rounded-2xl" />
            <div className="h-72 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError && !place) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[36px]">wifi_off</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">
          Gagal Memuat Detail Tempat
        </h2>
        <p className="text-sm text-charcoal-subtle max-w-md mb-6 font-medium">
          {loadError || 'Koneksi ke database atau backend terputus. Pastikan internet aktif dan layanan tersedia.'}
        </p>
        <div className="flex items-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-6 py-2.5 rounded-xl bg-primary-container text-on-surface text-sm font-bold shadow-xs hover:bg-accent-hover transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Coba Lagi</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="px-5 py-2.5 rounded-xl border border-outline/30 text-on-surface text-sm font-bold hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (!currentPlace) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[36px]">search_off</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">
          Tempat Tidak Ditemukan
        </h2>
        <p className="text-sm text-charcoal-subtle max-w-md mb-6 font-medium">
          Data tempat yang Anda cari belum tersedia atau telah dihapus.
        </p>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('explore')}
          className="px-6 py-2.5 rounded-xl bg-primary-container text-on-surface text-sm font-bold hover:bg-accent-hover transition-all cursor-pointer"
        >
          Jelajahi Tempat Lain
        </button>
      </div>
    );
  }

  const placeMenuItems =
    Array.isArray(currentPlace.menus) && currentPlace.menus.length > 0
      ? currentPlace.menus.map((item, idx) => ({
          id: item.id || idx + 1,
          name: item.name || 'Menu Pilihan',
          category: item.category || 'all',
          price: item.price || '',
          desc: item.desc || '',
          tag: item.tag || null,
          tagType: item.tagType || 'primary',
          image: item.image || '',
        }))
      : [];

  const filteredMenuItems =
    selectedMenuCategory === 'all'
      ? placeMenuItems
      : placeMenuItems.filter((item) => item.category === selectedMenuCategory);

  const dynamicMenuBookPhotos =
    Array.isArray(currentPlace.menu_images) && currentPlace.menu_images.length > 0
      ? currentPlace.menu_images.map((imgUrl, i) => ({
          id: i + 1,
          title: `Lembar Menu #${i + 1}`,
          caption: currentPlace.name,
          sub: 'Dokumentasi buku menu fisik',
          image: typeof imgUrl === 'object' ? imgUrl.image || imgUrl.url : imgUrl,
        }))
      : [];

  const filteredReviews =
    selectedStarFilter === 'all'
      ? reviewsList
      : reviewsList.filter((rev) => Math.floor(rev.rating) === Number(selectedStarFilter));

  const transitInfo = getTransitGuide(currentPlace, currentCity);
  const currentTransitRoute = transitInfo ? (transitInfo[activeTransitMode] || transitInfo.angkot) : null;

  const handleCopyTransitRoute = (modeInfo) => {
    if (!modeInfo || !transitInfo) return;
    const textToCopy = `🚌 Panduan Rute Transportasi Umum ke ${currentPlace.name}:
📍 Titik Awal: ${transitInfo.userOrigin}
🎯 Tujuan: ${currentPlace.name} (${currentPlace.address || ''})

Mode: ${modeInfo.type} (${modeInfo.code})
1. 🚶 Jalan Kaki: ${modeInfo.walkToPickup} menuju ${modeInfo.pickupPoint}
2. 🚐 Naik: ${modeInfo.code}
   - Ciri: ${modeInfo.color || '-'}
   - Instruksi: ${modeInfo.instruction}
   - Estimasi Tarif: ${modeInfo.fare}
   - Estimasi Waktu: ${modeInfo.duration}
3. 🛑 Titik Turun: ${modeInfo.dropPoint}
   - Tips: ${modeInfo.dropTips}
4. 🚶 Jalan Kaki: ${modeInfo.walkToDest} tiba di tujuan!

Estimasi Total: ${modeInfo.duration} • ${modeInfo.fare}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    showToast('Panduan rute transportasi umum disalin ke papan klip! 📋');
  };

  const handleCopyAddress = () => {
    const addr = currentPlace.address || 'Jl. Ir. H. Juanda No. 115, Coblong, Kota Bandung';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(addr);
    }
    showToast('Alamat lengkap tersalin ke papan klip! ✓');
  };

  const handleCopyInviteLink = () => {
    const link = `https://pnongki.id/place/${currentPlace.id || 'koffie-co'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    showToast('Tautan ajak nongkrong berhasil disalin! 🚀');
  };

  const currentSlide = dynamicSlides[currentSlideIndex] || dynamicSlides[0];

  return (
    <div className="w-full bg-surface min-h-screen text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-fixed">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/10">
          <span className="material-symbols-outlined text-primary-container text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
        <DetailBreadcrumb
          currentPlace={currentPlace}
          onNavigate={onNavigate}
        />

        <DetailHeader
          currentPlace={currentPlace}
          isPartner={isPartner}
          isFavorite={isFavorite}
          currentCity={currentCity}
          reviewCount={reviewsList.length}
          setActiveTab={setActiveTab}
          onToggleFavorite={onToggleFavorite}
          showToast={showToast}
          handleCopyInviteLink={handleCopyInviteLink}
        />

        <DetailHeroGallery
          dynamicSlides={dynamicSlides}
          currentSlideIndex={currentSlideIndex}
          currentSlide={currentSlide}
          setIsCarouselHovered={setIsCarouselHovered}
          handlePrevSlide={handlePrevSlide}
          handleNextSlide={handleNextSlide}
          handleGoToSlide={handleGoToSlide}
          openLightboxWithIndex={openLightboxWithIndex}
          openLightboxWithImage={openLightboxWithImage}
        />

        <DetailNavTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reviewCount={reviewsList.length}
        />

        <div className="w-full">
          {activeTab === 'fasilitas' && (
            <DetailOverviewTab
              currentPlace={currentPlace}
              isPartner={isPartner}
              bookingSuccess={bookingSuccess}
              setBookingSuccess={setBookingSuccess}
              bookingGuestCount={bookingGuestCount}
              setBookingGuestCount={setBookingGuestCount}
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              bookingTime={bookingTime}
              setBookingTime={setBookingTime}
              bookingSeating={bookingSeating}
              setBookingSeating={setBookingSeating}
              bookingCode={bookingCode}
              setBookingCode={setBookingCode}
              onConfirmBooking={handleConfirmBooking}
              showToast={showToast}
            />
          )}

          {activeTab === 'menu' && (
            <DetailMenuTab
              currentPlace={currentPlace}
              selectedMenuCategory={selectedMenuCategory}
              setSelectedMenuCategory={setSelectedMenuCategory}
              menuPage={menuPage}
              setMenuPage={setMenuPage}
              filteredMenuItems={filteredMenuItems}
              dynamicMenuBookPhotos={dynamicMenuBookPhotos}
              openLightboxWithIndex={openLightboxWithIndex}
              openLightboxWithImage={openLightboxWithImage}
            />
          )}

          {activeTab === 'ulasan' && (
            <DetailReviewsTab
              reviews={reviewsList}
              filteredReviews={filteredReviews}
              selectedStarFilter={selectedStarFilter}
              setSelectedStarFilter={setSelectedStarFilter}
              handleReviewSubmit={handleReviewSubmit}
              userRating={userRating}
              setUserRating={setUserRating}
              reviewInputText={reviewInputText}
              setReviewInputText={setReviewInputText}
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
              myReview={myReview}
              editingMyReview={editingMyReview}
              setEditingMyReview={setEditingMyReview}
              editReviewText={editReviewText}
              setEditReviewText={setEditReviewText}
              handleDeleteMyReview={handleDeleteMyReview}
              handleSaveEditReview={handleSaveEditReview}
            />
          )}

          {activeTab === 'lokasi' && (
            <DetailTransitTab
              currentPlace={currentPlace}
              mapZoom={mapZoom}
              setMapZoom={setMapZoom}
              handleCopyAddress={handleCopyAddress}
              currentTransitRoute={currentTransitRoute}
              transitInfo={transitInfo}
              handleCopyTransitRoute={handleCopyTransitRoute}
              activeTransitMode={activeTransitMode}
              setActiveTransitMode={setActiveTransitMode}
            />
          )}
        </div>
      </div>

      <DetailLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        slides={allSlides}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
      />
    </div>
  );
}
