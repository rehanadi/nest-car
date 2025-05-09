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
import { url } from "inspector";

const cookieSession = require('cookie-session');
const crypto = require('crypto');

global.crypto = crypto;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
      url: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : undefined,
      // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
      entities: [User, Report],
      synchronize: false,
      migrations: ['migrations/*.js'],
      migrationsRun: process.env.NODE_ENV !== 'development',
      migrationsTableName: 'migrations',
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report],
    //       synchronize: true, // Set synchronize to true for development
    //     }
    //   },
    // }),
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
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Middleware can be configured here if needed
    consumer.apply(
      cookieSession({
        keys: [this.configService.get<string>('COOKIE_KEY')],
      })
    ).forRoutes('*');
  }
}