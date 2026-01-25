import { Module } from '@nestjs/common';
import { GisZhkhService } from './gis-zhkh.service';
import { GisZhkhController } from './gis-zhkh.controller';

@Module({
  controllers: [GisZhkhController],
  providers: [GisZhkhService],
  exports: [GisZhkhService],
})
export class GisZhkhModule {}
