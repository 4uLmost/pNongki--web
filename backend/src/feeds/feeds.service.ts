import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface CommentItem {
  id: string;
  userId?: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  parentId?: string | null;
  replies?: CommentItem[];
}

export interface PostItem {
  id: string;
  userId?: string;
  postType?: 'thread' | 'hangout' | string;
  author: {
    id?: string;
    name: string;
    avatar: string;
    level: string;
    role: string;
    initials?: string;
    campus?: string;
    isMe?: boolean;
  };
  timeAgo: string;
  cafeTag?: string;
  taggedPlace?: any;
  content: string;
  image?: string;
  imageUrl?: string;
  likes: number;
  likesCount?: number;
  liked: boolean;
  isLiked?: boolean;
  comments: CommentItem[];
  isHangout?: boolean;
  hangoutDetails?: {
    slots: string;
    time: string;
    contactUrl?: string;
  };
  createdAt: string;
}

@Injectable()
export class FeedsService {
  private readonly logger = new Logger(FeedsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(userId?: string): Promise<PostItem[]> {
    try {
      const client = this.supabaseService.getAdminClient();
      const { data, error } = await client
        .from('posts')
        .select('*, users!user_id(id, full_name, name, avatar_url, role, campus), places(id, name, city), post_comments(*, users!user_id(id, full_name, name, avatar_url))')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error querying posts from Supabase: ${error.message}`);
        return [];
      }

      if (!Array.isArray(data)) {
        return [];
      }

      let userLikedIds = new Set<string>();
      if (userId) {
        const { data: likesData } = await client
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId);
        if (likesData) {
          userLikedIds = new Set(likesData.map((l: any) => l.post_id));
        }
      }

      return data.map((item: any) => {
        const isLikedByMe = userLikedIds.has(item.id);
        return {
          id: item.id,
          userId: item.user_id,
          postType: item.post_type || 'thread',
          author: {
            id: item.user_id,
            name: item.users?.full_name || item.users?.name || 'Pengguna pNongki!',
            avatar:
              item.users?.avatar_url ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            level: 'Sepuh Kopi',
            role: item.users?.role || 'Mahasiswa',
            initials: (item.users?.full_name || item.users?.name || 'PN').substring(0, 2).toUpperCase(),
            campus: item.users?.campus || 'Institut Teknologi Bandung',
            isMe: userId ? item.user_id === userId : false,
          },
          timeAgo: 'Baru saja',
          cafeTag: item.places?.name || undefined,
          taggedPlace: item.places ? { id: item.places.id, name: item.places.name, city: item.places.city } : null,
          content: item.content,
          image: item.image_url || undefined,
          imageUrl: item.image_url || undefined,
          likes: item.likes_count || 0,
          likesCount: item.likes_count || 0,
          liked: isLikedByMe,
          isLiked: isLikedByMe,
          isHangout: item.post_type === 'hangout',
          hangoutDetails: item.post_type === 'hangout'
            ? {
                slots: `${item.slot_capacity || 2} Orang Tersedia`,
                time: item.hangout_time ? new Date(item.hangout_time).toLocaleString('id-ID') : 'Hari ini',
                contactUrl: item.contact_url,
              }
            : undefined,
          comments: (item.post_comments || []).map((c: any) => ({
            id: c.id,
            userId: c.user_id,
            author: c.users?.full_name || c.users?.name || 'Teman Nongki',
            avatar: c.users?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            text: c.message,
            time: 'Beberapa saat lalu',
            parentId: c.parent_id || null,
            replies: [],
          })),
          createdAt: item.created_at,
        };
      });
    } catch (err: any) {
      this.logger.error(`Error in FeedsService.findAll: ${err?.message}`);
      return [];
    }
  }

  async createPost(postData: any): Promise<PostItem> {
    const client = this.supabaseService.getAdminClient();
    const activeUserId = postData.userId || postData.user_id || 'da20d2a2-9a9c-4ce5-8784-68735378af5e';

    const insertPayload: any = {
      user_id: activeUserId,
      content: postData.content,
      image_url: postData.image || postData.imageUrl || null,
      post_type: postData.isHangout || postData.postType === 'hangout' ? 'hangout' : 'thread',
      place_id: postData.placeId || null,
    };

    const { data, error } = await client
      .from('posts')
      .insert(insertPayload)
      .select('*, users!user_id(id, full_name, name, avatar_url, role, campus), places(id, name, city)')
      .single();

    if (error || !data) {
      throw new Error(`Gagal menyimpan postingan ke Supabase: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      postType: data.post_type,
      author: {
        id: data.user_id,
        name: data.users?.full_name || data.users?.name || 'Pengguna pNongki!',
        avatar: data.users?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        level: 'Sepuh Kopi',
        role: data.users?.role || 'Mahasiswa',
        initials: (data.users?.full_name || data.users?.name || 'PN').substring(0, 2).toUpperCase(),
        campus: data.users?.campus || 'Institut Teknologi Bandung',
        isMe: true,
      },
      timeAgo: 'Baru saja',
      cafeTag: data.places?.name,
      taggedPlace: data.places ? { id: data.places.id, name: data.places.name, city: data.places.city } : null,
      content: data.content,
      image: data.image_url,
      imageUrl: data.image_url,
      likes: 0,
      likesCount: 0,
      liked: false,
      isLiked: false,
      isHangout: data.post_type === 'hangout',
      comments: [],
      createdAt: data.created_at,
    };
  }

  async toggleLike(postId: string, userId?: string): Promise<{ likes: number; liked: boolean }> {
    const activeUserId = userId || 'da20d2a2-9a9c-4ce5-8784-68735378af5e';
    let liked = false;
    let likes = 0;

    const client = this.supabaseService.getAdminClient();

    const { data: existingLike } = await client
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', activeUserId)
      .maybeSingle();

    if (existingLike) {
      await client
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', activeUserId);
      liked = false;
    } else {
      await client.from('post_likes').insert({
        post_id: postId,
        user_id: activeUserId,
      });
      liked = true;
    }

    const { count } = await client
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    likes = count ?? (liked ? 1 : 0);

    await client
      .from('posts')
      .update({ likes_count: likes })
      .eq('id', postId);

    return { likes, liked };
  }

  async addComment(
    postId: string,
    commentData: { author: string; avatar?: string; text: string; parentId?: string; userId?: string },
  ): Promise<CommentItem> {
    const activeUserId = commentData.userId || 'da20d2a2-9a9c-4ce5-8784-68735378af5e';
    const client = this.supabaseService.getAdminClient();

    const { data, error } = await client
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: activeUserId,
        parent_id: commentData.parentId || null,
        message: commentData.text,
      })
      .select('*, users!user_id(id, full_name, name, avatar_url)')
      .single();

    if (error || !data) {
      throw new Error(`Gagal menyimpan komentar: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      author: data.users?.full_name || data.users?.name || commentData.author || 'Pengguna',
      avatar: data.users?.avatar_url || commentData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text: data.message,
      time: 'Baru saja',
      parentId: data.parent_id,
      replies: [],
    };
  }
}
