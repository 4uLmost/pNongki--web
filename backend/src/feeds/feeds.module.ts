import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller.js';
import { FeedsService } from './feeds.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}

