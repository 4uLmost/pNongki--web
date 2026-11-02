import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RewardsService, RewardItem, ClaimTicket } from './rewards.service.js';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async getRewards(): Promise<RewardItem[]> {
    return this.rewardsService.findAll();
  }

  @Get('my-claims')
  async getMyClaims(@Query('userId') userId?: string): Promise<ClaimTicket[]> {
    return this.rewardsService.findMyClaims(userId);
  }

  @Post('claim')
  async claimReward(
    @Body() body: { rewardId: string; currentPoints?: number; userId?: string },
  ): Promise<{ ticket: ClaimTicket; remainingPoints: number }> {
    return this.rewardsService.claimReward(body.rewardId, body.currentPoints, body.userId);
  }
}

