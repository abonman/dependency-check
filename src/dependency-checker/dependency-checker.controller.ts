import { Body, Controller, Post } from '@nestjs/common';
import { DependencyCheckerService } from './dependency-checker.service';
import { DependencyCheckerDto } from './dependency-checker.dto';

@Controller()
export class DependencyCheckerController {
  constructor(private readonly service: DependencyCheckerService) {}

  @Post('/dependency-validator')
  validateRepository(@Body() dto: DependencyCheckerDto): Promise<string[]> {
    return this.service.findAndCheckFile(dto);
  }
}
