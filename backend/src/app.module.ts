import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { RequestsModule } from './requests/requests.module';
import { BuildingsModule } from './buildings/buildings.module';
import { MetersModule } from './meters/meters.module';
import { NewsModule } from './news/news.module';
import { GisZhkhModule } from './gis-zhkh/gis-zhkh.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres123',
      database: process.env.DB_DATABASE || 'smart_zhk',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Только для разработки! В production использовать миграции
      logging: false,
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    PaymentsModule,
    RequestsModule,
    BuildingsModule,
    MetersModule,
    NewsModule,
    GisZhkhModule,
  ],
})
export class AppModule {}
