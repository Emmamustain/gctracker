import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [DrizzleModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
