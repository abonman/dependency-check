import { Repository } from './repository';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhpRepositoryService implements Repository {
  private REPO_URL = 'https://repo.packagist.org/p2/';

  constructor(private http: HttpService) {}

  async lookupVersion(dependencyName: string): Promise<any> {
    try {
      const res = await (
        await firstValueFrom(
          this.http.get(`${this.REPO_URL}/${dependencyName}.json`),
        )
      ).data['packages'][dependencyName][0]['version'];
      return res.replace('v', '').replace('-RC1', '');
    } catch (e) {
      return '-';
    }
  }
}
