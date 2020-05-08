import {Injectable} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AudioEntity} from './audio.entity';

@Injectable()
export class AudiosService extends TypeOrmCrudService<AudioEntity> {
    constructor(@InjectRepository(AudioEntity) public audioRepository: Repository<AudioEntity>) {
        super(audioRepository);
    }
}
