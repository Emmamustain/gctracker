import { Module } from '@nestjs/common';
import { CurationsService } from './curations.service';
import { CurationsController } from './curations.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [CurationsController],
  providers: [CurationsService],
  imports: [DrizzleModule],
  exports: [CurationsService],
})
export class CurationsModule {}
