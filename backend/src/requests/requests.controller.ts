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
import { RequestsService } from './requests.service';
import { Request, RequestStatus } from './request.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('requests')
@Controller('requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заявку' })
  async create(@Body() requestData: Partial<Request>): Promise<Request> {
    return this.requestsService.create(requestData);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все заявки' })
  async findAll(): Promise<Request[]> {
    return this.requestsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Получить заявки пользователя' })
  async findByUser(@Param('userId') userId: string): Promise<Request[]> {
    return this.requestsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заявку по ID' })
  async findOne(@Param('id') id: string): Promise<Request> {
    return this.requestsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус заявки' })
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: RequestStatus; response?: string },
  ): Promise<Request> {
    return this.requestsService.updateStatus(id, data.status, data.response);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить заявку' })
  async update(
    @Param('id') id: string,
    @Body() requestData: Partial<Request>,
  ): Promise<Request> {
    return this.requestsService.update(id, requestData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить заявку' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.requestsService.remove(id);
  }
}
