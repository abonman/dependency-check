import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GitHubService } from './github.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [HttpModule, RepositoryModule],
  controllers: [],
  providers: [GitHubService],
  exports: [GitHubService],
})
export class GitHubModule {}
