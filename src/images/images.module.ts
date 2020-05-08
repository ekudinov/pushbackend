import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ImageEntity} from './image.entity';

@Module({
  providers: [ImagesService],
  controllers: [ImagesController],
  imports: [
    TypeOrmModule.forFeature([ImageEntity])
  ]
})
export class ImagesModule {}
