import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {NotificationEntity} from './notification.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class NotificationsService extends TypeOrmCrudService<NotificationEntity>{
    constructor(@InjectRepository(NotificationEntity) public notificationRepository: Repository<NotificationEntity>) {
        super(notificationRepository);
    }

}

