import { Repository } from './repository';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NpmRepositoryService implements Repository {
  private REPO_URL = 'https://registry.npmjs.org/';

  constructor(private http: HttpService) {}

  async lookupVersion(dependencyName: string): Promise<any> {
    return await (
      await firstValueFrom(this.http.get(`${this.REPO_URL}/${dependencyName}`))
    ).data['dist-tags']['latest'];
  }
}
