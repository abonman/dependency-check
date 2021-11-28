import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DependencyCheckerDto {
  constructor(repoUrl: string, emails: string[]) {
    this.repo = repoUrl;
    this.emails = emails;
  }

  @IsString()
  @IsNotEmpty()
  repo: string;

  @IsNotEmpty()
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}
