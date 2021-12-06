import { DependencyCheckerService } from './dependency-checker.service';
import { Module } from '@nestjs/common';
import { DependencyCheckerController } from './dependency-checker.controller';
import { DbModule } from '../database/db.module';
import { HttpModule } from '@nestjs/axios';
import { GitHubModule } from '../github/github.module';
import { MailModule } from '../mail/mail.module';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [DbModule, HttpModule, GitHubModule, MailModule, RepositoryModule],
  controllers: [DependencyCheckerController],
  providers: [DependencyCheckerService],
})
export class DependencyCheckerModule {}
