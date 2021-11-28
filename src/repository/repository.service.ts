import { Injectable } from '@nestjs/common';
import { NpmRepositoryService } from './npm-repository.service';
import { PhpRepositoryService } from './php-repository.service';

@Injectable()
export class RepositoryService {
  constructor(
    private npmService: NpmRepositoryService,
    private phpService: PhpRepositoryService,
  ) {}

  private SUPPORTED_REPOSITORIES = [
    {
      name: 'composer.json',
      field: 'require',
      url: 'https://repo.packagist.org/p2/',
    },
    {
      name: 'package.json',
      field: 'dependencies',
      url: 'https://registry.npmjs.org/',
    },
  ];

  isSupportedDependency(filename: string): boolean {
    return !!this.SUPPORTED_REPOSITORIES.find(
      (value) => value.name === filename,
    );
  }

  resolveField(filename: string): string {
    return this.SUPPORTED_REPOSITORIES.find((value) => value.name === filename)
      .field;
  }

  async getLatestVersion(
    filename: string,
    dependencyName: string,
  ): Promise<string> {
    switch (filename) {
      case 'composer.json':
        return await this.phpService.lookupVersion(dependencyName);
      case 'package.json':
        return await this.npmService.lookupVersion(dependencyName);
      default:
        break;
    }
  }
}
