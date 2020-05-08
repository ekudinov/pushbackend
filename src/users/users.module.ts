import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersService} from './users.service';
import {UserEntity} from './user.entity.ts';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ]
})
export class UsersModule {}
