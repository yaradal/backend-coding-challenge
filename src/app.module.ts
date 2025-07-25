import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MoviesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
