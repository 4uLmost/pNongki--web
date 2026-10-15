import React, { useState, useEffect, useRef } from 'react';

export default function Navbar({
  currentPage,
  onNavigate,
  favoritesCount = 0,
  notificationsCount = 0,
  onOpenFavorites,
  onOpenNotifications,
  onLogout,
  currentUser = null,
  onOpenPartnershipModal,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AU';
  const userName = currentUser?.name || currentUser?.full_name || 'Anak Ulama';
  const userEmail = currentUser?.email || 'user@pnongki.id';
  const cleanEmail = (currentUser?.email || '').toLowerCase().trim();
  const isSuperAdminUser = currentUser?.role === 'super_admin' || cleanEmail === 'superadmin@admin.pnongki';
  const isAdminUser = isSuperAdminUser || currentUser?.role === 'admin' || cleanEmail.includes('@admin.pnongki');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-card/95 backdrop-blur-md border-b border-border-hairline shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Logo Brand */}
        <button
          type="button"
          onClick={() => onNavigate('beranda')}
          className="flex items-center group shrink-0 cursor-pointer text-left focus:outline-none"
        >
          <img
            src="/pNongki-Logo.png"
            alt="pNongki!"
            className="h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavigate('beranda')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              currentPage === 'beranda'
                ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Beranda
          </button>
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              currentPage === 'explore'
                ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Explore
          </button>
          <button
            type="button"
            onClick={() => onNavigate('tambah-tempat')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              currentPage === 'tambah-tempat'
                ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Tambah Tempat
          </button>
          <button
            type="button"
            onClick={() => onNavigate('feeds')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              currentPage === 'feeds'
                ? 'bg-primary-container text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Feeds
          </button>

          {/* Admin Dashboard Quick Link (Khusus Admin & Super Admin) */}
          {isAdminUser && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className={`ml-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'admin'
                  ? isSuperAdminUser
                    ? 'bg-purple-700 text-white shadow-xs font-extrabold ring-2 ring-purple-600/30'
                    : 'bg-primary text-white shadow-xs font-extrabold ring-2 ring-primary/20'
                  : isSuperAdminUser
                  ? 'bg-purple-700/10 text-purple-700 dark:text-purple-300 hover:bg-purple-700/20 border border-purple-700/30'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSuperAdminUser ? 'shield_person' : 'admin_panel_settings'}
              </span>
              <span>{isSuperAdminUser ? 'Super Admin' : 'Admin Panel'}</span>
            </button>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {/* Tombol Favorit */}
            <button
              type="button"
              aria-label="Favorit Saya"
              onClick={onOpenFavorites}
              className="relative w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-card"></span>
              )}
            </button>

            {/* Tombol Notifikasi */}
            <button
              type="button"
              aria-label="Notifikasi"
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {notificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-card"></span>
              )}
            </button>
          </div>

          <div className="h-6 w-0.5 bg-outline-variant/60 rounded-full"></div>

          {/* Profile Dropdown / Auth Buttons */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border transition-all cursor-pointer select-none ${
                  isDropdownOpen || currentPage === 'profile' || currentPage === 'profil'
                    ? 'border-primary bg-primary-container/40 ring-2 ring-primary/20'
                    : 'border-border-hairline hover:bg-surface-container'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-primary-container text-on-surface font-extrabold text-xs flex items-center justify-center">
                  {userInitials}
                </div>
                <span className="text-xs font-bold text-on-surface hidden sm:inline">{userName}</span>
                <span
                  className={`material-symbols-outlined text-[16px] text-charcoal-subtle transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>

              {/* Dropdown Popover */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-card rounded-2xl shadow-xl border border-border-hairline py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Info Singkat Akun */}
                  <div className="px-4 py-2 border-b border-border-hairline mb-1">
                    <p className="text-xs font-extrabold text-on-surface truncate">{userName}</p>
                    <p className="text-[11px] text-charcoal-subtle truncate">{userEmail}</p>
                    {(currentUser.role || isAdminUser) && (
                      <span
                        className={`inline-block mt-1 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                          isSuperAdminUser
                            ? 'bg-purple-700/20 text-purple-700 dark:text-purple-300 border border-purple-700/30'
                            : 'bg-surface-container text-primary'
                        }`}
                      >
                        {isSuperAdminUser ? 'SUPER ADMIN' : isAdminUser ? 'ADMIN' : currentUser.role}
                      </span>
                    )}
                  </div>

                  {/* 0. Admin Dashboard Link */}
                  {isAdminUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-primary hover:bg-primary/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSuperAdminUser ? 'shield_person' : 'admin_panel_settings'}
                      </span>
                      <span>Dashboard {isSuperAdminUser ? 'Super Admin' : 'Admin'}</span>
                    </button>
                  )}

                  {/* 0b. Owner Dashboard Link */}
                  {currentUser?.role === 'owner' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigate('owner-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">storefront</span>
                      <span>Dashboard Owner</span>
                    </button>
                  )}

                  {/* 1. Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onNavigate('profile', { tab: 'tempat-saya', modal: null });
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    <span>Profile</span>
                  </button>

                  {/* 2. Rewards */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onNavigate('profile', {
                        tab: 'katalog-reward',
                        modal: null,
                        scrollToRewards: true,
                      });
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-amber-500">redeem</span>
                    <span>Rewards</span>
                  </button>

                  {/* 3. Ajukan Bisnis */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onOpenPartnershipModal) {
                        onOpenPartnershipModal();
                      } else {
                        onNavigate('partnership-modal');
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">storefront</span>
                    <span>Ajukan Bisnis</span>
                  </button>

                  {/* Garis Pemisah (Divider) */}
                  <div className="my-1.5 border-t border-border-hairline"></div>

                  {/* 4. Log-out */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onLogout) {
                        onLogout();
                      } else {
                        onNavigate('login');
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-error hover:bg-error/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Log-out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="px-4 py-2 rounded-full text-xs font-extrabold bg-inverse-surface hover:bg-black text-inverse-on-surface shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
