export const MEMBERSHIP_LEVELS = [
  {
    id: 'baru',
    name: 'Warga Baru',
    tierName: 'Silver Member Card',
    minXp: 0,
    maxXp: 149,
    icon: 'eco',
    cardBg:
      'bg-gradient-to-br from-slate-800 via-zinc-900 to-neutral-950 text-slate-100 border-slate-700 shadow-xl',
    chipGradient: 'from-slate-200 via-zinc-300 to-slate-400 border-slate-300/80',
    accentColor: 'text-slate-300',
    badgeStyle: 'bg-slate-700/80 text-slate-200 border-slate-600',
    profileBadgeStyle: 'bg-slate-100 text-slate-900 border-slate-300 font-bold',
    progressBg: 'bg-slate-800/80',
    progressFill: 'bg-gradient-to-r from-slate-400 to-zinc-200',
    ambientColor: 'rgba(148, 163, 184, 0.35)',
    modalTopBg: 'from-slate-900/90',
    ambientBorder: 'border-slate-600/40',
    description: 'Tingkatan pertama untuk pengguna baru yang mulai menjelajahi spot nongki.',
    perks: [
      'Akses pencarian direktori kafe di seluruh kampus',
      'Menulis ulasan & rating bintang tempat',
      'Membaca dan berinteraksi di Feeds komunitas',
    ],
  },
  {
    id: 'nugas',
    name: 'Hobi Nugas',
    tierName: 'Sapphire Blue Member Card',
    minXp: 150,
    maxXp: 499,
    icon: 'laptop_chromebook',
    cardBg:
      'bg-gradient-to-br from-[#0c1e3d] via-[#09152b] to-[#040814] text-blue-50 border-blue-500/50 shadow-xl shadow-blue-950/40',
    chipGradient: 'from-cyan-200 via-blue-300 to-indigo-400 border-cyan-200/80',
    accentColor: 'text-cyan-400',
    badgeStyle: 'bg-blue-600/40 text-blue-200 border-blue-400/60',
    profileBadgeStyle: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
    progressBg: 'bg-blue-950/80',
    progressFill: 'bg-gradient-to-r from-blue-400 to-cyan-300',
    ambientColor: 'rgba(37, 99, 235, 0.4)',
    modalTopBg: 'from-[#06152d]/95',
    ambientBorder: 'border-blue-500/40',
    description: 'Level mahasiswa rajin yang aktif eksplor spot nugas berkoneksi kencang.',
    perks: [
      'Semua hak akses tingkat Warga Baru',
      'Lencana biru eksklusif di profil & forum Feeds',
      'Dapat menukarkan saldo poin dengan voucer kafe mitra',
      'Prioritas slot teman di sesi Ajak Nongkrong',
    ],
  },
  {
    id: 'sepuh',
    name: 'Sepuh Kopi',
    tierName: 'Gold Titanium Member Card',
    minXp: 500,
    maxXp: 999,
    icon: 'workspace_premium',
    cardBg:
      'bg-gradient-to-br from-[#2a1a06] via-[#3a250d] to-[#140c02] text-amber-50 border-amber-500/50 shadow-xl shadow-amber-950/40',
    chipGradient: 'from-amber-200 via-yellow-300 to-amber-400 border-amber-300/80',
    accentColor: 'text-amber-400',
    badgeStyle: 'bg-amber-500/30 text-amber-200 border-amber-400/60',
    profileBadgeStyle: 'bg-amber-100 text-amber-950 border-amber-400 font-extrabold',
    progressBg: 'bg-amber-950/80',
    progressFill: 'bg-gradient-to-r from-amber-400 to-yellow-200',
    ambientColor: 'rgba(217, 119, 6, 0.45)',
    modalTopBg: 'from-[#251505]/95',
    ambientBorder: 'border-amber-500/40',
    description: 'Tingkatan senior pencinta kopi dengan reputasi tinggi di komunitas.',
    perks: [
      'Semua hak akses tingkat Hobi Nugas',
      'Proses verifikasi tempat kontribusi diprioritaskan admin',
      'Akses penukaran merchandise edisi terbatas (Tumbler & Kaos)',
      'Lencana emas Sepuh Kopi di setiap postingan & balasan',
    ],
  },
  {
    id: 'master',
    name: 'Master Nongki',
    tierName: 'Obsidian Black & Green VIP Card',
    minXp: 1000,
    maxXp: Infinity,
    icon: 'diamond',
    cardBg:
      'bg-gradient-to-br from-[#0c0f0d] via-[#041a0d] to-[#010804] text-white border-primary/60 shadow-2xl shadow-primary/20',
    chipGradient: 'from-emerald-300 via-primary-container to-emerald-400 border-emerald-300/80',
    accentColor: 'text-primary-container',
    badgeStyle: 'bg-primary/30 text-primary-container border-primary/70',
    profileBadgeStyle: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-extrabold',
    progressBg: 'bg-emerald-950/80',
    progressFill: 'bg-gradient-to-r from-primary to-primary-container',
    ambientColor: 'rgba(16, 185, 129, 0.45)',
    modalTopBg: 'from-[#02180c]/95',
    ambientBorder: 'border-emerald-500/50',
    description: 'Tingkat tertinggi keanggotaan pNongki! dengan privilege maksimal komunitas.',
    perks: [
      'Kartu VIP eksklusif bertema Obsidian Black & Neon Green',
      'Akses instan ke seluruh rewards voucer & merchandise',
      'Undangan temu komunitas dan testing fitur rahasia platform',
      'Badge VIP Diamond hijau menyala di profil publik',
    ],
  },
];

export function getLevelByXp(xp) {
  if (xp >= 1000) return MEMBERSHIP_LEVELS[3];
  if (xp >= 500) return MEMBERSHIP_LEVELS[2];
  if (xp >= 150) return MEMBERSHIP_LEVELS[1];
  return MEMBERSHIP_LEVELS[0];
}

export function getNextLevel(xp) {
  if (xp >= 1000) return null;
  if (xp >= 500) return MEMBERSHIP_LEVELS[3];
  if (xp >= 150) return MEMBERSHIP_LEVELS[2];
  return MEMBERSHIP_LEVELS[1];
}

