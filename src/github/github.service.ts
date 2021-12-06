import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class GitHubService {
  constructor(
    private httpService: HttpService,
    private repoService: RepositoryService,
  ) {}

  async findGitFiles(repo: string): Promise<string[]> {
    const url = `https://api.github.com/repos/${repo}/contents`;
    const files = (await this.httpService.get(url).toPromise()).data;

    const dependencyFiles: string[] = files
      .filter((element) =>
        this.repoService.isSupportedDependency(element['name']),
      )
      .map((element) => element.name);
    return dependencyFiles;
  }

  async readGitVersions(packageName: string, repo: string): Promise<any> {
    try {
      const url = `https://api.github.com/repos/${repo}/contents/${packageName}`;
      console.log(url);
      const res = await (
        await firstValueFrom(
          this.httpService.get(url, {
            headers: { Accept: 'application/vnd.github.v3.raw' },
          }),
        )
      ).data[this.repoService.resolveField(packageName)];

      for (const pkg in res) {
        if (pkg == 'php') {
          continue;
        }
        if (res[pkg].includes('|')) {
          const temp = res[pkg].split('|');
          res[pkg] = temp[temp.length - 1];
        }
        res[pkg] = res[pkg].replace('^', '');
      }
      return res;
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Version Not Found' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
