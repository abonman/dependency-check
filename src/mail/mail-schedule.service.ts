import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MailService } from './mail.service';
import MailDto from './mail.dto';

@Injectable()
export class MailScheduleService {
  constructor(
    private readonly mailJobsService: MailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  private logger = new Logger(MailScheduleService.name);

  addInterval(mailSchedule: MailDto, name: string, milliseconds: number) {
    const callback = () => {
      this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
      this.sendM(mailSchedule);
    };
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }

  sendM(mailSchedule: MailDto) {
    this.mailJobsService.sendMail({
      to: mailSchedule.recipient,
      subject: mailSchedule.subject,
      text: mailSchedule.content.join(', \n'),
    });
  }

  async getIntervals(): Promise<string[]> {
    const intervals = await this.schedulerRegistry.getIntervals();
    intervals.forEach(async (key) => this.logger.log(`Interval: ${key}`));
    return intervals;
  }

  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    this.logger.warn(`Interval ${name} deleted!`);
  }
}
