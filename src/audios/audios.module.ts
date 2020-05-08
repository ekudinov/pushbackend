import { Module } from '@nestjs/common';
import { AudiosController } from './audios.controller';
import { AudiosService } from './audios.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AudioEntity} from './audio.entity';

@Module({
  controllers: [AudiosController],
  providers: [AudiosService],
  imports: [
    TypeOrmModule.forFeature([AudioEntity])
  ]
})
export class AudiosModule {}
