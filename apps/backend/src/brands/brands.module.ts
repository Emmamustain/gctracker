import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [DrizzleModule],
  exports: [BrandsService],
})
export class BrandsModule {}
