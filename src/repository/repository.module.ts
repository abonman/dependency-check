import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { NpmRepositoryService } from './npm-repository.service';
import { HttpModule } from '@nestjs/axios';
import { PhpRepositoryService } from './php-repository.service';

@Module({
  imports: [HttpModule],
  providers: [RepositoryService, NpmRepositoryService, PhpRepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
