import React from 'react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onClearNotifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onDeleteNotification,
  onClearAllNotifications,
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.isUnread).length;
  const handleMarkAll = onMarkAllAsRead || onClearNotifications;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:w-[380px] bg-surface-card shadow-2xl flex flex-col border-l border-border-hairline"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-hairline bg-surface-card">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">Notifikasi</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-fixed text-[11px] font-extrabold">
                {unreadCount} Baru
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && handleMarkAll && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-xs text-charcoal-subtle hover:text-primary transition-colors font-medium cursor-pointer"
              >
                Tandai dibaca
              </button>
            )}
            {notifications.length > 0 && onClearAllNotifications && (
              <button
                type="button"
                onClick={onClearAllNotifications}
                className="text-xs text-charcoal-subtle hover:text-error transition-colors font-medium cursor-pointer"
                title="Hapus semua notifikasi"
              >
                Hapus semua
              </button>
            )}
            <button
              type="button"
              aria-label="Tutup notifikasi"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-charcoal-subtle text-xs flex flex-col items-center justify-center my-auto">
              <span className="material-symbols-outlined text-[42px] text-gray-300 block mb-2">
                notifications_none
              </span>
              <p className="font-bold text-sm text-on-surface mb-1">Belum Ada Notifikasi</p>
              <p className="text-xs text-charcoal-subtle max-w-xs leading-relaxed">
                Pemberitahuan verifikasi tempat, ajakan nongkrong, dan balasan feeds Anda akan muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => onMarkAsRead && onMarkAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex gap-3 relative group ${
                  item.isUnread
                    ? item.icon === 'cancel' || (item.title || '').includes('Ditolak')
                      ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50/80'
                      : 'bg-primary-container/20 border-primary-container/60 hover:bg-primary-container/30'
                    : 'bg-surface-card border-border-hairline hover:border-outline-variant'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.icon === 'cancel' || (item.title || '').includes('Ditolak')
                      ? 'bg-rose-100 text-rose-700'
                      : item.isUnread
                      ? 'bg-primary-container text-on-primary-fixed'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon || 'notifications'}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-on-surface leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.isUnread && (
                        <span
                          className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${
                            item.icon === 'cancel' || (item.title || '').includes('Ditolak')
                              ? 'bg-rose-600'
                              : 'bg-primary'
                          }`}
                        />
                      )}
                      {onDeleteNotification && (
                        <button
                          type="button"
                          aria-label="Hapus notifikasi"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(item.id);
                          }}
                          className="w-6 h-6 rounded-md hover:bg-error/15 text-charcoal-subtle hover:text-error flex items-center justify-center transition-colors cursor-pointer"
                          title="Hapus notifikasi ini"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-[10px] text-charcoal-subtle font-medium mt-0.5">
                    {item.timeAgo || 'Baru saja'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border-hairline bg-surface-card flex items-center gap-2">
          {notifications.length > 0 && onClearAllNotifications && (
            <button
              type="button"
              onClick={onClearAllNotifications}
              className="px-4 py-2.5 rounded-xl border border-border-hairline hover:border-error/40 hover:bg-error/10 text-charcoal-subtle hover:text-error text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Hapus Semua</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>Tutup Notifikasi</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
