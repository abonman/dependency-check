import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DependencyCheckerModule } from './dependency-checker/dependency-checker.module';

@Module({
  imports: [DependencyCheckerModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
