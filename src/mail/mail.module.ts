import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailScheduleService } from './mail-schedule.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [MailService, MailScheduleService],
  exports: [MailScheduleService],
})
export class MailModule {}
