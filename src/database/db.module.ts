import { ConfigService } from '@nestjs/config';
import { DbService } from './db.service';
import { Module } from '@nestjs/common';
import { Pool } from 'pg';

const databasePoolFactory = async (configService: ConfigService) => {
  return new Pool({
    user: configService.get('POSTGRES_USER'),
    host: configService.get('POSTGRES_HOST'),
    database: configService.get('POSTGRES_DB'),
    password: configService.get('POSTGRES_PASSWORD'),
    port: configService.get('POSTGRES_LOCAL_PORT'),
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000,
  });
};

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: databasePoolFactory,
    },
    DbService,
  ],
  exports: [DbService],
})
export class DbModule {}
