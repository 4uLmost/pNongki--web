import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SupabaseModule } from './supabase/supabase.module.js';
import { PlacesModule } from './places/places.module.js';
import { FeedsModule } from './feeds/feeds.module.js';
import { RewardsModule } from './rewards/rewards.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    SupabaseModule,
    PlacesModule,
    FeedsModule,
    RewardsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
