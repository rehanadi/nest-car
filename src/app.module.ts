import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session');
const crypto = require('crypto');

global.crypto = crypto;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true, // Set synchronize to true for development
        }
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global pipe to validate incoming requests
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware can be configured here if needed
    consumer.apply(
      cookieSession({
        keys: ['abc123'],
      })
    ).forRoutes('*');
  }
}