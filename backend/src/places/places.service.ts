import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface PlaceItem {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  cover_image_url: string;
  imageUrl?: string;
  rating: number;
  review_count: number;
  price_range: string;
  open_status: string;
  distanceKm?: number;
  facilities?: string[];
  recommended_menu?: string;
  status: 'approved' | 'pending' | 'rejected';
  added_by?: string;
  booking_url?: string;
  is_partner?: boolean;
  partnership_status?: string;
  description?: string;
  opening_hours?: any;
  menus?: any[];
  menu_images?: string[];
  venue_photos?: any[];
  contact_phone?: string;
  instagram?: string;
  owner_id?: string;
}

export function normalizePlaceCategory(
  rawCat?: string,
): 'nongkrong' | 'nugas' | 'olahraga' | 'fasilitas_publik' {
  if (!rawCat) return 'nongkrong';
  const c = String(rawCat).toLowerCase().trim();
  if (c.includes('fasilitas') || c.includes('publik') || c.includes('taman')) {
    return 'fasilitas_publik';
  }
  if (c.includes('nugas') || c.includes('kerja') || c.includes('coworking') || c.includes('co-working')) {
    return 'nugas';
  }
  if (c.includes('olahraga') || c.includes('sport') || c.includes('fitness') || c.includes('biliar') || c.includes('gym')) {
    return 'olahraga';
  }
  return 'nongkrong';
}

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(query?: string, category?: string, sort?: string): Promise<PlaceItem[]> {
    const client = this.supabaseService.getAdminClient();
    let dbQuery = client
      .from('places')
      .select('*, place_details(*)')
      .eq('status', 'approved');

    if (category && category !== 'all') {
      const dbCat = normalizePlaceCategory(category);
      dbQuery = dbQuery.eq('category', dbCat);
    }
    if (query && query.trim() !== '') {
      dbQuery = dbQuery.ilike('name', `%${query.trim()}%`);
    }

    const { data, error } = await dbQuery;

    if (error) {
      this.logger.error(`Error querying places from Supabase: ${error.message}`);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!Array.isArray(data)) {
      return [];
    }

    const mapped = data.map((item: any) => {
      const details = Array.isArray(item.place_details)
        ? item.place_details[0]
        : item.place_details;
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        address: item.address,
        city: item.city || 'Bandung',
        latitude: item.latitude,
        longitude: item.longitude,
        cover_image_url: item.cover_image_url,
        imageUrl: item.cover_image_url,
        rating: Number(item.rating) || 0,
        review_count: item.review_count || 0,
        price_range: item.price_range || '',
        open_status: item.open_status || '',
        distanceKm: Number(item.distanceKm) || 1.2,
        status: item.status || 'approved',
        facilities: details?.facilities || [],
        recommended_menu: details?.recommended_menu || '',
        booking_url: details?.booking_url || null,
        is_partner: Boolean(item.is_partner) && item.partnership_status === 'approved',
        partnership_status: item.partnership_status || 'none',
        description: details?.description || '',
        opening_hours: details?.opening_hours || null,
        menus: details?.menus || [],
        menu_images: details?.menu_images || [],
        venue_photos: details?.venue_photos || [],
        contact_phone: details?.contact_phone || null,
        instagram: details?.instagram || null,
        added_by: item.added_by || null,
        owner_id: item.owner_id || item.added_by || null,
      };
    });

    if (sort === 'rating') {
      mapped.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'distance') {
      mapped.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return mapped;
  }

  async findOne(id: string): Promise<PlaceItem | null> {
    const client = this.supabaseService.getAdminClient();
    const { data, error } = await client
      .from('places')
      .select('*, place_details(*)')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const details = Array.isArray(data.place_details)
      ? data.place_details[0]
      : data.place_details;

    return {
      id: data.id,
      name: data.name,
      category: data.category,
      address: data.address,
      city: data.city || 'Bandung',
      latitude: data.latitude,
      longitude: data.longitude,
      cover_image_url: data.cover_image_url,
      imageUrl: data.cover_image_url,
      rating: Number(data.rating) || 0,
      review_count: data.review_count || 0,
      price_range: data.price_range || '',
      open_status: data.open_status || '',
      distanceKm: Number(data.distanceKm) || 1.2,
      status: data.status || 'approved',
      facilities: details?.facilities || [],
      recommended_menu: details?.recommended_menu || '',
      booking_url: details?.booking_url || null,
      is_partner: Boolean(data.is_partner) || data.partnership_status === 'approved',
      partnership_status: data.partnership_status || 'none',
      description: details?.description || '',
      opening_hours: details?.opening_hours || null,
      menus: details?.menus || [],
      menu_images: details?.menu_images || [],
      venue_photos: details?.venue_photos || [],
      contact_phone: details?.contact_phone || null,
      instagram: details?.instagram || null,
      added_by: data.added_by || null,
      owner_id: data.owner_id || data.added_by || null,
    };
  }

  async create(placeData: Partial<PlaceItem>): Promise<PlaceItem> {
    const partnershipStatus =
      (placeData as any).partnership_status ||
      ((placeData as any).requestPartnership ? 'pending' : 'none');
    const isPartner = partnershipStatus === 'approved';

    // Tempat baru yang diajukan (baik reguler maupun kemitraan) selalu berstatus 'pending'
    // sampai diverifikasi dan disetujui oleh admin, sehingga tidak langsung muncul di Explore.
    const defaultStatus = 'pending';

    const client = this.supabaseService.getAdminClient();
    const generatedSlug = (placeData.name || 'spot')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const insertPayload: any = {
      name: placeData.name || 'Tempat Baru',
      slug: (placeData as any).slug || generatedSlug,
      category: normalizePlaceCategory(placeData.category),
      address: placeData.address || '',
      city: placeData.city || 'Bandung',
      latitude: Number(placeData.latitude) || -6.89,
      longitude: Number(placeData.longitude) || 107.61,
      cover_image_url:
        placeData.cover_image_url || '',
      price_range: placeData.price_range || '',
      open_status: placeData.open_status || '',
      status: defaultStatus,
      is_partner: isPartner,
      partnership_status: partnershipStatus,
    };

    if (
      placeData.added_by &&
      typeof placeData.added_by === 'string' &&
      placeData.added_by.trim().length > 10
    ) {
      insertPayload.added_by = placeData.added_by.trim();
    }

    const { data, error } = await client
      .from('places')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Gagal menyimpan tempat ke Supabase: ${error?.message}`);
    }

    await client.from('place_details').insert({
      place_id: data.id,
      facilities: placeData.facilities || [],
      recommended_menu: placeData.recommended_menu || '',
      booking_url: placeData.booking_url || '',
      description: (placeData as any).description || '',
      opening_hours: (placeData as any).opening_hours || null,
      menus: (placeData as any).menus || null,
      menu_images: (placeData as any).menu_images || null,
      venue_photos: (placeData as any).venue_photos || null,
      contact_phone: (placeData as any).contact_phone || null,
      instagram: (placeData as any).instagram || null,
    });

    if (partnershipStatus !== 'none' && insertPayload.added_by) {
      try {
        const ticketCode = `PTR-${Math.floor(100000 + Math.random() * 900000)}`;
        await client.from('business_claims').insert({
          user_id: insertPayload.added_by,
          place_id: data.id,
          business_name: data.name,
          contact_person: `${(placeData as any).pic_name || 'Owner'} (${(placeData as any).pic_role || 'Pemilik Usaha'})`,
          whatsapp_number: (placeData as any).contact_phone || '',
          social_media_link: (placeData as any).instagram || (placeData as any).pic_email || '',
          status: 'pending',
          admin_notes: `[${ticketCode}] Pengajuan Kemitraan Langsung: ${(placeData as any).partnership_services || 'Official Partner'}. Dokumen: ${(placeData as any).legal_doc || '-'}. Catatan: ${(placeData as any).partnership_notes || '-'}`,
        });
      } catch (claimErr: any) {
        this.logger.warn(`Could not auto-create business claim: ${claimErr?.message}`);
      }
    }

    const createdPlace = await this.findOne(data.id);
    if (createdPlace) {
      return createdPlace;
    }

    return {
      ...insertPayload,
      id: data.id,
      rating: 0,
      review_count: 0,
      distanceKm: 1.2,
      facilities: placeData.facilities || [],
      recommended_menu: placeData.recommended_menu || '',
      booking_url: placeData.booking_url || '',
      description: (placeData as any).description || '',
      opening_hours: (placeData as any).opening_hours || null,
      menus: (placeData as any).menus || [],
      menu_images: (placeData as any).menu_images || [],
      venue_photos: (placeData as any).venue_photos || [],
      contact_phone: (placeData as any).contact_phone || null,
      instagram: (placeData as any).instagram || null,
    };
  }

  async findMyPlaces(userId?: string): Promise<PlaceItem[]> {
    if (!userId) {
      return [];
    }

    const client = this.supabaseService.getAdminClient();
    const { data, error } = await client
      .from('places')
      .select('*, place_details(*)')
      .eq('added_by', userId)
      .order('created_at', { ascending: false });

    if (error || !Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => {
      const details = Array.isArray(item.place_details)
        ? item.place_details[0]
        : item.place_details;
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        address: item.address,
        city: item.city || 'Bandung',
        latitude: item.latitude,
        longitude: item.longitude,
        cover_image_url: item.cover_image_url,
        imageUrl: item.cover_image_url,
        rating: Number(item.rating) || 0,
        review_count: item.review_count || 0,
        price_range: item.price_range || 'Rp 20.000 - Rp 40.000',
        open_status: item.open_status || 'Buka',
        status: item.status || 'approved',
        facilities: details?.facilities || [],
        recommended_menu: details?.recommended_menu || '',
        booking_url: details?.booking_url || null,
        is_partner: Boolean(item.is_partner) && item.partnership_status === 'approved',
        partnership_status: item.partnership_status || 'none',
        description: details?.description || '',
        opening_hours: details?.opening_hours || null,
        menus: details?.menus || [],
        menu_images: details?.menu_images || [],
        venue_photos: details?.venue_photos || [],
        contact_phone: details?.contact_phone || null,
        instagram: details?.instagram || null,
        added_by: item.added_by,
        owner_id: item.owner_id || item.added_by || null,
      };
    });
  }

  async applyPartnership(placeId: string, partnershipData: any): Promise<PlaceItem | null> {
    const client = this.supabaseService.getAdminClient();
    const { data, error } = await client
      .from('places')
      .update({
        partnership_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', placeId)
      .select('*, place_details(*)')
      .single();

    if (error || !data) {
      throw new Error(`Gagal update kemitraan: ${error?.message}`);
    }

    await client
      .from('place_details')
      .update({
        contact_phone: partnershipData.contactPhone,
        instagram: partnershipData.instagram,
      })
      .eq('place_id', placeId);

    if (partnershipData.userId) {
      try {
        await client.from('business_claims').insert({
          user_id: partnershipData.userId,
          place_id: placeId,
          business_name: data.name,
          contact_person: `${partnershipData.picName || 'PIC'} (${partnershipData.picRole || 'Owner'})`,
          whatsapp_number: partnershipData.contactPhone,
          social_media_link: partnershipData.instagram || partnershipData.email,
          status: 'pending',
          admin_notes: `[${partnershipData.ticketCode || 'Tiket Kemitraan'}] Kemitraan diajukan: ${partnershipData.partnershipType || 'Official Partner'}. Dokumen: ${partnershipData.legalDoc || '-'}. Catatan: ${partnershipData.notes || '-'}`,
        });
      } catch (err: any) {
        this.logger.warn(`Could not save to business_claims: ${err?.message}`);
      }
    }

    return this.findOne(placeId);
  }

  async verifyUserOwnerRole(userId: string): Promise<boolean> {
    if (!userId) return false;
    const client = this.supabaseService.getAdminClient();

    // Admin stays admin
    const { data: userProfile } = await client
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userProfile?.role === 'admin') {
      return false;
    }

    // 1. Check partner places in places table
    const { data: partnerPlaces } = await client
      .from('places')
      .select('id, is_partner, partnership_status')
      .or(`added_by.eq.${userId},owner_id.eq.${userId}`);

    const hasPartnerPlace =
      Array.isArray(partnerPlaces) &&
      partnerPlaces.some(
        (p) =>
          (Boolean(p.is_partner) ||
            p.partnership_status === 'approved' ||
            p.partnership_status === 'pending') &&
          p.partnership_status !== 'none',
      );

    // 2. Check business_claims table
    const { data: activeClaims } = await client
      .from('business_claims')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['approved', 'pending']);

    const hasActiveClaim = Array.isArray(activeClaims) && activeClaims.length > 0;

    if (!hasPartnerPlace && !hasActiveClaim) {
      this.logger.log(`User ${userId} no longer has active partnerships. Reverting role to 'user'.`);
      await client
        .from('users')
        .update({ role: 'user', updated_at: new Date().toISOString() })
        .eq('id', userId);

      try {
        await client.auth.admin.updateUserById(userId, {
          user_metadata: { role: 'user' },
        });
      } catch (authErr: any) {
        this.logger.warn(`Could not update auth metadata: ${authErr?.message}`);
      }

      return true;
    }

    return false;
  }

  async updatePartnershipStatus(
    placeId: string,
    partnershipStatus: string,
    isPartner: boolean = false,
  ): Promise<any> {
    const client = this.supabaseService.getAdminClient();
    const claimStatus =
      partnershipStatus === 'approved' || isPartner
        ? 'approved'
        : partnershipStatus === 'rejected'
        ? 'rejected'
        : 'pending';

    const updatePayload: any = {
      partnership_status: partnershipStatus,
      is_partner: Boolean(isPartner),
      updated_at: new Date().toISOString(),
    };
    if (claimStatus === 'approved') {
      updatePayload.status = 'approved';
    } else if (claimStatus === 'rejected') {
      updatePayload.status = 'rejected';
    }

    await client
      .from('places')
      .update(updatePayload)
      .eq('id', placeId);

    await client
      .from('business_claims')
      .update({
        status: claimStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('place_id', placeId);

    const { data: claimsData } = await client
      .from('business_claims')
      .select('user_id')
      .eq('place_id', placeId);

    const { data: placeData } = await client
      .from('places')
      .select('added_by, owner_id')
      .eq('id', placeId)
      .single();

    const affectedUserIds = new Set<string>();
    if (Array.isArray(claimsData)) {
      claimsData.forEach((c) => {
        if (c.user_id) affectedUserIds.add(c.user_id);
      });
    }
    if (placeData?.added_by) affectedUserIds.add(placeData.added_by);
    if (placeData?.owner_id) affectedUserIds.add(placeData.owner_id);

    if (claimStatus === 'approved') {
      for (const uid of affectedUserIds) {
        await client
          .from('users')
          .update({ role: 'owner', updated_at: new Date().toISOString() })
          .eq('id', uid);

        try {
          await client.auth.admin.updateUserById(uid, {
            user_metadata: { role: 'owner' },
          });
        } catch (e: any) {
          this.logger.warn(`Could not update auth metadata for ${uid}: ${e?.message}`);
        }
      }
    } else {
      for (const uid of affectedUserIds) {
        await this.verifyUserOwnerRole(uid);
      }
    }

    return this.findOne(placeId);
  }

  async deletePartnership(
    placeId: string,
    userId?: string,
  ): Promise<{ success: boolean; roleReverted: boolean }> {
    const client = this.supabaseService.getAdminClient();

    const affectedUserIds = new Set<string>();
    if (userId) affectedUserIds.add(userId);

    const { data: placeData } = await client
      .from('places')
      .select('added_by, owner_id')
      .eq('id', placeId)
      .single();

    if (placeData?.added_by) affectedUserIds.add(placeData.added_by);
    if (placeData?.owner_id) affectedUserIds.add(placeData.owner_id);

    const { data: claimsData } = await client
      .from('business_claims')
      .select('user_id')
      .eq('place_id', placeId);

    if (Array.isArray(claimsData)) {
      claimsData.forEach((c) => {
        if (c.user_id) affectedUserIds.add(c.user_id);
      });
    }

    const { error: claimsError } = await client
      .from('business_claims')
      .delete()
      .eq('place_id', placeId);

    if (claimsError) {
      this.logger.warn(`Failed to delete business claims for place ${placeId}: ${claimsError.message}`);
    }

    const { error: placeError } = await client
      .from('places')
      .update({
        is_partner: false,
        partnership_status: 'none',
        owner_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', placeId);

    if (placeError) {
      throw new Error(`Gagal menghapus kemitraan tempat: ${placeError.message}`);
    }

    let roleReverted = false;
    for (const uid of affectedUserIds) {
      const reverted = await this.verifyUserOwnerRole(uid);
      if (userId && uid === userId && reverted) {
        roleReverted = true;
      }
    }

    return { success: true, roleReverted };
  }

  async delete(
    placeId: string,
    userId?: string,
  ): Promise<{ success: boolean; roleReverted: boolean }> {
    const client = this.supabaseService.getAdminClient();

    const affectedUserIds = new Set<string>();
    if (userId) affectedUserIds.add(userId);

    const { data: placeData } = await client
      .from('places')
      .select('added_by, owner_id')
      .eq('id', placeId)
      .single();

    if (placeData?.added_by) affectedUserIds.add(placeData.added_by);
    if (placeData?.owner_id) affectedUserIds.add(placeData.owner_id);

    const { data: claimsData } = await client
      .from('business_claims')
      .select('user_id')
      .eq('place_id', placeId);

    if (Array.isArray(claimsData)) {
      claimsData.forEach((c) => {
        if (c.user_id) affectedUserIds.add(c.user_id);
      });
    }

    await client.from('place_details').delete().eq('place_id', placeId);
    await client.from('business_claims').delete().eq('place_id', placeId);
    await client.from('ratings').delete().eq('place_id', placeId);
    await client.from('reservations').delete().eq('place_id', placeId);

    const { error } = await client.from('places').delete().eq('id', placeId);
    if (error) {
      throw new Error(`Gagal menghapus tempat: ${error.message}`);
    }

    let roleReverted = false;
    for (const uid of affectedUserIds) {
      const reverted = await this.verifyUserOwnerRole(uid);
      if (userId && uid === userId && reverted) {
        roleReverted = true;
      }
    }

    return { success: true, roleReverted };
  }

  async findAdminPlaces(status?: string, partnershipStatus?: string): Promise<PlaceItem[]> {
    const client = this.supabaseService.getAdminClient();
    let dbQuery = client
      .from('places')
      .select('*, place_details(*)')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      dbQuery = dbQuery.eq('status', status);
    }
    if (partnershipStatus && partnershipStatus !== 'all') {
      dbQuery = dbQuery.eq('partnership_status', partnershipStatus);
    }

    const { data, error } = await dbQuery;
    if (error || !Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => {
      const details = Array.isArray(item.place_details)
        ? item.place_details[0]
        : item.place_details;
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        address: item.address,
        city: item.city || 'Bandung',
        latitude: item.latitude,
        longitude: item.longitude,
        cover_image_url: item.cover_image_url,
        imageUrl: item.cover_image_url,
        rating: Number(item.rating) || 0,
        review_count: item.review_count || 0,
        price_range: item.price_range || 'Rp 15.000 - Rp 35.000',
        open_status: item.open_status || 'Buka',
        distanceKm: Number(item.distanceKm) || 1.2,
        status: item.status || 'pending',
        facilities: details?.facilities || [],
        recommended_menu: details?.recommended_menu || '',
        booking_url: details?.booking_url || null,
        is_partner: Boolean(item.is_partner) && item.partnership_status === 'approved',
        partnership_status: item.partnership_status || 'none',
        description: details?.description || `Spot berkumpul di ${item.city || 'Bandung'}`,
        opening_hours: details?.opening_hours || null,
        menus: details?.menus || [],
        menu_images: details?.menu_images || [],
        venue_photos: details?.venue_photos || [],
        contact_phone: details?.contact_phone || null,
        instagram: details?.instagram || null,
        added_by: item.added_by,
      };
    });
  }

  async updateStatus(placeId: string, status: string): Promise<PlaceItem | null> {
    const client = this.supabaseService.getAdminClient();
    const { error } = await client
      .from('places')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', placeId);

    if (error) {
      throw new Error(`Gagal update status tempat: ${error.message}`);
    }

    return this.findOne(placeId);
  }

  async findPlaceReviews(placeId: string): Promise<any[]> {
    const client = this.supabaseService.getAdminClient();
    const { data, error } = await client
      .from('ratings')
      .select('*, users!user_id(id, full_name, name, avatar_url, campus, role)')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    if (error || !Array.isArray(data)) {
      return [];
    }

    return data.map((r: any) => ({
      id: r.id,
      placeId: r.place_id,
      userId: r.user_id,
      author: r.users?.full_name || r.users?.name || 'Mahasiswa',
      initials: (r.users?.full_name || r.users?.name || 'M').substring(0, 2).toUpperCase(),
      role: r.users?.campus || 'Mahasiswa Pengguna pNongki!',
      rating: Number(r.score) || 5,
      stars: Number(r.score) || 5,
      text: r.review_text || '',
      bg: 'bg-primary-container',
      createdAt: r.created_at,
    }));
  }

  async addPlaceReview(placeId: string, reviewData: any): Promise<any> {
    const client = this.supabaseService.getAdminClient();
    const userId = reviewData.userId || 'da20d2a2-9a9c-4ce5-8784-68735378af5e';
    const score = Number(reviewData.rating || reviewData.score) || 5;
    const text = reviewData.text || reviewData.reviewText || '';

    const { data, error } = await client
      .from('ratings')
      .insert({
        place_id: placeId,
        user_id: userId,
        score,
        review_text: text,
      })
      .select('*, users!user_id(id, full_name, name, avatar_url, campus, role)')
      .single();

    if (error) {
      throw new Error(`Gagal menyimpan ulasan: ${error.message}`);
    }

    const { data: allRatings } = await client
      .from('ratings')
      .select('score')
      .eq('place_id', placeId);

    if (Array.isArray(allRatings) && allRatings.length > 0) {
      const totalScore = allRatings.reduce((acc: number, curr: any) => acc + (Number(curr.score) || 0), 0);
      const avgRating = Number((totalScore / allRatings.length).toFixed(1));
      await client
        .from('places')
        .update({
          rating: avgRating,
          review_count: allRatings.length,
          updated_at: new Date().toISOString(),
        })
        .eq('id', placeId);
    }

    return {
      id: data.id,
      placeId: data.place_id,
      userId: data.user_id,
      author: data.users?.full_name || data.users?.name || 'Mahasiswa',
      initials: (data.users?.full_name || data.users?.name || 'M').substring(0, 2).toUpperCase(),
      role: data.users?.campus || 'Mahasiswa Pengguna pNongki!',
      rating: Number(data.score) || 5,
      stars: Number(data.score) || 5,
      text: data.review_text || '',
      bg: 'bg-primary-container',
      createdAt: data.created_at,
    };
  }

  async findPlaceReservations(placeId: string): Promise<any[]> {
    const client = this.supabaseService.getAdminClient();
    const { data, error } = await client
      .from('reservations')
      .select('*, users!user_id(id, full_name, name, campus)')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    if (error || !Array.isArray(data)) {
      return [];
    }

    return data.map((r: any) => ({
      id: r.booking_code || r.id,
      guestName: r.guest_name || r.users?.full_name || 'Tamu',
      phone: r.phone || '',
      campus: r.campus || r.users?.campus || 'Mahasiswa',
      date: r.reservation_date,
      time: r.reservation_time,
      guestsCount: r.guests_count || 2,
      needs: r.special_requests || 'Meja nugas',
      status: r.status || 'confirmed',
    }));
  }

  async createReservation(placeId: string, reservationData: any): Promise<any> {
    const client = this.supabaseService.getAdminClient();
    const bookingCode = reservationData.bookingCode || `PNK-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data, error } = await client
      .from('reservations')
      .insert({
        place_id: placeId,
        user_id: reservationData.userId || null,
        booking_code: bookingCode,
        guest_name: reservationData.guestName || 'Tamu',
        phone: reservationData.phone || null,
        campus: reservationData.campus || null,
        reservation_date: reservationData.date || 'Hari ini',
        reservation_time: reservationData.time || '14:00',
        guests_count: Number(reservationData.guestsCount) || 2,
        seating_area: reservationData.seatingArea || 'indoor',
        special_requests: reservationData.specialRequests || null,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Gagal menyimpan reservasi: ${error.message}`);
    }

    return {
      id: data.booking_code,
      bookingCode: data.booking_code,
      guestName: data.guest_name,
      phone: data.phone,
      campus: data.campus,
      date: data.reservation_date,
      time: data.reservation_time,
      guestsCount: data.guests_count,
      needs: data.special_requests,
      status: data.status,
    };
  }
}
