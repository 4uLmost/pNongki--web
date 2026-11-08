import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface RewardItem {
  id: string;
  title: string;
  type: 'voucher' | 'merchandise';
  pointCost: number;
  stock: number;
  voucherCode?: string | null;
  merchant: string;
  imageUrl: string;
  description: string;
}

export interface ClaimTicket {
  id: string;
  claimCode: string;
  title: string;
  type: 'voucher' | 'merchandise';
  pointCost: number;
  claimedAt: string;
  status: 'menunggu_pengambilan' | 'completed' | 'expired';
  voucherCode?: string | null;
}

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<RewardItem[]> {
    try {
      const client = this.supabaseService.getAdminClient();
      const { data, error } = await client
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !Array.isArray(data)) {
        return [];
      }

      return data.map((r: any) => ({
        id: r.id,
        title: r.title,
        type: r.reward_type,
        pointCost: r.point_cost,
        stock: r.stock,
        voucherCode: r.voucher_code,
        merchant: r.merchant || 'Official Partner',
        imageUrl: r.image_url,
        description: r.description,
      }));
    } catch (err: any) {
      this.logger.error(`Error in RewardsService.findAll: ${err?.message}`);
      return [];
    }
  }

  async claimReward(
    rewardId: string,
    currentPoints: number = 350,
    userId?: string,
  ): Promise<{
    ticket: ClaimTicket;
    remainingPoints: number;
  }> {
    if (!userId) {
      throw new BadRequestException('User harus terautentikasi untuk menukar reward.');
    }

    const client = this.supabaseService.getAdminClient();
    const { data: reward, error } = await client
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .maybeSingle();

    if (error || !reward) {
      throw new BadRequestException('Reward tidak ditemukan di database.');
    }

    if (reward.stock <= 0) {
      throw new BadRequestException('Stok reward ini sudah habis.');
    }

    const userPoints = currentPoints ?? 0;
    if (userPoints < reward.point_cost) {
      throw new BadRequestException('Saldo poin Anda tidak mencukupi untuk klaim hadiah ini.');
    }

    const prefix = reward.reward_type === 'merchandise' ? '#MCH' : '#VCR';
    const claimCode = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketStatus = reward.reward_type === 'merchandise' ? 'menunggu_pengambilan' : 'completed';

    const { data: claimRecord, error: claimErr } = await client
      .from('reward_claims')
      .insert({
        user_id: userId,
        reward_id: reward.id,
        claim_code: claimCode,
        status: ticketStatus,
      })
      .select()
      .single();

    if (claimErr || !claimRecord) {
      throw new BadRequestException(`Gagal mencatat klaim reward: ${claimErr?.message}`);
    }

    const remaining = Math.max(0, userPoints - reward.point_cost);
    await client.from('users').update({ points_balance: remaining }).eq('id', userId);
    await client.from('rewards').update({ stock: Math.max(0, reward.stock - 1) }).eq('id', reward.id);

    const ticket: ClaimTicket = {
      id: claimRecord.id,
      claimCode,
      title: reward.title,
      type: reward.reward_type,
      pointCost: reward.point_cost,
      claimedAt: 'Hari ini',
      status: ticketStatus,
      voucherCode: reward.voucher_code || null,
    };

    return {
      ticket,
      remainingPoints: remaining,
    };
  }

  async findMyClaims(userId?: string): Promise<ClaimTicket[]> {
    if (!userId) {
      return [];
    }

    try {
      const client = this.supabaseService.getAdminClient();
      const { data, error } = await client
        .from('reward_claims')
        .select('*, rewards(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !Array.isArray(data)) {
        return [];
      }

      return data.map((c: any) => ({
        id: c.id,
        claimCode: c.claim_code,
        title: c.rewards?.title || 'Voucer Hadiah',
        type: c.rewards?.reward_type || 'voucher',
        pointCost: c.rewards?.point_cost || 0,
        claimedAt: new Date(c.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        status: c.status,
        voucherCode: c.rewards?.voucher_code || null,
      }));
    } catch (err: any) {
      this.logger.error(`Error in RewardsService.findMyClaims: ${err?.message}`);
      return [];
    }
  }
}
