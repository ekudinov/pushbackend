import { Module } from '@nestjs/common';
import { PushresultsController } from './pushresults.controller';
import { PushresultsService } from './pushresults.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PushresultEntity} from './pushresult.entity';

@Module({
  controllers: [PushresultsController],
  providers: [PushresultsService],
  imports: [
    TypeOrmModule.forFeature([PushresultEntity])
  ]
})
export class PushresultsModule {}
