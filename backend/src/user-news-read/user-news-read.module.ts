import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNewsReadService } from './user-news-read.service';
import { UserNewsReadController } from './user-news-read.controller';
import { UserNewsRead } from './user-news-read.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserNewsRead])],
  controllers: [UserNewsReadController],
  providers: [UserNewsReadService],
  exports: [UserNewsReadService],
})
export class UserNewsReadModule {}
