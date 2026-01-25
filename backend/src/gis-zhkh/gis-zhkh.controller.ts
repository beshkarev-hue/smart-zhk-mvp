import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GisZhkhService } from './gis-zhkh.service';

@ApiTags('gis-zhkh')
@Controller('gis-zhkh')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GisZhkhController {
  constructor(private readonly gisZhkhService: GisZhkhService) {}

  @Get('account/:accountNumber')
  @ApiOperation({ summary: 'Получить информацию о лицевом счёте из ГИС ЖКХ' })
  async getAccountInfo(@Param('accountNumber') accountNumber: string) {
    return this.gisZhkhService.getAccountInfo(accountNumber);
  }

  @Get('charges/:accountNumber')
  @ApiOperation({ summary: 'Получить начисления за период из ГИС ЖКХ' })
  async getCharges(
    @Param('accountNumber') accountNumber: string,
    @Query('period') period?: string,
  ) {
    const currentPeriod = period || new Date().toISOString().slice(0, 7);
    return this.gisZhkhService.getCharges(accountNumber, currentPeriod);
  }

  @Get('meters/:accountNumber')
  @ApiOperation({ summary: 'Получить список приборов учёта из ГИС ЖКХ' })
  async getMeters(@Param('accountNumber') accountNumber: string) {
    return this.gisZhkhService.getMeters(accountNumber);
  }

  @Get('meter-readings/:accountNumber')
  @ApiOperation({ summary: 'Получить показания приборов учёта из ГИС ЖКХ' })
  async getMeterReadings(
    @Param('accountNumber') accountNumber: string,
    @Query('period') period?: string,
  ) {
    return this.gisZhkhService.getMeterReadings(accountNumber, period);
  }

  @Post('meter-readings/submit')
  @ApiOperation({ summary: 'Передать показания счётчика в ГИС ЖКХ' })
  async submitMeterReading(@Body() body: any) {
    return this.gisZhkhService.submitMeterReading(body);
  }

  @Get('payments/:accountNumber')
  @ApiOperation({ summary: 'Получить историю платежей из ГИС ЖКХ' })
  async getPaymentHistory(
    @Param('accountNumber') accountNumber: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.gisZhkhService.getPaymentHistory(accountNumber, startDate, endDate);
  }

  @Post('sync/charges')
  @ApiOperation({ summary: 'Синхронизировать начисления из ГИС ЖКХ в локальную БД' })
  async syncCharges(@Body() body: any) {
    return this.gisZhkhService.syncCharges(body.accountNumber, body.userId);
  }
}
