import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PlacesService, PlaceItem } from './places.service.js';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async getPlaces(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
  ): Promise<PlaceItem[]> {
    return this.placesService.findAll(query, category, sort);
  }

  @Get('my')
  async getMyPlaces(@Query('userId') userId?: string): Promise<PlaceItem[]> {
    return this.placesService.findMyPlaces(userId);
  }

  @Get('admin/list')
  async getAdminPlaces(
    @Query('status') status?: string,
    @Query('partnershipStatus') partnershipStatus?: string,
  ): Promise<PlaceItem[]> {
    return this.placesService.findAdminPlaces(status, partnershipStatus);
  }

  @Get(':id')
  async getPlaceById(@Param('id') id: string): Promise<PlaceItem | null> {
    return this.placesService.findOne(id);
  }

  @Post()
  async createPlace(@Body() body: Partial<PlaceItem>): Promise<PlaceItem> {
    return this.placesService.create(body);
  }

  @Post(':id/partnership')
  async applyPartnership(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<PlaceItem | null> {
    return this.placesService.applyPartnership(id, body);
  }

  @Put(':id/partnership-status')
  async updatePartnershipStatus(
    @Param('id') id: string,
    @Body() body: { partnershipStatus: string; isPartner?: boolean },
  ): Promise<any> {
    return this.placesService.updatePartnershipStatus(
      id,
      body.partnershipStatus,
      body.isPartner,
    );
  }

  @Put(':id/status')
  async updatePlaceStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<PlaceItem | null> {
    return this.placesService.updateStatus(id, status);
  }

  @Delete(':id/partnership')
  async deletePartnership(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<any> {
    return this.placesService.deletePartnership(id, userId);
  }

  @Delete(':id')
  async deletePlace(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<any> {
    return this.placesService.delete(id, userId);
  }

  @Get(':id/reviews')
  async getPlaceReviews(@Param('id') id: string): Promise<any[]> {
    return this.placesService.findPlaceReviews(id);
  }

  @Post(':id/reviews')
  async addPlaceReview(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<any> {
    return this.placesService.addPlaceReview(id, body);
  }

  @Get(':id/reservations')
  async getPlaceReservations(@Param('id') id: string): Promise<any[]> {
    return this.placesService.findPlaceReservations(id);
  }

  @Post(':id/reservations')
  async createReservation(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<any> {
    return this.placesService.createReservation(id, body);
  }
}
