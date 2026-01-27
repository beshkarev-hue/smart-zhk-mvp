import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return this.buildingsService.findAll();
  }

  @Get('by-address')
  @UseGuards(JwtAuthGuard)
  async getByAddress(@Query('address') address: string) {
    return this.buildingsService.findByAddress(address);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() buildingData: any) {
    return this.buildingsService.create(buildingData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() buildingData: any) {
    return this.buildingsService.update(id, buildingData);
  }
}
