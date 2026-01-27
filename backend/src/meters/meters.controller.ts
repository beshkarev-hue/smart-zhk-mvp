import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MetersService } from './meters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('meters')
export class MetersController {
  constructor(private readonly metersService: MetersService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyMeters(@Request() req) {
    return this.metersService.findByUser(req.user.userId);
  }

  @Get('apartment/:number')
  @UseGuards(JwtAuthGuard)
  async getByApartment(@Param('number') number: string) {
    return this.metersService.findByApartment(number);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() meterData: any) {
    return this.metersService.create(meterData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() meterData: any) {
    return this.metersService.update(id, meterData);
  }

  @Post(':id/reading')
  @UseGuards(JwtAuthGuard)
  async submitReading(@Param('id') id: string, @Body() body: { reading: number }) {
    return this.metersService.submitReading(id, body.reading);
  }
}
