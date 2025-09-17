import { Module } from '@nestjs/common';
import { ShowcasesService } from './showcases.service';
import { ShowcasesController } from './showcases.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [ShowcasesController],
  providers: [ShowcasesService],
  imports: [DrizzleModule],
  exports: [ShowcasesService],
})
export class ShowcasesModule {}
