import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../lib/api';
import {
  MEMBERSHIP_LEVELS,
  getLevelByXp,
  getNextLevel,
} from '../components/profile/membershipData';
import ProfileHeader from '../components/profile/ProfileHeader';
import GamificationCards from '../components/profile/GamificationCards';
import ProfileTabsNav from '../components/profile/ProfileTabsNav';
import MyPlacesTab from '../components/profile/MyPlacesTab';
import PartnershipTab from '../components/profile/PartnershipTab';
import RewardCatalogTab from '../components/profile/RewardCatalogTab';
import ClaimTicketsTab from '../components/profile/ClaimTicketsTab';
import FavoritesTab from '../components/profile/FavoritesTab';
import ActivityTab from '../components/profile/ActivityTab';
import ConfirmExchangeModal from '../components/profile/ConfirmExchangeModal';
import SuccessRedeemModal from '../components/profile/SuccessRedeemModal';
import ClaimReceiptModal from '../components/profile/ClaimReceiptModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import EditPlaceModal from '../components/profile/EditPlaceModal';
import DeletePlaceModal from '../components/profile/DeletePlaceModal';
import LevelMembershipModal from '../components/profile/LevelMembershipModal';

export default function ProfilePage({
  onNavigate,
  onSelectPlace,
  favorites = [],
  onToggleFavorite,
  places = [],
  initialTab,
  scrollToRewards = false,
  currentUser = null,
  onOpenPartnershipModal,
}) {
  const auth = useAuth() || {};
  const updateUserData = auth.updateUserData;

  const [userProfile, setUserProfile] = useState(() => ({
    name: currentUser?.name || currentUser?.full_name || 'User pNongki!',
    role: currentUser?.role || 'user',
    xpPoints: currentUser?.xpPoints ?? 0,
    pointsBalance: currentUser?.pointsBalance ?? 0,
    pointsExpiry: '31 Desember 2026',
  }));

  const userInitials = (userProfile.name || 'Pengguna')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'P';

  const userLevel = getLevelByXp(userProfile.xpPoints);
  const nextLevel = getNextLevel(userProfile.xpPoints);

  const [showLevelModal, setShowLevelModal] = useState(false);
  const activeCardLevel = userLevel;
  const userLevelIndex = Math.max(
    0,
    MEMBERSHIP_LEVELS.findIndex((l) => l.id === userLevel.id)
  );

  const [activeTab, setActiveTab] = useState(initialTab || 'tempat-saya');
  const [selectedRewardType, setSelectedRewardType] = useState('all');
  const [rewards, setRewards] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const [myPlaces, setMyPlaces] = useState([]);
  const [editingPlace, setEditingPlace] = useState(null);
  const [deletingPlace, setDeletingPlace] = useState(null);

  const [businessClaims, setBusinessClaims] = useState([]);
  const [isClaimsLoading, setIsClaimsLoading] = useState(false);
  const [isLoadingProfileData, setIsLoadingProfileData] = useState(Boolean(currentUser?.id));
  const [profileLoadError, setProfileLoadError] = useState(null);

  useEffect(() => {
    if (scrollToRewards || initialTab === 'katalog-reward') {
      const scrollTimer = setTimeout(() => {
        const target =
          document.getElementById('katalog-reward-section') ||
          document.getElementById('profile-tabs-section');
        if (target) {
          const yOffset = -90;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(scrollTimer);
    }
  }, [scrollToRewards, initialTab]);

  const [claimsHistory, setClaimsHistory] = useState([]);

  const [activityStats, setActivityStats] = useState(() => ({
    reviewsCount: 0,
    hangoutsCount: 0,
    threadsCount: 0,
    logs: [],
  }));

  const [activeReceiptModal, setActiveReceiptModal] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [confirmingReward, setConfirmingReward] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [successRedeemData, setSuccessRedeemData] = useState(null);
  const [successCountdown, setSuccessCountdown] = useState(5);

  useEffect(() => {
    if (!successRedeemData) return;
    setSuccessCountdown(5);

    const timer = setInterval(() => {
      setSuccessCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSuccessRedeemData(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [successRedeemData]);

  const [showQr, setShowQr] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(30);
  const [qrToken, setQrToken] = useState(() => Date.now());
  const [qrImgError, setQrImgError] = useState(false);

  useEffect(() => {
    if (!activeReceiptModal) {
      setShowQr(false);
      setQrCountdown(30);
      setQrImgError(false);
    }
  }, [activeReceiptModal]);

  useEffect(() => {
    if (!showQr || !activeReceiptModal) return;
    if (qrCountdown <= 0) return;

    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showQr, activeReceiptModal, qrCountdown]);

  const handleToggleQr = () => {
    if (!showQr) {
      setQrCountdown(30);
      setQrToken(Date.now());
      setQrImgError(false);
      setShowQr(true);
    } else {
      setShowQr(false);
    }
  };

  const handleRefreshQr = () => {
    setQrCountdown(30);
    setQrToken(Date.now());
    setQrImgError(false);
  };

  const [editName, setEditName] = useState(userProfile.name);

  const loadProfileData = async () => {
    setIsLoadingProfileData(true);
    setIsClaimsLoading(true);
    setProfileLoadError(null);

    try {
      const fetchTasks = [
        api.getRewards().catch((err) => {
          console.warn('Gagal memuat rewards:', err);
          return [];
        }),
      ];

      if (currentUser?.id) {
        fetchTasks.push(
          api.getUserProfile(currentUser.id).catch((err) => {
            console.warn('Gagal memuat profil pengguna:', err);
            return null;
          }),
          api.getMyClaims(currentUser.id).catch((err) => {
            console.warn('Gagal memuat riwayat klaim:', err);
            return [];
          }),
          api.getMyPlaces(currentUser.id).catch((err) => {
            console.warn('Gagal memuat tempat kontribusi:', err);
            return [];
          }),
          api.getMyBusinessClaims(currentUser.id).catch((err) => {
            console.warn('Gagal memuat pengajuan kemitraan:', err);
            return [];
          }),
          api.getUserActivity(currentUser.id).catch((err) => {
            console.warn('Gagal memuat data aktivitas:', err);
            return null;
          }),
        );
      }

      const results = await Promise.all(fetchTasks);
      const backendRewards = results[0];
      const profile = results[1] || null;
      const backendClaims = results[2] || [];
      const placesData = results[3] || [];
      const claimsData = results[4] || [];
      const statsData = results[5] || null;

      if (Array.isArray(backendRewards)) {
        setRewards(backendRewards);
      }

      if (currentUser?.id) {
        if (profile) {
          setUserProfile((prev) => ({
            ...prev,
            name: profile.name || prev.name,
            role: profile.role || prev.role,
            xpPoints: profile.xpPoints ?? prev.xpPoints,
            pointsBalance: profile.pointsBalance ?? prev.pointsBalance,
          }));
          setEditName(profile.name || userProfile.name);
        }
        if (Array.isArray(backendClaims)) {
          setClaimsHistory(backendClaims);
        }
        if (Array.isArray(placesData)) {
          setMyPlaces(placesData);
        }
        if (Array.isArray(claimsData)) {
          setBusinessClaims(claimsData);
        }
        if (statsData) {
          setActivityStats(statsData);
        }
      } else {
        setMyPlaces([]);
        setClaimsHistory([]);
        setBusinessClaims([]);
        setActivityStats({ reviewsCount: 0, hangoutsCount: 0, threadsCount: 0, logs: [] });
      }
    } catch (err) {
      console.error('Error saat sinkronisasi data profil:', err);
      setProfileLoadError('Gagal menyinkronkan data profil dari database. Pastikan koneksi internet aktif.');
    } finally {
      setIsLoadingProfileData(false);
      setIsClaimsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [currentUser?.id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const filteredRewards = rewards.filter((r) => {
    if (selectedRewardType !== 'all' && r.type !== selectedRewardType) return false;
    return true;
  });

  const uniqueBusinessClaims = React.useMemo(() => {
    const seen = new Set();
    return (businessClaims || []).filter((c) => {
      const key = c.placeId ? String(c.placeId) : String(c.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [businessClaims]);

  const favoritePlaces = (Array.isArray(places) ? places : []).filter(
    (p) => p && Array.isArray(favorites) && favorites.includes(p.id)
  );

  const handleInitiateRedeem = (reward) => {
    if (userProfile.pointsBalance < reward.pointCost) {
      alert(`Saldo poin kamu tidak mencukupi! Butuh ${reward.pointCost} Poin, saldo kamu: ${userProfile.pointsBalance} Poin.`);
      return;
    }

    if (reward.stock <= 0) {
      alert('Maaf, stok hadiah ini sedang habis!');
      return;
    }

    setConfirmingReward(reward);
  };

  const handleExecuteRedeem = async () => {
    if (!confirmingReward) return;
    const reward = confirmingReward;
    setIsRedeeming(true);

    try {
      const claimResult = await api.claimReward(
        reward.id,
        userProfile.pointsBalance,
        currentUser?.id,
      );

      const newPoints =
        claimResult?.remainingPoints !== undefined
          ? claimResult.remainingPoints
          : Math.max(0, userProfile.pointsBalance - reward.pointCost);

      setUserProfile((prev) => ({
        ...prev,
        pointsBalance: newPoints,
      }));
      if (updateUserData) {
        updateUserData({ pointsBalance: newPoints });
      }

      setRewards((prev) =>
        prev.map((item) =>
          item.id === reward.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item
        )
      );

      const prefix = reward.type === 'merchandise' ? '#MCH' : '#VCR';
      const fallbackTicket = {
        id: `clm-${Date.now()}`,
        claimCode: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: reward.title,
        type: reward.type,
        pointCost: reward.pointCost,
        claimedAt: 'Hari ini',
        status: reward.type === 'merchandise' ? 'menunggu_pengambilan' : 'completed',
        voucherCode: reward.voucherCode || null,
      };

      const finalTicket = claimResult?.ticket || fallbackTicket;
      setClaimsHistory((prev) => [finalTicket, ...prev]);

      setConfirmingReward(null);
      setSuccessRedeemData({
        reward,
        ticket: finalTicket,
      });
    } catch (err) {
      console.error('Gagal menukarkan reward:', err);
      showToast(err.message || 'Gagal memproses penukaran poin. Silakan coba lagi.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updatedName = editName.trim();
    if (!updatedName) return;

    setUserProfile((prev) => ({
      ...prev,
      name: updatedName,
    }));

    if (updateUserData) {
      updateUserData({
        name: updatedName,
        full_name: updatedName,
      });
    }

    if (currentUser?.id && !isDemoUser) {
      await api.updateUserProfile(currentUser.id, {
        name: updatedName,
      });
    }

    setShowEditProfileModal(false);
    showToast('Profil berhasil diperbarui!');
  };

  const handleSavePlaceEdit = (e) => {
    e.preventDefault();
    if (!editingPlace) return;

    setMyPlaces((prev) =>
      prev.map((item) =>
        item.id === editingPlace.id
          ? {
              ...editingPlace,
              status: 'pending_audit',
              auditNote: 'Perubahan data berhasil dikirim dan sedang dalam proses kurasi audit Admin pNongki.',
              lastUpdated: 'Baru saja (Menunggu Audit)',
            }
          : item
      )
    );
    setEditingPlace(null);
    showToast('Perubahan tempat berhasil disimpan! Menunggu audit kembali oleh admin.');
  };

  const [isDeletingClaimId, setIsDeletingClaimId] = useState(null);

  const handleDeleteClaim = async (claim) => {
    const placeName = claim.placeName || claim.businessName || 'tempat ini';
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin membatalkan dan menghapus kemitraan untuk "${placeName}"?`
    );
    if (!confirmed) return;

    setIsDeletingClaimId(claim.id);
    try {
      let roleReverted = false;
      if (claim.id && !String(claim.id).startsWith('place-claim-')) {
        const res = await api.deleteBusinessClaim(claim.id, currentUser?.id);
        if (res?.roleReverted) roleReverted = true;
      }

      const placeId = claim.placeId || claim.place_id;
      if (placeId) {
        const res = await api.deletePartnership(placeId, currentUser?.id);
        if (res?.roleReverted) roleReverted = true;
      }

      if (currentUser?.id) {
        const syncRes = await api.verifyAndSyncOwnerRole(currentUser.id);
        if (syncRes?.role === 'user' || syncRes?.reverted) {
          roleReverted = true;
        }
      }

      if (roleReverted) {
        setUserProfile((prev) => ({ ...prev, role: 'user' }));
        if (typeof updateUserData === 'function') {
          updateUserData({ role: 'user' });
        }
        showToast(`Kemitraan "${placeName}" dihapus. Status Anda telah kembali menjadi pengguna biasa.`);
      } else {
        showToast(`Kemitraan "${placeName}" berhasil dihapus.`);
      }

      await loadProfileData();
    } catch (err) {
      console.error('Gagal menghapus kemitraan:', err);
      showToast(`Gagal: ${err.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setIsDeletingClaimId(null);
    }
  };

  const handleConfirmDeletePlace = async () => {
    if (!deletingPlace) return;
    try {
      const res = await api.deletePlace(deletingPlace.id, currentUser?.id);
      setMyPlaces((prev) => prev.filter((item) => item.id !== deletingPlace.id));

      let roleReverted = res?.roleReverted;
      if (currentUser?.id) {
        const syncRes = await api.verifyAndSyncOwnerRole(currentUser.id);
        if (syncRes?.role === 'user' || syncRes?.reverted) {
          roleReverted = true;
        }
      }

      if (roleReverted) {
        setUserProfile((prev) => ({ ...prev, role: 'user' }));
        if (typeof updateUserData === 'function') {
          updateUserData({ role: 'user' });
        }
        showToast(`Tempat "${deletingPlace.name}" berhasil dihapus. Status Anda kembali menjadi pengguna biasa.`);
      } else {
        showToast(`Tempat "${deletingPlace.name}" berhasil dihapus.`);
      }

      await loadProfileData();
    } catch (err) {
      console.error('Gagal menghapus tempat:', err);
      showToast(`Gagal: ${err.message || 'Gagal menghapus tempat'}`);
    } finally {
      setDeletingPlace(null);
    }
  };

  return (
    <div className="w-full bg-surface min-h-screen text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-fixed">
      {toastMessage && (
        <div className="fixed bottom-8 left-6 md:left-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-border-hairline">
          <span className="material-symbols-outlined text-primary-container text-[20px]">
            check_circle
          </span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1240px] w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-charcoal-subtle font-medium"
        >
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="hover:text-on-surface transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Akun Saya</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">Profil &amp; Saldo Poin</span>
        </nav>

        <ProfileHeader
          userProfile={userProfile}
          userLevel={userLevel}
          userInitials={userInitials}
          onOpenEditProfile={() => setShowEditProfileModal(true)}
          businessClaims={businessClaims}
          places={places}
          onOpenPartnershipModal={onOpenPartnershipModal}
          onNavigate={onNavigate}
          setActiveTab={setActiveTab}
        />

        <GamificationCards
          userProfile={userProfile}
          activeCardLevel={activeCardLevel}
          nextLevel={nextLevel}
          onOpenLevelModal={() => setShowLevelModal(true)}
          onGoToRewardCatalog={() => {
            setActiveTab('katalog-reward');
            setTimeout(() => {
              const target =
                document.getElementById('katalog-reward-section') ||
                document.getElementById('profile-tabs-section');
              if (target) {
                const yOffset = -90;
                const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }, 50);
          }}
        />

        <ProfileTabsNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          myPlacesCount={myPlaces.length}
          businessClaimsCount={uniqueBusinessClaims.length}
          hasApprovedClaim={uniqueBusinessClaims.some((c) => {
            const p = places.find(
              (pl) => String(pl.id) === String(c.placeId || c.place_id)
            );
            const isPending =
              c.status === 'pending' ||
              c.partnership_status === 'pending' ||
              p?.partnership_status === 'pending';
            return (
              !isPending &&
              (c.status === 'approved' ||
                c.partnership_status === 'approved' ||
                p?.partnership_status === 'approved')
            );
          })}
          claimsHistoryCount={claimsHistory.length}
          favoritesCount={favorites.length}
        />

        {activeTab === 'tempat-saya' ? (
          <MyPlacesTab
            myPlaces={myPlaces}
            isLoadingProfileData={isLoadingProfileData}
            profileLoadError={profileLoadError}
            loadProfileData={loadProfileData}
            onNavigate={onNavigate}
            setEditingPlace={setEditingPlace}
            setDeletingPlace={setDeletingPlace}
          />
        ) : activeTab === 'kemitraan' ? (
          <PartnershipTab
            businessClaims={uniqueBusinessClaims}
            places={places}
            isLoadingProfileData={isLoadingProfileData}
            isClaimsLoading={isClaimsLoading}
            profileLoadError={profileLoadError}
            loadProfileData={loadProfileData}
            onOpenPartnershipModal={onOpenPartnershipModal}
            onNavigate={onNavigate}
            onSelectPlace={onSelectPlace}
            onDeleteClaim={handleDeleteClaim}
            isDeletingClaimId={isDeletingClaimId}
          />
        ) : activeTab === 'katalog-reward' ? (
          <RewardCatalogTab
            selectedRewardType={selectedRewardType}
            setSelectedRewardType={setSelectedRewardType}
            pointsBalance={userProfile.pointsBalance}
            isLoadingProfileData={isLoadingProfileData}
            profileLoadError={profileLoadError}
            loadProfileData={loadProfileData}
            filteredRewards={filteredRewards}
            handleInitiateRedeem={handleInitiateRedeem}
          />
        ) : activeTab === 'riwayat-klaim' ? (
          <ClaimTicketsTab
            claimsHistory={claimsHistory}
            isLoadingProfileData={isLoadingProfileData}
            profileLoadError={profileLoadError}
            loadProfileData={loadProfileData}
            setActiveReceiptModal={setActiveReceiptModal}
            onOpenRewardCatalog={() => setActiveTab('katalog-reward')}
          />
        ) : activeTab === 'favorit' ? (
          <FavoritesTab
            favoritePlaces={favoritePlaces}
            onNavigate={onNavigate}
            onSelectPlace={onSelectPlace}
            onToggleFavorite={onToggleFavorite}
          />
        ) : (
          <ActivityTab
            isLoadingProfileData={isLoadingProfileData}
            profileLoadError={profileLoadError}
            loadProfileData={loadProfileData}
            myPlacesCount={myPlaces.length}
            activityStats={activityStats}
          />
        )}
      </div>

      <ConfirmExchangeModal
        reward={confirmingReward}
        userPoints={userProfile.pointsBalance}
        isRedeeming={isRedeeming}
        onConfirm={handleExecuteRedeem}
        onClose={() => setConfirmingReward(null)}
      />

      <SuccessRedeemModal
        data={successRedeemData}
        countdown={successCountdown}
        onClose={() => setSuccessRedeemData(null)}
        onViewVoucher={(ticket) => setActiveReceiptModal(ticket)}
      />

      <ClaimReceiptModal
        ticket={activeReceiptModal}
        showQr={showQr}
        qrCountdown={qrCountdown}
        qrToken={qrToken}
        qrImgError={qrImgError}
        setQrImgError={setQrImgError}
        handleToggleQr={handleToggleQr}
        handleRefreshQr={handleRefreshQr}
        onClose={() => setActiveReceiptModal(null)}
        showToast={showToast}
      />

      <EditProfileModal
        isOpen={showEditProfileModal}
        name={editName}
        setName={setEditName}
        onSubmit={handleSaveProfile}
        onClose={() => setShowEditProfileModal(false)}
      />

      <EditPlaceModal
        editingPlace={editingPlace}
        setEditingPlace={setEditingPlace}
        onSubmit={handleSavePlaceEdit}
        onClose={() => setEditingPlace(null)}
      />

      <DeletePlaceModal
        deletingPlace={deletingPlace}
        onConfirm={handleConfirmDeletePlace}
        onClose={() => setDeletingPlace(null)}
      />

      <LevelMembershipModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        initialIndex={userLevelIndex}
        userProfile={userProfile}
        userLevel={userLevel}
      />
    </div>
  );
}
