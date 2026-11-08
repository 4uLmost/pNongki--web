import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/useAuth';
import OwnerDashboardHero from '../components/owner/OwnerDashboardHero';
import OwnerStatCards from '../components/owner/OwnerStatCards';
import OwnerOverviewTab from '../components/owner/OwnerOverviewTab';
import OwnerReservationTab from '../components/owner/OwnerReservationTab';
import OwnerSupportTab from '../components/owner/OwnerSupportTab';

export default function OwnerDashboardPage({
  places = [],
  onNavigate,
  onSelectPlace,
  currentUser,
  selectedPlace,
}) {
  const { updateUserData } = useAuth();
  const [userPlaces, setUserPlaces] = useState([]);
  const [isLoadingUserPlaces, setIsLoadingUserPlaces] = useState(true);
  const [roleNotice, setRoleNotice] = useState('');

  // Muat tempat milik owner langsung dari backend
  const loadUserPlaces = useCallback(async () => {
    if (!currentUser?.id) {
      setUserPlaces([]);
      setIsLoadingUserPlaces(false);
      return;
    }
    setIsLoadingUserPlaces(true);
    try {
      const myPlaces = await api.getMyPlaces(currentUser.id);
      if (Array.isArray(myPlaces) && myPlaces.length > 0) {
        setUserPlaces(myPlaces);
      } else {
        // Fallback filter dari daftar tempat global
        const matched = places.filter(
          (p) =>
            String(p.added_by) === String(currentUser.id) ||
            String(p.owner_id) === String(currentUser.id)
        );
        setUserPlaces(matched);
      }
    } catch (err) {
      console.warn('Gagal memuat tempat owner:', err);
      const matched = places.filter(
        (p) =>
          String(p.added_by) === String(currentUser.id) ||
          String(p.owner_id) === String(currentUser.id)
      );
      setUserPlaces(matched);
    } finally {
      setIsLoadingUserPlaces(false);
    }
  }, [currentUser?.id, places]);

  useEffect(() => {
    loadUserPlaces();
  }, [loadUserPlaces]);

  // Filter HANYA tempat yang diajukan atau disetujui sebagai mitra
  const partnerPlaces = userPlaces.filter((p) => {
    const isMine =
      String(p.added_by) === String(currentUser?.id) ||
      String(p.owner_id) === String(currentUser?.id);
    const hasPartnership =
      (Boolean(p.is_partner) ||
        p.partnership_status === 'approved' ||
        p.partnership_status === 'pending') &&
      p.partnership_status !== 'none';
    return isMine && hasPartnership;
  });

  // Periksa apakah owner tidak memiliki tempat mitra; jika ya, kembalikan ke role user biasa
  useEffect(() => {
    if (!isLoadingUserPlaces && currentUser?.id && partnerPlaces.length === 0) {
      api.verifyAndSyncOwnerRole(currentUser.id).then((res) => {
        if (res && res.reverted) {
          updateUserData({ role: 'user' });
          setRoleNotice(
            'Role akun Anda telah disesuaikan kembali menjadi Pengguna Biasa karena tidak ada tempat mitra yang terdaftar.'
          );
        }
      }).catch((err) => {
        console.warn('Gagal verifikasi role owner:', err);
      });
    }
  }, [isLoadingUserPlaces, partnerPlaces.length, currentUser?.id, updateUserData]);

  const [activePlaceId, setActivePlaceId] = useState(
    selectedPlace?.id || (partnerPlaces.length > 0 ? partnerPlaces[0].id : null)
  );

  useEffect(() => {
    if (partnerPlaces.length > 0 && !partnerPlaces.some((p) => String(p.id) === String(activePlaceId))) {
      setActivePlaceId(partnerPlaces[0].id);
    }
  }, [partnerPlaces, activePlaceId]);

  const currentPlace =
    partnerPlaces.find((p) => String(p.id) === String(activePlaceId)) ||
    (selectedPlace && partnerPlaces.some((p) => String(p.id) === String(selectedPlace.id)) ? selectedPlace : null) ||
    partnerPlaces[0] ||
    null;

  const [activeTab, setActiveTab] = useState('ringkasan');
  const [toastMessage, setToastMessage] = useState('');
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservations, setReservations] = useState([]);

  const loadOwnerReservations = useCallback(async () => {
    if (!currentPlace?.id) {
      setReservations([]);
      return;
    }
    setIsLoadingReservations(true);
    setReservationsError(null);
    try {
      const data = await api.getPlaceReservations(currentPlace.id);
      if (Array.isArray(data)) {
        setReservations(data);
        return;
      }
      setReservations([]);
    } catch (err) {
      console.error('Gagal memuat reservasi owner:', err);
      setReservationsError(err?.message || 'Gagal mengambil data reservasi dari server.');
    } finally {
      setIsLoadingReservations(false);
    }
  }, [currentPlace?.id]);

  useEffect(() => {
    loadOwnerReservations();
  }, [loadOwnerReservations]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleUpdateReservationStatus = (id, newStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(
      newStatus === 'completed'
        ? 'Reservasi telah ditandai selesai.'
        : newStatus === 'cancelled'
        ? 'Reservasi telah dibatalkan.'
        : 'Status reservasi diperbarui.'
    );
  };

  return (
    <div className="min-h-screen bg-surface py-8 md:py-12">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#242424] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-[#d4e684]">info</span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        {roleNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">info</span>
              <span>{roleNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setRoleNotice('')}
              className="text-amber-700 hover:text-amber-900 p-1 rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Jika belum ada tempat mitra yang terdaftar, tampilkan Empty State */}
        {!isLoadingUserPlaces && partnerPlaces.length === 0 ? (
          <div className="bg-surface-card rounded-3xl p-8 md:p-12 border border-border-hairline shadow-xs flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-container/30 text-on-surface flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px]">storefront</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mb-2">
              Belum Ada Tempat Terdaftar Sebagai Mitra
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-subtle max-w-md mb-6 leading-relaxed">
              Tempat yang Anda tambahkan tanpa opsi kemitraan hanya didaftarkan sebagai rekomendasi publik komunitas. Dashboard ini khusus untuk tempat yang terdaftar sebagai <strong>Mitra Resmi pNongki</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('partnership-modal')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-container text-on-surface text-xs sm:text-sm font-bold hover:bg-accent-hover transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">handshake</span>
                <span>Ajukan Kemitraan Bisnis</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('explore')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border-hairline hover:border-black text-on-surface text-xs sm:text-sm font-bold transition-all cursor-pointer bg-surface"
              >
                Jelajahi Tempat Lain
              </button>
            </div>
          </div>
        ) : (
          <>
            <OwnerDashboardHero
              onNavigate={onNavigate}
              onSelectPlace={onSelectPlace}
              currentPlace={currentPlace}
              partnerPlaces={partnerPlaces}
              activePlaceId={activePlaceId}
              setActivePlaceId={setActivePlaceId}
            />

            <OwnerStatCards currentPlace={currentPlace} reservations={reservations} />

            <div className="flex items-center gap-2 p-1.5 bg-surface-card rounded-2xl border border-border-hairline shadow-2xs overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('ringkasan')}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'ringkasan'
                    ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
                    : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
                <span>Ringkasan &amp; Operasional</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reservasi')}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'reservasi'
                    ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
                    : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">event_seat</span>
                <span>Reservasi Meja ({reservations.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('operasional')}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'operasional'
                    ? 'bg-inverse-surface text-inverse-on-surface shadow-xs'
                    : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>Bantuan Kurator &amp; Legalitas</span>
              </button>
            </div>

            {activeTab === 'ringkasan' && (
              <OwnerOverviewTab
                currentPlace={currentPlace}
                reservations={reservations}
                onSelectPlace={onSelectPlace}
                onNavigate={onNavigate}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'reservasi' && (
              <OwnerReservationTab
                currentPlace={currentPlace}
                reservations={reservations}
                isLoadingReservations={isLoadingReservations}
                reservationsError={reservationsError}
                loadOwnerReservations={loadOwnerReservations}
                handleUpdateReservationStatus={handleUpdateReservationStatus}
              />
            )}

            {activeTab === 'operasional' && (
              <OwnerSupportTab showToast={showToast} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
