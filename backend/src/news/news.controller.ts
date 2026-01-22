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
import { News } from './news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новость/объявление' })
  async create(@Body() newsData: Partial<News>): Promise<News> {
    return this.newsService.create(newsData);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все опубликованные новости' })
  async findAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить новость по ID' })
  async findOne(@Param('id') id: string): Promise<News> {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить новость' })
  async update(
    @Param('id') id: string,
    @Body() newsData: Partial<News>,
  ): Promise<News> {
    return this.newsService.update(id, newsData);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Опубликовать новость' })
  async publish(@Param('id') id: string): Promise<News> {
    return this.newsService.publish(id);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Снять новость с публикации' })
  async unpublish(@Param('id') id: string): Promise<News> {
    return this.newsService.unpublish(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить новость' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.newsService.remove(id);
  }
}
