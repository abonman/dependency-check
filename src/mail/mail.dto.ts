import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class MailDto {
  constructor(recipient: string[], subject: string, content: string[]) {
    this.recipient = recipient;
    this.subject = subject;
    this.content = content;
  }
  @IsEmail()
  recipient: string[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string[];
}

export default MailDto;
