import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller.js';
import { RewardsService } from './rewards.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}

