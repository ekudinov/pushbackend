import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {SubscriptionEntity} from './subscription.entity';
import {Repository} from 'typeorm';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';

@Injectable()
export class SubscriptionsService extends TypeOrmCrudService<SubscriptionEntity>{
    constructor(@InjectRepository(SubscriptionEntity) subscriptionsRepository: Repository<SubscriptionEntity>) {
        super(subscriptionsRepository);
    }
}
