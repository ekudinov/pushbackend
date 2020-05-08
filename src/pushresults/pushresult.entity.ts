import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {SubscriptionEntity} from '../subscriptions/subscription.entity';
import {NotificationEntity} from '../notifications/notification.entity';

@Entity(({
    name: 'pushresults'
}))
export class PushresultEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty({readOnly: true})
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    message: string;

    @Column({nullable: false})
    statusCode: number;

    @Column({nullable: false})
    body: string;

    @Column({nullable: false, default: () => 'now()'})
    created: Date;

    @ApiProperty({type: () => SubscriptionEntity})
    @ManyToOne(
        type => SubscriptionEntity,
        subscription => subscription.results
    )
    subscription?: SubscriptionEntity;

    @ApiProperty({type: () => NotificationEntity})
    @ManyToOne(
        type => NotificationEntity,
        notification => notification.results
    )
    notification?: NotificationEntity;
}
