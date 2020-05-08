import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {PushresultEntity} from './pushresult.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class PushresultsService  extends TypeOrmCrudService<PushresultEntity>{
    constructor(@InjectRepository(PushresultEntity) public pushresultRepository: Repository<PushresultEntity>) {
        super(pushresultRepository);
    }



}
