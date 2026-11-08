import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FeedsService, PostItem, CommentItem } from './feeds.service.js';

@Controller('posts')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  async getPosts(@Query('userId') userId?: string): Promise<PostItem[]> {
    return this.feedsService.findAll(userId);
  }

  @Post()
  async createPost(@Body() body: any): Promise<PostItem> {
    return this.feedsService.createPost(body);
  }

  @Post(':id/like')
  async toggleLike(
    @Param('id') id: string,
    @Body('userId') userId?: string,
  ): Promise<{ likes: number; liked: boolean }> {
    return this.feedsService.toggleLike(id, userId);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() body: { author: string; avatar?: string; text: string; parentId?: string; userId?: string },
  ): Promise<CommentItem> {
    return this.feedsService.addComment(id, body);
  }
}

