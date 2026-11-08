import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}

