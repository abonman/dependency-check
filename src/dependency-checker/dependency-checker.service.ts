import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DbService } from 'src/database/db.service';
import { GitHubService } from '../github/github.service';
import { MailScheduleService } from '../mail/mail-schedule.service';

import MailDto from '../mail/mail.dto';
import { RepositoryService } from '../repository/repository.service';
import { DependencyCheckerDto } from './dependency-checker.dto';

@Injectable()
export class DependencyCheckerService {
  constructor(
    private readonly db: DbService,
    private readonly gitService: GitHubService,
    private readonly mailScheduleService: MailScheduleService,
    private readonly repositoryService: RepositoryService,
  ) {}

  async findAndCheckFile(userMails: DependencyCheckerDto): Promise<string[]> {
    /* git start */
    const pkgFiles: string[] = await this.gitService.findGitFiles(
      userMails.repo,
    );
    /* git end */
    await this.saveToDatabase(userMails);

    /* find files start */
    const packageList: string[] = [];
    await Promise.all(
      pkgFiles.map(async (fileName: string) => {
        const packages = await this.gitService.readGitVersions(
          fileName,
          userMails.repo,
        ); //git

        for (const pkg of Object.keys(packages)) {
          const newPackages = await this.checkVersion(
            fileName,
            pkg,
            packages[pkg],
          );
          if (newPackages !== 'equal') {
            packageList.push(
              "'" +
                pkg +
                "' old version: '" +
                packages[pkg] +
                "', new version: '" +
                newPackages +
                "'",
            );
          }
        }
      }),
    );
    /* find files end */

    this.sendEmail(userMails, packageList);
    return packageList;
  }

  private sendEmail(userMails: DependencyCheckerDto, packageList: string[]) {
    const mailSend = new MailDto(
      userMails.emails,
      'dependency check',
      packageList,
    );
    this.mailScheduleService.sendM(mailSend);
    this.mailScheduleService.addInterval(
      mailSend,
      userMails.repo,
      60000 * 60 * 24,
    );
  }

  private async saveToDatabase(userMails: DependencyCheckerDto) {
    try {
      await this.insertData(userMails);
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'insertion error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkVersion(
    fileName: string,
    pkg: string,
    version: string,
  ): Promise<string> {
    const lastVersion = await this.repositoryService.getLatestVersion(
      fileName,
      pkg,
    );
    if (version === lastVersion || version + '.0' === lastVersion) {
      return 'equal';
    } else {
      return lastVersion;
    }
  }

  async insertData(userMails: DependencyCheckerDto): Promise<any> {
    const qString: string =
      'INSERT INTO "repository_mails"(repository,mails) VALUES ($1,$2)' +
      'ON CONFLICT ("repository") DO UPDATE SET "repository" = $3, "mails" = $4';
    const qvalues: any[] = [
      userMails.repo,
      userMails.emails,
      userMails.repo,
      userMails.emails,
    ];

    this.db.executeQuery(qString, qvalues).catch((err: any) => {
      switch (err.name) {
        case 'QueryFailedError':
          throw JSON.stringify(err);
        default:
          throw err;
      }
    });
  }
}
