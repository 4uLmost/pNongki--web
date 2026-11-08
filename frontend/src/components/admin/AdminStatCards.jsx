import React from 'react';

export default function AdminStatCards({
  activeTab,
  setActiveTab,
  tempatFilter,
  setTempatFilter,
  partnerFilter,
  setPartnerFilter,
  pendingTempatCount,
  pendingPartnerCount,
  activePartnerCount,
  totalTempatCount,
  totalAdminCount,
  isSuperAdmin,
  onLoadAdminUsers,
}) {
  return (
    <div
      className={`grid gap-3 sm:gap-4 my-6 ${
        isSuperAdmin ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setActiveTab('approval-tempat');
          setTempatFilter('pending');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setActiveTab('approval-tempat');
            setTempatFilter('pending');
          }
        }}
        className={`p-4 sm:p-5 rounded-2xl border transition-all text-left cursor-pointer ${
          activeTab === 'approval-tempat' && tempatFilter === 'pending'
            ? 'bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-500/20'
            : 'bg-surface-card border-border-hairline hover:border-outline-variant/60'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-charcoal-subtle uppercase tracking-wider">
            Pending Tempat
          </span>
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">pending_actions</span>
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">
          {pendingTempatCount}
        </div>
        <p className="text-[11px] text-charcoal-subtle mt-1 font-medium">
          Menunggu verifikasi admin
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setActiveTab('approval-partner');
          setPartnerFilter('pending');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setActiveTab('approval-partner');
            setPartnerFilter('pending');
          }
        }}
        className={`p-4 sm:p-5 rounded-2xl border transition-all text-left cursor-pointer ${
          activeTab === 'approval-partner' && partnerFilter === 'pending'
            ? 'bg-purple-500/10 border-purple-500/40 ring-2 ring-purple-500/20'
            : 'bg-surface-card border-border-hairline hover:border-outline-variant/60'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-charcoal-subtle uppercase tracking-wider">
            Pending Mitra
          </span>
          <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">handshake</span>
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">
          {pendingPartnerCount}
        </div>
        <p className="text-[11px] text-charcoal-subtle mt-1 font-medium">
          Pengajuan kemitraan baru
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setActiveTab('approval-partner');
          setPartnerFilter('active');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setActiveTab('approval-partner');
            setPartnerFilter('active');
          }
        }}
        className={`p-4 sm:p-5 rounded-2xl border transition-all text-left cursor-pointer ${
          activeTab === 'approval-partner' && partnerFilter === 'active'
            ? 'bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20'
            : 'bg-surface-card border-border-hairline hover:border-outline-variant/60'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-charcoal-subtle uppercase tracking-wider">
            Mitra Resmi
          </span>
          <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">
          {activePartnerCount}
        </div>
        <p className="text-[11px] text-charcoal-subtle mt-1 font-medium">
          Tempat berlabel Official Partner
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setActiveTab('approval-tempat');
          setTempatFilter('all');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setActiveTab('approval-tempat');
            setTempatFilter('all');
          }
        }}
        className={`p-4 sm:p-5 rounded-2xl border transition-all text-left cursor-pointer ${
          activeTab === 'approval-tempat' && tempatFilter === 'all'
            ? 'bg-primary/10 border-primary/40 ring-2 ring-primary/20'
            : 'bg-surface-card border-border-hairline hover:border-outline-variant/60'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-charcoal-subtle uppercase tracking-wider">
            Total Tempat
          </span>
          <span className="w-7 h-7 rounded-lg bg-surface-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">
          {totalTempatCount}
        </div>
        <p className="text-[11px] text-charcoal-subtle mt-1 font-medium">
          Seluruh rekaman di Supabase
        </p>
      </div>

      {isSuperAdmin && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setActiveTab('kelola-admin');
            if (onLoadAdminUsers) onLoadAdminUsers();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setActiveTab('kelola-admin');
              if (onLoadAdminUsers) onLoadAdminUsers();
            }
          }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all text-left cursor-pointer ${
            activeTab === 'kelola-admin'
              ? 'bg-purple-600/10 border-purple-600/40 ring-2 ring-purple-600/20'
              : 'bg-surface-card border-border-hairline hover:border-outline-variant/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Tim Admin
            </span>
            <span className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">
            {totalAdminCount || 2}
          </div>
          <p className="text-[11px] text-charcoal-subtle mt-1 font-medium">
            Admin terdaftar di pNongki!
          </p>
        </div>
      )}
    </div>
  );
}

