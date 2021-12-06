import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GitService } from './github.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [HttpModule, RepositoryModule],
  controllers: [],
  providers: [GitService],
  exports: [GitService],
})
export class GitModule {}
