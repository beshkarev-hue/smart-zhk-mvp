import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meter } from './meter.entity';
import { MetersService } from './meters.service';
import { MetersController } from './meters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Meter])],
  providers: [MetersService],
  controllers: [MetersController],
  exports: [MetersService],
})
export class MetersModule {}
