import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  campus: string;
  role: 'mahasiswa' | 'owner' | 'admin' | 'super_admin' | string;
  xpPoints: number;
  pointsBalance: number;
  pointsExpiry: string;
  avatarUrl?: string | null;
}

export class BusinessClaimDto {
  userId?: string;
  businessName: string;
  contactPerson: string;
  whatsappNumber: string;
  socialMediaLink?: string;
  placeId?: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readNotificationIds = new Set<string>();
  private deletedNotificationIds = new Set<string>();

  constructor(private readonly supabaseService: SupabaseService) {}

  async getProfile(userId?: string): Promise<UserProfile | null> {
    if (!userId) {
      return null;
    }

    try {
      const client = this.supabaseService.getAdminClient();
      const { data, error } = await client.from('users').select('*').eq('id', userId).maybeSingle();
      if (!error && data) {
        const cleanEmail = (data.email || '').toLowerCase().trim();
        const isSuperAdmin = cleanEmail === 'superadmin@admin.pnongki' || data.role === 'super_admin';
        const isAdmin = isSuperAdmin || cleanEmail.includes('@admin.pnongki') || data.role === 'admin';
        let resolvedRole = isSuperAdmin ? 'super_admin' : isAdmin ? 'admin' : (data.role || 'user');

        if (resolvedRole === 'owner') {
          // Periksa apakah owner memiliki tempat kemitraan aktif/pending
          const { data: userPlaces } = await client
            .from('places')
            .select('id, is_partner, partnership_status')
            .or(`added_by.eq.${userId},owner_id.eq.${userId}`);

          const hasPartnerPlace =
            Array.isArray(userPlaces) &&
            userPlaces.some(
              (p) =>
                (Boolean(p.is_partner) ||
                  p.partnership_status === 'approved' ||
                  p.partnership_status === 'pending') &&
                p.partnership_status !== 'none'
            );

          const { data: userClaims } = await client
            .from('business_claims')
            .select('id, status')
            .eq('user_id', userId)
            .in('status', ['approved', 'pending']);

          const hasActiveClaim = Array.isArray(userClaims) && userClaims.length > 0;

          if (!hasPartnerPlace && !hasActiveClaim) {
            resolvedRole = 'user';
            await client
              .from('users')
              .update({ role: 'user', updated_at: new Date().toISOString() })
              .eq('id', userId);
            try {
              await client.auth.admin.updateUserById(userId, { user_metadata: { role: 'user' } });
            } catch (err: any) {
              this.logger.warn(`Could not sync role to auth.users: ${err?.message}`);
            }
          }
        }

        return {
          id: data.id,
          name: data.full_name || data.name || data.email?.split('@')[0] || 'Pengguna',
          email: data.email,
          phone: data.phone_number || '',
          campus: data.campus || (isAdmin ? 'Tim Operasional pNongki' : 'User pNongki'),
          role: resolvedRole,
          xpPoints: data.xp_points ?? 0,
          pointsBalance: data.points_balance ?? 0,
          pointsExpiry: data.points_expiry || '31 Desember 2026',
          avatarUrl: data.avatar_url,
        };
      }

      // Jika belum ada di public.users, coba cari di auth.users
      const { data: authUser } = await client.auth.admin.getUserById(userId);
      if (authUser?.user) {
        const meta = authUser.user.user_metadata || {};
        const cleanEmail = (authUser.user.email || '').toLowerCase().trim();
        const isSuperAdmin = cleanEmail === 'superadmin@admin.pnongki' || meta.role === 'super_admin';
        const isAdmin = isSuperAdmin || cleanEmail.includes('@admin.pnongki') || meta.role === 'admin';
        const resolvedRole = isSuperAdmin ? 'super_admin' : isAdmin ? 'admin' : (meta.role || 'mahasiswa');

        const fallbackProfile: UserProfile = {
          id: authUser.user.id,
          name: meta.full_name || authUser.user.email?.split('@')[0] || (isSuperAdmin ? 'Super Admin pNongki' : isAdmin ? 'Admin pNongki' : 'Pengguna'),
          email: authUser.user.email || '',
          phone: meta.phone || '',
          campus: meta.campus || (isAdmin ? 'Tim Operasional pNongki' : 'Mahasiswa Pengguna pNongki!'),
          role: resolvedRole,
          xpPoints: meta.xp_points ?? 0,
          pointsBalance: meta.points_balance ?? 0,
          pointsExpiry: '31 Desember 2026',
          avatarUrl: meta.avatar_url || null,
        };

        try {
          await client.from('users').insert({
            id: fallbackProfile.id,
            email: fallbackProfile.email,
            full_name: fallbackProfile.name,
            name: fallbackProfile.name,
            campus: fallbackProfile.campus,
            phone_number: fallbackProfile.phone,
            role: fallbackProfile.role,
            xp_points: fallbackProfile.xpPoints,
            points_balance: fallbackProfile.pointsBalance,
          });
        } catch {}

        return fallbackProfile;
      }
    } catch (err: any) {
      this.logger.error(`Error reading user profile: ${err?.message}`);
    }

    return null;
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!userId) return null;

    try {
      const client = this.supabaseService.getAdminClient();
      const updatePayload: any = { updated_at: new Date().toISOString() };
      if (data.name !== undefined) {
        updatePayload.full_name = data.name;
        updatePayload.name = data.name;
      }
      if (data.phone !== undefined) updatePayload.phone_number = data.phone;
      if (data.campus !== undefined) updatePayload.campus = data.campus;
      if (data.role !== undefined) updatePayload.role = data.role;
      if (data.xpPoints !== undefined) updatePayload.xp_points = data.xpPoints;
      if (data.pointsBalance !== undefined) updatePayload.points_balance = data.pointsBalance;
      if (data.avatarUrl !== undefined) updatePayload.avatar_url = data.avatarUrl;

      await client.from('users').update(updatePayload).eq('id', userId);
      return this.getProfile(userId);
    } catch (err: any) {
      this.logger.error(`Error updating profile: ${err?.message}`);
      return null;
    }
  }

  async getFavorites(userId?: string): Promise<string[]> {
    if (!userId) return [];
    try {
      const client = this.supabaseService.getAdminClient();
      const { data, error } = await client
        .from('favorites')
        .select('place_id')
        .eq('user_id', userId);
      if (!error && Array.isArray(data)) {
        return data.map((row) => row.place_id);
      }
    } catch (err: any) {
      this.logger.error(`Error reading favorites: ${err?.message}`);
    }
    return [];
  }

  async toggleFavorite(
    placeId: string,
    userId?: string,
  ): Promise<{ placeId: string; isFavorited: boolean; favorites: string[] }> {
    if (!userId) {
      return { placeId, isFavorited: false, favorites: [] };
    }

    try {
      const client = this.supabaseService.getAdminClient();
      const { data: existing } = await client
        .from('favorites')
        .select('place_id')
        .eq('user_id', userId)
        .eq('place_id', placeId)
        .maybeSingle();

      let isFavorited = false;
      if (existing) {
        await client
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('place_id', placeId);
        isFavorited = false;
      } else {
        await client
          .from('favorites')
          .insert({ user_id: userId, place_id: placeId });
        isFavorited = true;
      }

      const { data: allFavs } = await client
        .from('favorites')
        .select('place_id')
        .eq('user_id', userId);

      return {
        placeId,
        isFavorited,
        favorites: (allFavs || []).map((f) => f.place_id),
      };
    } catch (err: any) {
      this.logger.error(`Error toggling favorite: ${err?.message}`);
      return { placeId, isFavorited: false, favorites: [] };
    }
  }

  async getNotifications(userId?: string): Promise<any[]> {
    if (!userId) return [];
    const notifs: any[] = [];

    try {
      const client = this.supabaseService.getAdminClient();

      // 1. Notifikasi Likes & Komentar pada postingan milik pengguna
      const { data: myPosts } = await client
        .from('posts')
        .select('id, content')
        .eq('user_id', userId);

      if (myPosts && myPosts.length > 0) {
        const postMap = new Map(myPosts.map((p) => [p.id, p.content]));
        const postIds = Array.from(postMap.keys());

        const { data: likesOnMyPosts } = await client
          .from('post_likes')
          .select('*, users!user_id(full_name, name)')
          .in('post_id', postIds)
          .neq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (likesOnMyPosts) {
          for (const l of likesOnMyPosts) {
            const rawContent = postMap.get(l.post_id) || '';
            const snippet = rawContent.length > 35 ? `${rawContent.slice(0, 35)}...` : rawContent;
            notifs.push({
              id: `notif-like-${l.post_id}-${l.user_id}`,
              title: 'Seseorang Menyukai Utasmu! ❤️',
              description: `${l.users?.full_name || l.users?.name || 'Seseorang'} menyukai utas "${snippet}"`,
              icon: 'favorite',
              timeAgo: 'Baru saja',
              isUnread: true,
              createdAt: l.created_at,
            });
          }
        }

        const { data: commentsOnMyPosts } = await client
          .from('post_comments')
          .select('*, users!user_id(full_name, name)')
          .in('post_id', postIds)
          .neq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (commentsOnMyPosts) {
          for (const c of commentsOnMyPosts) {
            const snippet = (c.message || '').length > 35 ? `${(c.message || '').slice(0, 35)}...` : c.message;
            notifs.push({
              id: `notif-comm-${c.id}`,
              title: 'Balasan Baru di Utasmu! 💬',
              description: `${c.users?.full_name || c.users?.name || 'Teman Nongki'} membalas: "${snippet}"`,
              icon: 'reply',
              timeAgo: 'Baru saja',
              isUnread: true,
              createdAt: c.created_at,
            });
          }
        }
      }

      // 2. Notifikasi status audit tempat yang ditambahkan pengguna
      const { data: userPlaces } = await client
        .from('places')
        .select('id, name, status, created_at, updated_at')
        .eq('added_by', userId)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (userPlaces && userPlaces.length > 0) {
        for (const [idx, p] of userPlaces.entries()) {
          const isApproved = p.status === 'approved';
          const isRejected = p.status === 'rejected';

          const notifTitle = isApproved
            ? 'Pengajuan Tempat Disetujui! 🎉'
            : isRejected
            ? 'Pengajuan Tempat Ditolak ❌'
            : 'Tempat Anda Sedang Ditinjau ⏳';

          const notifDesc = isApproved
            ? `Spot '${p.name}' telah diverifikasi dan resmi tayang di menu Explore.`
            : isRejected
            ? `Pengajuan tempat '${p.name}' belum dapat disetujui kurator karena belum memenuhi kriteria.`
            : `Spot '${p.name}' sedang ditinjau oleh kurator pNongki!.`;

          const notifIcon = isApproved
            ? 'verified'
            : isRejected
            ? 'cancel'
            : 'hourglass_top';

          notifs.push({
            id: `notif-place-${p.id || idx}-${p.status}`,
            title: notifTitle,
            description: notifDesc,
            icon: notifIcon,
            timeAgo: 'Baru saja',
            isUnread: isApproved || isRejected,
            createdAt: p.updated_at || p.created_at,
          });
        }
      }

      // 3. Notifikasi status klaim / kemitraan bisnis
      const { data: userClaims } = await client
        .from('business_claims')
        .select('id, business_name, status, created_at, updated_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (userClaims && userClaims.length > 0) {
        for (const [idx, c] of userClaims.entries()) {
          const isApproved = c.status === 'approved';
          const isRejected = c.status === 'rejected';
          notifs.push({
            id: `notif-claim-${c.id || idx}-${c.status}`,
            title: isApproved
              ? 'Kemitraan Bisnis Diterima! 🤝'
              : isRejected
              ? 'Status Kemitraan Perlu Revisi'
              : 'Pengajuan Kemitraan Sedang Ditinjau ⏳',
            description: isApproved
              ? `Pengajuan kemitraan untuk '${c.business_name}' telah disetujui sebagai Mitra Resmi pNongki!`
              : isRejected
              ? `Pengajuan kemitraan untuk '${c.business_name}' memerlukan perbaikan dokumen.`
              : `Pengajuan kemitraan untuk '${c.business_name}' sedang diproses oleh tim kurator.`,
            icon: isApproved ? 'verified' : isRejected ? 'cancel' : 'hourglass_top',
            timeAgo: 'Baru saja',
            isUnread: isApproved || isRejected,
            createdAt: c.updated_at || c.created_at,
          });
        }
      }
    } catch (err: any) {
      this.logger.error(`Error loading notifications: ${err?.message}`);
    }

    const filteredNotifs = notifs
      .filter((n) => !this.deletedNotificationIds.has(n.id))
      .map((n) => ({
        ...n,
        isUnread: this.readNotificationIds.has(n.id) ? false : Boolean(n.isUnread),
      }));

    return filteredNotifs.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    );
  }

  markNotificationRead(notifId?: string, notifIds?: string[]): { success: boolean } {
    if (notifId) {
      this.readNotificationIds.add(notifId);
    }
    if (Array.isArray(notifIds)) {
      for (const id of notifIds) {
        this.readNotificationIds.add(id);
      }
    }
    return { success: true };
  }

  deleteNotification(notifId?: string, notifIds?: string[]): { success: boolean } {
    if (notifId) {
      this.deletedNotificationIds.add(notifId);
    }
    if (Array.isArray(notifIds)) {
      for (const id of notifIds) {
        this.deletedNotificationIds.add(id);
      }
    }
    return { success: true };
  }

  async submitBusinessClaim(
    dto: BusinessClaimDto,
  ): Promise<{ success: boolean; message: string; claimId: string }> {
    const client = this.supabaseService.getAdminClient();
    const { data, error } = await client.from('business_claims').insert({
      user_id: dto.userId || null,
      place_id: dto.placeId || null,
      business_name: dto.businessName,
      contact_person: dto.contactPerson,
      whatsapp_number: dto.whatsappNumber,
      social_media_link: dto.socialMediaLink,
      status: 'pending',
    }).select().single();

    if (error) {
      throw new Error(`Gagal mengirim pengajuan bisnis: ${error.message}`);
    }

    return {
      success: true,
      message: 'Pengajuan bisnis berhasil dikirim! Tim Admin pNongki! akan memverifikasi dalam 1x24 jam.',
      claimId: data?.id || `claim-${Date.now()}`,
    };
  }

  async getBusinessClaims(userId?: string): Promise<any[]> {
    if (!userId) return [];

    try {
      const client = this.supabaseService.getAdminClient();
      const { data, error } = await client
        .from('business_claims')
        .select('*, places(id, name, city, address, cover_image_url, category, partnership_status, is_partner)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const claimsList = (!error && Array.isArray(data)) ? data : [];

      const mapped = claimsList.map((item) => {
        const place = item.places || {};
        let effectiveStatus = item.status || 'pending';
        if (place.partnership_status && place.partnership_status !== 'none') {
          effectiveStatus = place.partnership_status;
        } else if (place.is_partner) {
          effectiveStatus = 'approved';
        }

        return {
          id: item.id,
          ticketCode:
            item.admin_notes?.match(/PTR-\d+/)?.[0] ||
            `PTR-${String(item.id).replace(/-/g, '').slice(0, 6).toUpperCase()}`,
          placeId: item.place_id,
          businessName: item.business_name || place.name || 'Bisnis Anda',
          placeCover: place.cover_image_url || null,
          placeAddress: place.address || place.city || null,
          category: place.category || 'Kafe',
          contactPerson: item.contact_person,
          whatsappNumber: item.whatsapp_number,
          socialMediaLink: item.social_media_link,
          status: effectiveStatus,
          partnership_status: effectiveStatus,
          partnershipStatus: effectiveStatus,
          adminNotes: item.admin_notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          isPartner: Boolean(place.is_partner) && effectiveStatus === 'approved',
        };
      });

      // Tambahkan juga tempat yang didaftarkan user ini dengan status kemitraan aktif/pending
      // jika belum memiliki catatan di business_claims
      const { data: userPlaces } = await client
        .from('places')
        .select('id, name, city, address, cover_image_url, category, partnership_status, is_partner, created_at, updated_at')
        .eq('added_by', userId)
        .neq('partnership_status', 'none');

      const existingPlaceIds = new Set(mapped.map((m) => String(m.placeId)).filter(Boolean));

      if (Array.isArray(userPlaces)) {
        for (const p of userPlaces) {
          if (!existingPlaceIds.has(String(p.id))) {
            const effectiveStatus = (p.is_partner && p.partnership_status === 'approved')
              ? 'approved'
              : p.partnership_status === 'rejected'
              ? 'rejected'
              : 'pending';

            mapped.push({
              id: `claim-place-${p.id}`,
              ticketCode: `PTR-${String(p.id).replace(/-/g, '').slice(0, 6).toUpperCase()}`,
              placeId: p.id,
              businessName: p.name,
              placeCover: p.cover_image_url || null,
              placeAddress: p.address || p.city || null,
              category: p.category || 'Kafe',
              contactPerson: 'PIC Usaha',
              whatsappNumber: '',
              socialMediaLink: '',
              status: effectiveStatus,
              partnership_status: effectiveStatus,
              partnershipStatus: effectiveStatus,
              adminNotes: 'Pengajuan Kemitraan Tempat Baru',
              createdAt: p.created_at,
              updatedAt: p.updated_at,
              isPartner: Boolean(p.is_partner) && effectiveStatus === 'approved',
            });
          }
        }
      }

      // Deduplicate by placeId so that each place only has 1 claim item displayed
      const seenPlaceIds = new Set<string>();
      const deduplicated: any[] = [];
      for (const item of mapped) {
        const pid = item.placeId ? String(item.placeId) : String(item.id);
        if (!seenPlaceIds.has(pid)) {
          seenPlaceIds.add(pid);
          deduplicated.push(item);
        }
      }

      return deduplicated;
    } catch (err: any) {
      this.logger.error(`Error reading business claims: ${err?.message}`);
      return [];
    }
  }

  async deleteBusinessClaim(claimId: string, userId?: string): Promise<{ success: boolean; roleReverted: boolean }> {
    const client = this.supabaseService.getAdminClient();
    let targetUserId = userId;
    let placeId: string | null = null;

    if (claimId.startsWith('claim-place-')) {
      placeId = claimId.replace('claim-place-', '');
    } else {
      const { data: claim } = await client
        .from('business_claims')
        .select('user_id, place_id')
        .eq('id', claimId)
        .maybeSingle();

      if (claim) {
        targetUserId = targetUserId || claim.user_id;
        placeId = claim.place_id;
        await client.from('business_claims').delete().eq('id', claimId);
      }
    }

    if (placeId) {
      await client
        .from('places')
        .update({
          is_partner: false,
          partnership_status: 'none',
          updated_at: new Date().toISOString(),
        })
        .eq('id', placeId);
    }

    let roleReverted = false;
    if (targetUserId) {
      const roleCheck = await this.verifyAndSyncOwnerRole(targetUserId);
      roleReverted = roleCheck.reverted;
    }

    return { success: true, roleReverted };
  }

  async verifyAndSyncOwnerRole(userId?: string): Promise<{ role: string; reverted: boolean }> {
    if (!userId) {
      return { role: 'user', reverted: false };
    }

    try {
      const client = this.supabaseService.getAdminClient();
      const { data: user } = await client.from('users').select('role').eq('id', userId).maybeSingle();
      if (!user || user.role !== 'owner') {
        return { role: user?.role || 'user', reverted: false };
      }

      const { data: userPlaces } = await client
        .from('places')
        .select('id, is_partner, partnership_status')
        .or(`added_by.eq.${userId},owner_id.eq.${userId}`);

      const hasPartnerPlace =
        Array.isArray(userPlaces) &&
        userPlaces.some(
          (p) =>
            (Boolean(p.is_partner) ||
              p.partnership_status === 'approved' ||
              p.partnership_status === 'pending') &&
            p.partnership_status !== 'none'
        );

      const { data: userClaims } = await client
        .from('business_claims')
        .select('id, status')
        .eq('user_id', userId)
        .in('status', ['approved', 'pending']);

      const hasActiveClaim = Array.isArray(userClaims) && userClaims.length > 0;

      if (!hasPartnerPlace && !hasActiveClaim) {
        await client
          .from('users')
          .update({ role: 'user', updated_at: new Date().toISOString() })
          .eq('id', userId);
        try {
          await client.auth.admin.updateUserById(userId, { user_metadata: { role: 'user' } });
        } catch {}
        return { role: 'user', reverted: true };
      }

      return { role: 'owner', reverted: false };
    } catch (err: any) {
      this.logger.error(`Error verifying owner role: ${err?.message}`);
      return { role: 'user', reverted: false };
    }
  }

  async getAdminUsers(): Promise<any[]> {
    try {
      const client = this.supabaseService.getAdminClient();
      const { data, error } = await client
        .from('users')
        .select('id, email, full_name, role, created_at, campus')
        .in('role', ['admin', 'super_admin'])
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data;
      }
    } catch (err: any) {
      this.logger.error(`Error reading admin users: ${err?.message}`);
    }
    return [];
  }

  async createAdminUser(payload: { email: string; password: string; name: string }): Promise<any> {
    const client = this.supabaseService.getAdminClient();
    const cleanEmail = payload.email.trim().toLowerCase();

    const { data: rpcData, error: rpcError } = await client.rpc('superadmin_create_admin', {
      p_email: cleanEmail,
      p_password: payload.password,
      p_name: payload.name.trim(),
    });

    if (!rpcError) {
      return rpcData || { success: true };
    }

    const { data: authData, error: authError } = await client.auth.admin.createUser({
      email: cleanEmail,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        full_name: payload.name.trim(),
        role: 'admin',
        campus: 'Tim Operasional pNongki',
      },
    });

    if (authError || !authData?.user) {
      throw new Error(authError?.message || 'Gagal membuat akun admin.');
    }

    await client.from('users').upsert({
      id: authData.user.id,
      email: cleanEmail,
      full_name: payload.name.trim(),
      name: payload.name.trim(),
      role: 'admin',
      campus: 'Tim Operasional pNongki',
      updated_at: new Date().toISOString(),
    });

    return { success: true, user: authData.user };
  }

  async deleteAdminUser(adminId: string): Promise<any> {
    const client = this.supabaseService.getAdminClient();

    const { data: rpcData, error: rpcError } = await client.rpc('superadmin_delete_admin', {
      p_admin_id: adminId,
    });

    if (!rpcError) {
      return rpcData || { success: true };
    }

    await client.from('users').delete().eq('id', adminId);
    await client.auth.admin.deleteUser(adminId).catch(() => {});

    return { success: true };
  }

  async getUserActivity(userId?: string): Promise<any> {
    if (!userId) {
      return { reviewsCount: 0, hangoutsCount: 0, threadsCount: 0, logs: [] };
    }

    try {
      const client = this.supabaseService.getAdminClient();
      const [ratingsRes, postsRes, claimsRes, placesRes] = await Promise.all([
        client
          .from('ratings')
          .select('id, score, review_text, created_at, places(name)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10),
        client
          .from('posts')
          .select('id, post_type, content, created_at, places(name)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10),
        client
          .from('reward_claims')
          .select('id, claim_code, created_at, rewards(title, point_cost)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10),
        client
          .from('places')
          .select('id, name, created_at')
          .eq('added_by', userId)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const ratings = ratingsRes.data || [];
      const posts = postsRes.data || [];
      const claims = claimsRes.data || [];
      const places = placesRes.data || [];

      const hangoutsCount = posts.filter((p: any) => p.post_type === 'hangout').length;
      const threadsCount = posts.filter((p: any) => p.post_type !== 'hangout').length;

      const formatAgo = (isoDate: string) => {
        if (!isoDate) return 'Baru saja';
        const diffMs = Date.now() - new Date(isoDate).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${Math.max(1, diffMins)} menit lalu`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam lalu`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return new Date(isoDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      };

      const logs: any[] = [];
      places.forEach((p: any) => {
        logs.push({
          activity: `Menambahkan spot baru: ${p.name}`,
          xp: '+50 XP',
          point: '+50 Poin',
          time: formatAgo(p.created_at),
          timestamp: new Date(p.created_at).getTime(),
        });
      });
      ratings.forEach((r: any) => {
        logs.push({
          activity: `Menulis ulasan & rating di ${r.places?.name || 'Spot Nongki'}`,
          xp: '+20 XP',
          point: '+20 Poin',
          time: formatAgo(r.created_at),
          timestamp: new Date(r.created_at).getTime(),
        });
      });
      posts.forEach((p: any) => {
        const isHangout = p.post_type === 'hangout';
        const title = p.content ? (p.content.length > 35 ? p.content.slice(0, 35) + '...' : p.content) : 'Postingan';
        logs.push({
          activity: isHangout ? `Ajak Nongkrong: ${title}` : `Utas Diskusi: ${title}`,
          xp: isHangout ? '+15 XP' : '+10 XP',
          point: '+10 Poin',
          time: formatAgo(p.created_at),
          timestamp: new Date(p.created_at).getTime(),
        });
      });
      claims.forEach((c: any) => {
        logs.push({
          activity: `Menukarkan hadiah: ${c.rewards?.title || 'Voucer/Merchandise'}`,
          xp: 'Klaim Hadiah',
          point: `-${c.rewards?.point_cost || 0} Poin`,
          time: formatAgo(c.created_at),
          timestamp: new Date(c.created_at).getTime(),
        });
      });

      logs.sort((a, b) => b.timestamp - a.timestamp);

      return {
        reviewsCount: ratings.length,
        hangoutsCount,
        threadsCount,
        logs: logs.slice(0, 5),
      };
    } catch (err: any) {
      this.logger.error(`Error loading user activity: ${err?.message}`);
      return { reviewsCount: 0, hangoutsCount: 0, threadsCount: 0, logs: [] };
    }
  }
}
