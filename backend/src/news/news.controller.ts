import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { News, NewsCategory } from './news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новость' })
  create(@Body() newsData: Partial<News>): Promise<News> {
    return this.newsService.create(newsData);
  }

  @Get('published')
  @ApiOperation({ summary: 'Получить опубликованные новости' })
  findPublished(): Promise<News[]> {
    return this.newsService.findPublished();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Новости по категории' })
  findByCategory(@Param('category') category: NewsCategory): Promise<News[]> {
    return this.newsService.findByCategory(category);
  }

  @Get('all')
  @ApiOperation({ summary: 'Все новости' })
  findAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Новость по ID' })
  findOne(@Param('id') id: string): Promise<News> {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить новость' })
  update(@Param('id') id: string, @Body() newsData: Partial<News>): Promise<News> {
    return this.newsService.update(id, newsData);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Опубликовать' })
  publish(@Param('id') id: string): Promise<News> {
    return this.newsService.publish(id);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Снять с публикации' })
  unpublish(@Param('id') id: string): Promise<News> {
    return this.newsService.unpublish(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить новость' })
  remove(@Param('id') id: string): Promise<void> {
    return this.newsService.remove(id);
  }
}
