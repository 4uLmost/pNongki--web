import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UsersService, UserProfile, BusinessClaimDto } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Query('userId') userId?: string): Promise<UserProfile | null> {
    return this.usersService.getProfile(userId);
  }

  @Put('profile')
  async updateProfile(
    @Query('userId') userId: string,
    @Body() body: Partial<UserProfile>,
  ): Promise<UserProfile | null> {
    return this.usersService.updateProfile(userId, body);
  }

  @Get('activity')
  async getActivity(@Query('userId') userId?: string): Promise<any> {
    return this.usersService.getUserActivity(userId);
  }

  @Get('favorites')
  async getFavorites(@Query('userId') userId?: string): Promise<string[]> {
    return this.usersService.getFavorites(userId);
  }

  @Post('favorites')
  async toggleFavorite(
    @Body('placeId') placeId: string,
    @Body('userId') userId?: string,
  ): Promise<{ placeId: string; isFavorited: boolean; favorites: string[] }> {
    return this.usersService.toggleFavorite(placeId, userId);
  }

  @Get('notifications')
  async getNotifications(@Query('userId') userId?: string): Promise<any[]> {
    return this.usersService.getNotifications(userId);
  }

  @Post('notifications/read')
  async markNotificationRead(
    @Body('notifId') notifId?: string,
    @Body('notifIds') notifIds?: string[],
  ): Promise<{ success: boolean }> {
    return this.usersService.markNotificationRead(notifId, notifIds);
  }

  @Post('notifications/delete')
  async deleteNotification(
    @Body('notifId') notifId?: string,
    @Body('notifIds') notifIds?: string[],
  ): Promise<{ success: boolean }> {
    return this.usersService.deleteNotification(notifId, notifIds);
  }

  @Post('business-claim')
  async submitBusinessClaim(
    @Body() dto: BusinessClaimDto,
  ): Promise<{ success: boolean; message: string; claimId: string }> {
    return this.usersService.submitBusinessClaim(dto);
  }

  @Get('business-claims')
  async getBusinessClaims(@Query('userId') userId?: string): Promise<any[]> {
    return this.usersService.getBusinessClaims(userId);
  }

  @Delete('business-claim/:id')
  async deleteBusinessClaim(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<{ success: boolean; roleReverted: boolean }> {
    return this.usersService.deleteBusinessClaim(id, userId);
  }

  @Post('revert-owner-if-no-partners')
  async revertOwnerIfNoPartners(@Body('userId') userId?: string): Promise<{ role: string; reverted: boolean }> {
    return this.usersService.verifyAndSyncOwnerRole(userId);
  }

  @Get('admin-list')
  async getAdminList(): Promise<any[]> {
    return this.usersService.getAdminUsers();
  }

  @Post('admin')
  async createAdmin(@Body() body: { email: string; password: string; name: string }): Promise<any> {
    return this.usersService.createAdminUser(body);
  }

  @Delete('admin/:id')
  async deleteAdmin(@Param('id') id: string): Promise<any> {
    return this.usersService.deleteAdminUser(id);
  }
}
