import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ShowcasesModule } from './showcases/showcases.module';
import { CategoriesModule } from './categories/categories.module';
import { CurationsModule } from './curations/curations.module';

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
    AuthModule,
    ShowcasesModule,
    CategoriesModule,
    CurationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
