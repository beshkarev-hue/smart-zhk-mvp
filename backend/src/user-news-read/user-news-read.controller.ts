import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserNewsReadService } from './user-news-read.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user-news-read')
@Controller('user-news-read')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserNewsReadController {
  constructor(private readonly userNewsReadService: UserNewsReadService) {}

  @Post('mark-read')
  @ApiOperation({ summary: 'Отметить новость как прочитанную' })
  async markAsRead(@Request() req, @Body() body: { newsId: string }): Promise<void> {
    await this.userNewsReadService.markAsRead(req.user.userId, body.newsId);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Отметить все новости как прочитанные' })
  async markAllAsRead(@Request() req, @Body() body: { newsIds: string[] }): Promise<void> {
    await this.userNewsReadService.markAllAsRead(req.user.userId, body.newsIds);
  }

  @Get('read-ids')
  @ApiOperation({ summary: 'Получить ID прочитанных новостей' })
  async getReadNewsIds(@Request() req): Promise<string[]> {
    return this.userNewsReadService.getReadNewsIds(req.user.userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Получить количество непрочитанных' })
  async getUnreadCount(@Request() req, @Body() body: { newsIds: string[] }): Promise<number> {
    return this.userNewsReadService.getUnreadCount(req.user.userId, body.newsIds);
  }
}
