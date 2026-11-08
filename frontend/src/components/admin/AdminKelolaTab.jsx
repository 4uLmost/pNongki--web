import React from 'react';

export default function AdminKelolaTab({
  adminUsers,
  isAdminUsersLoading,
  adminUsersError,
  onLoadAdminUsers,
  newAdminName,
  setNewAdminName,
  newAdminEmail,
  setNewAdminEmail,
  newAdminPassword,
  setNewAdminPassword,
  isCreatingAdmin,
  handleCreateAdminSubmit,
  deletingAdminId,
  handleDeleteAdmin,
}) {
  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-2xl bg-purple-700/10 border border-purple-700/30 flex items-start gap-3">
        <span className="material-symbols-outlined text-purple-700 dark:text-purple-300 text-[24px] shrink-0 mt-0.5">
          admin_panel_settings
        </span>
        <div>
          <h3 className="text-sm font-extrabold text-on-surface">
            Otoritas Super Administrator — Penambahan Akun Admin
          </h3>
          <p className="text-xs text-charcoal-subtle mt-0.5 leading-relaxed">
            Pengguna umum tidak dapat mendaftar sendiri sebagai admin melalui halaman registrasi publik.
            Hanya Anda sebagai Super Admin yang dapat menambahkan kredensial akun admin baru dengan domain{' '}
            <strong className="text-on-surface">@admin.pnongki</strong> untuk membantu moderasi konten.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-surface-card border border-border-hairline rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-hairline">
            <div className="w-8 h-8 rounded-xl bg-primary-container text-on-surface flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-on-surface">Daftarkan Admin Baru</h3>
              <p className="text-[11px] text-charcoal-subtle">
                Buat kredensial admin baru secara langsung ke Supabase
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Nama Lengkap Admin <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Email Akun (@admin.pnongki) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="nama.admin"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {!newAdminEmail.includes('@') && newAdminEmail.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-charcoal-subtle pointer-events-none">
                    @admin.pnongki
                  </span>
                )}
              </div>
              <span className="text-[10px] text-charcoal-subtle mt-1 block">
                Wajib berakhiran domain <strong>@admin.pnongki</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Kata Sandi Awal <span className="text-error">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border-hairline text-xs text-on-surface placeholder:text-charcoal-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isCreatingAdmin}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isCreatingAdmin ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">person_add</span>
              )}
              <span>{isCreatingAdmin ? 'Menyimpan ke Supabase...' : 'Buat Akun Admin Sekarang'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-surface-card border border-border-hairline rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-hairline">
            <div>
              <h3 className="text-sm font-extrabold text-on-surface">Daftar Tim Administrator</h3>
              <p className="text-[11px] text-charcoal-subtle">
                Total {adminUsers.length} akun admin terdaftar di sistem
              </p>
            </div>
            <button
              type="button"
              onClick={onLoadAdminUsers}
              disabled={isAdminUsersLoading}
              className="p-1.5 rounded-lg border border-border-hairline hover:bg-surface-container text-charcoal-subtle hover:text-on-surface transition-colors cursor-pointer"
              title="Segarkan daftar admin"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isAdminUsersLoading ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
            </button>
          </div>

          {isAdminUsersLoading ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-[28px] text-primary animate-spin">
                progress_activity
              </span>
              <p className="text-xs font-semibold text-charcoal-subtle mt-2">
                Memuat daftar admin...
              </p>
            </div>
          ) : adminUsersError ? (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">wifi_off</span>
              </div>
              <p className="text-xs text-charcoal-subtle">{adminUsersError}</p>
              <button
                type="button"
                onClick={onLoadAdminUsers}
                className="px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary-fixed hover:bg-accent-hover font-bold text-xs inline-flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : adminUsers.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-subtle">
              Belum ada data admin lain.
            </div>
          ) : (
            <div className="divide-y divide-border-hairline">
              {adminUsers.map((admin) => {
                const isTargetSuper = admin.role === 'super_admin';
                const isCurrentDeleting = deletingAdminId === admin.id;

                return (
                  <div
                    key={admin.id}
                    className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          isTargetSuper
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'bg-primary-container text-on-surface'
                        }`}
                      >
                        {(admin.full_name || admin.email || 'A')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-on-surface truncate">
                            {admin.full_name || 'Admin pNongki'}
                          </h4>
                          {isTargetSuper ? (
                            <span className="px-2 py-0.2 rounded text-[9px] font-extrabold bg-purple-700/20 text-purple-700 dark:text-purple-300 border border-purple-700/30 uppercase tracking-wider">
                              Super Admin
                            </span>
                          ) : (
                            <span className="px-2 py-0.2 rounded text-[9px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-charcoal-subtle truncate mt-0.5">
                          {admin.email}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isTargetSuper ? (
                        <span className="text-[11px] text-charcoal-subtle italic font-medium">
                          Akun Utama
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isCurrentDeleting}
                          onClick={() => handleDeleteAdmin(admin)}
                          className="px-3 py-1.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          title="Cabut akses & hapus akun admin"
                        >
                          {isCurrentDeleting ? (
                            <span className="material-symbols-outlined text-[14px] animate-spin">
                              progress_activity
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[14px]">
                              person_remove
                            </span>
                          )}
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

