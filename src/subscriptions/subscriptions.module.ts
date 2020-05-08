import { Module } from '@nestjs/common';
import {SubscriptionsController} from './subscriptions.controller';
import {SubscriptionsService} from './subscriptions.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SubscriptionEntity} from './subscription.entity';

@Module({
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
    imports: [
        TypeOrmModule.forFeature([SubscriptionEntity])
    ]
})
export class SubscriptionsModule {}
