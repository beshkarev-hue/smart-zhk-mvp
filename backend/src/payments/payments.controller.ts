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
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать начисление' })
  async create(@Body() paymentData: Partial<Payment>): Promise<Payment> {
    return this.paymentsService.create(paymentData);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все платежи' })
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Получить платежи пользователя' })
  async findByUser(@Param('userId') userId: string): Promise<Payment[]> {
    return this.paymentsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить платеж по ID' })
  async findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Отметить платеж как оплаченный' })
  async markAsPaid(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.markAsPaid(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить платеж' })
  async update(
    @Param('id') id: string,
    @Body() paymentData: Partial<Payment>,
  ): Promise<Payment> {
    return this.paymentsService.update(id, paymentData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить платеж' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }
}
