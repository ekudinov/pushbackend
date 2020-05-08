import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ImageEntity} from './image.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class ImagesService  extends TypeOrmCrudService<ImageEntity>{
    constructor(@InjectRepository(ImageEntity) public imageRepository: Repository<ImageEntity>) {
        super(imageRepository);
    }
}
