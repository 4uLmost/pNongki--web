import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../lib/api';
import AdminStatCards from '../components/admin/AdminStatCards';
import AdminTempatTab from '../components/admin/AdminTempatTab';
import AdminPartnershipTab from '../components/admin/AdminPartnershipTab';
import AdminKelolaTab from '../components/admin/AdminKelolaTab';
import AdminAuditModal from '../components/admin/AdminAuditModal';

export default function AdminDashboardPage({ onNavigate, onSelectPlace }) {
  const { user: authUser } = useAuth();
  const user = authUser || (function() {
    try {
      const saved = localStorage.getItem('pnongki_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  })();
  const cleanEmail = (user?.email || '').toLowerCase().trim();
  const isSuperAdmin = user?.role === 'super_admin' || cleanEmail === 'superadmin@admin.pnongki';
  const isAdmin = isSuperAdmin || user?.role === 'admin' || cleanEmail.includes('@admin.pnongki');

  const [activeTab, setActiveTab] = useState('approval-tempat');
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [tempatFilter, setTempatFilter] = useState('pending');
  const [tempatSearch, setTempatSearch] = useState('');

  const [partnerFilter, setPartnerFilter] = useState('pending');
  const [partnerSearch, setPartnerSearch] = useState('');

  const [adminUsers, setAdminUsers] = useState([]);
  const [isAdminUsersLoading, setIsAdminUsersLoading] = useState(false);
  const [adminUsersError, setAdminUsersError] = useState(null);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState(null);

  const [previewPlace, setPreviewPlace] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAdminPlaces();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading admin places:', err);
      setError(err.message || 'Gagal mengambil data dari database.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    setIsAdminUsersLoading(true);
    setAdminUsersError(null);
    try {
      const data = await api.getAdminUsers();
      setAdminUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading admin users:', err);
      setAdminUsersError(err.message || 'Gagal memuat akun admin dari database.');
    } finally {
      setIsAdminUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
      if (isSuperAdmin) {
        loadAdminUsers();
      }
    }
  }, [isAdmin, isSuperAdmin]);

  const handleUpdatePlaceStatus = async (placeId, newStatus) => {
    setActionLoadingId(placeId);
    try {
      const updated = await api.updatePlaceStatus(placeId, newStatus);
      setPlaces((prev) =>
        prev.map((p) => (p.id === placeId ? { ...p, status: newStatus } : p))
      );
      if (previewPlace && previewPlace.id === placeId) {
        setPreviewPlace((prev) => ({ ...prev, status: newStatus }));
      }
      showToast(
        newStatus === 'approved'
          ? `Tempat "${updated.name}" BERHASIL DISETUJUI & tayang di aplikasi!`
          : `Tempat "${updated.name}" telah DITOLAK.`
      );
    } catch (err) {
      console.error('Gagal update status tempat:', err);
      showToast(`Gagal: ${err.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdatePartnership = async (placeId, newPartnershipStatus, isPartner) => {
    setActionLoadingId(placeId);
    try {
      const updated = await api.updatePartnershipStatus(placeId, newPartnershipStatus, isPartner);
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === placeId
            ? { ...p, partnership_status: newPartnershipStatus, is_partner: Boolean(isPartner) }
            : p
        )
      );
      if (previewPlace && previewPlace.id === placeId) {
        setPreviewPlace((prev) => ({
          ...prev,
          partnership_status: newPartnershipStatus,
          is_partner: Boolean(isPartner),
        }));
      }
      showToast(
        isPartner
          ? `Kemitraan "${updated.name}" RESMI DITERIMA sebagai Mitra Resmi pNongki!`
          : newPartnershipStatus === 'rejected'
          ? `Pengajuan kemitraan "${updated.name}" ditolak.`
          : `Status kemitraan "${updated.name}" telah dinonaktifkan.`
      );
    } catch (err) {
      console.error('Gagal update status kemitraan:', err);
      showToast(`Gagal: ${err.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      showToast('Harap lengkapi semua data admin baru!');
      return;
    }

    let normalizedEmail = newAdminEmail.trim().toLowerCase();
    if (!normalizedEmail.includes('@')) {
      normalizedEmail = `${normalizedEmail}@admin.pnongki`;
    }
    if (!normalizedEmail.endsWith('@admin.pnongki')) {
      showToast('Email admin harus berakhiran domain @admin.pnongki!');
      return;
    }

    setIsCreatingAdmin(true);
    try {
      const createdAdmin = await api.createAdminUser({
        name: newAdminName.trim(),
        email: normalizedEmail,
        password: newAdminPassword,
      });

      setAdminUsers((prev) => [createdAdmin, ...prev]);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      showToast(`Akun admin "${createdAdmin.email}" berhasil dibuat & aktif!`);
    } catch (err) {
      console.error('Gagal membuat admin baru:', err);
      showToast(`Gagal: ${err.message || 'Terjadi kesalahan saat membuat admin'}`);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (targetAdmin) => {
    if (targetAdmin.role === 'super_admin' || targetAdmin.email === 'superadmin@admin.pnongki') {
      showToast('Akun Super Admin utama tidak dapat dihapus!');
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mencabut akses dan menghapus admin "${targetAdmin.full_name || targetAdmin.email}"?`
    );
    if (!confirmed) return;

    setDeletingAdminId(targetAdmin.id);
    try {
      await api.deleteAdminUser(targetAdmin.id);
      setAdminUsers((prev) => prev.filter((a) => a.id !== targetAdmin.id));
      showToast(`Akun admin "${targetAdmin.email}" berhasil dihapus dari sistem.`);
    } catch (err) {
      console.error('Gagal menghapus admin:', err);
      showToast(`Gagal: ${err.message || 'Gagal menghapus admin'}`);
    } finally {
      setDeletingAdminId(null);
    }
  };

  const handleDeletePartnership = async (placeId) => {
    const targetPlace = places.find((p) => p.id === placeId);
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus status kemitraan untuk "${targetPlace?.name || 'tempat ini'}"?`
    );
    if (!confirmed) return;

    setActionLoadingId(placeId);
    try {
      await api.deletePartnership(placeId);
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === placeId
            ? { ...p, partnership_status: 'none', is_partner: false }
            : p
        )
      );
      showToast(`Kemitraan untuk "${targetPlace?.name || 'tempat'}" berhasil dihapus.`);
    } catch (err) {
      console.error('Gagal menghapus kemitraan:', err);
      showToast(`Gagal: ${err.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Regular places for Tambah Tempat tab (exclude places that requested partnership)
  const tempatPlaces = places.filter(
    (p) => !p.partnership_status || p.partnership_status === 'none'
  );
  // Partner places for Kemitraan tab
  const partnerPlaces = places.filter(
    (p) => (p.partnership_status && p.partnership_status !== 'none') || p.is_partner
  );

  const pendingTempatCount = tempatPlaces.filter((p) => p.status === 'pending').length;
  const pendingPartnerCount = partnerPlaces.filter((p) => p.partnership_status === 'pending').length;
  const activePartnerCount = partnerPlaces.filter((p) => p.is_partner).length;
  const totalTempatCount = places.length;
  const totalAdminCount = adminUsers.length;

  const filteredTempatPlaces = tempatPlaces.filter((p) => {
    if (tempatFilter === 'pending' && p.status !== 'pending') return false;
    if (tempatFilter === 'approved' && p.status !== 'approved') return false;
    if (tempatFilter === 'rejected' && p.status !== 'rejected') return false;
    if (tempatSearch.trim()) {
      const q = tempatSearch.toLowerCase().trim();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchAddr = (p.address || '').toLowerCase().includes(q);
      const matchCity = (p.city || '').toLowerCase().includes(q);
      return matchName || matchAddr || matchCity;
    }
    return true;
  });

  const filteredPartnerPlaces = partnerPlaces.filter((p) => {
    if (partnerFilter === 'pending' && p.partnership_status !== 'pending') return false;
    if (partnerFilter === 'active' && !p.is_partner) return false;
    if (partnerFilter === 'rejected' && p.partnership_status !== 'rejected') return false;
    if (partnerSearch.trim()) {
      const q = partnerSearch.toLowerCase().trim();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchAddr = (p.address || '').toLowerCase().includes(q);
      return matchName || matchAddr;
    }
    return true;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-surface pt-28 pb-16">
        <div className="max-w-md w-full bg-surface-card border border-border-hairline rounded-3xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]">gpp_maybe</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Akses Dibatasi Administrator</h2>
          <p className="text-sm text-charcoal-subtle mb-6 leading-relaxed">
            Halaman Dashboard Admin hanya dapat diakses oleh akun resmi yang didaftarkan oleh Super Admin dengan domain{' '}
            <code className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono text-xs">
              @admin.pnongki
            </code>
            .
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full py-2.5 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              Masuk dengan Akun Admin
            </button>
            <button
              type="button"
              onClick={() => onNavigate('beranda')}
              className="w-full py-2.5 rounded-full border border-border-hairline text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pt-24 pb-20 antialiased selection:bg-primary-container selection:text-on-primary-fixed">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-border-hairline max-w-md">
          <span className="material-symbols-outlined text-primary-container text-[20px] shrink-0">
            info
          </span>
          <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-hairline">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-xs ${
                  isSuperAdmin
                    ? 'bg-purple-700 text-white'
                    : 'bg-primary text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {isSuperAdmin ? 'shield_person' : 'verified_user'}
                </span>
                {isSuperAdmin ? 'SUPER ADMINISTRATOR' : 'PANEL ADMINISTRATOR'}
              </span>
              <span className="text-xs text-charcoal-subtle font-medium">
                Masuk sebagai <strong className="text-on-surface">{user?.email}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Dashboard {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-subtle mt-1 max-w-2xl">
              {isSuperAdmin
                ? 'Otoritas tertinggi pNongki!: Kelola approval tempat, verifikasi kemitraan resmi, dan daftarkan tim admin baru secara langsung.'
                : 'Pusat kurasi verifikasi tempat baru kiriman komunitas dan approval status kemitraan resmi pNongki! secara real-time.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                loadAdminData();
                if (isSuperAdmin) loadAdminUsers();
              }}
              disabled={isLoading || isAdminUsersLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-hairline bg-surface-card hover:bg-surface-container text-xs font-bold text-on-surface transition-colors cursor-pointer disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-[16px] text-charcoal-subtle ${
                  isLoading || isAdminUsersLoading ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
              <span>Segarkan Data</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tambah-tempat')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-inverse-surface hover:bg-black text-inverse-on-surface text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
              <span>Tambah Tempat Baru</span>
            </button>
          </div>
        </div>

        <AdminStatCards
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tempatFilter={tempatFilter}
          setTempatFilter={setTempatFilter}
          partnerFilter={partnerFilter}
          setPartnerFilter={setPartnerFilter}
          pendingTempatCount={pendingTempatCount}
          pendingPartnerCount={pendingPartnerCount}
          activePartnerCount={activePartnerCount}
          totalTempatCount={totalTempatCount}
          totalAdminCount={totalAdminCount}
          isSuperAdmin={isSuperAdmin}
          onLoadAdminUsers={loadAdminUsers}
        />

        <div className="flex items-center border-b border-border-hairline gap-2 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('approval-tempat')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'approval-tempat'
                ? 'border-primary text-primary'
                : 'border-transparent text-charcoal-subtle hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">add_location</span>
            <span>Approval Tambah Tempat</span>
            {pendingTempatCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-xs">
                {pendingTempatCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approval-partner')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'approval-partner'
                ? 'border-primary text-primary'
                : 'border-transparent text-charcoal-subtle hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">handshake</span>
            <span>Approval Partnership</span>
            {pendingPartnerCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-xs">
                {pendingPartnerCount}
              </span>
            )}
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('kelola-admin');
                loadAdminUsers();
              }}
              className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'kelola-admin'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                  : 'border-transparent text-charcoal-subtle hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-purple-600">
                shield_person
              </span>
              <span>Kelola Tim Admin</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-700 text-white shadow-xs">
                Super Admin
              </span>
            </button>
          )}
        </div>

        {activeTab === 'approval-tempat' && (
          <AdminTempatTab
            places={tempatPlaces}
            filteredTempatPlaces={filteredTempatPlaces}
            tempatFilter={tempatFilter}
            setTempatFilter={setTempatFilter}
            tempatSearch={tempatSearch}
            setTempatSearch={setTempatSearch}
            pendingTempatCount={pendingTempatCount}
            isLoading={isLoading}
            error={error}
            onRetry={loadAdminData}
            actionLoadingId={actionLoadingId}
            onUpdatePlaceStatus={handleUpdatePlaceStatus}
            onPreviewPlace={setPreviewPlace}
          />
        )}

        {activeTab === 'approval-partner' && (
          <AdminPartnershipTab
            places={partnerPlaces}
            filteredPartnerPlaces={filteredPartnerPlaces}
            partnerFilter={partnerFilter}
            setPartnerFilter={setPartnerFilter}
            partnerSearch={partnerSearch}
            setPartnerSearch={setPartnerSearch}
            pendingPartnerCount={pendingPartnerCount}
            activePartnerCount={activePartnerCount}
            isLoading={isLoading}
            error={error}
            onRetry={loadAdminData}
            actionLoadingId={actionLoadingId}
            onUpdatePartnership={handleUpdatePartnership}
            onDeletePartnership={handleDeletePartnership}
            onPreviewPlace={setPreviewPlace}
          />
        )}

        {activeTab === 'kelola-admin' && isSuperAdmin && (
          <AdminKelolaTab
            adminUsers={adminUsers}
            isAdminUsersLoading={isAdminUsersLoading}
            adminUsersError={adminUsersError}
            onLoadAdminUsers={loadAdminUsers}
            newAdminName={newAdminName}
            setNewAdminName={setNewAdminName}
            newAdminEmail={newAdminEmail}
            setNewAdminEmail={setNewAdminEmail}
            newAdminPassword={newAdminPassword}
            setNewAdminPassword={setNewAdminPassword}
            isCreatingAdmin={isCreatingAdmin}
            handleCreateAdminSubmit={handleCreateAdminSubmit}
            deletingAdminId={deletingAdminId}
            handleDeleteAdmin={handleDeleteAdmin}
          />
        )}
      </div>

      <AdminAuditModal
        previewPlace={previewPlace}
        onClose={() => setPreviewPlace(null)}
        onSelectPlace={onSelectPlace}
        onUpdatePlaceStatus={handleUpdatePlaceStatus}
      />
    </div>
  );
}
