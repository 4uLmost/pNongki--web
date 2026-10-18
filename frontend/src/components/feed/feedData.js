export const BADGES = {
  sepuh: {
    name: 'Sepuh Kopi',
    icon: 'workspace_premium',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  nugas: {
    name: 'Hobi Nugas',
    icon: 'laptop_chromebook',
    color: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  baru: {
    name: 'Warga Baru',
    icon: 'eco',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  owner: {
    name: 'Owner Kafe',
    icon: 'storefront',
    color: 'bg-purple-100 text-purple-900 border-purple-300',
  },
};

export function getTotalCommentsCount(comments) {
  if (!Array.isArray(comments)) return 0;
  let count = 0;
  for (const c of comments) {
    count += 1;
    if (Array.isArray(c.replies)) {
      count += c.replies.length;
    }
  }
  return count;
}
